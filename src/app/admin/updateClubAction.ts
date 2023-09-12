"use server"
import { zact } from "zact/server"
import { z } from "zod"

import School from "~/data/School"

const updateClubAction = zact(
	z.object({
		name: z.string(),
		action: z.enum(["verify", "unverify", "delete"]),
	}),
)(async ({ name, action }) => {
	if (action === "verify")
		await School({
			name: "Maria Carrillo High School",
			districtName: "Santa Rosa City Schools",
		}).verifyClub({ name })
	else if (action === "unverify")
		await School({
			name: "Maria Carrillo High School",
			districtName: "Santa Rosa City Schools",
		}).unverifyClub({ name })
	else if (action === "delete")
		await School({
			name: "Maria Carrillo High School",
			districtName: "Santa Rosa City Schools",
		}).deleteClub({ name })
})

export default updateClubAction
