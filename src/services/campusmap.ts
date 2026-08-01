import { EDUSIGN_API_BASE } from "@/constants";
import { handleResponse } from "@/core/handler";
import type { CampusMapLocation } from "@/models/campusmap";

export async function getPublicCampusMapBySchool(
	schoolId: string,
): Promise<CampusMapLocation[]> {
	const headers: Record<string, string> = {
		"x-edusign-school-id": schoolId,
	};

	const response = await fetch(
		`${EDUSIGN_API_BASE}/student/campus-map/public/locations`,
		{
			method: "GET",
			headers,
		},
	);

	return handleResponse<CampusMapLocation[]>(response);
}

export async function getPrivateCampusMapBySchool(
	schoolId: string,
	token: string,
	deviceId?: string,
): Promise<CampusMapLocation[]> {
	const headers: Record<string, string> = {
		"x-edusign-school-id": schoolId,
		Authorization: `Bearer ${token}`,
	};
	if (deviceId) {
		headers["x-device-id"] = deviceId;
	}

	const response = await fetch(
		`${EDUSIGN_API_BASE}/student/campus-map/private/locations`,
		{
			method: "GET",
			headers,
		},
	);

	return handleResponse<CampusMapLocation[]>(response);
}
