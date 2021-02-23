const path = require('path'),
    threadLoader = require('thread-loader'),
    MiniCssExtractPlugin = require("mini-css-extract-plugin"),
    OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin"),
    UglifyJsPlugin = require("uglifyjs-webpack-plugin"),
    CleanWebpackPlugin = require('clean-webpack-plugin'),
    VueLoaderPlugin = require('vue-loader/lib/plugin'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    webpackConfig = require('../webpack.config'),
    pkg = require('../package.json');


threadLoader.warmup({}, [
    'vue-loader',
    'babel-loader',
    'vue-style-loader',
    'svg-inline-loader',
    'less-loader',
    'postcss-loader',
    'css-loader',
    'url-loader'
]);


module.exports = {
    mode: 'production',
    entry: {
        example: path.resolve(__dirname, './src/index.js')
    },
    output: {
        path: path.resolve('./public/'),
        publicPath: '/demo-page/neteasemusic-player/',
        filename: '[name].js'
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
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true
            }),
            new OptimizeCSSAssetsPlugin()
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
                    'css-loader',
                    'postcss-loader'
                ]
            },
            {
                test: /\.less$/,
                use: [
                    'thread-loader',
                    'vue-style-loader',
                    'css-loader',
                    'postcss-loader',
                    {
                        loader: 'less-loader',
                        options: {
                            paths: [] // 黑魔法，保证thread-loader能正常运行
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
                    'thread-loader',
                    'url-loader'
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './src/index.html'),
            title: `${pkg.name} demo`,
            hash: true
        }),
        new CleanWebpackPlugin(
            ["public"],
            {
                root: path.resolve('./'),
                verbose: true,
                dry: false
            }
        ),
        new VueLoaderPlugin()
    ]
};
