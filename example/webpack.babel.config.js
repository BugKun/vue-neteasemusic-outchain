const webpack = require('webpack'),
    path = require('path'),
    threadLoader = require('thread-loader'),
    VueLoaderPlugin = require('vue-loader/lib/plugin'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    webpackConfig = require('../webpack.config'),
    pkg = require('../package.json');


threadLoader.warmup({}, [
    'vue-loader',
    'babel-loader',
    'vue-style-loader',
    'svg-inline-loader',
    'sass-loader',
    'css-loader',
    'url-loader'
]);


module.exports = {
    mode: 'development',
    entry: {
        [pkg.name]: [
            path.resolve(__dirname, './src/index.js'),
            'webpack-hot-middleware/client?reload=true'
        ]
    },
    output: {
        path: path.resolve(__dirname, './build'),
        filename: '[name].js',
        publicPath: '/'
    },
    devtool: 'source-map',
    resolve: {
        modules: [
            path.resolve(__dirname, './src'),
            'node_modules'
        ],
        alias: {
            ...webpackConfig.resolve.alias,
            [pkg.name]: path.join(__dirname, '../src/index.js?hot=true'),
            [`${pkg.name}/src`]: path.join(__dirname, '../src')
        },
        extensions: [
            '.vue',
            '.js'
        ]
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: [
                    'thread-loader',
                    {
                        loader: 'vue-loader',
                        options: {
                            threadMode: true
                        }
                    }
                ]
            },
            {
                test: /\.js$/,
                exclude: file => (
                    /node_modules/.test(file) &&
                    !/\.vue\.js/.test(file)
                ),
                use: [
                    'thread-loader',
                    {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [
                    'thread-loader',
                    'vue-style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    'thread-loader',
                    'vue-style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.svg$/,
                use: [
                    "thread-loader",
                    {
                        loader: 'svg-inline-loader',
                        options: {
                            classPrefix: true
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    'thread-loader',
                    'url-loader'
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './src/index.html'),
            title: `${pkg.name} demo`,
            hash: true
        }),
        new webpack.HotModuleReplacementPlugin(),
        new VueLoaderPlugin()
    ]
};
