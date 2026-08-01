import { select } from "@inquirer/prompts";
import chalk from "chalk";
import { authenticate as authCredentials } from "./credentials.example";
import { authenticateMicrosoft as authMicrosoft } from "./microsoft-oauth.example";
import { authenticateSso as authSSO } from "./sso.example";

async function main() {
	console.log(chalk.bold.magenta("\n--- Edusign Auth Examples ---"));

	const authType = await select({
		message: chalk.cyan(
			"Quelle méthode d'authentification souhaitez-vous tester ?",
		),
		choices: [
			{
				name: "Identifiants (Email & Mot de passe)",
				value: "credentials",
				description:
					"Test de l'authentification classique (gère les comptes multiples/OTP).",
			},
			{
				name: "SSO (Single Sign-On)",
				value: "sso",
				description: "Test de la récupération du lien SSO.",
			},
			{
				name: "Microsoft OAuth",
				value: "microsoft",
				description: "Test de l'authentification via Microsoft OAuth.",
			},
		],
	});

	switch (authType) {
		case "credentials":
			await authCredentials();
			break;
		case "sso":
			await authSSO();
			break;
		case "microsoft":
			await authMicrosoft();
			break;
		default:
			console.log(chalk.red("Choix invalide."));
	}
}

main().catch(console.error);
