import { input, select } from "@inquirer/prompts";
import chalk from "chalk";
import { chromium } from "playwright";
import {
	EDUSIGN_MICROSOFT_OAUTH_URL,
	EDUSIGN_MICROSOFT_SSO_CALLBACK_PREFIX_URL,
} from "../../src/constants";
import { loginWithMicrosoft, verifyPin } from "../../src/services/auth";
import { getProfile } from "../../src/services/profile";
import { getSchools } from "../../src/services/schools";

class PageClosedError extends Error {
	constructor(message?: string) {
		super(message);
		this.name = "PageClosedError";
	}
}

class NetworkNavigationError extends Error {
	constructor(public originalMessage: string) {
		super(`Network Navigation Error: ${originalMessage}`);
		this.name = "NetworkNavigationError";
	}
}

async function getOAuthCodeViaWebview(): Promise<string> {
	const browser = await chromium.launch({
		headless: false,
		args: ["--window-size=480,700"],
	});

	const context = await browser.newContext({
		viewport: { width: 480, height: 700 },
	});

	const page = await context.newPage();

	await context.route(
		`${EDUSIGN_MICROSOFT_SSO_CALLBACK_PREFIX_URL}*`,
		async (route) => {
			await route.fulfill({ status: 200, contentType: "text/html", body: "" });
		},
	);

	try {
		const safeGoto = async () => {
			try {
				await page.goto(EDUSIGN_MICROSOFT_OAUTH_URL);
			} catch (e) {
				if (page.isClosed()) throw new PageClosedError();
				console.warn(
					chalk.yellow(
						`\nWarning: Network issue detected during loading (${e instanceof Error ? e.message.split("\n")[0] : String(e)}).`,
					),
				);
			}
		};

		const [callbackRequest] = await Promise.all([
			page.waitForRequest(
				(req) =>
					req.url().startsWith(EDUSIGN_MICROSOFT_SSO_CALLBACK_PREFIX_URL),
				{ timeout: 0 },
			),
			safeGoto(),
		]);

		const callbackUrl = new URL(callbackRequest.url());
		const code = callbackUrl.searchParams.get("code");

		await browser.close();

		if (!code) {
			throw new Error("No 'code' parameter found in Microsoft callback URL.");
		}

		return code;
	} catch (error) {
		if (page.isClosed()) {
			throw new Error("PAGE_CLOSED");
		}
		await browser.close();
		throw error;
	}
}

export async function authenticateMicrosoft() {
	console.log(
		chalk.bold.cyan("\n--- Edusign Microsoft OAuth Authentication ---"),
	);

	try {
		console.log(chalk.blue("\nOpening Microsoft login window..."));
		const oauthCode = await getOAuthCodeViaWebview();

		console.log(chalk.blue("\nLogging in with OAuth code..."));
		const user = await loginWithMicrosoft(oauthCode);

		if (!user.HAS_MULTI_ACCOUNTS) {
			const profile = await getProfile(user.TOKEN || user.ACCESS_TOKEN);

			console.log(
				chalk.green(
					`\n✔ Login successful for ${profile.FIRSTNAME} ${profile.LASTNAME}!`,
				),
			);
			console.log(chalk.cyan("\n--- Profile Information ---"));
			console.log(chalk.white(`Email: ${chalk.gray(profile.EMAIL)}`));
			console.log(chalk.white(`Username: ${chalk.gray(profile.USERNAME)}`));
			console.log(chalk.white(`Language: ${chalk.gray(profile.LANGUAGE)}`));
			if (profile.PHOTO) {
				console.log(chalk.white(`Avatar: ${chalk.gray(profile.PHOTO)}`));
			}
			console.log(
				chalk.white(
					`School: ${chalk.gray(profile.SCHOOL?.NAME || "Not defined")}`,
				),
			);

			console.log(chalk.cyan("\n--- Tokens ---"));
			console.log(
				chalk.white(`Token : ${chalk.gray(user.TOKEN || user.ACCESS_TOKEN)}`),
			);
			if (user.REFRESH_TOKEN) {
				console.log(
					chalk.white(`Refresh Token : ${chalk.gray(user.REFRESH_TOKEN)}`),
				);
			}

			return user;
		}

		console.log(
			chalk.yellow(
				"\nA verification code has been sent to your email address.",
			),
		);

		const pin = await input({
			message: "Verification code:",
			required: true,
		});

		console.log(chalk.blue("\nVerifying code..."));
		const pinResult = await verifyPin(user.EMAIL, pin);

		console.log(chalk.blue("\nFetching schools..."));
		const schools = await getSchools(pinResult.v2Token);

		const selectedAccount =
			schools.length === 1
				? schools[0]
				: await select({
						message: chalk.cyan("Select the school you want to log in with:"),
						choices: schools.map((school) => ({
							name: `${school.SCHOOL.NAME} — ${chalk.dim(school.USERNAME)}`,
							value: school,
						})),
					});

		const profile = await getProfile(selectedAccount.TOKEN);

		console.log(
			chalk.green(
				`\n✔ Login successful for ${profile.FIRSTNAME} ${profile.LASTNAME}!`,
			),
		);
		console.log(chalk.cyan("\n--- Profile Information ---"));
		console.log(chalk.white(`Email: ${chalk.gray(profile.EMAIL)}`));
		console.log(chalk.white(`Username: ${chalk.gray(profile.USERNAME)}`));
		console.log(chalk.white(`Language: ${chalk.gray(profile.LANGUAGE)}`));
		if (profile.PHOTO) {
			console.log(chalk.white(`Avatar: ${chalk.gray(profile.PHOTO)}`));
		}
		console.log(
			chalk.white(
				`School: ${chalk.gray(profile.SCHOOL?.NAME || "Not defined")}`,
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
		if (err instanceof PageClosedError) {
			console.error(
				chalk.red(
					"\nError: Login window was closed before authentication finished.",
				),
			);
		} else if (err instanceof NetworkNavigationError) {
			console.error(
				chalk.red(`\nError: Failed to load SSO page (${err.originalMessage}).`),
			);
		} else {
			const errorMessage = err instanceof Error ? err.message : String(err);
			console.error(chalk.red("\nError during authentication:"), errorMessage);
		}
		process.exit(1);
	}
}

const isMain = process.argv[1]?.includes("microsoft-oauth.example");

if (isMain) {
	authenticateMicrosoft().catch(console.error);
}
