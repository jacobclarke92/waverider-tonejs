var path = require('path')
var webpack = require('webpack')
var BrowserSyncPlugin = require('browser-sync-webpack-plugin')

var options = {
	entry: {
		scripts: path.join(__dirname, '/src/index.js'),
	},
	output: {
		filename: '[name].js',
		path: path.join(__dirname, '/app/dist'),
	},
	resolve: {
		alias: {
			wavesurfer: 'wavesurfer.js/src/wavesurfer.js',
		},
	},
	plugins: [
		new BrowserSyncPlugin({
			host: 'localhost',
			port: 3000,
			server: {
				baseDir: ['./app'],
				index: 'index.html',
			},
		}),
		new webpack.optimize.ModuleConcatenationPlugin(),
	],
	module: {
		rules: [
			{
				test: /\.js$/,
				include: [path.join(__dirname, 'src'), path.join(__dirname, 'node_modules/wavesurfer.js/src')],
				loader: 'babel-loader',
				query: {
					presets: ['react', 'env'],
					plugins: ['transform-object-rest-spread', 'transform-class-properties', 'syntax-dynamic-import'],
				},
			},
			{
				include: [path.join(__dirname, 'node_modules', 'pixi.js')],
				loader: 'ify-loader',
			},
		],
	},
}

module.exports = options
