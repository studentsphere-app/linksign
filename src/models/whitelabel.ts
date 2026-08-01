export interface WhiteLabelApp {
	id: string;
	package: string;
	appName: string;
}

export interface WhiteLabelAppTheme {
	primaryColor?: string;
	secondaryColor?: string;
	tabBarColor?: string;
	tabBarIconColor?: string;
}

export interface WhiteLabelAppMenu {
	key: string;
	enabled: boolean;
	order: number;
	type?: string;
	icon?: string[] | null;
}

export interface WhiteLabelAppMenus {
	principal?: WhiteLabelAppMenu[];
	plus?: WhiteLabelAppMenu[];
}

export interface WhiteLabelAppSchool {
	schoolId: string;
	name: string;
	logoUrl?: string | null;
	theme?: WhiteLabelAppTheme;
	whiteLabelEnabled: boolean;
	menus?: WhiteLabelAppMenus;
	publicMenus?: WhiteLabelAppMenus;
}

export interface WhiteLabelAppConfiguration {
	packageId: string;
	name: string;
	logoUrl?: string | null;
	theme?: WhiteLabelAppTheme;
	whiteLabelEnabled: boolean;
	publicEnabled: boolean;
	schoolIds: WhiteLabelAppSchool[];
}
