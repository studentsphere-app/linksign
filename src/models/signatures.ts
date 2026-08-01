export interface SignByQRCodeRequest {
	signature: string;
	courseId: string;
	UUID: string;
	Model: string;
}

export interface SignByEmailRequest {
	studentId: string;
	schoolId: string;
	base64Signature: string;
}

export interface SignByCodeRequest {
	studentId: string;
	base64Signature: string;
}
