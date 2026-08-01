import { EDUSIGN_API_BASE } from "@/constants";
import { handleResponse } from "@/core/handler";
import type { PaginatedData } from "@/models/common";
import type {
	ContactDirectoryEntry,
	ContactsDirectoryQuery,
} from "@/models/contactsdirectory";

export async function getPublicContactsDirectory(
	schoolId: string,
	query?: ContactsDirectoryQuery,
): Promise<PaginatedData<ContactDirectoryEntry>> {
	const url = new URL(`${EDUSIGN_API_BASE}/student/contacts-directory/public`);

	if (query?.name) {
		url.searchParams.set("name", query.name);
	}
	if (query?.page) {
		url.searchParams.set("page", query.page.toString());
	}

	const headers: Record<string, string> = {
		"x-edusign-school-id": schoolId,
	};

	const response = await fetch(url.toString(), {
		method: "GET",
		headers,
	});

	return handleResponse<PaginatedData<ContactDirectoryEntry>>(response);
}

export async function getPrivateContactsDirectory(
	schoolId: string,
	token: string,
	deviceId?: string,
	query?: ContactsDirectoryQuery,
): Promise<PaginatedData<ContactDirectoryEntry>> {
	const url = new URL(`${EDUSIGN_API_BASE}/student/contacts-directory/private`);

	if (query?.name) {
		url.searchParams.set("name", query.name);
	}
	if (query?.page) {
		url.searchParams.set("page", query.page.toString());
	}

	const headers: Record<string, string> = {
		"x-edusign-school-id": schoolId,
		Authorization: `Bearer ${token}`,
	};

	if (deviceId) {
		headers["x-device-id"] = deviceId;
	}

	const response = await fetch(url.toString(), {
		method: "GET",
		headers,
	});

	return handleResponse<PaginatedData<ContactDirectoryEntry>>(response);
}
