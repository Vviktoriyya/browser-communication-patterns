import type {YoutubeSearchItem} from "../../types/youtube.ts";


interface VideoCardProps {
    item: YoutubeSearchItem;
}

export default function VideoCard({ item }: VideoCardProps) {
    const videoId = item.id?.videoId;
    const snippet = item.snippet;
    if (!videoId) return null;

    return (
        <a
            href={`https://www.youtube.com/watch?v=${videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group block"
        >
            <div className="aspect-video w-full overflow-hidden rounded-xl bg-slate-200">
                <img
                    src={snippet.thumbnails?.medium?.url || snippet.thumbnails?.default?.url}
                    alt={snippet.title}
                    className="h-full w-full object-cover transition group-hover:scale-[1.02]"
                />
            </div>

            <div className="mt-3 flex gap-3">
                {item.channelAvatarUrl ? (
                    <img
                        src={item.channelAvatarUrl}
                        alt={snippet.channelTitle}
                        className="h-10 w-10 flex-shrink-0 rounded-full object-cover"
                    />
                ) : (
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-200 text-base font-bold text-indigo-700">
            {snippet.channelTitle?.[0] ?? '?'}
          </span>
                )}

                <div className="min-w-0">
                    <p className="line-clamp-2 text-base font-medium text-slate-900">{snippet.title}</p>
                    <p className="mt-1 text-sm text-slate-500">{snippet.channelTitle}</p>
                </div>
            </div>
        </a>
    );
}