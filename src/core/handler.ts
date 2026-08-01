import type { EduSignResponse } from "@/models/common";
import {
	CoursesNotFoundError,
	GenericAPIError,
	InvalidTokenError,
	StatesNotFoundError,
	StudentAccountSsoNotFoundError,
	StudentAlreadyPresentError,
	UnauthorizedError,
	WrongValueError,
} from "./errors";

export const handleResponse = async <T>(response: Response): Promise<T> => {
	let data: EduSignResponse<T>;
	try {
		data = await response.json();
	} catch (_e) {
		throw new GenericAPIError(
			`Edusign API Error ${response.status}: ${response.statusText}`,
		);
	}

	if (data.status === "success") {
		return data.result;
	}

	switch (data.errorCode) {
		case "ERR_INVALID_TOKEN":
			throw new InvalidTokenError();
		case "UNAUTHORIZED":
			throw new UnauthorizedError();
		case "ER_WRONG_VALUE":
			throw new WrongValueError();
		case "ERR_STUDENT_ALREADY_PRESENT":
			throw new StudentAlreadyPresentError();
		case "ERR_COURSES_NOT_FOUND":
			throw new CoursesNotFoundError();
		case "ERR_STATES_NOT_FOUND":
			throw new StatesNotFoundError();
		case "ERR_STUDENT_ACCOUNT_SSO_NOT_FOUND":
			throw new StudentAccountSsoNotFoundError();
		default:
			throw new GenericAPIError(
				data.message ||
					`Edusign API Error ${response.status}: ${response.statusText}`,
			);
	}
};
