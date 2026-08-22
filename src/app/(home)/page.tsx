"use client";

import {
	ArrowRight,
	ArrowUpRight,
	BookOpen,
	Briefcase,
	Calendar,
	Check,
	ClipboardCheck,
	Copy,
	FileText,
	Layers,
	Library,
	Lock,
	MapIcon,
	Newspaper,
	PenTool,
	PieChart,
	School,
	Tag,
	Terminal,
	User,
	Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { GithubIcon } from "../../components/icons";

type Tab = "quickstart" | "auth" | "planning" | "attendance" | "documents";

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
		quickstart: `import { loginWithCredentials, getProfile, getPlanning } from 'linksign';
 
async function run() {
  // 1. Authenticate with Edusign
  const session = await loginWithCredentials('exemple@exemple.com', 'password');
 
  // 2. Fetch student profile details
  const profile = await getProfile(session.TOKEN);
  console.log(\`Hello, \${profile.FIRSTNAME} \${profile.LASTNAME}!\`);
  console.log(\`School: \${profile.SCHOOL?.NAME}\`);
 
  // 3. Retrieve student schedule
  const lessons = await getPlanning(
    session.TOKEN,
    new Date('2026-09-01').toISOString(),
    new Date('2026-09-30').toISOString()
  );
  console.log(\`Retrieved \${lessons.length} courses\`);
}
 
run();`,
		auth: `import { loginWithCredentials, verifyPin, getSchools } from 'linksign';
import * as readline from 'node:readline/promises';
 
async function runAuth() {
  // 1. Initial login (supports multi-accounts)
  const session = await loginWithCredentials('aconique@gmail.com', 'password');
 
  if (session.NUMBER_OF_ACCOUNTS > 1) {
    console.log('Verification code sent to email!');
    
    // 2. Prompt for PIN via terminal
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const pin = await rl.question('Enter PIN: ');
    rl.close();
 
    // 3. Verify with email OTP code
    const verified = await verifyPin('aconique@gmail.com', pin);
 
    // 3. Get available schools and select one
    const schools = await getSchools(verified.v2Token);
    console.log(\`Available schools: \${schools.map(s => s.SCHOOL.NAME).join(', ')}\`);
 
    // The selected school object contains the final tokens
    console.log('Token:', schools[0].TOKEN);
    console.log('Refresh Token:', schools[0].REFRESH_TOKEN);
  } else {
    console.log('Token:', session.TOKEN);
    console.log('Refresh Token:', session.REFRESH_TOKEN);
  }
}
 
runAuth();`,
		planning: `import { getPlanning, getCoursesBetweenDates } from 'linksign';
 
async function runPlanning(token: string) {
  const start = new Date('2026-09-01').toISOString();
  const end = new Date('2026-09-07').toISOString();
 
  // 1. Fetch raw planning events
  const events = await getPlanning(token, start, end);
  console.log(\`Found \${events.length} events in planning\`);
 
  // 2. Fetch detailed courses
  const courses = await getCoursesBetweenDates(token, start, end);
 
  for (const course of courses) {
    const date = new Date(course.START).toLocaleString();
    console.log(\`[\${date}] \${course.NAME}\`);
  }
}
 
runPlanning('your_token_here');`,
		attendance: `import { getAttendanceStatistics, getAbsences } from 'linksign';
 
async function runAttendance(token: string) {
  const start = new Date('2026-09-01').toISOString();
  const end = new Date('2026-09-30').toISOString();
 
  // 1. Get presence/absence counts
  const stats = await getAttendanceStatistics(token, start, end);
  console.log(\`Presences: \${stats.presences}\`);
  console.log(\`Absences: \${stats.absences}\`);
 
  // 2. Get detailed absences list
  const absences = await getAbsences(token, start, end);
  console.log(\`Found \${absences.length} absence(s)\`);
}
 
runAttendance('your_token_here');`,
		documents: `import { getDocuments, getStudentAttachments } from 'linksign';
 
async function runDocuments(token: string) {
  // 1. Get documents to sign and completed documents
  const documents = await getDocuments(token);
  console.log(\`\${documents.toSign.length} document(s) to sign\`);
  console.log(\`\${documents.complete.length} completed document(s)\`);
 
  for (const doc of documents.toSign) {
    console.log(\`- Action required: \${doc.NAME}\`);
  }
 
  // 2. Get student attachments
  const attachments = await getStudentAttachments(token);
  console.log(\`Found \${attachments.length} student attachment(s)\`);
}
 
runDocuments('your_token_here');`,
	};

	const terminalOutputs: Record<Tab, React.ReactNode> = {
		quickstart: (
			<div className="flex flex-col gap-1.5">
				<div className="text-zinc-500 font-medium select-none">
					$ npx tsx quickstart.ts
				</div>
				<div className="text-zinc-700 dark:text-zinc-300">
					Hello, Jules Martin!
				</div>
				<div className="text-zinc-700 dark:text-zinc-300">School: Exemple</div>
				<div className="text-zinc-700 dark:text-zinc-300">
					Retrieved 10 courses
				</div>
			</div>
		),
		auth: (
			<div className="flex flex-col gap-1.5">
				<div className="text-zinc-500 font-medium select-none">
					$ npx tsx authentication.ts
				</div>
				<div className="text-zinc-700 dark:text-zinc-300">
					Verification code sent to email!
				</div>
				<div className="text-zinc-700 dark:text-zinc-300">
					Enter PIN:{" "}
					<span className="text-zinc-400 dark:text-zinc-500">894321</span>
				</div>
				<div className="text-zinc-700 dark:text-zinc-300">
					Available schools: Exemple, EPSI Paris, WIS Paris
				</div>
				<div className="text-zinc-700 dark:text-zinc-300 break-all">
					Token:{" "}
					<span className="text-amber-600 dark:text-amber-300">
						eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
					</span>
				</div>
				<div className="text-zinc-700 dark:text-zinc-300 break-all">
					Refresh Token:{" "}
					<span className="text-amber-600 dark:text-amber-300">
						def50200543f8e53a510c592237e...
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
					Found 6 events in planning
				</div>
				<div className="text-zinc-700 dark:text-zinc-300">
					[2026-09-01, 08:30:00] Développement Web Avancé
				</div>
				<div className="text-zinc-700 dark:text-zinc-300">
					[2026-09-01, 13:30:00] Architecture des SI
				</div>
				<div className="text-zinc-700 dark:text-zinc-300">
					[2026-09-02, 09:00:00] Gestion de Projet Agile
				</div>
				<div className="text-zinc-700 dark:text-zinc-300">
					[2026-09-02, 14:00:00] Design UX/UI
				</div>
				<div className="text-zinc-700 dark:text-zinc-300">
					[2026-09-03, 10:00:00] Sécurité des Applications
				</div>
				<div className="text-zinc-700 dark:text-zinc-300">
					[2026-09-03, 15:30:00] Masterclass IA
				</div>
			</div>
		),
		attendance: (
			<div className="flex flex-col gap-1.5">
				<div className="text-zinc-500 font-medium select-none">
					$ npx tsx attendance.ts
				</div>
				<div className="text-zinc-700 dark:text-zinc-300">Presences: 128</div>
				<div className="text-zinc-700 dark:text-zinc-300">Absences: 3</div>
				<div className="text-zinc-700 dark:text-zinc-300">
					Found 3 absence(s)
				</div>
			</div>
		),
		documents: (
			<div className="flex flex-col gap-1.5">
				<div className="text-zinc-500 font-medium select-none">
					$ npx tsx documents.ts
				</div>
				<div className="text-zinc-700 dark:text-zinc-300">
					3 document(s) to sign
				</div>
				<div className="text-zinc-700 dark:text-zinc-300">
					12 completed document(s)
				</div>
				<div className="text-zinc-700 dark:text-zinc-300">
					- Action required: Règlement intérieur 2026-2027
				</div>
				<div className="text-zinc-700 dark:text-zinc-300">
					- Action required: Charte informatique
				</div>
				<div className="text-zinc-700 dark:text-zinc-300">
					- Action required: Contrat d'alternance
				</div>
				<div className="text-zinc-700 dark:text-zinc-300">
					Found 5 student attachment(s)
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
					<h1 className="text-4xl sm:text-5xl md:text-7xl font-medium tracking-tight text-fd-foreground mb-6 max-w-3xl mx-auto leading-[1.1] flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
						<span>A simple wrapper for</span>
						<img
							src="/logos/edusign.svg"
							alt="edusign logo"
							className="h-10 sm:h-12 md:h-16 lg:h-20 dark:invert"
						/>
					</h1>

					<p className="text-base sm:text-lg text-fd-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
						Build powerful integrations directly with{" "}
						<a
							href="https://www.edusign.com"
							target="_blank"
							rel="noopener noreferrer"
							className="text-fd-foreground font-medium underline underline-offset-4 hover:text-fd-primary transition-colors"
						>
							Edusign
						</a>
						. Handle authentication, planning, attendance, and more with a
						fully-typed, zero-dependency wrapper.
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
							{(
								[
									"quickstart",
									"auth",
									"planning",
									"attendance",
									"documents",
								] as Tab[]
							).map((tab) => (
								<button
									key={tab}
									onClick={() => setActiveTab(tab)}
									className={`px-4 py-2.5 border-r border-fd-border transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap ${
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
									{tab === "attendance" && "attendance.ts"}
									{tab === "documents" && "documents.ts"}
								</button>
							))}
						</div>

						{/* IDE Code Content */}
						<div className="p-5 font-mono text-[13px] md:text-sm text-fd-foreground bg-fd-card/40 overflow-x-auto leading-relaxed max-h-95 transition-colors duration-200">
							<pre>
								{codeSnippets[activeTab].split("\n").map((line, i) => {
									const tokenize = (lineText: string) => {
										const regex =
											/(\/\/.*)|('(?:\\.|[^'])*'|"(?:\\.|[^"])*"|`(?:\\.|[^`])*`)|([a-zA-Z_$][a-zA-Z0-9_$]*)|([0-9]+(?:\.[0-9]+)?)|(\s+)|([^\s\w])/g;
										let match;
										const elements = [];
										let key = 0;

										// Handle empty line
										if (lineText.length === 0) {
											return <span> </span>;
										}

										while ((match = regex.exec(lineText)) !== null) {
											const [full, comment, str, word, num, space, symbol] =
												match;
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
													/^(loginWithCredentials|getPlanning|getProfile|log|verifyPin|getSchools|getCoursesBetweenDates|getAttendanceStatistics|getAbsences|getDocuments|getStudentAttachments)$/.test(
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
											} else if (num) {
												elements.push(
													<span
														key={key++}
														className="text-blue-500 dark:text-blue-400"
													>
														{num}
													</span>,
												);
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
						<div className="p-5 font-mono text-[12px] bg-zinc-950/5 dark:bg-black/40 text-zinc-800 dark:text-zinc-300 border-t border-fd-border overflow-x-auto min-h-27.5 leading-relaxed transition-colors duration-200">
							{terminalOutputs[activeTab]}
						</div>
					</div>
				</div>

				{/* Features Checklist Grid */}
				<div className="max-w-(--fd-layout-width) w-full mx-auto mt-8 relative z-10">
					<div className="text-center mb-12">
						<h2 className="text-2xl md:text-3xl font-medium tracking-tight text-fd-foreground">
							Unlock the full power of Edusign
						</h2>
						<p className="text-fd-muted-foreground text-sm mt-2 max-w-lg mx-auto">
							A zero-dependency library designed to be the ultimate,
							comprehensive wrapper for Edusign.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8 text-left border border-fd-border bg-fd-card/25 p-8 md:p-12 rounded-2xl transition-colors duration-200">
						<div className="flex gap-4">
							<div className="w-8 h-8 rounded-lg bg-fd-card border border-fd-border flex items-center justify-center shrink-0">
								<Layers className="w-4 h-4 text-fd-primary" />
							</div>
							<div>
								<h3 className="font-semibold text-fd-foreground text-sm">
									Zero Dependencies
								</h3>
								<p className="text-fd-muted-foreground text-xs mt-1.5 leading-relaxed">
									Zero runtime dependencies. Built strictly on native Web APIs
									(fetch) to run instantly anywhere.
								</p>
							</div>
						</div>

						<div className="flex gap-4">
							<div className="w-8 h-8 rounded-lg bg-fd-card border border-fd-border flex items-center justify-center shrink-0">
								<Lock className="w-4 h-4 text-fd-primary" />
							</div>
							<div>
								<h3 className="font-semibold text-fd-foreground text-sm">
									Universal Authentication
								</h3>
								<p className="text-fd-muted-foreground text-xs mt-1.5 leading-relaxed">
									Universal Authentication supporting Passwords, Microsoft
									OAuth, CAS, and custom SSO domains.
								</p>
							</div>
						</div>

						<div className="flex gap-4">
							<div className="w-8 h-8 rounded-lg bg-fd-card border border-fd-border flex items-center justify-center shrink-0">
								<Calendar className="w-4 h-4 text-fd-primary" />
							</div>
							<div>
								<h3 className="font-semibold text-fd-foreground text-sm">
									Planning & Schedule
								</h3>
								<p className="text-fd-muted-foreground text-xs mt-1.5 leading-relaxed">
									Timetable & schedule parser to query academic courses with
									custom date ranges.
								</p>
							</div>
						</div>

						<div className="flex gap-4">
							<div className="w-8 h-8 rounded-lg bg-fd-card border border-fd-border flex items-center justify-center shrink-0">
								<ClipboardCheck className="w-4 h-4 text-fd-primary" />
							</div>
							<div>
								<h3 className="font-semibold text-fd-foreground text-sm">
									Attendance & Lateness
								</h3>
								<p className="text-fd-muted-foreground text-xs mt-1.5 leading-relaxed">
									Monitor detailed presence, absences, and lateness records
									typed via TypeScript.
								</p>
							</div>
						</div>

						<div className="flex gap-4">
							<div className="w-8 h-8 rounded-lg bg-fd-card border border-fd-border flex items-center justify-center shrink-0">
								<PenTool className="w-4 h-4 text-fd-primary" />
							</div>
							<div>
								<h3 className="font-semibold text-fd-foreground text-sm">
									Digital Signatures
								</h3>
								<p className="text-fd-muted-foreground text-xs mt-1.5 leading-relaxed">
									Digitally sign attendance sheets and view past signature
									payloads.
								</p>
							</div>
						</div>

						<div className="flex gap-4">
							<div className="w-8 h-8 rounded-lg bg-fd-card border border-fd-border flex items-center justify-center shrink-0">
								<BookOpen className="w-4 h-4 text-fd-primary" />
							</div>
							<div>
								<h3 className="font-semibold text-fd-foreground text-sm">
									Homeworks & Grades
								</h3>
								<p className="text-fd-muted-foreground text-xs mt-1.5 leading-relaxed">
									Retrieve assignments, homeworks, and detailed grades
									evaluation endpoints.
								</p>
							</div>
						</div>

						<div className="flex gap-4">
							<div className="w-8 h-8 rounded-lg bg-fd-card border border-fd-border flex items-center justify-center shrink-0">
								<FileText className="w-4 h-4 text-fd-primary" />
							</div>
							<div>
								<h3 className="font-semibold text-fd-foreground text-sm">
									Documents & Attachments
								</h3>
								<p className="text-fd-muted-foreground text-xs mt-1.5 leading-relaxed">
									Download school attachments and interact with documents that
									require signing.
								</p>
							</div>
						</div>

						<div className="flex gap-4">
							<div className="w-8 h-8 rounded-lg bg-fd-card border border-fd-border flex items-center justify-center shrink-0">
								<Newspaper className="w-4 h-4 text-fd-primary" />
							</div>
							<div>
								<h3 className="font-semibold text-fd-foreground text-sm">
									Announcements & News
								</h3>
								<p className="text-fd-muted-foreground text-xs mt-1.5 leading-relaxed">
									Parse latest announcements, alerts, and news published by the
									administration.
								</p>
							</div>
						</div>

						<div className="flex gap-4">
							<div className="w-8 h-8 rounded-lg bg-fd-card border border-fd-border flex items-center justify-center shrink-0">
								<MapIcon className="w-4 h-4 text-fd-primary" />
							</div>
							<div>
								<h3 className="font-semibold text-fd-foreground text-sm">
									Campus Maps
								</h3>
								<p className="text-fd-muted-foreground text-xs mt-1.5 leading-relaxed">
									Fetch campus locations, interactive maps, and classroom
									directories.
								</p>
							</div>
						</div>

						<div className="flex gap-4">
							<div className="w-8 h-8 rounded-lg bg-fd-card border border-fd-border flex items-center justify-center shrink-0">
								<Users className="w-4 h-4 text-fd-primary" />
							</div>
							<div>
								<h3 className="font-semibold text-fd-foreground text-sm">
									Contacts Directory
								</h3>
								<p className="text-fd-muted-foreground text-xs mt-1.5 leading-relaxed">
									Browse the school's administration and teachers directory
									seamlessly.
								</p>
							</div>
						</div>

						<div className="flex gap-4">
							<div className="w-8 h-8 rounded-lg bg-fd-card border border-fd-border flex items-center justify-center shrink-0">
								<User className="w-4 h-4 text-fd-primary" />
							</div>
							<div>
								<h3 className="font-semibold text-fd-foreground text-sm">
									Student Profile
								</h3>
								<p className="text-fd-muted-foreground text-xs mt-1.5 leading-relaxed">
									Access student profile.
								</p>
							</div>
						</div>

						<div className="flex gap-4">
							<div className="w-8 h-8 rounded-lg bg-fd-card border border-fd-border flex items-center justify-center shrink-0">
								<PieChart className="w-4 h-4 text-fd-primary" />
							</div>
							<div>
								<h3 className="font-semibold text-fd-foreground text-sm">
									Satisfaction Surveys
								</h3>
								<p className="text-fd-muted-foreground text-xs mt-1.5 leading-relaxed">
									Retrieve and submit forms, satisfaction surveys, and school
									evaluations.
								</p>
							</div>
						</div>

						<div className="flex gap-4">
							<div className="w-8 h-8 rounded-lg bg-fd-card border border-fd-border flex items-center justify-center shrink-0">
								<Library className="w-4 h-4 text-fd-primary" />
							</div>
							<div>
								<h3 className="font-semibold text-fd-foreground text-sm">
									Knowledge Base
								</h3>
								<p className="text-fd-muted-foreground text-xs mt-1.5 leading-relaxed">
									Search and query the school's internal knowledge base and FAQ.
								</p>
							</div>
						</div>

						<div className="flex gap-4">
							<div className="w-8 h-8 rounded-lg bg-fd-card border border-fd-border flex items-center justify-center shrink-0">
								<School className="w-4 h-4 text-fd-primary" />
							</div>
							<div>
								<h3 className="font-semibold text-fd-foreground text-sm">
									Schools Metadata
								</h3>
								<p className="text-fd-muted-foreground text-xs mt-1.5 leading-relaxed">
									Fetch school metadata, logos, group IDs, and multischool
									account mapping.
								</p>
							</div>
						</div>

						<div className="flex gap-4">
							<div className="w-8 h-8 rounded-lg bg-fd-card border border-fd-border flex items-center justify-center shrink-0">
								<Briefcase className="w-4 h-4 text-fd-primary" />
							</div>
							<div>
								<h3 className="font-semibold text-fd-foreground text-sm">
									Continuing Education
								</h3>
								<p className="text-fd-muted-foreground text-xs mt-1.5 leading-relaxed">
									Access continuing education and professional training modules.
								</p>
							</div>
						</div>

						<div className="flex gap-4">
							<div className="w-8 h-8 rounded-lg bg-fd-card border border-fd-border flex items-center justify-center shrink-0">
								<Tag className="w-4 h-4 text-fd-primary" />
							</div>
							<div>
								<h3 className="font-semibold text-fd-foreground text-sm">
									White-label Support
								</h3>
								<p className="text-fd-muted-foreground text-xs mt-1.5 leading-relaxed">
									Full support for Edusign's whitelabel applications and custom
									endpoints.
								</p>
							</div>
						</div>
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
						authorized, maintained, sponsored, or endorsed by Edusign or its
						developers. All trademarks, logos, and brand names are the property
						of their respective owners. Their mention here is strictly for
						identification purposes and does not imply any association.
					</p>
					<p>
						This tool is provided strictly to facilitate interoperability. The
						authors decline any liability for misuse, illegal activities, or
						malicious acts committed by users. You are solely responsible for
						ensuring your use of this tool complies with applicable laws and
						terms of service. The software is provided &quot;as is&quot;,
						without warranty of any kind. The developer assumes no liability for
						account suspensions, access blocks, or any legal actions taken by
						Edusign resulting from the use of this tool.
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
