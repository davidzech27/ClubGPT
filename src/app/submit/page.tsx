import ClubForm from "./ClubForm"

export const runtime = "edge"

export const metadata = {
	title: "Submit club",
}

export default function SubmitPage() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-center bg-black px-48 py-8 mobile:px-8">
			<h1 className="mb-4 select-none text-5xl font-semibold text-white mobile:text-3xl">
				Submit a club
			</h1>

			<ClubForm />
		</main>
	)
}
