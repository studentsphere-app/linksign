import type { CourseEntry } from "../models/planning";

export function getTodayCourses(courses: CourseEntry[]): CourseEntry[] {
	const today = new Date().toDateString();
	return courses.filter(
		(course) => new Date(course.START).toDateString() === today,
	);
}

export function isCourseActive(
	courseStart: string,
	courseEnd: string,
): boolean {
	const now = Date.now();
	return (
		new Date(courseStart).getTime() <= now &&
		new Date(courseEnd).getTime() >= now
	);
}

export function sortCoursesByDate(
	courses: CourseEntry[],
	order: "asc" | "desc" = "asc",
): CourseEntry[] {
	return [...courses].sort((a, b) => {
		const timeA = new Date(a.START).getTime();
		const timeB = new Date(b.START).getTime();
		return order === "asc" ? timeA - timeB : timeB - timeA;
	});
}

export function splitCoursesByPastAndUpcoming(courses: CourseEntry[]): {
	past: CourseEntry[];
	upcoming: CourseEntry[];
} {
	const now = Date.now();
	const past: CourseEntry[] = [];
	const upcoming: CourseEntry[] = [];

	for (const course of courses) {
		if (new Date(course.END).getTime() < now) {
			past.push(course);
		} else {
			upcoming.push(course);
		}
	}

	return { past, upcoming };
}
