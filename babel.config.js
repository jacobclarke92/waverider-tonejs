module.exports = {
    presets: [
        ['@babel/preset-env', { 
            modules: false, 
            shippedProposals: true,
            targets: {browsers: ['last 2 versions', 'safari >= 7']},
        }],
        '@babel/preset-typescript',
        '@babel/preset-react', // can be commented out once entire project is in typescript
    ],
    plugins: [
        ['@babel/plugin-proposal-decorators', {'legacy': true}],
        ['@babel/plugin-proposal-class-properties', {'loose': true}],
        '@babel/plugin-proposal-export-default-from',
        '@babel/plugin-proposal-export-namespace-from',
        '@babel/plugin-proposal-object-rest-spread',
        '@babel/plugin-syntax-dynamic-import',
        ['@babel/plugin-transform-runtime', {helpers: true, regenerator: false}],
    ],
    env: {
        development: {},
        production: {
            presets: ['minify'],
        },
    },
}