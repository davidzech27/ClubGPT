"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

import { type Club } from "~/data/School"
import Await from "~/utils/Await"
import isURLValid from "~/utils/isURLValid"

interface Props {
	clubsPromise: Promise<Club[]>
}

export default function ClubList({ clubsPromise }: Props) {
	const [showWelcomeMessage, setShowWelcomeMessage] = useState(true)

	useEffect(() => {
		setTimeout(() => setShowWelcomeMessage(false), 2000)
	}, [])

	return (
		<AnimatePresence>
			{showWelcomeMessage ? (
				<motion.h1
					key="welcome"
					exit={{ opacity: 0 }}
					transition={{ duration: 0.15, ease: "easeOut" }}
					className="absolute select-none text-center text-5xl font-semibold leading-[1.125] text-white transition mobile:text-4xl"
				>
					Welcome to Maria Carrillo&apos;s club directory.
				</motion.h1>
			) : (
				<Await promise={clubsPromise}>
					{(clubs) => (
						<motion.div
							key="list"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.15, ease: "easeOut" }}
							className="w-full flex-1"
						>
							<h1 className="mb-4 select-none text-5xl font-semibold leading-[1.125] text-white mobile:text-4xl">
								Clubs
							</h1>

							<ul className="flex flex-col justify-start gap-3">
								{clubs.map((club) => {
									const Component =
										club.link !== undefined &&
										isURLValid(club.link)
											? Link
											: "li"

									return (
										<Component
											key={club.name}
											href={club.link ?? "/"}
											role="listitem"
											draggable={false}
											className="block rounded-md border border-stone-700 bg-black px-6 py-3 transition hover:border-stone-500 hover:bg-stone-950 focus-visible:border-stone-500 focus-visible:bg-stone-950 active:border-stone-500 active:bg-stone-950"
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
										</Component>
									)
								})}
							</ul>
						</motion.div>
					)}
				</Await>
			)}
		</AnimatePresence>
	)
}
