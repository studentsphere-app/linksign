import { input, password, select } from "@inquirer/prompts";
import chalk from "chalk";
import { loginWithCredentials, verifyPin } from "../../src/services/auth";
import { getProfile } from "../../src/services/profile";
import { getSchools } from "../../src/services/schools";

export async function authenticate() {
	console.log(chalk.bold.cyan("\n--- Edusign Credentials Authentication ---"));

	const identifier = await input({
		message: "Email ou identifiant :",
		required: true,
	});

	const pwd = await password({
		message: "Mot de passe :",
		mask: "*",
	});

	console.log(chalk.blue("\nConnexion en cours..."));

	try {
		const user = await loginWithCredentials(identifier, pwd, "fr");

		if (user.NUMBER_OF_ACCOUNTS === 1) {
			const profile = await getProfile(user.TOKEN);

			console.log(
				chalk.green(
					`\n✔ Connexion réussie pour ${profile.FIRSTNAME} ${profile.LASTNAME} !`,
				),
			);
			console.log(chalk.cyan("\n--- Informations du Profil ---"));
			console.log(chalk.white(`Email : ${chalk.gray(profile.EMAIL)}`));
			console.log(chalk.white(`Username : ${chalk.gray(profile.USERNAME)}`));
			console.log(chalk.white(`Langue : ${chalk.gray(profile.LANGUAGE)}`));
			if (profile.PHOTO) {
				console.log(chalk.white(`Avatar : ${chalk.gray(profile.PHOTO)}`));
			}
			console.log(
				chalk.white(
					`École : ${chalk.gray(profile.SCHOOL?.NAME || "Non définie")}`,
				),
			);

			console.log(chalk.cyan("\n--- Tokens ---"));
			console.log(chalk.white(`Token : ${chalk.gray(user.TOKEN)}`));
			if (user.REFRESH_TOKEN) {
				console.log(
					chalk.white(`Refresh Token : ${chalk.gray(user.REFRESH_TOKEN)}`),
				);
			}

			return user;
		}

		console.log(
			chalk.yellow(
				"\nUn code de vérification a été envoyé à votre adresse email.",
			),
		);

		const pin = await input({
			message: "Code de vérification :",
			required: true,
		});

		console.log(chalk.blue("\nVérification du code..."));
		const pinResult = await verifyPin(identifier, pin);

		console.log(chalk.blue("\nRécupération des écoles..."));
		const schools = await getSchools(pinResult.v2Token);

		const selectedAccount =
			schools.length === 1
				? schools[0]
				: await select({
						message: chalk.cyan(
							"Sélectionnez l'école avec laquelle vous souhaitez vous connecter :",
						),
						choices: schools.map((school) => ({
							name: `${school.SCHOOL.NAME} — ${chalk.dim(school.USERNAME)}`,
							value: school,
						})),
					});

		const profile = await getProfile(selectedAccount.TOKEN);

		console.log(
			chalk.green(
				`\n✔ Connexion réussie pour ${profile.FIRSTNAME} ${profile.LASTNAME} !`,
			),
		);
		console.log(chalk.cyan("\n--- Informations du Profil ---"));
		console.log(chalk.white(`Email : ${chalk.gray(profile.EMAIL)}`));
		console.log(chalk.white(`Username : ${chalk.gray(profile.USERNAME)}`));
		console.log(chalk.white(`Langue : ${chalk.gray(profile.LANGUAGE)}`));
		if (profile.PHOTO) {
			console.log(chalk.white(`Avatar : ${chalk.gray(profile.PHOTO)}`));
		}
		console.log(
			chalk.white(
				`École : ${chalk.gray(profile.SCHOOL?.NAME || "Non définie")}`,
			),
		);

		console.log(chalk.cyan("\n--- Tokens ---"));
		console.log(chalk.white(`Token : ${chalk.gray(selectedAccount.TOKEN)}`));
		if (selectedAccount.REFRESH_TOKEN) {
			console.log(
				chalk.white(
					`Refresh Token : ${chalk.gray(selectedAccount.REFRESH_TOKEN)}`,
				),
			);
		}

		return selectedAccount;
	} catch (err) {
		const errorMessage = err instanceof Error ? err.message : String(err);
		console.error(chalk.red("\nErreur :"), errorMessage);
		process.exit(1);
	}
}

const isMain = process.argv[1]?.includes("credentials.example");

if (isMain) {
	authenticate().catch(console.error);
}
