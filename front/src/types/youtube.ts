export interface YoutubeThumbnail {
    url: string;
    width?: number;
    height?: number;
}

export interface YoutubeSnippet {
    title: string;
    channelId: string;
    channelTitle: string;
    thumbnails: {
        default?: YoutubeThumbnail;
        medium?: YoutubeThumbnail;
        high?: YoutubeThumbnail;
    };
}

export interface YoutubeSearchItem {
    id: { videoId: string };
    snippet: YoutubeSnippet;
    channelAvatarUrl?: string;
}

export interface YoutubeSearchResponse {
    items: YoutubeSearchItem[];
}

export interface YoutubeChannelItem {
    id: string;
    snippet?: {
        thumbnails?: {
            default?: YoutubeThumbnail;
        };
    };
}

export interface YoutubeChannelsResponse {
    items: YoutubeChannelItem[];
}