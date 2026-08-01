export class EduSignAPIError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "EduSignAPIError";
	}
}

export class InvalidTokenError extends EduSignAPIError {
	constructor(message: string = "Invalid or expired token") {
		super(message);
		this.name = "InvalidTokenError";
	}
}

export class UnauthorizedError extends EduSignAPIError {
	constructor(message: string = "Unauthorized access") {
		super(message);
		this.name = "UnauthorizedError";
	}
}

export class WrongValueError extends EduSignAPIError {
	constructor(message: string = "Invalid value provided") {
		super(message);
		this.name = "WrongValueError";
	}
}

export class StudentAlreadyPresentError extends EduSignAPIError {
	constructor(message: string = "Student already present during signature") {
		super(message);
		this.name = "StudentAlreadyPresentError";
	}
}

export class CoursesNotFoundError extends EduSignAPIError {
	constructor(message: string = "Course not found during signature") {
		super(message);
		this.name = "CoursesNotFoundError";
	}
}

export class StatesNotFoundError extends EduSignAPIError {
	constructor(message: string = "Student(s) not found during signature") {
		super(message);
		this.name = "StatesNotFoundError";
	}
}

export class GenericAPIError extends EduSignAPIError {
	constructor(message: string = "Server error") {
		super(message);
		this.name = "GenericAPIError";
	}
}

export class SsoConfigNotFoundError extends EduSignAPIError {
	constructor(message: string = "SSO configuration not found") {
		super(message);
		this.name = "SsoConfigNotFoundError";
	}
}

export class UnsupportedSsoTypeError extends EduSignAPIError {
	constructor(message: string = "Unsupported SSO type") {
		super(message);
		this.name = "UnsupportedSsoTypeError";
	}
}

export class NewPasswordNeededError extends EduSignAPIError {
	constructor(
		message: string = "This account requires a password change. Please change your password directly from the Edusign application before authenticating.",
	) {
		super(message);
		this.name = "NewPasswordNeededError";
	}
}

export class StudentAccountSsoNotFoundError extends EduSignAPIError {
	constructor(message: string = "Student account SSO configuration not found") {
		super(message);
		this.name = "StudentAccountSsoNotFoundError";
	}
}
