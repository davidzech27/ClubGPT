import Link from "next/link"

export const runtime = "edge"

export const metadata = {
	title: "Club submitted",
}

export default function SubmittedPage() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-center bg-black px-48 py-8 mobile:px-8">
			<Link
				href="/"
				draggable={false}
				className="select-none text-center text-5xl font-semibold leading-[1.125] text-white transition hover:text-stone-300 focus-visible:text-stone-300 active:text-stone-300 mobile:text-4xl"
			>
				Thank you for submitting a club.
			</Link>
		</main>
	)
}
