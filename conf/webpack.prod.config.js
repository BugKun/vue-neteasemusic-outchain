const path = require('path'),
    webpackBaseConfig = require('./webpack.base.config'),
    FileManagerPlugin = require('filemanager-webpack-plugin');


module.exports = {
    mode: "production",
    entry: webpackBaseConfig.entry,
    output: webpackBaseConfig.output,
    resolve: webpackBaseConfig.resolve,
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
                    { source: path.resolve(__dirname, '../dist/*.js'), destination: path.resolve(__dirname, '../example/dist') }
                ],
                move: [
                    { source: path.resolve(__dirname, '../dist/*.html'), destination: path.resolve(__dirname, '../example') }
                ],
                delete: [
                    path.resolve(__dirname, '../dist/*.html')
                ]
            }
        })
    ]
};
