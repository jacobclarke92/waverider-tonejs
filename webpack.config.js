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
		new webpack.NoEmitOnErrorsPlugin(),
		new ExtractTextPlugin('styles.css'),
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
		rules: [
			{
				test: /\.js$/,
				include: [
					path.join(__dirname, 'src'), 
					path.join(__dirname, 'node_modules/wavesurfer.js/src'),
				],
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['react', 'es2015', 'stage-0'],
					},
				},
			},
			{
				test: /\.js$/,
				include: path.join(__dirname, 'node_modules', 'pixi.js'),
				use: {
					loader: 'transform-loader?brfs',
				},
			},
			{
				test: /\.json$/,
				include: [
					path.join(__dirname, 'node_modules', 'pixi.js'),
					path.join(__dirname, 'node_modules', 'axios'),
				],
				use: {
					loader: 'json-loader',
				},
			},
			{
				test: /\.css$/,
				include: [
					path.join(__dirname, 'src'), 
				],
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: [
						'css-loader',
						'postcss-loader'
					]
				}),
			},
			{
				test: /\.(eot|woff|woff2|ttf|svg|png|jpe?g|gif)(\?\S*)?/,
				use: [
					{
						loader: 'url',
						options: {
							limit: 8000, 
							name: '[name].[ext]',
						},
					}
				]
			},
		],
	},
};

module.exports = options;
