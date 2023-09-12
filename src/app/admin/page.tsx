import env from "~/env.mjs"
import School from "~/data/School"
import AdminClubList from "./AdminClubList"

export const runtime = "edge"

export const metadata = {
	title: "Admin",
}

export const dynamic = "force-dynamic"

export default async function UnverifiedPage() {
	if (env.NODE_ENV !== "development") return null

	const clubs = await School({
		name: "Maria Carrillo High School",
		districtName: "Santa Rosa City Schools",
	}).searchClubs({ limit: 9998 })

	return (
		<main className="flex min-h-screen flex-col items-center justify-center bg-black px-48 py-8 mobile:px-8">
			<AdminClubList clubs={clubs} />
		</main>
	)
}
