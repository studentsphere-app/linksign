import { EDUSIGN_API_BASE } from "@/constants";
import { handleResponse } from "@/core/handler";
import type {
	Documents,
	SchoolDocument,
	StudentAttachment,
} from "@/models/documents";
import type { Professor } from "@/models/professors";

export async function getDocuments(
	token: string,
	deviceId?: string,
): Promise<Documents<SchoolDocument>> {
	const headers: Record<string, string> = { Authorization: `Bearer ${token}` };
	if (deviceId) {
		headers["x-device-id"] = deviceId;
	}

	const response = await fetch(`${EDUSIGN_API_BASE}/student/documents`, {
		method: "GET",
		headers,
	});

	return handleResponse<Documents<SchoolDocument>>(response);
}

export async function getStudentAttachments(
	token: string,
	deviceId?: string,
): Promise<StudentAttachment[]> {
	const headers: Record<string, string> = { Authorization: `Bearer ${token}` };
	if (deviceId) {
		headers["x-device-id"] = deviceId;
	}

	const response = await fetch(
		`${EDUSIGN_API_BASE}/student/attachments/student`,
		{
			method: "GET",
			headers,
		},
	);

	return handleResponse<StudentAttachment[]>(response);
}

export async function getProfessors(
	token: string,
	professorIds: string[],
	deviceId?: string,
): Promise<Professor[]> {
	const headers: Record<string, string> = {
		Authorization: `Bearer ${token}`,
		"Content-Type": "application/json",
	};
	if (deviceId) {
		headers["x-device-id"] = deviceId;
	}

	const response = await fetch(`${EDUSIGN_API_BASE}/student/professors`, {
		method: "POST",
		headers,
		body: JSON.stringify({ ids: professorIds }),
	});

	return handleResponse<Professor[]>(response);
}
