export interface School {
	ID: string;
	NAME: string;
	LOGO: string;
	STREET_ADDRESS: string;
	CITY: string;
	POSTALCODE: string;
	PHONE: string;
}

export interface SchoolInfo {
	ID: string;
	NAME: string;
	LOGO: string;
	CLASSROOMS: string[];
	STREET_ADDRESS: string;
	CITY: string;
	POSTALCODE: string;
	PHONE: string;
	ENABLE_STUDENT_TO_EDIT_PROFILE_PICTURE: number;
	TIMEZONE: string;
}

export interface StudentAccount {
	ID: string;
	EMAIL: string;
	FIRSTNAME: string;
	LASTNAME: string;
	USERNAME: string;
	PHOTO: string;
	PHONE: string;
	TRAINING_NAME: string;
	FILE_NUMBER: string;
	COMPANY: string;
	TAGS: string[];
	SIGNATURE_ID: string;
	HIDDEN: number;
	DATE_CREATED: string;
	DATE_UPDATED: string;
	MULTI_ACCOUNT_LOGIN_CODE: number;
	SCHOOL_ID: string;
	BADGE_ID: string;
	PUSH_TOKEN: string;
	API_ID: string;
	API_TYPE: string;
	LANGUAGE: "fr" | "en" | "es";
	VARIABLES: unknown | null;
	STUDENT_FOLLOWER_ID: string[];
	NEW_PASSWORD_NEEDED: number;
	USER_TYPE: string;
	TRAINING_IDS: string[];
	TOKEN: string;
	ACCESS_TOKEN: string;
	REFRESH_TOKEN: string;
	FAMILY_ID: string;
	SCHOOL: School;
}

export interface SchoolFeaturesEnabled {
	OPTION_ALERTS: boolean;
	OPTION_STATISTICS: boolean;
	OPTION_DOCUMENTS: boolean;
	OPTION_SURVEY: boolean;
	KNOWLEDGE_BASE: boolean;
	MAILBOX: boolean;
	SCHEDULE: boolean;
	OPTION_ABSENCE_RECORD_ALLOWED: boolean;
	OPTION_ADD_USER: boolean;
	OPTION_API: boolean;
	OPTION_CONNECTORS: boolean;
	OPTION_CONNEXION_LINK: boolean;
	OPTION_CUSTOM_EMAILS: boolean;
	OPTION_GROUPED_SENDING_OF_DOCUMENTS: boolean;
	OPTION_PREMIUM_SURVEY: boolean;
	OPTION_ADMIN: number;
	OPTION_SIGNATURES: number;
	OPTION_DOCUMENTS_NO_SIGN_TEMPLATE: number;
	OPTION_SURVEYS_TEMPLATES: number;
	OPTION_DOC_WITHOUT_TEMPLATE: number;
	NEWS_FEED: boolean;
	CAMPUS_MAP: boolean;
	WEBVIEW: boolean;
	OPTION_STUDENTS_IP_RESTRICTION: boolean;
	MESSAGING: boolean;
	IA_FEATURES: boolean;
	STUDENT_CARD: boolean;
	ASSESSMENTS: boolean;
	GRADES: boolean;
	ATTENDANCE: boolean;
	CONTACTS_DIRECTORY: boolean;
	TRANSPORTS: boolean;
	CAMPUS_CHATBOT: boolean;
	NEW_COLLABORATOR_TRIGGER_EMAIL: boolean;
	AUTOMATIONS: boolean;
	MAX_TABLE_TEMPLATES: number;
	BLOCK_ARCHIVE_WITHOUT_TEACHER_SIGNATURE: boolean;
	AUTOMATIONS_CHATBOT: boolean;
	TRAINING: boolean;
	JUSTIFY_ABSENCE: boolean;
	JUSTIFY_ABSENCES_IA: boolean;
	SURVEYS: boolean;
	DOCUMENTS: boolean;
}

export interface SchoolFeatures {
	TIMEZONE: string;
	YOUSIGN_TOKEN: boolean;
	STUDENT_CARD_MODE: string | null;
	ISIC_MODE: string | null;
	ISIC_FIELD: string;
	STUDENT_CARD_ACTIVATED: number;
	featuresEnabled: SchoolFeaturesEnabled;
}
