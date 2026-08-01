import { EDUSIGN_API_BASE } from "@/constants";
import {
	NewPasswordNeededError,
	SsoConfigNotFoundError,
	UnsupportedSsoTypeError,
} from "@/core/errors";
import { handleResponse } from "@/core/handler";
import type {
	AuthSession,
	CasSsoAuthSession,
	MicrosoftOauthAuthSession,
	MicrosoftSsoAuthSession,
	OauthSsoAuthSession,
	PinVerification,
	RefreshedSession,
	SsoConfig,
	WhiteLabelSsoConfig,
} from "@/models/auth";
import { extractDomainFromEmail } from "@/utils";

export async function loginWithCredentials(
	identifier: string,
	password: string,
	language?: "fr" | "en" | "es",
	deviceId?: string,
): Promise<AuthSession> {
	const headers: Record<string, string> = {
		"Content-Type": "application/json",
	};

	if (deviceId) {
		headers["x-device-id"] = deviceId;
	}

	const response = await fetch(
		`${EDUSIGN_API_BASE}/student/account/getByCredentials`,
		{
			method: "POST",
			headers,
			body: JSON.stringify({
				EMAIL: identifier,
				PASSWORD: password,
				LANGUAGE: language ?? "fr",
			}),
		},
	);
	const result = await handleResponse<AuthSession>(response);
	if (result.NEW_PASSWORD_NEEDED === 1) {
		throw new NewPasswordNeededError();
	}
	return result;
}

export async function loginWhitelabelAppWithCredentials(
	identifier: string,
	password: string,
	schoolId: string,
	language?: "fr" | "en" | "es",
	deviceId?: string,
): Promise<AuthSession> {
	const headers: Record<string, string> = {
		"Content-Type": "application/json",
	};

	if (deviceId) {
		headers["x-device-id"] = deviceId;
	}

	const response = await fetch(
		`${EDUSIGN_API_BASE}/student/account/getByCredentials`,
		{
			method: "POST",
			headers,
			body: JSON.stringify({
				EMAIL: identifier,
				PASSWORD: password,
				LANGUAGE: language ?? "fr",
				SCHOOL_ID: schoolId,
			}),
		},
	);
	const result = await handleResponse<AuthSession>(response);
	if (result.NEW_PASSWORD_NEEDED === 1) {
		throw new NewPasswordNeededError();
	}
	return result;
}

export async function verifyPin(
	identifier: string,
	pin: string,
): Promise<PinVerification> {
	const response = await fetch(
		`${EDUSIGN_API_BASE}/student/account/multiAccountLoginPinv2`,
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				email: identifier,
				pin: pin,
			}),
		},
	);
	return handleResponse<PinVerification>(response);
}

export async function loginWithMicrosoft(
	code: string,
	isWhitelabelApp: boolean = false,
	deviceId?: string,
): Promise<MicrosoftOauthAuthSession> {
	const headers: Record<string, string> = {
		"Content-Type": "application/json",
	};

	if (deviceId) {
		headers["x-device-id"] = deviceId;
	}

	const response = await fetch(
		`${EDUSIGN_API_BASE}/integrations/microsoft-v2/connection`,
		{
			method: "POST",
			headers,
			body: JSON.stringify({
				type: "student",
				code: code,
				accessToken: "",
				whiteLabelActive: isWhitelabelApp,
			}),
		},
	);
	return handleResponse<MicrosoftOauthAuthSession>(response);
}

export async function loginWithMicrosoftSso(
	code: string,
	isWhitelabelApp: boolean = false,
	deviceId?: string,
): Promise<MicrosoftSsoAuthSession> {
	return loginWithMicrosoft(code, isWhitelabelApp, deviceId);
}

export async function loginWithCasSso(
	ticket: string,
	schoolId: string,
	isWhitelabelApp: boolean = false,
	deviceId?: string,
): Promise<CasSsoAuthSession> {
	const headers: Record<string, string> = {
		"Content-Type": "application/json",
	};

	if (deviceId) {
		headers["x-device-id"] = deviceId;
	}

	const response = await fetch(
		`${EDUSIGN_API_BASE}/integrations/cas/connection`,
		{
			method: "POST",
			headers,
			body: JSON.stringify({
				type: "student",
				ticketUrl: `https://edusign.app/login?ticket=${ticket}`,
				SCHOOL_ID: schoolId,
				whiteLabelActive: isWhitelabelApp,
			}),
		},
	);
	return handleResponse<CasSsoAuthSession>(response);
}

