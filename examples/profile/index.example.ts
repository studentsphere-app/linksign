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

	console.log(chalk.blue("\nFetching profile..."));
	const profile = await getProfile(token);
	console.log(chalk.green("✔ Profile fetched"));
	console.log(chalk.white(`Name: ${profile.FIRSTNAME} ${profile.LASTNAME}`));
	console.log(chalk.white(`Username: ${profile.USERNAME}`));
	console.log(chalk.white(`Email: ${profile.EMAIL}`));

	if (profile.SCHOOL) {
		console.log(chalk.blue("\nAssociated school:"));
		console.log(chalk.white(`- ${profile.SCHOOL.NAME}`));
	}

	console.log(chalk.blue("\nFetching notification preferences..."));
	const prefs = await getNotificationsPreferences(token);
	console.log(chalk.green("✔ Preferences fetched"));
	console.log(prefs);
}

const isMain = process.argv[1]?.includes("index.example");
if (isMain) {
	runProfileExample().catch(console.error);
}
