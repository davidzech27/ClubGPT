import School from "~/data/School"
import ClubList from "./ClubList"

export const runtime = "edge"

export const revalidate = 10

export default function Home() {
	const clubsPromise = School({
		name: "Maria Carrillo High School",
		districtName: "Santa Rosa City Schools",
	}).searchClubs({ filter: { verified: true }, limit: 9998 })

	return (
		<main className="flex min-h-screen flex-col items-center justify-center bg-black px-48 py-8 mobile:px-8">
			<ClubList clubsPromise={clubsPromise} />
		</main>
	)
}
