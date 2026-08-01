import { EDUSIGN_API_BASE } from "@/constants";
import { handleResponse } from "@/core/handler";
import type {
	NotificationsPreferences,
	StudentProfile,
} from "@/models/profile";
import type { StudentAccount } from "@/models/schools";

export async function getProfile(
	token: string,
	deviceId?: string,
): Promise<StudentProfile> {
	const headers: Record<string, string> = { Authorization: `Bearer ${token}` };
	if (deviceId) {
		headers["x-device-id"] = deviceId;
	}

	const response = await fetch(
		`${EDUSIGN_API_BASE}/student/account/getByToken`,
		{
			method: "GET",
			headers,
		},
	);

	return handleResponse<StudentProfile>(response);
}

export async function getSchoolsByToken(
	token: string,
	deviceId?: string,
): Promise<StudentAccount[]> {
	const headers: Record<string, string> = { Authorization: `Bearer ${token}` };
	if (deviceId) {
		headers["x-device-id"] = deviceId;
	}

	const response = await fetch(
		`${EDUSIGN_API_BASE}/student/account/schoolsByV2Token`,
		{
			method: "GET",
			headers,
		},
	);

	return handleResponse<StudentAccount[]>(response);
}

export async function getNotificationsPreferences(
	token: string,
	deviceId?: string,
): Promise<NotificationsPreferences> {
	const headers: Record<string, string> = { Authorization: `Bearer ${token}` };
	if (deviceId) {
		headers["x-device-id"] = deviceId;
	}

	const response = await fetch(
		`${EDUSIGN_API_BASE}/student/notifications/preferences`,
		{
			method: "GET",
			headers,
		},
	);

	return handleResponse<NotificationsPreferences>(response);
}
