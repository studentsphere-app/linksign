export function formatDuration(minutes: number): string {
	if (minutes < 0) return "0h00";
	const h = Math.floor(minutes / 60);
	const m = minutes % 60;
	return `${h}h${m > 0 ? m.toString().padStart(2, "0") : "00"}`;
}

export function formatToLocaleDateTime(
	isoString: string,
	locale: string = "fr-FR",
): string {
	const date = new Date(isoString);
	return date
		.toLocaleString(locale, {
			day: "numeric",
			month: "long",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		})
		.replace(",", " à");
}

export function capitalize(str: string): string {
	if (!str) return "";
	return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
