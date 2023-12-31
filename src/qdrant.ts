import env from "~/env.mjs"

const qdrant = ({ collection }: { collection: string }) => ({
	createCollection: async () => {
		await fetch(`${env.QDRANT_URL}/collections/${collection}`, {
			method: "PUT",
			body: JSON.stringify({
				name: collection,
				vectors: {
					size: 1536,
					distance: "Dot",
				},
			}),
			headers: {
				"Content-Type": "application/json",
				"api-key": env.QDRANT_API_KEY,
			},
		})
	},
	insertPoint: async (point: {
		id: number | string
		payload: Record<string, string | number | boolean | undefined>
		vector: number[]
	}) => {
		await (
			await fetch(
				`${env.QDRANT_URL}/collections/${collection}/points?wait=true`,
				{
					method: "PUT",
					body: JSON.stringify({ points: [point] }),
					headers: {
						"Content-Type": "application/json",
						"api-key": env.QDRANT_API_KEY,
					},
				},
			)
		).json()
	},
	updatePayload: async ({
		payload,
		filter,
	}: {
		payload: Record<string, string | number | boolean | undefined>
		filter: Record<string, string | number | boolean>
	}) => {
		await (
			await fetch(
				`${env.QDRANT_URL}/collections/${collection}/points/payload?wait=true`,
				{
					method: "POST",
					body: JSON.stringify({
						payload,
						filter:
							filter !== undefined
								? {
										must: Object.keys(filter).map(
											(key) => ({
												key,
												match: {
													value: filter[key],
												},
											}),
										),
								  }
								: undefined,
					}),
					headers: {
						"Content-Type": "application/json",
						"api-key": env.QDRANT_API_KEY,
					},
				},
			)
		).json()
	},
	searchPoints: async ({
		vector,
		filter,
		limit,
	}: {
		vector: number[]
		filter?: Record<string, string | number | boolean>
		limit: number
	}) => {
		return (
			(await (
				await fetch(
					`${env.QDRANT_URL}/collections/${collection}/points/search`,
					{
						method: "POST",
						body: JSON.stringify({
							vector,
							filter:
								filter !== undefined
									? {
											must: Object.keys(filter).map(
												(key) => ({
													key,
													match: {
														value: filter[key],
													},
												}),
											),
									  }
									: undefined,
							limit,
							with_payload: true,
						}),
						headers: {
							"Content-Type": "application/json",
							"api-key": env.QDRANT_API_KEY,
						},
					},
				)
			).json()) as {
				result: {
					id: number
					score: number
					payload: Record<string, string | number | boolean>
				}[]
			}
		).result
	},
	deletePoint: async ({
		filter,
	}: {
		filter: Record<string, string | number | boolean>
	}) => {
		await (
			await fetch(
				`${env.QDRANT_URL}/collections/${collection}/points/delete?wait=true`,
				{
					method: "POST",
					body: JSON.stringify({
						filter:
							filter !== undefined
								? {
										must: Object.keys(filter).map(
											(key) => ({
												key,
												match: {
													value: filter[key],
												},
											}),
										),
								  }
								: undefined,
					}),
					headers: {
						"Content-Type": "application/json",
						"api-key": env.QDRANT_API_KEY,
					},
				},
			)
		).json()
	},
	countPoints: async () => {
		return (
			(await (
				await fetch(
					`${env.QDRANT_URL}/collections/${collection}/points/count`,
					{
						method: "POST",
						body: JSON.stringify({
							exact: true,
						}),
						headers: {
							"Content-Type": "application/json",
							"api-key": env.QDRANT_API_KEY,
						},
					},
				)
			).json()) as { result: { count: number } }
		).result.count
	},
})

export default qdrant
