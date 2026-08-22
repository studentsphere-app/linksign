import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
	output: "export",
	// Remove basePath because the custom domain maps directly to the root '/'
	// basePath: '/linksign',
	trailingSlash: true,
	reactStrictMode: true,
	webpack: (config, options) => {
		// 1. Locate Next.js's SWC loader
		let swcLoader;
		for (const rule of config.module.rules || []) {
			if (rule.oneOf) {
				for (const oneOfRule of rule.oneOf) {
					if (oneOfRule.loader?.includes("next-swc-loader")) {
						swcLoader = {
							loader: oneOfRule.loader,
							options: oneOfRule.options,
						};
						break;
					}
					if (oneOfRule.use) {
						const uses = Array.isArray(oneOfRule.use)
							? oneOfRule.use
							: [oneOfRule.use];
						for (const useItem of uses) {
							if (useItem.loader?.includes("next-swc-loader")) {
								swcLoader = useItem;
								break;
							}
						}
					}
					if (swcLoader) break;
				}
			}
			if (swcLoader) break;
		}

		// 2. Locate the MDX loader rule added by Fumadocs and replace the undefined/Babel loader with SWC
		for (const rule of config.module.rules || []) {
			if (rule.test?.toString().includes("mdx")) {
				if (rule.use && Array.isArray(rule.use)) {
					if (rule.use[0] === undefined) {
						rule.use[0] = swcLoader || {
							loader: "next-swc-loader",
							options: {
								isServer: options.isServer,
								compilerType: options.isServer
									? options.nextRuntime === "edge"
										? "edge-server"
										: "server"
									: "client",
								rootDir: config.context || process.cwd(),
							},
						};
					}
				}
			}
		}

		return config;
	},
};

export default withMDX(config);
