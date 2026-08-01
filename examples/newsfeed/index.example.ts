import chalk from "chalk";
import {
	getPrivateNewsFeedChannels,
	getPrivateNewsFeedPosts,
	getPublicNewsFeedChannels,
	getPublicNewsFeedPosts,
} from "../../src/services/newsfeed";
import { authenticate } from "../auth/credentials.example";

async function runNewsFeedExample() {
	console.log(chalk.bold.magenta("\n--- Edusign News Feed Example ---"));

	const user = await authenticate();
	const token = user.TOKEN;
	const schoolId = user.SCHOOL_ID;

	if (!schoolId) {
		console.error(chalk.red("Erreur: ID de l'école non trouvé."));
		return;
	}

	console.log(chalk.blue("\nRécupération des channels publics..."));
	const publicChannels = await getPublicNewsFeedChannels(schoolId);
	console.log(
		chalk.green(`✔ ${publicChannels.length} channel(s) public(s) trouvé(s)`),
	);
	for (const c of publicChannels) {
		console.log(chalk.white(`- ${c.title}`));
	}

	console.log(chalk.blue("\nRécupération des channels privés..."));
	const privateChannels = await getPrivateNewsFeedChannels(schoolId, token);
	console.log(
		chalk.green(`✔ ${privateChannels.length} channel(s) privé(s) trouvé(s)`),
	);
	for (const c of privateChannels) {
		console.log(chalk.white(`- ${c.title}`));
	}

	console.log(chalk.blue("\nRécupération des posts publics (limite 5)..."));
	const publicPosts = await getPublicNewsFeedPosts(schoolId, {
		limit: 5,
	});
	console.log(
		chalk.green(`✔ ${publicPosts.data.length} post(s) public(s) récupéré(s)`),
	);
	for (const p of publicPosts.data) {
		console.log(chalk.white(`- ${p.title}`));
	}

	console.log(chalk.blue("\nRécupération des posts privés (limite 5)..."));
	const privatePosts = await getPrivateNewsFeedPosts(schoolId, token, {
		limit: 5,
	});
	console.log(
		chalk.green(`✔ ${privatePosts.data.length} post(s) privé(s) récupéré(s)`),
	);
	for (const p of privatePosts.data) {
		console.log(chalk.white(`- ${p.title}`));
	}
}

const isMain = process.argv[1]?.includes("index.example");
if (isMain) {
	runNewsFeedExample().catch(console.error);
}
