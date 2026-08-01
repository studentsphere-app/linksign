import type { CursorPaginatedData } from "@/models/common";

export interface NewsFeedChannel {
	id: string;
	title: string;
	type: "rss" | "youtube" | string;
	locale: string;
	alwaysDisplayed: boolean;
}

export interface NewsFeedPost {
	id: string;
	url: string;
	channelType: "rss" | "youtube" | string;
	channelId: string;
	title: string;
	content?: string | Record<string, string | null>;
	availableLanguages?: string[];
	createdAt: string;
	imageCoverUrl?: string | null;
}

export type NewsFeedPostsResponse = CursorPaginatedData<NewsFeedPost>;

export interface NewsFeedPostsQuery {
	channels?: string[];
	cursor?: string;
	limit?: number;
}
