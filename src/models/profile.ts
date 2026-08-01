import type { SchoolInfo } from "./schools";

export interface NotificationsPreferences {
	messaging: { push: boolean };
	attendance: { inApp: boolean; push: boolean };
	assessments: { inApp: boolean; push: boolean };
	documents: { inApp: boolean; push: boolean };
	surveys: { inApp: boolean; push: boolean };
	grades: { inApp: boolean; push: boolean };
	planning: { inApp: boolean; push: boolean };
}

export interface StudentProfile {
	ID: string;
	EMAIL: string;
	LASTNAME: string;
	FIRSTNAME: string;
	PASSWORD: string;
	USERNAME: string;
	LANGUAGE: "fr" | "en" | "es";
	SCHOOL_ID: string;
	PHOTO: string;
	SCHOOL: SchoolInfo;
	NOTIFICATIONS_PREFERENCES: NotificationsPreferences;
	AUDIENCE_ID: string | null;
	isImpersonated: boolean;
}
