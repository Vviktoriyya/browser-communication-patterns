import { useYoutubeSearch } from '../hooks/useYoutubeSearch';
import Header from '../components/youtube/Header';
import FilterChips from '../components/youtube/FilterChips';
import Sidebar from '../components/youtube/Sidebar';
import SearchBar from '../components/youtube/SearchBar';
import VideoCard from "../components/youtube/VideoCard.tsx";


export default function Task5Youtube() {
    const { query, setQuery, items, status, loading } = useYoutubeSearch();

    return (
        <div className="flex h-screen flex-col bg-white">
            <Header searchSlot={<SearchBar value={query} onChange={setQuery} loading={loading} />} />

            <div className="flex flex-1 overflow-hidden">
                <Sidebar />

                <main className="flex-1 overflow-y-auto">
                    <FilterChips />

                    <div className="px-6 py-5">
                        <div className="mb-4 min-h-[18px] text-sm text-slate-500">{status}</div>

                        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                            {items.map((item) => (
                                <VideoCard key={item.id?.videoId} item={item} />
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}