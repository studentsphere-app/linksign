import type { PaginatedData } from "./common";

export type AssessmentTime = "future" | "past" | "current";

export interface Assessment {
	ID: string;
	NAME: string;
	DATE: string;
	SCHOOL_ID: string;
	TRAINING_ID: string | null;
	DESCRIPTION: string;
	TYPE: string;
}

export type Assessments = PaginatedData<Assessment>;
