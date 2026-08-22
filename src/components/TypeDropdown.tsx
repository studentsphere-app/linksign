"use client";

import { useRouter } from "next/navigation";
import type React from "react";

export function TypeDropdown() {
	const router = useRouter();

	const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const val = e.target.value;
		if (val) {
			router.push(val);
			// Reset select value back to default
			e.target.value = "";
		}
	};

	return (
		<div className="flex flex-col gap-1.5 w-full">
			<label className="text-[10px] uppercase tracking-wider font-semibold text-fd-muted-foreground">
				Types & API Reference
			</label>
			<select
				onChange={handleSelect}
				defaultValue=""
				className="w-full bg-fd-card border border-fd-border rounded-md px-3 py-1.5 text-xs text-fd-foreground hover:bg-fd-accent/30 transition-colors focus:outline-none focus:ring-1 focus:ring-fd-primary font-medium cursor-pointer"
			>
				<option value="" disabled>
					Select a reference...
				</option>

				<optgroup label="Functions" className="font-semibold text-xs">
					<option value="/docs/types/login-with-credentials">
						loginWithCredentials()
					</option>
					<option value="/docs/types/get-planning">getPlanning()</option>
					<option value="/docs/types/get-profile">getProfile()</option>
					<option value="/docs/types/get-cas-url">getCASURL()</option>
				</optgroup>

				<optgroup label="Constants" className="font-semibold text-xs">
					<option value="/docs/types/instances">INSTANCES</option>
					<option value="/docs/types/cd-instances">CD_INSTANCES</option>
					<option value="/docs/types/igensia-instances">
						IGENSIA_INSTANCES
					</option>
				</optgroup>

				<optgroup label="Interfaces" className="font-semibold text-xs">
					<option value="/docs/types/user">User</option>
					<option value="/docs/types/lesson">Lesson</option>
					<option value="/docs/types/profile">Profile</option>
					<option value="/docs/types/instance">Instance</option>
				</optgroup>
			</select>
		</div>
	);
}
