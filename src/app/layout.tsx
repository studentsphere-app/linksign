import type { Metadata } from "next";
import localFont from "next/font/local";
import { Provider } from "@/components/provider";
import "./global.css";

const lexend = localFont({
	src: "../../public/fonts/Lexend/Lexend.ttf",
	variable: "--font-lexend",
});

export const metadata: Metadata = {
	title: {
		template: "%s | Linksign",
		default: "Linksign - Lightweight TypeScript Wrapper for Edusign",
	},
	description:
		"A lightweight, zero-dependency TypeScript wrapper designed to interact with EdusignServices portals.",
	metadataBase: new URL("https://linksign.studentsphere.app"),
	alternates: {
		canonical: "/",
	},
	icons: {
		icon: [
			{ url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
			{ url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
			{ url: "/favicon.ico", sizes: "any" },
		],
		apple: [
			{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
		],
	},
	manifest: "/site.webmanifest",
	openGraph: {
		title: "Linksign - Lightweight TypeScript Wrapper for Edusign",
		description:
			"Interact programmatically with Edusign school portals. Zero dependencies, TypeScript-first, compatible with 20+ schools from Compétences & Développement and IGENSIA Education.",
		url: "https://linksign.studentsphere.app",
		siteName: "Linksign",
		images: [
			{
				url: "/banner.png",
				width: 1200,
				height: 640,
				alt: "Linksign - Edusign Wrapper banner",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Linksign - Lightweight TypeScript Wrapper for Edusign",
		description:
			"Interact programmatically with Edusign school portals. Zero dependencies, TypeScript-first, compatible with 20+ schools from Compétences & Développement and IGENSIA Education.",
		images: ["/banner.png"],
	},
};

export default function Layout({ children }: LayoutProps<"/">) {
	return (
		<html
			lang="en"
			className={`${lexend.variable} font-sans`}
			suppressHydrationWarning
		>
			<body className="flex flex-col min-h-screen">
				<Provider>{children}</Provider>
			</body>
		</html>
	);
}
