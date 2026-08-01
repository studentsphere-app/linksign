import { EDUSIGN_API_BASE } from "@/constants";
import { handleResponse } from "@/core/handler";
import type {
	Absence,
	AttendanceStatistics,
	NewAbsence,
	SchoolAbsenceType,
	SubmittedAbsence,
} from "@/models/attendance";

export async function getAttendanceStatistics(
	token: string,
	start: string,
	end: string,
	trainingId: string | null = null,
	deviceId?: string,
): Promise<AttendanceStatistics> {
	const url = `${EDUSIGN_API_BASE}/student/absences/statistics`;

	const headers: Record<string, string> = {
		Authorization: `Bearer ${token}`,
		"Content-Type": "application/json",
	};

	if (deviceId) {
		headers["x-device-id"] = deviceId;
	}

	const body = JSON.stringify({ start, end, trainingId });

	const response = await fetch(url, {
		method: "POST",
		headers,
		body,
	});

	return handleResponse<AttendanceStatistics>(response);
}

export async function getSchoolAbsenceTypes(
	token: string,
	deviceId?: string,
): Promise<SchoolAbsenceType[]> {
	const url = `${EDUSIGN_API_BASE}/student/absences/types`;

	const headers: Record<string, string> = {
		Authorization: `Bearer ${token}`,
	};

	if (deviceId) {
		headers["x-device-id"] = deviceId;
	}

	const response = await fetch(url, {
		method: "GET",
		headers,
	});

	return handleResponse<SchoolAbsenceType[]>(response);
}

export async function getAbsences(
	token: string,
	start: string,
	end: string,
	deviceId?: string,
): Promise<Absence[]> {
	const url = `${EDUSIGN_API_BASE}/student/absences/requests`;

	const headers: Record<string, string> = {
		Authorization: `Bearer ${token}`,
		"Content-Type": "application/json",
	};

	if (deviceId) {
		headers["x-device-id"] = deviceId;
	}

	const body = JSON.stringify({ start, end });

	const response = await fetch(url, {
		method: "POST",
		headers,
		body,
	});

	return handleResponse<Absence[]>(response);
}

export async function submitAbsence(
	token: string,
	absence: NewAbsence,
	deviceId?: string,
): Promise<SubmittedAbsence> {
	const url = `${EDUSIGN_API_BASE}/student/absences/request/`;

	const headers: Record<string, string> = {
		Authorization: `Bearer ${token}`,
		"Content-Type": "application/json",
	};

	if (deviceId) {
		headers["x-device-id"] = deviceId;
	}

	const body = JSON.stringify({ absence });

	const response = await fetch(url, {
		method: "POST",
		headers,
		body,
	});

	return handleResponse<SubmittedAbsence>(response);
}
