export interface KnowledgeBasePost {
	id: string;
	type: "category" | "text" | string;
	title: string;
	text: string | Record<string, string | null> | null;
	postCount?: number;
	imageCoverUrl?: string | null;
	children?: KnowledgeBasePost[];
}
