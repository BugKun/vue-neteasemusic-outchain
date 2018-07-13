const webpack = require('webpack'),
    path = require('path'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    webpackBaseConfig = require('./webpack.base.config.js');


module.exports = {
    mode: "development",
    entry: [path.resolve(__dirname, '../src/index.js?hot=true'), "webpack-hot-middleware/client?reload=true"],
    output: {
        ...webpackBaseConfig.output,
        library: 'webpackHotMiddlewareMode'
    },
    devtool: "source-map",
    resolve: webpackBaseConfig.resolve,
    module: webpackBaseConfig.module,
    plugins: [
        ...webpackBaseConfig.plugins,
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "../src/dev-pages/template.html"),
            minify: {
                collapseWhitespace: true
            },
            hash: true,
            inject: "head"
        }),
    ]
};