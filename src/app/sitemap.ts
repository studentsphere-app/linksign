export const dynamic = "force-static";

import type { MetadataRoute } from "next";
import { source } from "@/lib/source";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const domain = "https://linksign.studentsphere.app";

	const baseRoutes: MetadataRoute.Sitemap = [
		{
			url: domain,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 1.0,
		},
	];

	const docPages = source.getPages();
	const docRoutes: MetadataRoute.Sitemap = docPages.map((page) => {
		const path = page.url.startsWith("/") ? page.url : `/${page.url}`;

		let priority = 0.8;
		if (path.includes("/types/")) {
			priority = 0.5;
		} else if (path.includes("/functionality/")) {
			priority = 0.7;
		}

		return {
			url: `${domain}${path}`,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority,
		};
	});

	return [...baseRoutes, ...docRoutes];
}
