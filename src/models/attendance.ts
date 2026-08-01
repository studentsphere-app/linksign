export interface AttendanceStatistics {
	totalCourses: number;
	absences: number;
	justified: number;
	presences: number;
	justifiedRatio: number;
	delays: number;
	presenceRatio: number;
	pending: number;
}

export interface SchoolAbsenceType {
	ID: number;
	NAME: string;
}

export type AbsenceStatus = "pending" | "accepted" | "refused";

export interface AbsenceIA {
	state: string;
	reason: string;
}

export interface Absence {
	id: string;
	status: AbsenceStatus;
	reasonLabel: string;
	refusalReason: string | null;
	start: string;
	end: string;
	createdAt: string;
	decisionAt: string | null;
	requestDate: string;
	ia: AbsenceIA | null;
	sessions: string[];
}

export interface NewAbsence {
	TYPE: number;
	hasComment: boolean;
	COMMENT?: string;
	START: string;
	END: string;
	STATUS: number;
	STUDENT_ID: string;
	FILE?: {
		DATA: string;
		NAME: string;
	};
	fileType?: string;
	rgpdChecked: boolean;
}

export interface SubmittedAbsence {
	ID: string;
}
