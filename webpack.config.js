const path = require('path'),
    threadLoader = require('thread-loader'),
    pkg = require('./package.json');


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
    mode: "production",
    entry: {
        [pkg.name]: [path.resolve(__dirname, './src/index.js')]
    },
    output: {
        path: path.resolve(__dirname, "./dist"),
        publicPath: '/dist',
        filename: '[name].js',
        libraryTarget: 'umd',
        library: '[name]'
    },
    resolve: {
        modules: [path.resolve(__dirname, './src'), 'node_modules'],
        alias: {
            libs: path.resolve(__dirname, "./src/libs")
        }
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
                            cssModules: {
                                minimize: true
                            },
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
                        loader: 'url-loader'
                    }
                ]
            }
        ]
    }
};
