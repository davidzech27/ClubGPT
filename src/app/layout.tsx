import "./globals.css"

export const metadata = {
	title: { default: "ClubGPT", template: "%s | ClubGPT" },
	description: "Find clubs at your school",
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en" >
			<body className="absolute inset-0">{children}</body>
		</html>
	)
}
