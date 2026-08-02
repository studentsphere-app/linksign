import { input, password, select } from "@inquirer/prompts";
import chalk from "chalk";
import { chromium } from "playwright";
import { WHITE_LABEL_APPS } from "../../src/constants";
import {
	createWhiteLabelSsoAuthURL,
	getWhiteLabelSsoConfig,
	loginWhitelabelAppWithCredentials,
	loginWithCasSso,
	loginWithMicrosoftSso,
	loginWithOauthSso,
	verifyPin,
} from "../../src/services/auth";
import { getProfile } from "../../src/services/profile";
import { getSchools } from "../../src/services/schools";
import { getWhiteLabelSchools } from "../../src/services/whitelabel";

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

async function handleMultiAccount(email: string) {
	console.log(
		chalk.yellow("\nA verification code has been sent to your email address."),
	);

	const pin = await input({
		message: "Verification code:",
		required: true,
	});

	console.log(chalk.blue("\nVerifying code..."));
	const pinResult = await verifyPin(email, pin);

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

	return selectedAccount;
}

async function printProfileAndTokens(token: string, refreshToken?: string) {
	console.log(chalk.blue("\nFetching final profile..."));
	const profile = await getProfile(token);

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
		chalk.white(`School: ${chalk.gray(profile.SCHOOL?.NAME || "Not defined")}`),
	);

	console.log(chalk.cyan("\n--- Tokens ---"));
	console.log(chalk.white(`Token : ${chalk.gray(token)}`));
	if (refreshToken) {
		console.log(chalk.white(`Refresh Token : ${chalk.gray(refreshToken)}`));
	}

	return profile;
}

