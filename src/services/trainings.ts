import { EDUSIGN_API_BASE } from "@/constants";
import { handleResponse } from "@/core/handler";
import type { Training } from "@/models/trainings";

export async function getTrainings(
	token: string,
	deviceId?: string,
): Promise<Training[]> {
	const headers: Record<string, string> = { Authorization: `Bearer ${token}` };
	if (deviceId) {
		headers["x-device-id"] = deviceId;
	}

	const response = await fetch(`${EDUSIGN_API_BASE}/student/training`, {
		method: "GET",
		headers,
	});

	return handleResponse<Training[]>(response);
}
