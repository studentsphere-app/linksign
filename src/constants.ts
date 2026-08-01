import type { WhiteLabelApp } from "@/models/whitelabel";

export const EDUSIGN_FRONTEND_BASE: string = "https://edusign.app";
export const EDUSIGN_API_BASE: string = "https://api.edusign.fr";
export const EDUSIGN_MICROSOFT_OAUTH_URL: string =
	"https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=54e3c166-704f-4ee3-a102-618b1de5f055&response_type=code&redirect_uri=https%3A%2F%2Fedusign.app%2Fstudent%2Fmicrosoft-v2-sso&response_mode=query&scope=user.read&state=microsoftv2";
export const EDUSIGN_MICROSOFT_SSO_CALLBACK_PREFIX_URL: string =
	"https://edusign.app/student/microsoft-v2-sso";

export const WHITE_LABEL_APPS: Readonly<WhiteLabelApp[]> = [
	{ id: "edhec", package: "com.appscho.EDHEC", appName: "MyEDHEC" },
	{ id: "ipparis", package: "com.appscho.IPParis", appName: "IP Paris Campus" },
	{
		id: "ccihautdefrance",
		package: "com.edusign.ccihautdefrance",
		appName: "MyLaho",
	},
	{ id: "mbs", package: "com.appscho.mbs", appName: "My MBS" },
	{
		id: "campusdesmetierssaintnicolas",
		package: "com.edusign.campusdesmetierssaintnicolas",
		appName: "Campus Saint-Nicolas",
	},
	{ id: "epp", package: "com.appscho.epp", appName: "myEPP" },
	{ id: "icn", package: "com.appscho.icn", appName: "ICN Student" },
];
