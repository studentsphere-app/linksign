import { EDUSIGN_API_BASE } from "@/constants";
import { handleResponse } from "@/core/handler";
import type { KnowledgeBasePost } from "@/models/knowledgebase";

export async function getPublicKnowledgeBasePosts(
	schoolId: string,
	lang = "fr",
): Promise<KnowledgeBasePost[]> {
	const headers: Record<string, string> = {
		"x-edusign-school-id": schoolId,
		"x-edusign-lang": lang,
	};

	const response = await fetch(
		`${EDUSIGN_API_BASE}/student/knowledge-base/public/posts`,
		{
			method: "GET",
			headers,
		},
	);

	return handleResponse<KnowledgeBasePost[]>(response);
}

export async function getPrivateKnowledgeBasePosts(
	schoolId: string,
	token: string,
	deviceId?: string,
	lang = "fr",
): Promise<KnowledgeBasePost[]> {
	const headers: Record<string, string> = {
		"x-edusign-school-id": schoolId,
		"x-edusign-lang": lang,
		Authorization: `Bearer ${token}`,
	};

	if (deviceId) {
		headers["x-device-id"] = deviceId;
	}

	const response = await fetch(
		`${EDUSIGN_API_BASE}/student/knowledge-base/private/posts`,
		{
			method: "GET",
			headers,
		},
	);

	return handleResponse<KnowledgeBasePost[]>(response);
}
