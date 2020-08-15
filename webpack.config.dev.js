const { resolve } = require('path')
const { merge } = require('webpack-merge')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const commonConfig = require('./webpack.config.common')

module.exports = merge(commonConfig, {
	mode: 'development',
	entry: {
		scripts: resolve(__dirname, 'src/index.tsx'),
	},
	output: {
		path: resolve(__dirname, 'app/dist'),
		publicPath: '/dist/',
		filename: '[name].js',
	},
	devtool: 'eval-source-map',
	// plugins: [new BundleAnalyzerPlugin()],
})
