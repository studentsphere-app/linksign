import type { DateRange } from "@/models/common";

export function lastSevenDays(): DateRange {
	const end = new Date();
	const start = new Date();
	start.setDate(end.getDate() - 7);

	return {
		start: start.toISOString(),
		end: end.toISOString(),
	};
}

export function lastThirtyDays(): DateRange {
	const end = new Date();
	const start = new Date();
	start.setDate(end.getDate() - 30);

	return {
		start: start.toISOString(),
		end: end.toISOString(),
	};
}

export function lastThreeMonths(): DateRange {
	const end = new Date();
	const start = new Date();
	start.setMonth(end.getMonth() - 3);

	return {
		start: start.toISOString(),
		end: end.toISOString(),
	};
}

export function lastYear(): DateRange {
	const end = new Date();
	const start = new Date();
	start.setFullYear(end.getFullYear() - 1);

	return {
		start: start.toISOString(),
		end: end.toISOString(),
	};
}
