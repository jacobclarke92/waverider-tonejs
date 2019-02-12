const { resolve } = require('path')

module.exports = {
	context: resolve(__dirname, 'src'),
	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.jsx'],
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