export async function authenticateWhitelabel() {
	console.log(chalk.bold.cyan("\n--- Edusign White-Label Authentication ---"));

	const selectedApp = await select({
		message: "Select the White Label application:",
		choices: WHITE_LABEL_APPS.map((app) => ({
			name: `${app.appName} (${app.package})`,
			value: app,
		})),
	});

	console.log(chalk.blue("\nFetching application schools..."));
	const schools = await getWhiteLabelSchools(selectedApp.package);

	if (schools.length === 0) {
		console.error(chalk.red("\nNo school found for this application."));
		process.exit(1);
	}

	const selectedSchool =
		schools.length === 1
			? schools[0]
			: await select({
					message: "Select the school:",
					choices: schools.map((s) => ({
						name: s.name,
						value: s,
					})),
				});

	console.log(
		chalk.blue(
			`\nChecking SSO configuration for school: ${selectedSchool.name}...`,
		),
	);

	let ssoConfig = null;
	try {
		ssoConfig = await getWhiteLabelSsoConfig(selectedSchool.schoolId);
	} catch (_e) {
		ssoConfig = null;
	}

	if (!ssoConfig) {
		console.log(
			chalk.yellow(
				"\nNo SSO configuration found, falling back to classic email/password login.",
			),
		);

		const identifier = await input({
			message: "Email or identifier:",
			required: true,
		});

		const pwd = await password({
			message: "Password:",
			mask: "*",
		});

		console.log(chalk.blue("\nLogging in..."));
		try {
			const user = await loginWhitelabelAppWithCredentials(
				identifier,
				pwd,
				selectedSchool.schoolId,
				"fr",
			);

			if (user.NUMBER_OF_ACCOUNTS === 1) {
				await printProfileAndTokens(user.TOKEN, user.REFRESH_TOKEN);
				return user;
			}

			const acc = await handleMultiAccount(identifier);
			await printProfileAndTokens(acc.TOKEN, acc.REFRESH_TOKEN);
			return acc;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : String(err);
			console.error(chalk.red("\nError:"), errorMessage);
			process.exit(1);
		}
	}

	console.log(
		chalk.green(`\n✔ SSO configuration found! Type: ${ssoConfig.type}`),
	);

	const authUrl = createWhiteLabelSsoAuthURL(ssoConfig);
	console.log(chalk.gray(`\nGenerated URL: ${authUrl}`));
	console.log(chalk.blue("\nOpening SSO login window..."));

	const browser = await chromium.launch({
		headless: false,
		args: ["--window-size=480,700"],
	});

	const context = await browser.newContext({
		viewport: { width: 480, height: 700 },
	});

	const page = await context.newPage();

	const safeGoto = async (url: string) => {
		try {
			await page.goto(url);
		} catch (e) {
			if (page.isClosed()) throw new PageClosedError();
			console.warn(
				chalk.yellow(
					`\nWarning: Network issue detected during loading (${
						e instanceof Error ? e.message.split("\n")[0] : String(e)
					}).`,
				),
			);
		}
	};

	try {
		if (ssoConfig.type === "cas") {
			await context.route("https://edusign.app/student*", async (route) => {
				await route.fulfill({
					status: 200,
					contentType: "text/html",
					body: "",
				});
			});

			const [req] = await Promise.all([
				page.waitForRequest(
					(req) => req.url().startsWith("https://edusign.app/student"),
					{ timeout: 0 },
				),
				safeGoto(authUrl),
			]);
			const url = new URL(req.url());
			const ticket = url.searchParams.get("ticket");

			await browser.close();

			if (!ticket) throw new Error("No 'ticket' parameter found.");

			console.log(chalk.blue("\nLogging in with CAS..."));
			const user = await loginWithCasSso(ticket, ssoConfig.SCHOOL_ID, true);

			if (user.HAS_MULTI_ACCOUNTS) {
				const acc = await handleMultiAccount(user.EMAIL);
				await printProfileAndTokens(acc.TOKEN, acc.REFRESH_TOKEN);
				return acc;
			}

			await printProfileAndTokens(
				user.TOKEN || user.ACCESS_TOKEN,
				user.REFRESH_TOKEN,
			);
			return user;
		}

		if (ssoConfig.type === "oauth") {
			await context.route("https://edusign.app/student*", async (route) => {
				await route.fulfill({
					status: 200,
					contentType: "text/html",
					body: "",
				});
			});

			const [req] = await Promise.all([
				page.waitForRequest(
					(req) => req.url().startsWith("https://edusign.app/student"),
					{ timeout: 0 },
				),
				safeGoto(authUrl),
			]);
			const url = new URL(req.url());
			const code = url.searchParams.get("code");

			await browser.close();

			if (!code) throw new Error("No 'code' parameter found.");

			console.log(chalk.blue("\nLogging in with OAuth..."));
			const user = await loginWithOauthSso(code, ssoConfig.SCHOOL_ID);

			if (user.HAS_MULTI_ACCOUNTS) {
				const acc = await handleMultiAccount(user.EMAIL);
				await printProfileAndTokens(acc.TOKEN, acc.REFRESH_TOKEN);
				return acc;
			}

			await printProfileAndTokens(
				user.TOKEN || user.ACCESS_TOKEN,
				user.REFRESH_TOKEN,
			);
			return user;
		}

		if (ssoConfig.type === "microsoft") {
			const msPrefix = "https://edusign.app/student/microsoft-v2-sso";
			await context.route(`${msPrefix}*`, async (route) => {
				await route.fulfill({
					status: 200,
					contentType: "text/html",
					body: "",
				});
			});

			const [req] = await Promise.all([
				page.waitForRequest((req) => req.url().startsWith(msPrefix), {
					timeout: 0,
				}),
				safeGoto(authUrl),
			]);
			const url = new URL(req.url());
			const code = url.searchParams.get("code");

			await browser.close();

			if (!code) throw new Error("No 'code' parameter found.");

			console.log(chalk.blue("\nLogging in with Microsoft SSO..."));
			const user = await loginWithMicrosoftSso(code, true);

			if (user.HAS_MULTI_ACCOUNTS) {
				const acc = await handleMultiAccount(user.EMAIL);
				await printProfileAndTokens(acc.TOKEN, acc.REFRESH_TOKEN);
				return acc;
			}

			await printProfileAndTokens(
				user.TOKEN || user.ACCESS_TOKEN,
				user.REFRESH_TOKEN,
			);
			return user;
		}

		if (ssoConfig.type === "saml") {
			await context.route("https://edusign.app/student*", async (route) => {
				await route.fulfill({
					status: 200,
					contentType: "text/html",
					body: "",
				});
			});

			const [req] = await Promise.all([
				page.waitForRequest(
					(req) => req.url().startsWith("https://edusign.app/student"),
					{ timeout: 0 },
				),
				safeGoto(authUrl),
			]);
			const url = new URL(req.url());
			const hotlogin = url.searchParams.get("hotlogin");
			const multi = url.searchParams.get("multiaccount");
			const email = url.searchParams.get("email");

			await browser.close();

			if (!hotlogin) throw new Error("No 'hotlogin' parameter found.");

			if (multi === "true" && email) {
				const acc = await handleMultiAccount(email);
				await printProfileAndTokens(acc.TOKEN, acc.REFRESH_TOKEN);
				return acc;
			}

			console.log(
				chalk.yellow(
					"\nWarning: In SAML authentication with a single account, no Refresh Token is provided by Edusign.\n" +
						"You will not be able to renew the token after it expires (usually 8h) and will need to log in again.\n",
				),
			);

			const profile = await printProfileAndTokens(hotlogin);
			return profile;
		}
	} catch (err) {
		const wasClosed = err instanceof PageClosedError || page.isClosed();

		if (browser.isConnected()) await browser.close();

		if (wasClosed) {
			console.error(
				chalk.red(
					"\nError: Login window was closed before authentication finished.",
				),
			);
		} else if (err instanceof NetworkNavigationError) {
			console.error(
				chalk.red(
					`\nError: Failed to load SSO page (${err.originalMessage}). The domain seems invalid or inaccessible.`,
				),
			);
		} else {
			const errorMessage = err instanceof Error ? err.message : String(err);
			console.error(chalk.red("\nError during authentication:"), errorMessage);
		}
		process.exit(1);
	}
}

const isMain = process.argv[1]?.includes("whitelabel.example");

if (isMain) {
	authenticateWhitelabel().catch(console.error);
}
