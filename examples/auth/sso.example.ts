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
		chalk.yellow(
			"\nUn code de vérification a été envoyé à votre adresse email.",
		),
	);

	const pin = await input({
		message: "Code de vérification :",
		required: true,
	});

	console.log(chalk.blue("\nVérification du code..."));
	const pinResult = await verifyPin(email, pin);

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

	return selectedAccount;
}

async function printProfileAndTokens(token: string, refreshToken?: string) {
	console.log(chalk.blue("\nRécupération du profil final..."));
	const profile = await getProfile(token);

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
		chalk.white(`École : ${chalk.gray(profile.SCHOOL?.NAME || "Non définie")}`),
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
		message: "Entrez votre email institutionnel ou votre domaine :",
		required: true,
	});

	const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
	const domain = isEmail ? extractDomainFromEmail(identifier) : identifier;

	if (!domain) {
		console.error(
			chalk.red("\nErreur : Impossible d'extraire un domaine valide."),
		);
		process.exit(1);
	}

	console.log(
		chalk.blue(
			`\nVérification de la configuration SSO pour le domaine : ${domain}...`,
		),
	);

	const config = await getSsoConfig(domain).catch(() => {
		console.error(chalk.red(`\nErreur : Aucun SSO configuré pour ce domaine`));
		process.exit(1);
	});

	console.log(
		chalk.green(`\n✔ Configuration SSO trouvée ! Type : ${config.type}`),
	);

	const authUrl = createSsoAuthURL(config);
	console.log(chalk.blue("\nOuverture de la fenêtre de connexion SSO..."));

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
					`\nAttention : Problème réseau détecté lors du chargement (${e instanceof Error ? e.message.split("\n")[0] : String(e)}).`,
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

			if (!ticket) throw new Error("Aucun paramètre 'ticket' trouvé.");

			console.log(chalk.blue("\nConnexion CAS en cours..."));
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

			if (!code) throw new Error("Aucun paramètre 'code' trouvé.");

			console.log(chalk.blue("\nConnexion OAuth en cours..."));
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

			if (!code) throw new Error("Aucun paramètre 'code' trouvé.");

			console.log(chalk.blue("\nConnexion Microsoft SSO en cours..."));
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

			if (!hotlogin) throw new Error("Aucun paramètre 'hotlogin' trouvé.");

			if (multi === "true" && email) {
				const acc = await handleMultiAccount(email);
				await printProfileAndTokens(acc.TOKEN, acc.REFRESH_TOKEN);
				return acc;
			}

			console.log(
				chalk.yellow(
					"\nAttention : En authentification SAML avec un compte unique, aucun Refresh Token n'est fourni par Edusign.\n" +
						"Vous ne pourrez pas renouveler le token après son expiration (généralement 8h) et il faudra vous reconnecter.\n",
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
					"\nErreur : La fenêtre de connexion a été fermée avant la fin de l'authentification.",
				),
			);
		} else if (err instanceof NetworkNavigationError) {
			console.error(
				chalk.red(
					`\nErreur : Impossible de charger la page SSO (${err.originalMessage}). Le domaine semble invalide ou inaccessible. Ceci peu etre du à un probleme avec la configuration SSO de l'établissement.`,
				),
			);
		} else {
			const errorMessage = err instanceof Error ? err.message : String(err);
			console.error(
				chalk.red("\nErreur lors de l'authentification :"),
				errorMessage,
			);
		}
		process.exit(1);
	}
}

const isMain = process.argv[1]?.includes("sso.example");

if (isMain) {
	authenticateSso().catch(console.error);
}
