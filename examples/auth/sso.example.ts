import { input, select } from "@inquirer/prompts";
import chalk from "chalk";
import { chromium } from "playwright";
import {
	createSsoAuthURL,
	getSsoConfig,
	loginWithCasSso,
	loginWithMicrosoftSso,
	loginWithOauthSso,
	verifyPin,
} from "../../src/services/auth";
import { getProfile } from "../../src/services/profile";
import { getSchools } from "../../src/services/schools";
import { extractDomainFromEmail } from "../../src/utils";

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

export async function authenticateSso() {
	console.log(chalk.bold.cyan("\n--- Edusign SSO Authentication ---"));

	const identifier = await input({
		message: "Enter your institutional email or domain:",
		required: true,
	});

	const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
	const domain = isEmail ? extractDomainFromEmail(identifier) : identifier;

	if (!domain) {
		console.error(chalk.red("\nError: Failed to extract a valid domain."));
		process.exit(1);
	}

	console.log(
		chalk.blue(`\nChecking SSO configuration for domain: ${domain}...`),
	);

	const config = await getSsoConfig(domain).catch(() => {
		console.error(chalk.red(`\nError: No SSO configured for this domain`));
		process.exit(1);
	});

	console.log(chalk.green(`\n✔ SSO configuration found! Type: ${config.type}`));

	const authUrl = createSsoAuthURL(config);
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
					`\nWarning: Network issue detected during loading (${e instanceof Error ? e.message.split("\n")[0] : String(e)}).`,
				),
			);
		}
	};

	try {
		if (config.type === "cas") {
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
			const user = await loginWithCasSso(ticket, config.SCHOOL_ID);

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

		if (config.type === "oauth") {
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
			const user = await loginWithOauthSso(code, config.SCHOOL_ID);

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

		if (config.type === "microsoft") {
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
			const user = await loginWithMicrosoftSso(code);

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

		if (config.type === "saml") {
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
					`\nError: Failed to load SSO page (${err.originalMessage}). The domain seems invalid or inaccessible. This could be due to a problem with the establishment's SSO configuration.`,
				),
			);
		} else {
			const errorMessage = err instanceof Error ? err.message : String(err);
			console.error(chalk.red("\nError during authentication:"), errorMessage);
		}
		process.exit(1);
	}
}

const isMain = process.argv[1]?.includes("sso.example");

if (isMain) {
	authenticateSso().catch(console.error);
}
