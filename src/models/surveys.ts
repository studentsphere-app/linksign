export interface SurveyPageElement {
	type: string;
	name: string;
	title: string;
	description?: string;
	inputTextAlignment?: string;
	maskType?: string;
	options?: string[];
	required?: boolean;
}

export interface SurveyPage {
	name: string;
	title: string;
	description?: string;
	elements: SurveyPageElement[];
}

export interface SurveyTemplate {
	title: string;
	description?: string;
	pages: SurveyPage[];
}

export interface SurveyEntry {
	ID: string;
	NAME: string;
	AUTOMATIC_SEND_DATE: string | null;
	DATE_CREATED: string;
	SCHOOL_ID: string;
	RECIPIENT_TYPE: number;
	TRAINING_ID: string | null;
	TEMPLATE: SurveyTemplate;
	isAnswered: boolean;
	toFill: boolean;
	date: string;
}

export interface Surveys<T = SurveyEntry> {
	past: T[];
	current: T[];
	toFill: T[];
}

export interface SurveyDetail {
	ID: string;
	NAME: string;
	TEMPLATE: SurveyTemplate;
	OLD_STUDENT_ANSWERS: string;
	RECIPIENT_IDS: string[];
	REMINDER_EMAILS_NB_SENT: number;
	ANONYMOUS: number;
	TYPE: number;
	SCHOOL_ID: string;
	COURSE_ID: string;
	TEMPLATE_ID: string;
	AUTOMATIC_SEND_DATE: string | null;
	SURVEY_SENT: number;
	RECIPIENT_TYPE: string;
	DATE_CREATED: string;
	DATE_UPDATED: string;
	STUDENT_INSCRIPTION_HASH: string;
	HIDDEN: number;
	MESSAGE: string;
	SEND_TO_ABSENTS: number;
	TRAINING_ID: string | null;
	TRAINING_SCHEDULE: unknown | null;
	STUDENT_ANSWERS: unknown[];
}

export interface SurveySchoolInfo {
	ID: string;
	NAME: string;
	LOGO: string;
	STREET_ADDRESS: string;
	CITY: string;
	POSTALCODE: string;
}

export interface SurveyStudentInfo {
	FIRSTNAME: string;
	LASTNAME: string;
	TRAINING_NAME: string;
}

export interface SurveyDetails {
	course: Record<string, unknown>;
	training: Record<string, unknown>;
	survey: SurveyDetail;
	school: SurveySchoolInfo;
	student: SurveyStudentInfo;
	alreadyAnswered: boolean;
	answers: Record<string, unknown>;
}

export interface SurveyAnswersRequest {
	answers: Record<string, unknown>;
}
