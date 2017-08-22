module.exports = {
	plugins: [
		require('postcss-import'),
		require('postcss-cssnext')({
			features: {
				rem: false
			},
			browsers: ['last 2 versions', '> 5%'],
		})
	],
};