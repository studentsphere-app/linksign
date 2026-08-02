import type { PaginatedData } from "./common";

export type AssessmentTime = "future" | "past";

export interface Assessment {
	id: string;
	name: string;
	gradingType: string | null;
	deadlineDate: string;
	status: string;
	subject: string | null;
}

export interface AssessmentDetail extends Assessment {
	handedInAt: string;
	description: string;
	link: string | null;
}

export type Assessments = PaginatedData<Assessment>;
