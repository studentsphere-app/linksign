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
			`\nRécupération des statistiques d'assiduité du mois (${startOfMonth.split("T")[0]} au ${endOfMonth.split("T")[0]})...`,
		),
	);
	const stats = await getAttendanceStatistics(token, startOfMonth, endOfMonth);
	console.log(chalk.green("✔ Statistiques récupérées"));
	console.log(chalk.white(`Présences : ${stats.presences}`));
	console.log(chalk.white(`Absences : ${stats.absences}`));

	console.log(chalk.blue("\nRécupération des types d'absences..."));
	const types = await getSchoolAbsenceTypes(token);
	console.log(chalk.green(`✔ ${types.length} type(s) d'absences trouvé(s)`));
	for (const t of types) {
		console.log(chalk.white(`- ${t.NAME}`));
	}

	console.log(chalk.blue("\nRécupération des absences du mois..."));
	const absences = await getAbsences(token, startOfMonth, endOfMonth);
	console.log(chalk.green(`✔ ${absences.length} absence(s) trouvée(s)`));
}

const isMain = process.argv[1]?.includes("index.example");
if (isMain) {
	runAttendanceExample().catch(console.error);
}
