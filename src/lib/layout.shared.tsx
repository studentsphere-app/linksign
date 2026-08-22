import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { appName, gitConfig } from "./shared";

export function baseOptions(): BaseLayoutProps {
	return {
		nav: {
			title: (
				<span className="flex items-center gap-2">
					<img
						src="/logos/linksign.svg"
						alt={appName}
						className="h-7 dark:invert"
					/>
				</span>
			),
		},
		githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
	};
}
