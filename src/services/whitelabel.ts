import { EDUSIGN_API_BASE } from "@/constants";
import { handleResponse } from "@/core/handler";
import type {
	WhiteLabelAppConfiguration,
	WhiteLabelAppSchool,
} from "@/models/whitelabel";

export async function getWhiteLabelConfiguration(
	appPackage: string,
): Promise<WhiteLabelAppConfiguration> {
	const response = await fetch(
		`${EDUSIGN_API_BASE}/student/white-label/configuration/${appPackage}`,
	);

	return handleResponse<WhiteLabelAppConfiguration>(response);
}

export async function getWhiteLabelSchools(
	appPackage: string,
): Promise<WhiteLabelAppSchool[]> {
	const config = await getWhiteLabelConfiguration(appPackage);
	return config.schoolIds;
}
