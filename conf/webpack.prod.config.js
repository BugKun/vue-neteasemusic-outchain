const path = require('path'),
    webpackBaseConfig = require('./webpack.base.config'),
    FileManagerPlugin = require('filemanager-webpack-plugin');


const webpackConfig = {
    mode: "production",
    entry: webpackBaseConfig.entry,
    output: webpackBaseConfig.output,
    module: webpackBaseConfig.module,
    plugins: [
        ...webpackBaseConfig.plugins,
        new FileManagerPlugin({
            onStart: {
                delete: [
                    path.resolve(__dirname, '../dist'),
                ]
            },
            onEnd: {
                copy: [
                    { source: path.resolve(__dirname, '../dist'), destination: path.resolve(__dirname, '../example/dist') }
                ]
            }
        })
    ]
};

module.exports = webpackConfig;