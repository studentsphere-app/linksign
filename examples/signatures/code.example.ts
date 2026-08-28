import { input } from "@inquirer/prompts";
import chalk from "chalk";
import { getProfile } from "../../src/services/profile";
import { signByCode } from "../../src/services/signatures";
import { authenticate } from "../auth/credentials.example";
import { getSignatureWithFallback } from "./signature-pad";

export async function signWithCode(passedToken?: string, studentId?: string) {
	console.log(
		chalk.bold.magenta("\n--- Edusign Signature by Code / PIN Example ---"),
	);

	let token = passedToken;
	let sId = studentId;

	if (!token) {
		const user = await authenticate();
		token = user.TOKEN;
		if (!sId) {
			const profile = await getProfile(token);
			sId = profile.ID;
		}
	} else if (!sId) {
		const profile = await getProfile(token);
		sId = profile.ID;
	}

	const code = await input({
		message: chalk.cyan("Enter the session code / PIN:"),
		required: true,
	});

	const signature = await getSignatureWithFallback(
		"Opening Chromium window to draw your signature...",
	);

	console.log(chalk.blue(`\nSubmitting signature for code "${code}"...`));

	try {
		const result = await signByCode(token, code.trim(), {
			studentId: sId,
			base64Signature: signature,
		});

		console.log(chalk.green("\n✔ Attendance successfully signed by code!"));
		console.log(chalk.white(JSON.stringify(result, null, 2)));
		return result;
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		console.error(
			chalk.red("\n✖ Error signing attendance by code:"),
			errorMessage,
		);
	}
}

const isMain = process.argv[1]?.includes("code.example");
if (isMain) {
	signWithCode().catch(console.error);
}
