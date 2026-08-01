import {
	EduSignAPIError,
	InvalidTokenError,
	UnauthorizedError,
} from "../core/errors";

export function isEduSignAPIError(error: unknown): error is EduSignAPIError {
	return error instanceof EduSignAPIError;
}

export function isUnauthorizedError(error: unknown): boolean {
	return (
		error instanceof UnauthorizedError || error instanceof InvalidTokenError
	);
}
