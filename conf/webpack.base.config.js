const webpack = require('webpack'),
    path = require('path'),
    HappyPack = require('happypack'),
    os = require("os"),
    threads = os.cpus().length,
    ThreadLimit = 8, //超过8个线程后 happypack 打包速度会更慢
    happyThreadPool = HappyPack.ThreadPool({ size: (threads > ThreadLimit)? ThreadLimit : threads });


module.exports = {
    entry:{
        "VueNeteaseMusicOutchain": [path.resolve(__dirname, '../src/index.js')]
    },
    output: {
        path: path.resolve(__dirname, "../"),
        filename: 'dist/[name].js',
        publicPath: '/',
        libraryTarget: 'umd',
        library: '[name]'
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: ['happypack/loader?id=vue']
            },
            {
                test: /\.css$/,
                use: ['happypack/loader?id=css']
            },
            {
                test: /\.scss$/,
                use:['happypack/loader?id=scss']
            },
            {
                test: /\.js$/,
                use: ['happypack/loader?id=babel']
            }
        ]
    },
    plugins: [
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
            use: ['style-loader',{loader: 'css-loader',options: { minimize: true } }, 'sass-loader?outputStyle=compressed']
        }),
        new HappyPack({
            id: 'css',
            threadPool: happyThreadPool,
            loaders: ['style-loader',{loader: 'css-loader',options: { minimize: true } }]
        }),
        new HappyPack({
            id: 'vue',
            threadPool: happyThreadPool,
            loaders: [
                {
                    loader: 'vue-loader',
                    options: {
                        cssModules: {
                            minimize: true
                        },
                        threadMode: true
                    }
                }
            ],
        }),
    ]
};
