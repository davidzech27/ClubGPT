"use client"
import { useState } from "react"
import { produce } from "immer"

import { type Club } from "~/data/School"
import cn from "~/utils/cn"
import updateClubAction from "./updateClubAction"
import isURLValid from "~/utils/isURLValid"

interface Props {
	clubs: Club[]
}

export default function AdminClubList({ clubs: clubsProps }: Props) {
	const [clubs, setClubs] = useState(clubsProps)

	const [actions, setActions] = useState<
		{ name: string; action: "verify" | "unverify" | "delete" }[]
	>([])

	const onAction = async (action: {
		name: string
		action: "verify" | "unverify" | "delete"
	}) => {
		setActions((prevActions) => [...prevActions, action])

		await updateClubAction(action)

		setActions((prevActions) =>
			prevActions.filter((prevAction) => prevAction !== action),
		)

		if (action.action === "verify")
			setClubs(
				produce((clubs) => {
					const club = clubs.find((club) => club.name === action.name)

					if (club !== undefined) club.verified = true
				}),
			)
		else if (action.action === "unverify")
			setClubs(
				produce((clubs) => {
					const club = clubs.find((club) => club.name === action.name)

					if (club !== undefined) club.verified = false
				}),
			)
		else if (action.action === "delete")
			setClubs((prevClubs) =>
				prevClubs.filter((prevClub) => prevClub.name !== action.name),
			)
	}

	return (
		<ul className="flex w-full flex-1 flex-col justify-start gap-3">
			{clubs.map((club) => {
				return (
					<li
						key={club.name}
						onClick={() => {
							if (
								club.link !== undefined &&
								isURLValid(club.link)
							)
								window.location.href = club.link
						}}
						className="cursor-pointer rounded-md border border-stone-700 bg-black px-6 py-3 transition hover:border-stone-500 hover:bg-stone-950 focus-visible:border-stone-500 focus-visible:bg-stone-950 active:border-stone-500 active:bg-stone-950"
					>
						<div className="flex justify-between">
							<div className="font-semibold text-white">
								{club.name}
							</div>

							<div className="font-medium text-stone-500">
								{club.presidentName}
							</div>
						</div>

						<p className="mt-3 whitespace-pre-wrap text-stone-400">
							{club.description}
						</p>

						<div className="mt-3 flex gap-3">
							{club.verified ? (
								<button
									onClick={(e) => {
										e.stopPropagation()

										onAction({
											name: club.name,
											action: "unverify",
										})
									}}
									className={cn(
										"h-12 flex-1 select-none rounded-md bg-white text-lg font-semibold outline-none transition hover:bg-stone-300 focus-visible:bg-stone-300 active:bg-stone-300",
										actions.find(
											(action) =>
												action.name === club.name &&
												action.action === "unverify",
										) && "animate-pulse",
									)}
								>
									Unverify
								</button>
							) : (
								<button
									onClick={(e) => {
										e.stopPropagation()

										onAction({
											name: club.name,
											action: "verify",
										})
									}}
									className={cn(
										"h-12 flex-1 select-none rounded-md bg-white text-lg font-semibold outline-none transition hover:bg-stone-300 focus-visible:bg-stone-300 active:bg-stone-300",
										actions.find(
											(action) =>
												action.name === club.name &&
												action.action === "verify",
										) && "animate-pulse",
									)}
								>
									Verify
								</button>
							)}

							<button
								onClick={(e) => {
									e.stopPropagation()

									onAction({
										name: club.name,
										action: "delete",
									})
								}}
								className={cn(
									"h-12 flex-1 select-none rounded-md bg-white text-lg font-semibold outline-none transition hover:bg-stone-300 focus-visible:bg-stone-300 active:bg-stone-300",
									actions.find(
										(action) =>
											action.name === club.name &&
											action.action === "delete",
									) && "animate-pulse",
								)}
							>
								Delete
							</button>
						</div>
					</li>
				)
			})}
		</ul>
	)
}
