import chalk from "chalk";
import {
	getCoursesBetweenDates,
	getPlanning,
} from "../../src/services/planning";
import { authenticate } from "../auth/credentials.example";

async function runPlanningExample() {
	console.log(chalk.bold.magenta("\n--- Edusign Planning Example ---"));

	const user = await authenticate();
	const token = user.TOKEN;

	const now = new Date();
	const start = now.toISOString();
	const end = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();

	console.log(chalk.blue(`\nFetching planning for the next 7 days...`));
	const planning = await getPlanning(token, start, end);
	console.log(chalk.green(`✔ ${planning.length} event(s) in planning`));

	console.log(chalk.blue(`\nFetching courses...`));
	const courses = await getCoursesBetweenDates(token, start, end);
	console.log(chalk.green(`✔ ${courses.length} course(s) found`));

	for (const course of courses) {
		console.log(
			chalk.white(
				`- ${course.NAME} (On ${new Date(course.START).toLocaleString()})`,
			),
		);
	}
}

const isMain = process.argv[1]?.includes("index.example");
if (isMain) {
	runPlanningExample().catch(console.error);
}
