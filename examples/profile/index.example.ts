import chalk from "chalk";
import {
	getNotificationsPreferences,
	getProfile,
} from "../../src/services/profile";
import { authenticate } from "../auth/credentials.example";

async function runProfileExample() {
	console.log(chalk.bold.magenta("\n--- Edusign Profile Example ---"));

	const user = await authenticate();
	const token = user.TOKEN;

	console.log(chalk.blue("\nRécupération du profil..."));
	const profile = await getProfile(token);
	console.log(chalk.green("✔ Profil récupéré"));
	console.log(chalk.white(`Nom : ${profile.FIRSTNAME} ${profile.LASTNAME}`));
	console.log(chalk.white(`Username : ${profile.USERNAME}`));
	console.log(chalk.white(`Email : ${profile.EMAIL}`));

	if (profile.SCHOOL) {
		console.log(chalk.blue("\nÉcole associée :"));
		console.log(chalk.white(`- ${profile.SCHOOL.NAME}`));
	}

	console.log(chalk.blue("\nRécupération des préférences de notifications..."));
	const prefs = await getNotificationsPreferences(token);
	console.log(chalk.green("✔ Préférences récupérées"));
	console.log(prefs);
}

const isMain = process.argv[1]?.includes("index.example");
if (isMain) {
	runProfileExample().catch(console.error);
}
