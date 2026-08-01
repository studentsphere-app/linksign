import { EDUSIGN_API_BASE } from "@/constants";
import { handleResponse } from "@/core/handler";
import type { SchoolFeatures, StudentAccount } from "@/models/schools";

export async function getSchools(
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

export async function getSchoolFeatures(
	token: string,
	schoolId: string,
	deviceId?: string,
): Promise<SchoolFeatures> {
	const url = new URL(`${EDUSIGN_API_BASE}/student/school/features`);
	url.searchParams.set("schoolId", schoolId);

	const headers: Record<string, string> = { Authorization: `Bearer ${token}` };
	if (deviceId) {
		headers["x-device-id"] = deviceId;
	}

	const response = await fetch(url.toString(), {
		method: "GET",
		headers,
	});

	return handleResponse<SchoolFeatures>(response);
}
