import { select } from "@inquirer/prompts";
import chalk from "chalk";
import { authenticate } from "../auth/credentials.example";
import { signWithCode } from "./code.example";
import { signWithEmail } from "./email.example";
import { signWithQRCode } from "./qrcode.example";

async function main() {
	console.log(
		chalk.bold.magenta("\n--- Edusign Signatures / Émargement Examples ---"),
	);

	const user = await authenticate();
	const token = user.TOKEN;

	const method = await select({
		message: chalk.cyan(
			"Which signature / émargement method would you like to test?",
		),
		choices: [
			{
				name: "1. Code / PIN",
				value: "code",
				description: "Sign attendance using a 6-digit session PIN/code.",
			},
			{
				name: "2. Email Link / Verification Token",
				value: "email",
				description:
					"Sign attendance using course ID and email verification token.",
			},
			{
				name: "3. QR Code (Chromium Scanner & Signature Pad)",
				value: "qrcode",
				description:
					"Open a Chromium window to scan QR code via camera/file and draw your signature.",
			},
		],
	});

	switch (method) {
		case "code":
			await signWithCode(token);
			break;
		case "email":
			await signWithEmail(token);
			break;
		case "qrcode":
			await signWithQRCode(token);
			break;
		default:
			console.log(chalk.red("Invalid choice."));
	}
}

const isMain = process.argv[1]?.includes("index.example");
if (isMain) {
	main().catch(console.error);
}
