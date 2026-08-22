"use client";

import {
	ArrowRight,
	ArrowUpRight,
	Calendar,
	Check,
	Copy,
	Globe,
	Layers,
	Lock,
	Sparkles,
	Terminal,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { GithubIcon } from "../../components/icons";

type Tab = "quickstart" | "auth" | "planning";

const schoolsList = [
	{ name: "3A", logo: "/schools/3a.png", url: "https://ecole3a.edu/" },
	{
		name: "American Business School Paris",
		logo: "/schools/abcp.png",
		url: "https://www.absparis.org/",
	},
	{
		name: "Business Science Institute",
		logo: "/schools/bsi.png",
		url: "https://www.business-science-institute.com/",
	},
	{
		name: "CNVA",
		logo: "/schools/cnva.png",
		url: "https://le-conservatoire.com/",
	},
	{ name: "ECM", logo: "/schools/ecm.png", url: "https://ecm-france.fr/" },
	{ name: "EMI", logo: "/schools/emi.png", url: "https://www.emi-ecoles.com/" },
	{ name: "EPSI", logo: "/schools/epsi.png", url: "https://www.epsi.fr/" },
	{ name: "ESA", logo: "/schools/esa.png", url: "https://www.esa-igensia.ma/" },
	{ name: "ESAIL", logo: "/schools/esail.png", url: "https://www.esail.fr/" },
	{
		name: "ESAM",
		logo: "/schools/esam.png",
		url: "https://www.esam-ecoles.com/",
	},
	{ name: "ICD", logo: "/schools/icd.png", url: "https://www.icd-ecoles.com/" },
	{ name: "ICL", logo: "/schools/icl.png", url: "https://www.icl.fr/" },
	{
		name: "IDRAC",
		logo: "/schools/idrac.png",
		url: "https://www.ecoles-idrac.com/",
	},
	{
		name: "IEFT",
		logo: "/schools/ieft.png",
		url: "https://www.ieftourisme.com/",
	},
	{ name: "IET", logo: "/schools/iet.png", url: "https://www.iet.fr/" },
	{ name: "IFAG", logo: "/schools/ifag.png", url: "https://www.ifag.com/" },
	{ name: "IGEFI", logo: "/schools/igefi.png", url: "https://www.igefi.fr/" },
	{
		name: "IGENSIA RH",
		logo: "/schools/igensiarh.png",
		url: "https://www.igensia-rh.fr/",
	},
	{
		name: "IHEDREA",
		logo: "/schools/ihedrea.png",
		url: "https://www.ihedrea.org/",
	},
	{ name: "ILERI", logo: "/schools/ileri.png", url: "https://www.ileri.fr/" },
	{ name: "IMIS", logo: "/schools/imis.png", url: "https://www.imislyon.com/" },
	{
		name: "IMSI",
		logo: "/schools/imsi.png",
		url: "https://www.imsi-ecoles.com/",
	},
	{ name: "IPI", logo: "/schools/ipi.png", url: "https://www.ipi-ecoles.com/" },
	{
		name: "ISCPA",
		logo: "/schools/iscpa.png",
		url: "https://www.iscpa-ecoles.com/",
	},
	{
		name: "ISMM",
		logo: "/schools/ismm.png",
		url: "https://www.formation-montessori.fr/",
	},
	{
		name: "SUP DE COM",
		logo: "/schools/supdecom.png",
		url: "https://www.ecoles-supdecom.com/",
	},
	{
		name: "VIVA MUNDI",
		logo: "/schools/vivamundi.png",
		url: "https://vivamundi.fr/",
	},
	{ name: "WIS", logo: "/schools/wis.png", url: "https://www.wis-ecoles.com/" },
];

export default function HomePage() {
	const [copiedInstall, setCopiedInstall] = useState(false);
	const [copiedCode, setCopiedCode] = useState(false);
	const [activeTab, setActiveTab] = useState<Tab>("quickstart");
	const [packageManager, setPackageManager] = useState<
		"pnpm" | "npm" | "yarn" | "bun"
	>("pnpm");

	const installCommands = {
		pnpm: "pnpm add @studentsphere/linksign",
		npm: "npm install @studentsphere/linksign",
		yarn: "yarn add @studentsphere/linksign",
		bun: "bun add @studentsphere/linksign",
	};

	const codeSnippets: Record<Tab, string> = {
		quickstart: `import { loginWithCredentials, getPlanning, getProfile } from 'linksign';
 
async function run() {
  // 1. Authenticate with Edusign CAS
  const user = await loginWithCredentials('epsi', 'jean.dupont', 'password');
  console.log(\`Hello, \${user.firstname}!\`);
 
  // 2. Fetch student profile details
  const profile = await getProfile('epsi', user.token);
  console.log(\`Campus: \${profile.city}\`);
 
  // 3. Retrieve student schedule
  const lessons = await getPlanning('epsi', user.token);
  console.log(\`Retrieved \${lessons.length} courses\`);
}
 
run();`,
		auth: `import { loginWithCredentials } from 'linksign';
 
// Authenticate and retrieve a Edusign session
const session = await loginWithCredentials(
  'idrac', // school id
  'jean.dupont', // student email
  'my_secure_password' // password
);
 
console.log('Session token:', session.token);`,
		planning: `import { getPlanning } from 'linksign';
 
// Retrieve timetable planning within a custom date range
const lessons = await getPlanning('epsi', session.token, {
  start: new Date('2026-09-01'),
  end: new Date('2026-09-30')
});
 
for (const lesson of lessons) {
  console.log(\`[\${lesson.start}] \${lesson.subject} by \${lesson.teacher}\`);
}`,
	};

	const terminalOutputs: Record<Tab, React.ReactNode> = {
		quickstart: (
			<div className="flex flex-col gap-1.5">
				<div className="text-zinc-500 font-medium select-none">
					$ npx tsx quickstart.ts
				</div>
				<div className="text-zinc-700 dark:text-zinc-300">
					Hello, Jean Dupont!
				</div>
				<div className="text-zinc-700 dark:text-zinc-300">Campus: Lille</div>
				<div className="text-zinc-700 dark:text-zinc-300">
					Retrieved 14 courses
				</div>
			</div>
		),
		auth: (
			<div className="flex flex-col gap-1.5">
				<div className="text-zinc-500 font-medium select-none">
					$ npx tsx authentication.ts
				</div>
				<div className="text-zinc-700 dark:text-zinc-300 break-all">
					Session token:{" "}
					<span className="text-amber-600 dark:text-amber-300">
						eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.W2siY2FzLXAiLCJq...
					</span>
				</div>
			</div>
		),
		planning: (
			<div className="flex flex-col gap-1.5">
				<div className="text-zinc-500 font-medium select-none">
					$ npx tsx planning.ts
				</div>
				<div className="text-zinc-700 dark:text-zinc-300">
					[2026-09-01T08:30:00Z] Algorithmique by Jean DUPONT
				</div>
				<div className="text-zinc-700 dark:text-zinc-300">
					[2026-09-01T10:30:00Z] Bases de données by Marie MARTIN
				</div>
				<div className="text-zinc-700 dark:text-zinc-300">
					[2026-09-02T13:30:00Z] Développement Web by Pierre LEROY
				</div>
			</div>
		),
	};

	const copyToClipboard = async (text: string, isInstall: boolean) => {
		try {
			await navigator.clipboard.writeText(text);
			if (isInstall) {
				setCopiedInstall(true);
				setTimeout(() => setCopiedInstall(false), 2000);
			} else {
				setCopiedCode(true);
				setTimeout(() => setCopiedCode(false), 2000);
			}
		} catch (err) {
			console.error("Failed to copy to clipboard", err);
		}
	};

	return (
		<div className="flex flex-col min-h-screen bg-fd-background text-fd-foreground  font-sans relative overflow-hidden transition-colors duration-200">
			{/* Grid Pattern Background */}
			<div
				className="absolute inset-0 pointer-events-none opacity-80"
				style={{
					backgroundImage:
						"linear-gradient(to right, var(--color-fd-border) 1px, transparent 1px), linear-gradient(to bottom, var(--color-fd-border) 1px, transparent 1px)",
					backgroundSize: "4rem 4rem",
					maskImage:
						"radial-gradient(ellipse 60% 50% at 50% 0%, #000 70%, transparent 100%)",
					WebkitMaskImage:
						"radial-gradient(ellipse 60% 50% at 50% 0%, #000 70%, transparent 100%)",
				}}
				id="grid-background"
			/>

			{/* Hero Section */}
			<div className="flex-1 flex flex-col justify-center items-center px-6 pt-24 pb-16 text-center relative z-10">
				<div className="max-w-(--fd-layout-width) w-full">
					{/* Logo SVG */}
					<div className="flex justify-center items-end gap-2 mb-6">
						<img
							src="/logos/linksign.svg"
							alt="linksign logo"
							className="h-20 dark:invert"
						/>
						<span className="text-fd-muted-foreground text-xs font-mono -ml-10">
							1.0.3
						</span>
					</div>

					{/* Maintained by Badge */}
					<div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-fd-border bg-fd-card/40 text-fd-muted-foreground text-[11px] mb-6 select-none">
						<span>Maintained by</span>
						<a
							href="https://github.com/studentsphere-app"
							target="_blank"
							rel="noopener noreferrer"
						>
							<img
								src="/logos/studentsphere.svg"
								alt="StudentSphere"
								className="h-4 dark:invert"
							/>
						</a>
					</div>

					{/* Heading */}
					<h1 className="text-4xl sm:text-5xl md:text-7xl font-medium tracking-tight text-fd-foreground mb-6 max-w-3xl mx-auto leading-[1.1]">
						A simple wrapper for{" "}
						<span className="text-fd-primary">Edusign</span>
					</h1>

					{/* Subtitle */}
					<p className="text-base sm:text-lg text-fd-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
						Interact programmatically with school portals in the{" "}
						<a
							href="https://www.competences-developpement.com"
							target="_blank"
							rel="noopener noreferrer"
							className="text-fd-foreground font-medium underline underline-offset-4 hover:text-fd-primary transition-colors"
						>
							Compétences & Développement (C&D)
						</a>{" "}
						and{" "}
						<a
							href="https://www.igensia.com"
							target="_blank"
							rel="noopener noreferrer"
							className="text-fd-foreground font-medium underline underline-offset-4 hover:text-fd-primary transition-colors"
						>
							IGENSIA Education
						</a>{" "}
						groups.
					</p>

					{/* CTA Buttons */}
					<div className="flex flex-wrap justify-center gap-3.5 mb-12">
						<Link
							href="/docs"
							className="flex items-center gap-2 px-5 py-2.5 bg-fd-primary hover:bg-fd-primary/95 text-fd-primary-foreground font-medium rounded-lg transition-colors text-sm shadow-sm"
						>
							Get Started <ArrowRight className="w-4 h-4" />
						</Link>
						<a
							href="https://github.com/studentsphere-app/linksign"
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-2 px-5 py-2.5 border border-fd-border bg-fd-card hover:bg-fd-accent text-fd-foreground font-medium rounded-lg transition-colors text-sm"
						>
							<GithubIcon className="w-4 h-4" />
							<span>GitHub Repository</span>
							<ArrowUpRight className="w-4 h-4 text-fd-muted-foreground" />
						</a>
					</div>

					{/* Terminal Code block */}
					<div className="max-w-md mx-auto mb-16 p-3.5 border border-fd-border bg-fd-card/75 rounded-xl backdrop-blur-md shadow-2xl flex items-center justify-between text-left font-mono text-sm text-fd-foreground">
						<div className="flex items-center gap-2.5 ">
							<span className="text-fd-muted-foreground font-medium select-none">
								$
							</span>
							<span className="text-xs">{installCommands[packageManager]}</span>
						</div>

						<div className="flex items-center gap-2">
							<select
								value={packageManager}
								onChange={(e) => setPackageManager(e.target.value as any)}
								className="bg-fd-background/50 border border-fd-border rounded-md px-2 py-1 text-xs text-fd-muted-foreground hover:text-fd-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-fd-primary font-mono mr-1"
							>
								<option value="pnpm">pnpm</option>
								<option value="npm">npm</option>
								<option value="bun">bun</option>
								<option value="yarn">yarn</option>
							</select>

							<button
								onClick={() =>
									copyToClipboard(installCommands[packageManager], true)
								}
								className="flex items-center gap-1.5 text-xs text-fd-muted-foreground hover:text-fd-foreground transition-colors border border-fd-border rounded-md px-2.5 py-1 bg-fd-background/40 cursor-pointer"
							>
								{copiedInstall ? (
									<>
										<Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
										<span className="text-emerald-600 dark:text-emerald-400 font-medium">
											Copied
										</span>
									</>
								) : (
									<>
										<Copy className="w-3.5 h-3.5 text-fd-muted-foreground" />
										<span>Copy</span>
									</>
								)}
							</button>
						</div>
					</div>
				</div>

				{/* IDE Showcase Container */}
				<div className="max-w-(--fd-layout-width) w-full mx-auto mb-20 relative z-10">
					<div className="w-full text-left border border-fd-border bg-fd-card/30 backdrop-blur-sm rounded-xl overflow-hidden shadow-2xl transition-colors duration-200">
						{/* IDE Titlebar */}
						<div className="flex items-center justify-between px-4 py-3 bg-fd-card/50 border-b border-fd-border ">
							<div className="flex items-center gap-2">
								<div className="w-2.5 h-2.5 rounded-full bg-fd-border" />
								<div className="w-2.5 h-2.5 rounded-full bg-fd-border" />
								<div className="w-2.5 h-2.5 rounded-full bg-fd-border" />
								<span className="text-xs text-fd-muted-foreground font-mono ml-2">
									Exemples
								</span>
							</div>
							<button
								onClick={() => copyToClipboard(codeSnippets[activeTab], false)}
								className="flex items-center gap-1.5 text-xs text-fd-muted-foreground hover:text-fd-foreground transition-colors border border-fd-border rounded px-2 py-0.5 bg-fd-background/30 cursor-pointer"
							>
								{copiedCode ? (
									<>
										<Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
										<span className="text-emerald-600 dark:text-emerald-400 font-medium">
											Copied snippet
										</span>
									</>
								) : (
									<>
										<Copy className="w-3 h-3 text-fd-muted-foreground" />
										<span>Copy code</span>
									</>
								)}
							</button>
						</div>

						{/* IDE Tabs */}
						<div className="flex bg-fd-card/25 border-b border-fd-border text-xs font-mono overflow-x-auto">
							{(["quickstart", "auth", "planning"] as Tab[]).map((tab) => (
								<button
									key={tab}
									onClick={() => setActiveTab(tab)}
									className={`px-4 py-2.5 border-r border-fd-border transition-colors flex items-center gap-2 cursor-pointer ${
										activeTab === tab
											? "bg-fd-background text-fd-foreground border-b border-b-fd-primary"
											: "text-fd-muted-foreground hover:text-fd-foreground hover:bg-fd-card/20"
									}`}
								>
									<span className="text-[10px] text-fd-muted-foreground">
										TS
									</span>
									{tab === "quickstart" && "quickstart.ts"}
									{tab === "auth" && "authentication.ts"}
									{tab === "planning" && "planning.ts"}
								</button>
							))}
						</div>

						{/* IDE Code Content */}
						<div className="p-5 font-mono text-[13px] md:text-sm text-fd-foreground bg-fd-card/40 overflow-x-auto leading-relaxed max-h-[380px] transition-colors duration-200">
							<pre>
								{codeSnippets[activeTab].split("\n").map((line, i) => {
									const tokenize = (lineText: string) => {
										const regex =
											/(\/\/.*)|('(?:\\.|[^'])*'|"(?:\\.|[^"])*"|`(?:\\.|[^`])*`)|([a-zA-Z_$][a-zA-Z0-9_$]*)|(\s+)|([^\s\w])/g;
										let match;
										const elements = [];
										let key = 0;

										// Handle empty line
										if (lineText.length === 0) {
											return <span> </span>;
										}

										while ((match = regex.exec(lineText)) !== null) {
											const [full, comment, str, word, space, symbol] = match;
											if (comment) {
												elements.push(
													<span
														key={key++}
														className="text-fd-muted-foreground italic"
													>
														{comment}
													</span>,
												);
											} else if (str) {
												elements.push(
													<span
														key={key++}
														className="text-emerald-600 dark:text-emerald-400"
													>
														{str}
													</span>,
												);
											} else if (word) {
												if (
													/^(const|let|var|import|from|await|async|function|for|of|return|export|type|interface|as|async|run|await)$/.test(
														word,
													)
												) {
													elements.push(
														<span key={key++} className="text-fd-primary">
															{word}
														</span>,
													);
												} else if (
													/^(loginWithCredentials|getPlanning|getProfile|log)$/.test(
														word,
													)
												) {
													elements.push(
														<span
															key={key++}
															className="text-amber-600 dark:text-amber-300"
														>
															{word}
														</span>,
													);
												} else {
													elements.push(
														<span key={key++} className="text-fd-foreground">
															{word}
														</span>,
													);
												}
											} else if (space) {
												elements.push(<span key={key++}>{space}</span>);
											} else if (symbol) {
												elements.push(
													<span
														key={key++}
														className="text-fd-muted-foreground"
													>
														{symbol}
													</span>,
												);
											}
										}
										return elements;
									};

									return (
										<div
											key={i}
											className="flex hover:bg-fd-accent/30 px-1 rounded -mx-1"
										>
											<span className="text-fd-muted-foreground text-right  w-6 pr-3 border-r border-fd-border/50 mr-3 select-none">
												{i + 1}
											</span>
											<code>{tokenize(line)}</code>
										</div>
									);
								})}
							</pre>
						</div>

						{/* IDE Terminal Output */}
						<div className="flex items-center gap-2 px-4 py-2.5 bg-fd-card/50 border-t border-fd-border select-none text-[11px] font-mono text-fd-muted-foreground">
							<Terminal className="w-3.5 h-3.5" />
							<span>Terminal Output</span>
						</div>
						<div className="p-5 font-mono text-[12px] bg-zinc-950/5 dark:bg-black/40 text-zinc-800 dark:text-zinc-300 border-t border-fd-border overflow-x-auto min-h-[110px] leading-relaxed transition-colors duration-200">
							{terminalOutputs[activeTab]}
						</div>
					</div>
				</div>

				{/* Features Checklist Grid */}
				<div className="max-w-(--fd-layout-width) w-full mx-auto mt-8 relative z-10">
					<div className="text-center mb-12">
						<h2 className="text-2xl md:text-3xl font-medium tracking-tight text-fd-foreground">
							Built with modern, lightweight design principles
						</h2>
						<p className="text-fd-muted-foreground text-sm mt-2 max-w-lg mx-auto">
							A zero-dependency library designed to integrate with school
							portals from the Compétences & Développement and IGENSIA Education
							groups.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 text-left border border-fd-border bg-fd-card/25 p-8 md:p-12 rounded-2xl transition-colors duration-200">
						<div className="flex gap-4">
							<div className="w-8 h-8 rounded-lg bg-fd-card border border-fd-border flex items-center justify-center shrink-0">
								<Lock className="w-4 h-4 text-fd-primary" />
							</div>
							<div>
								<h3 className="font-semibold text-fd-foreground text-sm">
									CAS Authentication Automation
								</h3>
								<p className="text-fd-muted-foreground text-xs mt-1.5 leading-relaxed">
									Handles programmatic authentication flows, parses redirect
									sequences, and retrieves session tokens to access school
									portal services.
								</p>
							</div>
						</div>

						<div className="flex gap-4">
							<div className="w-8 h-8 rounded-lg bg-fd-card border border-fd-border flex items-center justify-center shrink-0">
								<Layers className="w-4 h-4 text-fd-primary" />
							</div>
							<div>
								<h3 className="font-semibold text-fd-foreground text-sm">
									Zero Runtime Dependencies
								</h3>
								<p className="text-fd-muted-foreground text-xs mt-1.5 leading-relaxed">
									No third-party packages or native Node-only packages required.
									It is built strictly on standard Web APIs (like native fetch)
									to guarantee it imports, initializes, and runs instantly in
									any JavaScript or TypeScript project environment.
								</p>
							</div>
						</div>

						<div className="flex gap-4">
							<div className="w-8 h-8 rounded-lg bg-fd-card border border-fd-border flex items-center justify-center shrink-0">
								<Calendar className="w-4 h-4 text-fd-primary" />
							</div>
							<div>
								<h3 className="font-semibold text-fd-foreground text-sm">
									Timetable & Schedule Parser
								</h3>
								<p className="text-fd-muted-foreground text-xs mt-1.5 leading-relaxed">
									Queries academic planning and schedule APIs with dynamic
									custom date ranges. It parses and resolves the timetable
									endpoints into fully typed TypeScript lists of course modules,
									teacher names, and classroom locations.
								</p>
							</div>
						</div>

						<div className="flex gap-4">
							<div className="w-8 h-8 rounded-lg bg-fd-card border border-fd-border flex items-center justify-center shrink-0">
								<Globe className="w-4 h-4 text-fd-primary" />
							</div>
							<div>
								<h3 className="font-semibold text-fd-foreground text-sm">
									C&D and Igensia Compatibility
								</h3>
								<p className="text-fd-muted-foreground text-xs mt-1.5 leading-relaxed">
									Designed exclusively to route logins and payloads for all 28
									compatible schools: 3A, American Business School Paris,
									Business Science Institute, CNVA, ECM, EMI, EPSI, ESA, ESAIL,
									ESAM, ICD, ICL, IDRAC, IEFT, IET, IFAG, IGEFI, IGENSIA RH,
									IHEDREA, ILERI, IMIS, IMSI, IPI, ISCPA, ISMM, SUP DE COM, VIVA
									MUNDI, and WIS.
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Supported Schools Grid */}
				<div className="max-w-(--fd-layout-width) w-full mx-auto mt-20 text-center relative z-10">
					<div className="text-center mb-12">
						<h2 className="text-2xl md:text-3xl font-medium tracking-tight text-fd-foreground">
							Compatible with 20+ school
						</h2>
						<p className="text-fd-muted-foreground text-sm mt-2 max-w-lg mx-auto">
							Easily route authentication and planning requests across C&D and
							Igensia educational groups.
						</p>
					</div>

					{/* Group Logos */}
					<div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 mb-12">
						<a
							href="https://www.competences-developpement.com"
							target="_blank"
							rel="noopener noreferrer"
							className="hover:opacity-80 transition-opacity"
						>
							<img
								src="/logos/cd.svg"
								alt="Compétences & Développement"
								className="h-10 md:h-12 w-auto object-contain dark:invert"
							/>
						</a>
						<a
							href="https://www.igensia.com"
							target="_blank"
							rel="noopener noreferrer"
							className="hover:opacity-80 transition-opacity"
						>
							<img
								src="/logos/igensia.svg"
								alt="IGENSIA Education"
								className="h-10 md:h-12 w-auto object-contain dark:invert"
							/>
						</a>
					</div>

					<div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-x-6 gap-y-10 mt-8">
						{schoolsList.map((school) => (
							<a
								key={school.name}
								href={school.url}
								target="_blank"
								rel="noopener noreferrer"
								className="flex flex-col items-center text-center group hover:scale-105 transition-transform duration-200"
							>
								<div className="h-16 w-full flex items-center justify-center mb-2">
									<img
										src={school.logo}
										alt={school.name}
										className="h-12 max-w-full object-contain transition-opacity duration-200"
									/>
								</div>
								<span className="text-[10px] font-semibold text-fd-muted-foreground group-hover:text-fd-foreground transition-colors duration-200 select-none">
									{school.name}
								</span>
							</a>
						))}
					</div>
				</div>
			</div>

			{/* Footer */}
			<footer className="pt-10 pb-8 border-t border-fd-border bg-fd-background/50 relative z-10 text-[11px] text-fd-muted-foreground/80 leading-relaxed">
				{/* Legal Disclaimer */}
				<div className="max-w-(--fd-layout-width) mx-auto px-4 space-y-3.5 mb-8 text-fd-muted-foreground/80">
					<p>
						This project,{" "}
						<code className="px-1.5 py-0.5 rounded bg-fd-muted text-fd-foreground font-mono text-[10px] border border-fd-border/50">
							@studentsphere/linksign
						</code>
						, is an independent open-source tool. It is not affiliated with,
						authorized, maintained, sponsored, or endorsed by the Compétences &
						Développement (C&D) group, IGENSIA Education, or the developers of
						the EdusignServices platform. All trademarks, logos, and brand names
						are the property of their respective owners. Their mention here is
						strictly for identification purposes and does not imply any
						association.
					</p>
					<p>
						This tool is provided strictly to facilitate interoperability. The
						authors decline any liability for misuse, illegal activities, or
						malicious acts committed by users. You are solely responsible for
						ensuring your use of this tool complies with applicable laws and
						terms of service. The software is provided &quot;as is&quot;,
						without warranty of any kind. The developer assumes no liability for
						account suspensions, access blocks, or any legal actions taken by
						the aforementioned groups resulting from the use of this tool.
					</p>
					<p>
						This project is meant to help users interact with their own data
						while respecting French software laws (
						<a
							href="https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006278918"
							target="_blank"
							rel="noopener noreferrer"
							className="underline hover:text-fd-foreground transition-colors font-medium"
						>
							Article L.122-6-1 of the French Intellectual Property Code
						</a>
						). It only does what’s needed to make the software work together
						with other tools, without copying, sharing, or changing the original
						software. This analysis is limited to what’s needed for
						interoperability and isn’t used for anything else.
					</p>
					<p>
						For any legal questions or concerns regarding this project, contact:{" "}
						<a
							href="mailto:contact@studentsphere.app"
							className="underline hover:text-fd-foreground transition-colors font-medium"
						>
							contact@studentsphere.app
						</a>
						.
					</p>
				</div>

				{/* Divider */}
				<div className="border-t border-fd-border max-w-6xl mx-auto my-6 opacity-60" />

				{/* Original Footer Links & Copyright */}
				<div className="max-w-(--fd-layout-width) mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-fd-muted-foreground">
					<div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
						<p>© {new Date().getFullYear()} StudentSphere</p>
						<span className="hidden sm:inline text-fd-border">|</span>
						<div className="flex items-center gap-1.5">
							<span>Maintained by</span>
							<a
								href="https://github.com/studentsphere-app"
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-1.5 hover:text-fd-foreground transition-colors font-medium text-fd-foreground"
							>
								<img
									src="/logos/studentsphere.svg"
									alt="StudentSphere"
									className="h-4.5 dark:invert"
								/>
							</a>
						</div>
					</div>
					<div className="flex gap-4">
						<Link
							href="/docs"
							className="hover:text-fd-foreground transition-colors"
						>
							Documentation
						</Link>
						<a
							href="https://github.com/studentsphere-app/linksign"
							target="_blank"
							rel="noopener noreferrer"
							className="hover:text-fd-foreground transition-colors"
						>
							GitHub
						</a>
					</div>
				</div>
			</footer>
		</div>
	);
}
