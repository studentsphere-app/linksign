import { EDUSIGN_API_BASE } from "@/constants";
import { handleResponse } from "@/core/handler";
import type {
	SurveyAnswersRequest,
	SurveyDetails,
	SurveyEntry,
	Surveys,
} from "@/models/surveys";

export async function getSurveys(
	token: string,
	deviceId?: string,
): Promise<Surveys<SurveyEntry>> {
	const headers: Record<string, string> = { Authorization: `Bearer ${token}` };
	if (deviceId) {
		headers["x-device-id"] = deviceId;
	}

	const response = await fetch(`${EDUSIGN_API_BASE}/student/surveys`, {
		method: "GET",
		headers,
	});

	return handleResponse<Surveys<SurveyEntry>>(response);
}

export async function getSurveyById(
	token: string,
	schoolId: string,
	studentId: string,
	surveyId: string,
	deviceId?: string,
): Promise<SurveyDetails> {
	const headers: Record<string, string> = { Authorization: `Bearer ${token}` };
	if (deviceId) {
		headers["x-device-id"] = deviceId;
	}

	const response = await fetch(
		`${EDUSIGN_API_BASE}/surveys/survey/${encodeURIComponent(schoolId)}/${encodeURIComponent(studentId)}/${encodeURIComponent(surveyId)}`,
		{
			method: "GET",
			headers,
		},
	);

	return handleResponse<SurveyDetails>(response);
}

export async function answerSurvey(
	token: string,
	schoolId: string,
	studentId: string,
	surveyId: string,
	body: SurveyAnswersRequest,
	deviceId?: string,
): Promise<unknown> {
	const headers: Record<string, string> = {
		Authorization: `Bearer ${token}`,
		"Content-Type": "application/json",
	};
	if (deviceId) {
		headers["x-device-id"] = deviceId;
	}

	const response = await fetch(
		`${EDUSIGN_API_BASE}/surveys/survey/${encodeURIComponent(schoolId)}/${encodeURIComponent(studentId)}/${encodeURIComponent(surveyId)}`,
		{
			method: "POST",
			headers,
			body: JSON.stringify(body),
		},
	);

	return handleResponse<unknown>(response);
}
