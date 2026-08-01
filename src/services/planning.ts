import { EDUSIGN_API_BASE } from "@/constants";
import { handleResponse } from "@/core/handler";
import type { CourseEntry, PlanningEntry } from "@/models/planning";

export async function getPlanning(
	token: string,
	start: string,
	end: string,
	deviceId?: string,
): Promise<PlanningEntry[]> {
	const url = new URL(`${EDUSIGN_API_BASE}/student/planning`);
	url.searchParams.set("start", start);
	url.searchParams.set("end", end);

	const headers: Record<string, string> = { Authorization: `Bearer ${token}` };
	if (deviceId) {
		headers["x-device-id"] = deviceId;
	}

	const response = await fetch(url.toString(), {
		method: "GET",
		headers,
	});

	return handleResponse<PlanningEntry[]>(response);
}

export async function getCoursesBetweenDates(
	token: string,
	start: string,
	end: string,
	deviceId?: string,
): Promise<CourseEntry[]> {
	const url = new URL(
		`${EDUSIGN_API_BASE}/student/courses/getCoursesBetweenDates`,
	);
	url.searchParams.set("start", start);
	url.searchParams.set("end", end);

	const headers: Record<string, string> = { Authorization: `Bearer ${token}` };
	if (deviceId) {
		headers["x-device-id"] = deviceId;
	}

	const response = await fetch(url.toString(), {
		method: "GET",
		headers,
	});

	return handleResponse<CourseEntry[]>(response);
}

export async function getCourseByCode(
	token: string,
	code: string,
	deviceId?: string,
): Promise<CourseEntry> {
	const headers: Record<string, string> = { Authorization: `Bearer ${token}` };
	if (deviceId) {
		headers["x-device-id"] = deviceId;
	}

	const response = await fetch(
		`${EDUSIGN_API_BASE}/student/courses/code/${encodeURIComponent(code)}`,
		{
			method: "GET",
			headers,
		},
	);

	return handleResponse<CourseEntry>(response);
}
