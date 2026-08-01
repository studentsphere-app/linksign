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

	console.log(
		chalk.blue("\nRécupération des documents (à signer & terminés)..."),
	);
	const documents = await getDocuments(token);
	console.log(
		chalk.green(
			`✔ ${documents.toSign.length} document(s) à signer, ${documents.complete.length} document(s) terminé(s)`,
		),
	);

	if (documents.toSign.length > 0) {
		console.log(chalk.cyan("\nDocuments à signer :"));
		for (const doc of documents.toSign) {
			console.log(chalk.white(`- ${doc.NAME}`));
		}
	}

	console.log(chalk.blue("\nRécupération des pièces jointes..."));
	const attachments = await getStudentAttachments(token);
	console.log(
		chalk.green(`✔ ${attachments.length} pièce(s) jointe(s) trouvée(s)`),
	);
	for (const att of attachments) {
		console.log(chalk.white(`- ${att.NAME}`));
	}
}

const isMain = process.argv[1]?.includes("index.example");
if (isMain) {
	runDocumentsExample().catch(console.error);
}
