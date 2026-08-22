import { HomeLayout } from "fumadocs-ui/layouts/home";
import { baseOptions } from "@/lib/layout.shared";

export default function Layout({ children }: LayoutProps<"/">) {
	return (
		<HomeLayout
			{...baseOptions()}
			links={[
				{
					text: "Home",
					url: "/",
				},
				{
					text: "Documentation",
					url: "/docs",
				},
			]}
		>
			{children}
		</HomeLayout>
	);
}
