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
	link: z.string().optional(),
	verified: z.boolean(),
})

type ClubPayload = z.infer<typeof clubPayloadSchema>

export type Club = Omit<ClubPayload, "schoolName" | "schoolDistrictName">

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
		link: string | undefined
		verified: boolean
	}) => {
		// await collection.createCollection() // uncomment this if first time running

		await collection.insertPoint({
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
		})
	},
	verifyClub: async ({ name }: { name: string }) => {
		const points = await collection.searchPoints({
			vector: Array(1536).fill(0),
			filter: {
				schoolName,
				schoolDistrictName,
				name,
			},
			limit: 5,
		})
		console.log("Verify", points)
		const clubPoint = points[0]

		if (clubPoint === undefined) return

		const clubId = clubPoint.id

		const clubPayload = clubPayloadSchema.parse(clubPoint.payload)

		await collection.updatePayload({
			id: clubId,
			payload: {
				...clubPayload,
				verified: true,
			} satisfies ClubPayload,
		})
	},
	unverifyClub: async ({ name }: { name: string }) => {
		const points = await collection.searchPoints({
			vector: Array(1536).fill(0),
			filter: {
				schoolName,
				schoolDistrictName,
				name,
			},
			limit: 5,
		})
		console.log("Unverify", points)
		const clubPoint = points[0]

		if (clubPoint === undefined) return

		const clubId = clubPoint.id

		const clubPayload = clubPayloadSchema.parse(clubPoint.payload)

		await collection.updatePayload({
			id: clubId,
			payload: {
				...clubPayload,
				verified: false,
			} satisfies ClubPayload,
		})
	},
	deleteClub: async ({ name }: { name: string }) => {
		await collection.deletePoint({
			filter: { schoolName, schoolDistrictName, name },
		})
	},
	searchClubs: async ({
		text,
		filter,
		limit,
	}: {
		text?: string
		filter?: Partial<Club>
		limit: number
	}) => {
		const points = await collection.searchPoints({
			vector:
				text !== undefined
					? (
							(await (
								await openai.createEmbedding({
									input: text,
									model: "text-embedding-ada-002",
								})
							).json()) as { data: [{ embedding: number[] }] }
					  ).data[0].embedding
					: Array(1536).fill(0),
			filter: { schoolName, schoolDistrictName, ...(filter ?? {}) },
			limit,
		})
		console.log("Search", points)
		return points
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
