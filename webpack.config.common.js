const { resolve } = require('path')

module.exports = {
	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.jsx'],
	},
	context: resolve(__dirname, 'src'),
	resolve: {
		alias: {
			wavesurfer: 'wavesurfer.js/src/wavesurfer.js',
		},
	},
	module: {
		rules: [
			{
				test: /\.(j|t)sx?$/,
				use: ['babel-loader'],
				include: [resolve(__dirname, 'src'), resolve(__dirname, 'node_modules/wavesurfer.js/src')],
			},
		],
	},
	performance: {
		hints: false,
	},
}
