/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{ts,tsx}"],
	theme: {
		extend: {
			screens: {
				mobile: { max: "1024px" },
			},
		},
	},
	plugins: [],
}
