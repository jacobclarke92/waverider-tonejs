var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');

var options = {
	entry: {
		'scripts': path.join(__dirname, '/src/index.js'),
	},
	output: {
		filename: '[name].js',
		path: path.join(__dirname, '/app/dist'),
	},
	devtool: 'cheap-module-eval-source-map',
	plugins: [
		new webpack.NoErrorsPlugin(),
		// new ExtractTextPlugin('timbre.css', {allChunks: false}),
		new webpack.DefinePlugin({
		    'process.env.NODE_ENV': JSON.stringify('development')
		}),
		new BrowserSyncPlugin({
			host: 'localhost',
			port: 3000,
			server: { 
				baseDir: ['./app'] ,
				index: 'index.html',
			}
		}),
	],
	module: {
		loaders: [
			{
				test: /\.js$/,
				include: path.join(__dirname, 'node_modules', 'pixi.js'),
				loader: 'transform?brfs',
			},
			{
				test: /\.json$/,
				include: [
					path.join(__dirname, 'node_modules', 'pixi.js'),
					path.join(__dirname, 'node_modules', 'axios'),
				],
				loader: 'json',
			},
			{
				loader: 'babel-loader',
				test: /\.js$/,
				query: {presets: ['react', 'es2015', 'stage-0']},
				include: [
					path.join(__dirname, 'src'), 
					path.join(__dirname, 'node_modules/wavesurfer.js/src'),
				],
			},
		],
	},
	postcss: [ autoprefixer({ browsers: ['last 3 versions'] }) ],
};

module.exports = options;
