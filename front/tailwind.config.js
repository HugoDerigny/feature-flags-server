module.exports = {
	content: ['./src/**/*.{js,jsx,ts,tsx}', './styles/**/*.{sass,css}', './public/index.html'],
	safelist: [
		{
			pattern: /(bg|border)-(indigo|blue|orange|pink|purple)-(400|500|600)/,
		},
	],
	theme: {
		extend: {},
	},
	plugins: [require('@tailwindcss/forms')({ strategy: 'class' })],
}
