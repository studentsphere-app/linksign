export interface DocumentRecipient {
	id: string;
	category: string;
	firstname: string;
	lastname: string;
	email: string;
	name: string;
}

export interface SchoolDocument {
	ID: string;
	NAME: string;
	SCHOOL_ID: string;
	RECIPIENT_ID: string;
	RECIPIENT_TYPE: string;
	DIRECTORY_ID: string | null;
	CREATOR_ID: string;
	TEMPLATE_ID: string;
	DOCUMENT_URL: string;
	DOCUMENT_SENT: boolean;
	DATE_CREATED: string;
	RECIPIENTS: DocumentRecipient[];
	TO_DELETE: boolean;
	TRAINING_ID: string;
	TYPE: number;
}

export interface Documents<T = SchoolDocument> {
	toSign: T[];
	complete: T[];
}

export interface StudentAttachment {
	ID: string;
	NAME: string;
	URL: string;
	DATE_CREATED: string;
	SCHOOL_ID: string;
	STUDENT_ID: string;
	TYPE: string;
}
