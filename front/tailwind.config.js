const colors = require('tailwindcss/colors')

module.exports = {
	content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],

	theme: {
		extend: {
			colors: {
				primary: colors.violet,
			},
		},
	},
	plugins: [require('@tailwindcss/forms')({ strategy: 'class' })],
}
