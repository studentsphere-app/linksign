import { select } from "@inquirer/prompts";
import chalk from "chalk";
import { authenticate as authCredentials } from "./credentials.example";
import { authenticateMicrosoft as authMicrosoft } from "./microsoft-oauth.example";
import { authenticateSso as authSSO } from "./sso.example";

async function main() {
	console.log(chalk.bold.magenta("\n--- Edusign Auth Examples ---"));

	const authType = await select({
		message: chalk.cyan("Which authentication method would you like to test?"),
		choices: [
			{
				name: "Credentials (Email & Password)",
				value: "credentials",
				description:
					"Test classic authentication (handles multi-accounts/OTP).",
			},
			{
				name: "SSO (Single Sign-On)",
				value: "sso",
				description: "Test SSO link retrieval.",
			},
			{
				name: "Microsoft OAuth",
				value: "microsoft",
				description: "Test Microsoft OAuth authentication.",
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
			console.log(chalk.red("Invalid choice."));
	}
}

main().catch(console.error);
