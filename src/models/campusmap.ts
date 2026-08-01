export interface CampusMapContact {
	id: string;
	name: string;
	email: string | null;
	phone: string | null;
	website: string | null;
	color: string | null;
	gradient: string | null;
	imageUrl: string | null;
}

export interface CampusMapParent {
	id: string;
	name: string;
	visibility: string;
}

export interface CampusMapLocation {
	id: string;
	order: number;
	name: string;
	description: string;
	latitude: number;
	longitude: number;
	schoolId: string;
	address: string;
	parent: CampusMapParent | null;
	imageCoverUrl?: string | null;
	contacts: CampusMapContact[];
	children?: CampusMapLocation[];
}
