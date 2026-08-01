export interface EduSignSuccessResponse<T> {
	status: "success";
	result: T;
}

export interface EduSignErrorResponse {
	status: "error";
	message: string;
	errorCode: EduSignErrorCode;
	code: string;
	path: string;
	timestamp: string;
}

export type EduSignErrorCode =
	| "ERR_INVALID_TOKEN"
	| "ERROR"
	| "UNAUTHORIZED"
	| "ER_WRONG_VALUE"
	| "ERR_STUDENT_ALREADY_PRESENT"
	| "ERR_COURSES_NOT_FOUND"
	| "ERR_STATES_NOT_FOUND"
	| (string & {});

export type EduSignResponse<T> =
	| EduSignSuccessResponse<T>
	| EduSignErrorResponse;

export interface Pagination {
	total_records: number;
	current_page: number;
	total_pages: number;
	next_page: number | null;
	prev_page: number | null;
}

export interface PaginatedData<T> {
	data: T[];
	pagination: Pagination;
}

export interface CursorPagination {
	current_cursor: string | null;
	next_page: string | null;
	next_cursor: string | null;
}

export interface CursorPaginatedData<T> {
	data: T[];
	metadata?: Record<string, unknown>;
	pagination: CursorPagination;
}

export interface DateRange {
	start: string;
	end: string;
}
