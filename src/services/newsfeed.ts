import { EDUSIGN_API_BASE } from "@/constants";
import { handleResponse } from "@/core/handler";
import type {
	NewsFeedChannel,
	NewsFeedPostsQuery,
	NewsFeedPostsResponse,
} from "@/models/newsfeed";

function buildNewsFeedQuery(query?: NewsFeedPostsQuery): string {
	if (!query) return "";
	const params = new URLSearchParams();

	if (query.channels && query.channels.length > 0) {
		params.append("channels", query.channels.join(","));
	}

	if (query.cursor) {
		params.append("cursor", query.cursor);
	}

	if (query.limit) {
		params.append("limit", query.limit.toString());
	}

	const queryString = params.toString();
	return queryString ? `?${queryString}` : "";
}

/**
 * Récupère les chaînes (channels) du feed public.
 * Endpoint: GET /student/news-feed/public/channels
 */
export async function getPublicNewsFeedChannels(
	schoolId: string,
	lang: string = "fr",
): Promise<NewsFeedChannel[]> {
	const response = await fetch(
		`${EDUSIGN_API_BASE}/student/news-feed/public/channels`,
		{
			method: "GET",
			headers: {
				"x-edusign-school-id": schoolId,
				"x-edusign-lang": lang,
			},
		},
	);

	return handleResponse<NewsFeedChannel[]>(response);
}

export async function getPrivateNewsFeedChannels(
	schoolId: string,
	token: string,
	deviceId?: string,
	lang: string = "fr",
): Promise<NewsFeedChannel[]> {
	const headers: Record<string, string> = {
		"x-edusign-school-id": schoolId,
		"x-edusign-lang": lang,
		Authorization: `Bearer ${token}`,
	};

	if (deviceId) {
		headers["x-device-id"] = deviceId;
	}

	const response = await fetch(
		`${EDUSIGN_API_BASE}/student/news-feed/private/channels`,
		{
			method: "GET",
			headers,
		},
	);

	return handleResponse<NewsFeedChannel[]>(response);
}

export async function getPublicNewsFeedPosts(
	schoolId: string,
	query?: NewsFeedPostsQuery,
	lang: string = "fr",
): Promise<NewsFeedPostsResponse> {
	const queryString = buildNewsFeedQuery(query);

	const response = await fetch(
		`${EDUSIGN_API_BASE}/student/news-feed/public/posts${queryString}`,
		{
			method: "GET",
			headers: {
				"x-edusign-school-id": schoolId,
				"x-edusign-lang": lang,
			},
		},
	);

	return handleResponse<NewsFeedPostsResponse>(response);
}

export async function getPrivateNewsFeedPosts(
	schoolId: string,
	token: string,
	query?: NewsFeedPostsQuery,
	deviceId?: string,
	lang: string = "fr",
): Promise<NewsFeedPostsResponse> {
	const headers: Record<string, string> = {
		"x-edusign-school-id": schoolId,
		"x-edusign-lang": lang,
		Authorization: `Bearer ${token}`,
	};

	if (deviceId) {
		headers["x-device-id"] = deviceId;
	}

	const queryString = buildNewsFeedQuery(query);

	const response = await fetch(
		`${EDUSIGN_API_BASE}/student/news-feed/private/posts${queryString}`,
		{
			method: "GET",
			headers,
		},
	);

	return handleResponse<NewsFeedPostsResponse>(response);
}
