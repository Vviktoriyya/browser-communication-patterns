import { useEffect, useRef, useState } from 'react';
import { searchYoutubeVideos, fetchTrendingVideos, fetchChannelAvatars } from '../api/youtube';
import type { YoutubeSearchItem } from '../types/youtube';

const DEBOUNCE_MS = 500;

async function withAvatars(items: YoutubeSearchItem[], signal: AbortSignal): Promise<YoutubeSearchItem[]> {
    try {
        const channelIds = items.map((item) => item.snippet.channelId);
        const avatarMap = await fetchChannelAvatars(channelIds, signal);
        return items.map((item) => ({
            ...item,
            channelAvatarUrl: avatarMap.get(item.snippet.channelId),
        }));
    } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') throw err;
        console.warn('Не вдалося завантажити аватарки каналів:', err);
        return items; // відео все одно показуємо, просто без фото каналу
    }
}

interface UseYoutubeSearchResult {
    query: string;
    setQuery: (value: string) => void;
    items: YoutubeSearchItem[];
    status: string;
    loading: boolean;
}

export function useYoutubeSearch(): UseYoutubeSearchResult {
    const [query, setQuery] = useState('');
    const [trending, setTrending] = useState<YoutubeSearchItem[]>([]);
    const [searchResults, setSearchResults] = useState<YoutubeSearchItem[] | null>(null);
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);

    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const controllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        setLoading(true);

        fetchTrendingVideos(controller.signal)
            .then(async (data) => {
                const items = data.items || [];
                setTrending(items); // спершу показуємо без аватарок — швидше
                const withAvatarsItems = await withAvatars(items, controller.signal);
                setTrending(withAvatarsItems);
            })
            .catch((err) => {
                if (err instanceof DOMException && err.name === 'AbortError') return;
                console.error(err);
            })
            .finally(() => setLoading(false));

        return () => controller.abort();
    }, []);

    useEffect(() => {
        if (debounceTimer.current) clearTimeout(debounceTimer.current);

        const trimmed = query.trim();
        if (!trimmed) {
            setSearchResults(null);
            setStatus('');
            controllerRef.current?.abort();
            return;
        }

        setStatus('Очікування паузи в наборі тексту…');

        debounceTimer.current = setTimeout(async () => {
            controllerRef.current?.abort();
            const controller = new AbortController();
            controllerRef.current = controller;

            setLoading(true);
            setStatus('Пошук…');

            try {
                const data = await searchYoutubeVideos(trimmed, controller.signal);
                const results = data.items || [];
                setSearchResults(results);
                setStatus(results.length ? `Знайдено відео: ${results.length}` : 'Нічого не знайдено');

                const withAvatarsItems = await withAvatars(results, controller.signal);
                setSearchResults(withAvatarsItems);
            } catch (err) {
                if (err instanceof DOMException && err.name === 'AbortError') {
                    console.log('Попередній запит перервано (AbortController)');
                    return;
                }
                console.error(err);
                setStatus('Помилка запиту: ' + (err as Error).message);
            } finally {
                setLoading(false);
            }
        }, DEBOUNCE_MS);

        return () => {
            if (debounceTimer.current) clearTimeout(debounceTimer.current);
        };
    }, [query]);

    const items = searchResults ?? trending;
    const effectiveStatus = searchResults === null && trending.length > 0 ? 'Популярне зараз' : status;

    return { query, setQuery, items, status: effectiveStatus, loading };
}