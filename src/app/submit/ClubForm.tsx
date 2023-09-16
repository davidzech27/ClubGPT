"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

import submitClubAction from "./submitClubAction"
import cn from "~/utils/cn"

export default function ClubForm() {
	const [nameInput, setNameInput] = useState("")
	const [presidentNameInput, setPresidentNameInput] = useState("")
	const [descriptionInput, setDescriptionInput] = useState("")
	const [linkInput, setLinkInput] = useState("")

	const [submitting, setSubmitting] = useState(false)

	const onSubmit = async () => {
		setSubmitting(true)

		await submitClubAction({
			name: nameInput,
			presidentName: presidentNameInput,
			description: descriptionInput,
			link: linkInput,
		})

		router.push("/submitted")
	}

	const disabled =
		[nameInput, presidentNameInput, descriptionInput].includes("") ||
		submitting

	const router = useRouter()

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault()

				onSubmit()
			}}
			className="flex w-full flex-col gap-3"
		>
			<label
				htmlFor="name"
				className="ml-1 select-none text-sm font-semibold leading-none text-white"
			>
				Name
			</label>

			<input
				type="text"
				value={nameInput}
				onChange={(e) => setNameInput(e.target.value)}
				id="name"
				placeholder="Name"
				autoComplete="off"
				className="rounded-md border border-stone-700 bg-black px-3 py-1.5 font-medium text-white outline-none transition placeholder:select-none placeholder:text-stone-700 hover:bg-stone-950 focus:border-stone-500 focus:bg-stone-950 placeholder:focus:text-stone-500"
			/>

			<label
				htmlFor="president-name"
				className="ml-1 select-none text-sm font-semibold leading-none text-white"
			>
				President name
			</label>

			<input
				type="text"
				value={presidentNameInput}
				onChange={(e) => setPresidentNameInput(e.target.value)}
				id="president-name"
				placeholder="President name"
				autoComplete="off"
				className="rounded-md border border-stone-700 bg-black px-3 py-1.5 font-medium text-white outline-none transition placeholder:select-none placeholder:text-stone-700 hover:bg-stone-950 focus:border-stone-500 focus:bg-stone-950 placeholder:focus:text-stone-500"
			/>

			<label
				htmlFor="description"
				className="ml-1 select-none text-sm font-semibold leading-none text-white"
			>
				Description
			</label>

			<textarea
				value={descriptionInput}
				onChange={(e) => setDescriptionInput(e.target.value)}
				placeholder="Description"
				id="description"
				autoComplete="off"
				className="rounded-md border border-stone-700 bg-black px-3 py-1.5 font-medium text-white outline-none transition placeholder:select-none placeholder:text-stone-700 hover:bg-stone-950 focus:border-stone-500 focus:bg-stone-950 placeholder:focus:text-stone-500"
			/>

			<label
				htmlFor="link"
				className="ml-1 select-none text-sm font-semibold leading-none text-white"
			>
				Relevant link
			</label>

			<input
				type="text"
				value={linkInput}
				onChange={(e) => setLinkInput(e.target.value)}
				id="link"
				placeholder="Relevant link"
				autoComplete="off"
				className="rounded-md border border-stone-700 bg-black px-3 py-1.5 font-medium text-white outline-none transition placeholder:select-none placeholder:text-stone-700 hover:bg-stone-950 focus:border-stone-500 focus:bg-stone-950 placeholder:focus:text-stone-500"
			/>

			<button
				disabled={disabled}
				className={cn(
					"h-14 select-none rounded-md bg-white text-xl font-semibold outline-none transition",
					submitting
						? "animate-pulse"
						: disabled
						? "opacity-50"
						: "hover:bg-stone-300 focus-visible:bg-stone-300 active:bg-stone-300",
				)}
			>
				Submit
			</button>
		</form>
	)
}
