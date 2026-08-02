import chalk from "chalk";
import {
	getAbsences,
	getAttendanceStatistics,
	getSchoolAbsenceTypes,
} from "../../src/services/attendance";
import { authenticate } from "../auth/credentials.example";

async function runAttendanceExample() {
	console.log(chalk.bold.magenta("\n--- Edusign Attendance Example ---"));

	const user = await authenticate();
	const token = user.TOKEN;

	const now = new Date();
	const startOfMonth = new Date(
		now.getFullYear(),
		now.getMonth(),
		1,
	).toISOString();
	const endOfMonth = new Date(
		now.getFullYear(),
		now.getMonth() + 1,
		0,
	).toISOString();

	console.log(
		chalk.blue(
			`\nFetching attendance statistics for the month (${startOfMonth.split("T")[0]} to ${endOfMonth.split("T")[0]})...`,
		),
	);
	const stats = await getAttendanceStatistics(token, startOfMonth, endOfMonth);
	console.log(chalk.green("✔ Statistics fetched"));
	console.log(chalk.white(`Presences: ${stats.presences}`));
	console.log(chalk.white(`Absences: ${stats.absences}`));

	console.log(chalk.blue("\nFetching absence types..."));
	const types = await getSchoolAbsenceTypes(token);
	console.log(chalk.green(`✔ ${types.length} absence type(s) found`));
	for (const t of types) {
		console.log(chalk.white(`- ${t.NAME}`));
	}

	console.log(chalk.blue("\nFetching absences for the month..."));
	const absences = await getAbsences(token, startOfMonth, endOfMonth);
	console.log(chalk.green(`✔ ${absences.length} absence(s) found`));
}

const isMain = process.argv[1]?.includes("index.example");
if (isMain) {
	runAttendanceExample().catch(console.error);
}
