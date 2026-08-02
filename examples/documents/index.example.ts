import chalk from "chalk";
import {
	getDocuments,
	getStudentAttachments,
} from "../../src/services/documents";
import { authenticate } from "../auth/credentials.example";

async function runDocumentsExample() {
	console.log(chalk.bold.magenta("\n--- Edusign Documents Example ---"));

	const user = await authenticate();
	const token = user.TOKEN;

	console.log(chalk.blue("\nFetching documents (to sign & completed)..."));
	const documents = await getDocuments(token);
	console.log(
		chalk.green(
			`✔ ${documents.toSign.length} document(s) to sign, ${documents.complete.length} completed document(s)`,
		),
	);

	if (documents.toSign.length > 0) {
		console.log(chalk.cyan("\nDocuments to sign:"));
		for (const doc of documents.toSign) {
			console.log(chalk.white(`- ${doc.NAME}`));
		}
	}

	console.log(chalk.blue("\nFetching attachments..."));
	const attachments = await getStudentAttachments(token);
	console.log(chalk.green(`✔ ${attachments.length} attachment(s) found`));
	for (const att of attachments) {
		console.log(chalk.white(`- ${att.NAME}`));
	}
}

const isMain = process.argv[1]?.includes("index.example");
if (isMain) {
	runDocumentsExample().catch(console.error);
}
