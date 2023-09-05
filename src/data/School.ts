import { z } from "zod"
import { v4 as uuid } from "uuid"

import qdrant from "~/qdrant"
import openai from "~/openai"

const collection = qdrant({ collection: "clubgpt" })

const clubPayloadSchema = z.object({
	schoolName: z.string(),
	schoolDistrictName: z.string(),
	name: z.string(),
	presidentName: z.string(),
	description: z.string(),
	link: z.string().url(),
	verified: z.boolean(),
})

type ClubPayload = z.infer<typeof clubPayloadSchema>

const School = ({
	name: schoolName,
	districtName: schoolDistrictName,
}: {
	name: string
	districtName: string
}) => ({
	addClub: async ({
		name,
		presidentName,
		description,
		link,
		verified,
	}: {
		name: string
		presidentName: string
		description: string
		link: string
		verified: boolean
	}) => {
		// await collection.createCollection() uncomment this if first time running

		await collection.upsertPoints([
			{
				id: uuid(),
				payload: {
					schoolName,
					schoolDistrictName,
					name,
					presidentName,
					description,
					link,
					verified,
				} satisfies ClubPayload,
				vector: (
					(await (
						await openai.createEmbedding({
							input: `Club name: ${name}\nClub description: ${description}`,
							model: "text-embedding-ada-002",
						})
					).json()) as { data: [{ embedding: number[] }] }
				).data[0].embedding,
			},
		])
	},
	verifyClub: async ({ name }: { name: string }) => {
		const clubPayload = clubPayloadSchema.parse(
			(
				await collection.searchPoints({
					vector: Array(1536).fill(0),
					filter: {
						schoolName,
						schoolDistrictName,
						name,
					},
					limit: 1,
				})
			)[0]?.payload,
		)

		await School({
			name: schoolName,
			districtName: schoolDistrictName,
		}).addClub({ ...clubPayload, verified: true })
	},
	searchClubs: async ({
		text,
		filter,
		limit,
	}: {
		text: string
		filter: Partial<ClubPayload>
		limit: number
	}) => {
		return (
			await collection.searchPoints({
				vector: (
					(await (
						await openai.createEmbedding({
							input: text,
							model: "text-embedding-ada-002",
						})
					).json()) as { data: [{ embedding: number[] }] }
				).data[0].embedding,
				filter,
				limit,
			})
		)
			.map(({ payload }) => clubPayloadSchema.parse(payload))
			.map(({ name, presidentName, description, link, verified }) => ({
				name,
				presidentName,
				description,
				link,
				verified,
			}))
	},
})

export default School
