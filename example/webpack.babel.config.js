const webpack = require('webpack'),
    path = require('path'),
    threadLoader = require('thread-loader'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    pkg = require('../package.json');


threadLoader.warmup({}, [
    'vue-loader',
    'babel-loader',
    'style-loader',
    'sass-loader',
    'css-loader',
    'svg-inline-loader',
    'url-loader'
]);


module.exports = {
    mode: "development",
    entry: {
        [pkg.name]: [
            path.resolve(__dirname, './src/index.js'),
            "webpack-hot-middleware/client?reload=true"
        ]
    },
    output: {
        path: path.resolve(__dirname, "./build"),
        filename: '[name].js',
        publicPath: '/'
    },
    devtool: "source-map",
    resolve: {
        modules: [
            path.resolve(__dirname, './src'),
            'node_modules'
        ],
        alias: {
            libs: path.resolve(__dirname, "../src/libs"),
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
                    "thread-loader",
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
                exclude: /node_modules/,
                use: [
                    "thread-loader",
                    {
                        loader: "babel-loader",
                        options: {
                            cacheDirectory: true
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [
                    "thread-loader",
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            minimize: true
                        }
                    }
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    "thread-loader",
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            minimize: true
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            outputStyle: "compressed"
                        }
                    }
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
                    "thread-loader",
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 99999
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "./src/index.html"),
            title: `${pkg.name} demo`,
            hash: true
        }),
        new webpack.HotModuleReplacementPlugin()
    ]
};