export async function loginWithOauthSso(
	code: string,
	schoolId: string,
	deviceId?: string,
): Promise<OauthSsoAuthSession> {
	const headers: Record<string, string> = {
		"Content-Type": "application/json",
	};

	if (deviceId) {
		headers["x-device-id"] = deviceId;
	}

	const response = await fetch(`${EDUSIGN_API_BASE}/integrations/sso`, {
		method: "POST",
		headers,
		body: JSON.stringify({
			code: code,
			schoolId: schoolId,
			type: "student",
			redirectUri: "https://edusign.app/student",
		}),
	});
	return handleResponse<OauthSsoAuthSession>(response);
}

export async function refreshTokenByRefreshToken(
	refreshToken: string,
	deviceId?: string,
): Promise<RefreshedSession> {
	const headers: Record<string, string> = {
		"Content-Type": "application/json",
	};

	if (deviceId) {
		headers["x-device-id"] = deviceId;
	}

	const response = await fetch(
		`${EDUSIGN_API_BASE}/student/account/auth/refresh`,
		{
			method: "POST",
			headers,
			body: JSON.stringify({
				refresh_token: refreshToken,
			}),
		},
	);
	return handleResponse<RefreshedSession>(response);
}

export async function logoutByRefreshToken(
	refreshToken: string,
	deviceId?: string,
): Promise<boolean> {
	const headers: Record<string, string> = {
		"Content-Type": "application/json",
	};

	if (deviceId) {
		headers["x-device-id"] = deviceId;
	}

	const response = await fetch(
		`${EDUSIGN_API_BASE}/student/account/auth/logout`,
		{
			method: "POST",
			headers,
			body: JSON.stringify({
				refresh_token: refreshToken,
			}),
		},
	);
	return handleResponse<boolean>(response);
}

export async function getSsoConfig(domain: string): Promise<SsoConfig> {
	const response = await fetch(
		`${EDUSIGN_API_BASE}/integrations/sso/${domain}`,
	);

	const result = await handleResponse<SsoConfig[]>(response);

	if (Array.isArray(result) && result.length > 0) {
		return result[0];
	}

	throw new SsoConfigNotFoundError();
}

export async function getWhiteLabelSsoConfig(
	schoolId: string,
): Promise<WhiteLabelSsoConfig> {
	const response = await fetch(
		`${EDUSIGN_API_BASE}/integrations/sso/whiteLabelSso/pltStudent/${schoolId}`,
	);

	return handleResponse<WhiteLabelSsoConfig>(response);
}

export function createSsoAuthURL(
	config: SsoConfig,
	isWhitelabel: boolean = false,
): string {
	switch (config.type) {
		case "microsoft":
			return "https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=54e3c166-704f-4ee3-a102-618b1de5f055&response_type=code&redirect_uri=https://edusign.app/student/microsoft-v2-sso&response_mode=query&scope=user.read&state=microsoftv2";

		case "oauth": {
			const params = new URLSearchParams({
				response_type: config.data.responseType,
				client_id: config.data.clientId,
				scope: config.data.scope,
				redirect_uri: "https://edusign.app/student",
			});
			return `${config.data.authority}?${params.toString().replace(/%20/g, "+")}`;
		}

		case "cas": {
			const params = new URLSearchParams({
				service: "https://edusign.app/student",
			});
			return `${config.data.webCasClientUrl}?${params.toString()}`;
		}

		case "saml": {
			const params = new URLSearchParams({
				schoolId: config.SCHOOL_ID,
				type: "student",
				whiteLabelActive: String(isWhitelabel),
			});
			return `${EDUSIGN_API_BASE}/integrations/saml/connection?${params.toString()}`;
		}

		default:
			throw new UnsupportedSsoTypeError(
				`Type de SSO non supporté: ${(config as SsoConfig).type}`,
			);
	}
}

export async function isSsoDomain(domain: string): Promise<boolean> {
	const response = await fetch(
		`${EDUSIGN_API_BASE}/integrations/sso/${domain}`,
	);
	const result = await handleResponse<SsoConfig[]>(response);
	return Array.isArray(result) && result.length > 0;
}

export async function isSsoEnabled(email: string): Promise<boolean> {
	const domain = extractDomainFromEmail(email);
	if (!domain) return false;
	return await isSsoDomain(domain);
}
