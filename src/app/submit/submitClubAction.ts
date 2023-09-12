"use server"
import { zact } from "zact/server"
import { z } from "zod"

import School from "~/data/School"
import discord from "~/discord"

const submitClubAction = zact(
	z.object({
		name: z.string(),
		presidentName: z.string(),
		description: z.string(),
		link: z.preprocess(
			(unknown) =>
				typeof unknown === "string" &&
				/^(https?:\/\/)?([\w.-]+)(\.[\w.-]+)(\/[\w.-]*)*\/?$/.test(
					unknown,
				)
					? unknown
					: undefined,
			z.string().url().optional(),
		),
	}),
)(async ({ name, presidentName, description, link }) => {
	console.log({ link })
	await Promise.all([
		School({
			name: "Maria Carrillo High School",
			districtName: "Santa Rosa City Schools",
		}).addClub({ name, presidentName, description, link, verified: false }),
		discord.send(
			`Club submitted: ${JSON.stringify(
				{ name, presidentName, description, link },
				null,
				4,
			)}`,
		),
	])
})

export default submitClubAction
