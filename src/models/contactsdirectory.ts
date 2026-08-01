import type { PaginatedData } from "@/models/common";

export interface ContactDirectoryEntry {
	id: string;
	name: string;
	phone: string | null;
	email: string | null;
	website: string | null;
	location: string | null;
	color: string | null;
	gradient: string | null;
	imageUrl: string | null;
	mapLocations: unknown[];
}

export type ContactsDirectoryResponse = PaginatedData<ContactDirectoryEntry>;

export interface ContactsDirectoryQuery {
	name?: string;
	page?: string | number;
}
