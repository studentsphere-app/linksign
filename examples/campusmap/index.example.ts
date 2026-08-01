import chalk from "chalk";
import {
	getPrivateCampusMapBySchool,
	getPublicCampusMapBySchool,
} from "../../src/services/campusmap";
import { authenticate } from "../auth/credentials.example";

async function runCampusMapExample() {
	console.log(chalk.bold.magenta("\n--- Edusign Campus Map Example ---"));

	const user = await authenticate();
	const token = user.TOKEN;
	const schoolId = user.SCHOOL_ID;

	if (!schoolId) {
		console.error(chalk.red("Erreur: ID de l'école non trouvé."));
		return;
	}

	console.log(chalk.blue(`\nRécupération de la carte publique du campus...`));
	const publicLocations = await getPublicCampusMapBySchool(schoolId);
	console.log(
		chalk.green(`✔ ${publicLocations.length} lieu(x) public(s) trouvé(s)`),
	);
	for (const loc of publicLocations) {
		console.log(chalk.white(`- ${loc.name}`));
	}

	console.log(chalk.blue(`\nRécupération de la carte privée du campus...`));
	const privateLocations = await getPrivateCampusMapBySchool(schoolId, token);
	console.log(
		chalk.green(`✔ ${privateLocations.length} lieu(x) privé(s) trouvé(s)`),
	);
	for (const loc of privateLocations) {
		console.log(chalk.white(`- ${loc.name}`));
	}
}

const isMain = process.argv[1]?.includes("index.example");
if (isMain) {
	runCampusMapExample().catch(console.error);
}
