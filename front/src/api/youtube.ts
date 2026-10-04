import type { YoutubeSearchResponse, YoutubeChannelsResponse } from '../types/youtube';

const RAPIDAPI_HOST = 'youtube-v311.p.rapidapi.com';
const RAPIDAPI_KEY = import.meta.env.VITE_RAPID_API_KEY;

const headers = {
    'X-RapidAPI-Key': RAPIDAPI_KEY,
    'X-RapidAPI-Host': RAPIDAPI_HOST,
};

function handleErrors(response: Response) {
    if (!response.ok) {
        if (response.status === 429) throw new Error('Перевищено ліміт запитів (429). Перевір квоту на RapidAPI.');
        if (response.status === 403) throw new Error('Немає доступу (403). Перевір ключ і підписку на RapidAPI.');
        throw new Error(`HTTP ${response.status}`);
    }
}

export async function searchYoutubeVideos(
    query: string,
    signal: AbortSignal
): Promise<YoutubeSearchResponse> {
    const params = new URLSearchParams({
        part: 'snippet',
        q: query,
        type: 'video',
        maxResults: '15',
    });

    const response = await fetch(`https://${RAPIDAPI_HOST}/search/?${params.toString()}`, { signal, headers });
    handleErrors(response);
    return response.json();
}

export async function fetchTrendingVideos(signal: AbortSignal): Promise<YoutubeSearchResponse> {
    const params = new URLSearchParams({
        part: 'snippet',
        chart: 'mostPopular',
        regionCode: 'UA',
        maxResults: '15',
    });

    const response = await fetch(`https://${RAPIDAPI_HOST}/videos/?${params.toString()}`, { signal, headers });
    handleErrors(response);
    const data = await response.json();

    return {
        items: (data.items || []).map((item: { id: string; snippet: YoutubeSearchResponse['items'][number]['snippet'] }) => ({
            id: { videoId: item.id },
            snippet: item.snippet,
        })),
    };
}

/**
 * Аватарки каналів. YouTube дозволяє до 50 id в одному запиті, тому
 * унікальні channelId зі списку відео передаємо одним викликом.
 */
export async function fetchChannelAvatars(
    channelIds: string[],
    signal: AbortSignal
): Promise<Map<string, string>> {
    const uniqueIds = [...new Set(channelIds)].filter(Boolean);
    if (uniqueIds.length === 0) return new Map();

    const params = new URLSearchParams({
        part: 'snippet',
        id: uniqueIds.join(','),
    });

    const response = await fetch(`https://${RAPIDAPI_HOST}/channels/?${params.toString()}`, { signal, headers });
    handleErrors(response);
    const data: YoutubeChannelsResponse = await response.json();

    const map = new Map<string, string>();
    for (const channel of data.items || []) {
        const avatar = channel.snippet?.thumbnails?.default?.url;
        if (avatar) map.set(channel.id, avatar);
    }
    return map;
}