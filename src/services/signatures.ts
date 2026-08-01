import { EDUSIGN_API_BASE } from "@/constants";
import { handleResponse } from "@/core/handler";
import type {
	SignByCodeRequest,
	SignByEmailRequest,
	SignByQRCodeRequest,
} from "@/models/signatures";

export async function signByQRCode(
	token: string,
	qrCodeId: string | number,
	body: SignByQRCodeRequest,
	deviceId?: string,
): Promise<unknown> {
	const headers: Record<string, string> = {
		Authorization: `Bearer ${token}`,
		"Content-Type": "application/json",
		qrcodeid: String(qrCodeId),
	};
	if (deviceId) {
		headers["x-device-id"] = deviceId;
	}

	const response = await fetch(
		`${EDUSIGN_API_BASE}/student/courses/scanQRCode-v2`,
		{
			method: "POST",
			headers,
			body: JSON.stringify(body),
		},
	);

	return handleResponse<unknown>(response);
}

export async function signByEmail(
	token: string,
	courseId: string,
	verificationToken: string,
	body: SignByEmailRequest,
	deviceId?: string,
): Promise<unknown> {
	const url = new URL(
		`${EDUSIGN_API_BASE}/student/courses/email/setStudentPresent/${encodeURIComponent(courseId)}`,
	);
	url.searchParams.set("verificationToken", verificationToken);

	const headers: Record<string, string> = {
		Authorization: `Bearer ${token}`,
		"Content-Type": "application/json",
	};
	if (deviceId) {
		headers["x-device-id"] = deviceId;
	}

	const response = await fetch(url.toString(), {
		method: "POST",
		headers,
		body: JSON.stringify(body),
	});

	return handleResponse<unknown>(response);
}

export async function signByCode(
	token: string,
	code: string,
	body: SignByCodeRequest,
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
		`${EDUSIGN_API_BASE}/student/courses/code/setStudentPresent/${encodeURIComponent(code)}`,
		{
			method: "POST",
			headers,
			body: JSON.stringify(body),
		},
	);

	return handleResponse<unknown>(response);
}
