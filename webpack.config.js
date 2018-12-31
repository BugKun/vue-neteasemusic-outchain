const path = require('path'),
    threadLoader = require('thread-loader'),
    VueLoaderPlugin = require('vue-loader/lib/plugin'),
    MiniCssExtractPlugin = require("mini-css-extract-plugin"),
    OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin"),
    UglifyJsPlugin = require("uglifyjs-webpack-plugin"),
    CleanWebpackPlugin = require('clean-webpack-plugin'),
    pkg = require('./package.json');



threadLoader.warmup({}, [
    'vue-loader',
    'babel-loader',
    'sass-loader',
    'css-loader',
    'svg-inline-loader',
    'url-loader'
]);

module.exports = {
    mode: 'production',
    entry: {
        [pkg.name]: [path.resolve(__dirname, './src/index.js')]
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: '/dist',
        filename: '[name].js',
        libraryTarget: 'umd',
        library: '[name]'
    },
    externals: {
        'vue': {
            root: 'Vue',
            commonjs: 'vue',
            commonjs2: 'vue',
            amd: 'vue'
        }
    },
    resolve: {
        modules: [path.resolve(__dirname, './src'), 'node_modules'],
        alias: {
            Utils: path.resolve(__dirname, './src/utils'),
            Services: path.resolve(__dirname, './src/services'),
            Icons: path.resolve(__dirname, './src/icons'),
        }
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
                    MiniCssExtractPlugin.loader,
                    'thread-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'thread-loader',
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
        new MiniCssExtractPlugin({
            filename: "[name].css"
        }),
        new CleanWebpackPlugin(
            ["dist"],
            {
                root: __dirname,
                verbose: true,
                dry: false
            }
        ),
        new VueLoaderPlugin()
    ]
};
