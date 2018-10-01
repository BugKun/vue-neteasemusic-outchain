const webpack = require('webpack'),
    path = require('path'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    HappyPack = require('happypack'),
    os = require("os"),
    threads = os.cpus().length,
    ThreadLimit = 8, //超过8个线程后 happypack 打包速度会更慢
    happyThreadPool = HappyPack.ThreadPool({ size: (threads > ThreadLimit) ? ThreadLimit : threads });


module.exports = {
    entry: {
        "VueNeteaseMusicOutchain": [path.resolve(__dirname, '../src/index.js')]
    },
    output: {
        path: path.resolve(__dirname, "../dist"),
        filename: '[name].js',
        publicPath: '/',
        libraryTarget: 'umd',
        library: '[name]'
    },
    resolve: {
        modules: [path.resolve(__dirname, '../src'), 'node_modules'],
        alias: {
            libs: path.resolve(__dirname, "../src/libs")
        }
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: ['happypack/loader?id=vue']
            },
            {
                test: /\.js$/,
                use: ['happypack/loader?id=babel']
            },
            {
                test: /\.css$/,
                use: ['happypack/loader?id=css']
            },
            {
                test: /\.scss$/,
                use: ['happypack/loader?id=scss']
            },
            {
                test: /\.svg$/,
                use: ['happypack/loader?id=svg']
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: ['happypack/loader?id=url']
            }
        ]
    },
    plugins: [
        new HappyPack({
            id: 'vue',
            threadPool: happyThreadPool,
            loaders: [{
                loader: 'vue-loader',
                options: {
                    cssModules: {
                        minimize: true
                    },
                    threadMode: true
                }
            }],
        }),
        new HappyPack({
            id: 'babel',
            threadPool: happyThreadPool,
            use: [{
                loader: "babel-loader?cacheDirectory=true",
                exclude: /node_modules/
            }],
        }),
        new HappyPack({
            id: 'scss',
            threadPool: happyThreadPool,
            use: ['style-loader', { loader: 'css-loader', options: { minimize: true } }, 'sass-loader?outputStyle=compressed']
        }),
        new HappyPack({
            id: 'css',
            threadPool: happyThreadPool,
            loaders: [
                'style-loader',
                {
                    loader: 'css-loader',
                    options: {
                        minimize: true
                    }
                }
            ]
        }),
        new HappyPack({
            id: 'svg',
            threadPool: happyThreadPool,
            loaders: ['svg-inline-loader?classPrefix']
        }),
        new HappyPack({
            id: 'url',
            threadPool: happyThreadPool,
            loaders: ['url-loader?limit=99999']
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "../src/dev-pages/template.html"),
            hash: true,
            inject: "head"
        }),
    ]
};
