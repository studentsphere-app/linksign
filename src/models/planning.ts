export interface StudentSignatureRecord {
	_id: number;
	studentId: string;
	courseId: string;
	schoolId: string;
	state: boolean;
	start: string;
	end: string;
	absenceId: string | null;
	excluded: string | null;
	earlyDeparture: string | null;
	delay: number;
	signatureEmail: string | null;
	justifyAbsenceReminder: string | null;
	timestamp: string;
	signature: string | null;
	comment: string;
	teamsId: string | null;
	studentTime: number;
	platform: string | null;
	zoom_last_logged_in: string | null;
	zoom_logged_in: string | null;
	zoom_name: string | null;
	zoom_left: string | null;
	session_duration: number;
	dateCreated: string;
	dateUpdated: string;
}

export interface CourseEntry {
	ID: string;
	NAME: string;
	START: string;
	END: string;
	LOCKED: number;
	CLASSROOM: string;
	SCHOOL_GROUP: string[];
	DESCRIPTION: string;
	TRAINING_ID: string | null;
	NEED_STUDENTS_SIGNATURE: number;
	SURVEY_ID: string;
	SURVEY_ID_2: string;
	API_ID: string;
	PROFESSOR: string;
	PROFESSOR_SIGNATURE: string | null;
	idx: number;
	STUDENTS: StudentSignatureRecord[];
	surveyCount: number;
	STUDENT_IS_JUSTIFICATED: boolean;
	STUDENT_ABSENCE_ID: string | null;
	JUSTIFIED: boolean;
	STUDENT_PRESENCE: boolean;
	STUDENT_SIGNATURE: string | null;
	SIGNATURE_DATE: string | null;
	DELAY: number;
	COMMENT: string;
	EARLY_DEPARTURE: string | null;
	WAITING: boolean;
	EXCLUDED: string | null;
	REQUEST_STATUS: number;
	data_type: "attendance_sheet";
	type: string;
}

export interface PlanningAssessmentEntry {
	id: string;
	name: string;
	gradingType: string;
	deadlineDate: string;
	status: string;
	subject: string | null;
	data_type: "assessment";
}

export interface EventEntry {
	ID: string;
	NAME: string;
	START: string;
	END: string;
	DESCRIPTION: string;
	CLASSROOM_ID: number;
	SCHOOL_ID: string;
	TYPE: string;
	API_ID: string;
	API_TYPE: string;
	COLOR: string;
	DATE_CREATED: string;
	DATE_UPDATED: string;
	PROFESSORS: string;
	CLASSROOM: string;
	data_type: "event";
	type: string;
}

export type PlanningEntry = CourseEntry | PlanningAssessmentEntry | EventEntry;
