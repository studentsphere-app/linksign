import { Callout } from "fumadocs-ui/components/callout";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { CodeBlock, Pre } from "./codeblock";
import { TypeDropdown } from "./TypeDropdown";

export function getMDXComponents(components?: MDXComponents) {
	return {
		...defaultMdxComponents,
		TypeDropdown,
		Callout,
		pre: ({ ref: _ref, ...props }) => (
			<CodeBlock {...props}>
				<Pre>{props.children}</Pre>
			</CodeBlock>
		),
		...components,
	} satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
	type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
