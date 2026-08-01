export function extractDomainFromEmail(email: string): string | null {
	if (!email?.includes("@")) {
		return null;
	}
	return email.split("@")[1].toLowerCase();
}
