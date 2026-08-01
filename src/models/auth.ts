export interface AuthSession {
	ID: string;
	EMAIL: string;
	LASTNAME: string;
	FIRSTNAME: string;
	USERNAME: string;
	LANGUAGE: string;
	SCHOOL_ID: string;
	MULTI_ACCOUNT_LOGIN_CODE: number;
	NEW_PASSWORD_NEEDED: 0 | 1;
	USER_TYPE: string;
	TOKEN: string;
	NUMBER_OF_ACCOUNTS: number;
	STUDENT_FOLLOWER_ID: string[];
	TRAINING_IDS: string[];
	ACCESS_TOKEN?: string;
	REFRESH_TOKEN?: string;
	FAMILY_ID?: string;
}

export interface PinVerification {
	v2Token: string;
}

export interface MicrosoftOauthAuthSession {
	ID: string;
	SCHOOL_ID: string;
	EMAIL: string;
	NUMBER_OF_ACCOUNTS: number;
	TOKEN: string;
	MICROSOFT_ACCESS_TOKEN: string;
	MICROSOFT_REFRESH_TOKEN: string;
	ACCESS_TOKEN: string;
	REFRESH_TOKEN: string;
	FAMILY_ID: string;
	HAS_MULTI_ACCOUNTS: boolean;
}

export type MicrosoftSsoAuthSession = MicrosoftOauthAuthSession;
export type OauthSsoAuthSession = MicrosoftOauthAuthSession;
export type CasSsoAuthSession = MicrosoftOauthAuthSession;

export interface RefreshedSession {
	access_token: string;
	refresh_token: string;
	token_type: string;
	expires_in: number;
	device_id: string;
}

export interface SsoConfigBase {
	SCHOOL_ID: string;
	SCHOOL_NAME: string;
}

export interface MicrosoftSsoConfig extends SsoConfigBase {
	type: "microsoft";
	data: {
		clientId: string;
		authority: string;
		scopes: string[];
		redirectUriAndroid?: string;
		redirectUriIos?: string;
		redirectUri?: string;
	};
}

export interface OauthSsoConfig extends SsoConfigBase {
	type: "oauth";
	data: {
		clientId: string;
		clientSecret: string;
		authority: string;
		scope: string;
		responseType: string;
		redirectUri: string;
		token_auth: string;
		user_auth: string;
		grant_type: string;
		token_req_mode?: string;
		attributePath?: string;
		cert?: string;
	};
}

export interface CasSsoConfig extends SsoConfigBase {
	type: "cas";
	data: {
		webCasClientUrl: string;
		webValidationService: string;
		casClientUrl: string;
		attributePath?: string;
		cert?: string;
	};
}

export interface SamlSsoConfig extends SsoConfigBase {
	type: "saml";
	data: {
		entryPoint: string;
		callbackUrl: string;
		issuer: string;
		idpIssuer: string;
		signatureAlgorithm: string;
		identifierFormat?: string;
		matchingStrategy?: string;
		cert?: string;
		pltType?: string;
		attributePath?: string;
	};
}

export type SsoConfig =
	| MicrosoftSsoConfig
	| OauthSsoConfig
	| CasSsoConfig
	| SamlSsoConfig;

export interface WhiteLabelSsoConfigBase {
	ID: number;
	SCHOOL_ID: string;
	domain: string;
	CERTIFICATE?: string;
	DESCRIPTION?: string;
	SCHOOL_NAME?: string;
}

export interface WhiteLabelMicrosoftSsoConfig extends WhiteLabelSsoConfigBase {
	type: "microsoft";
	DATA: MicrosoftSsoConfig["data"];
	data?: Partial<MicrosoftSsoConfig["data"]>;
}

export interface WhiteLabelOauthSsoConfig extends WhiteLabelSsoConfigBase {
	type: "oauth";
	DATA: OauthSsoConfig["data"];
	data?: Partial<OauthSsoConfig["data"]>;
}

export interface WhiteLabelCasSsoConfig extends WhiteLabelSsoConfigBase {
	type: "cas";
	DATA: CasSsoConfig["data"];
	data?: Partial<CasSsoConfig["data"]>;
}

export interface WhiteLabelSamlSsoConfig extends WhiteLabelSsoConfigBase {
	type: "saml";
	DATA: SamlSsoConfig["data"];
	data?: Partial<SamlSsoConfig["data"]>;
}

export type WhiteLabelSsoConfig =
	| WhiteLabelMicrosoftSsoConfig
	| WhiteLabelOauthSsoConfig
	| WhiteLabelCasSsoConfig
	| WhiteLabelSamlSsoConfig;
