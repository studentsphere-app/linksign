import { EDUSIGN_API_BASE } from "@/constants";
import { handleResponse } from "@/core/handler";
import type {
	AssessmentDetail,
	Assessments,
	AssessmentTime,
} from "@/models/assessments";

export async function getAssessments(
	token: string,
	time: AssessmentTime = "future",
	deviceId?: string,
): Promise<Assessments> {
	const url = new URL(`${EDUSIGN_API_BASE}/student/assessments`);
	url.searchParams.set("time", time);

	const headers: Record<string, string> = { Authorization: `Bearer ${token}` };
	if (deviceId) {
		headers["x-device-id"] = deviceId;
	}

	const response = await fetch(url.toString(), {
		method: "GET",
		headers,
	});

	return handleResponse<Assessments>(response);
}

export async function getAssessmentDetailById(
	token: string,
	id: string,
	deviceId?: string,
): Promise<AssessmentDetail> {
	const url = `${EDUSIGN_API_BASE}/student/assessments/${encodeURIComponent(id)}`;

	const headers: Record<string, string> = { Authorization: `Bearer ${token}` };
	if (deviceId) {
		headers["x-device-id"] = deviceId;
	}

	const response = await fetch(url, {
		method: "GET",
		headers,
	});

	return handleResponse<AssessmentDetail>(response);
}
