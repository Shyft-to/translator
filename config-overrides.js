const webpack = require("webpack")

module.exports = function override(config, env) {
    //do stuff with the webpack config...
    config.resolve.fallback = {
        ...config.resolve.fallback,
        assert: require.resolve('assert'),
        stream: require.resolve("stream-browserify"),
        buffer: require.resolve("buffer"),
        crypto: require.resolve('crypto-browserify'),
        url:false,
        zlib: false,
        https: false,
        http: false
    }
    config.resolve.extensions = [...config.resolve.extensions, ".ts", ".js"]
    config.plugins = [
        ...config.plugins,
        new webpack.ProvidePlugin({
            process: "process/browser",
            Buffer: ["buffer", "Buffer"],
        }),
    ]
    config.module = {
        ...config.module,
        rules: [
            ...config.module.rules,
            {
                test: /\.m?[jt]sx?$/,
                enforce: 'pre',
                use: ['source-map-loader'],
            },
            {
                test: /\.m?[jt]sx?$/,
                resolve: {
                    fullySpecified: false,
                },
            },
        ],
    }
    // console.log(config.resolve)
    // console.log(config.plugins)

    return config
}