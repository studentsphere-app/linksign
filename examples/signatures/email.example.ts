import { input } from "@inquirer/prompts";
import chalk from "chalk";
import { getProfile } from "../../src/services/profile";
import { signByEmail } from "../../src/services/signatures";
import { authenticate } from "../auth/credentials.example";
import { getSignatureWithFallback } from "./signature-pad";

export async function signWithEmail(
	passedToken?: string,
	studentId?: string,
	schoolId?: string,
) {
	console.log(
		chalk.bold.magenta("\n--- Edusign Signature by Email Example ---"),
	);

	let token = passedToken;
	let sId = studentId;
	let scId = schoolId;

	if (!token) {
		const user = await authenticate();
		token = user.TOKEN;
	}

	if (!sId || !scId) {
		const profile = await getProfile(token);
		sId = sId || profile.ID;
		scId = scId || profile.SCHOOL_ID;
	}

	const rawInput = await input({
		message: chalk.cyan(
			"Enter the Course ID or the full email verification link:",
		),
		required: true,
	});

	let courseId = rawInput.trim();
	let verificationToken = "";

	if (courseId.startsWith("http://") || courseId.startsWith("https://")) {
		try {
			const url = new URL(courseId);
			const tokenParam = url.searchParams.get("verificationToken");
			if (tokenParam) {
				verificationToken = tokenParam;
			}
			const segments = url.pathname.split("/").filter(Boolean);
			if (segments.length > 0) {
				courseId = segments[segments.length - 1];
			}
		} catch {
			throw new Error("Invalid URL");
		}
	}

	if (!verificationToken) {
		verificationToken = await input({
			message: chalk.cyan("Enter the verification token:"),
			required: true,
		});
		verificationToken = verificationToken.trim();
	}

	const signature = await getSignatureWithFallback(
		"Opening Chromium window to draw your signature...",
	);

	console.log(
		chalk.blue(
			`\nSubmitting signature for course "${courseId}" with verification token...`,
		),
	);

	try {
		const result = await signByEmail(token, courseId, verificationToken, {
			studentId: sId,
			schoolId: scId,
			base64Signature: signature,
		});

		console.log(chalk.green("\n✔ Attendance successfully signed by email!"));
		console.log(chalk.white(JSON.stringify(result, null, 2)));
		return result;
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		console.error(
			chalk.red("\n✖ Error signing attendance by email:"),
			errorMessage,
		);
	}
}

const isMain = process.argv[1]?.includes("email.example");
if (isMain) {
	signWithEmail().catch(console.error);
}
