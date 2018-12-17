const port = process.env.PORT || 8081,
    child_process = require("child_process"),
    path = require("path"),
    express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    compress = require("compression"), //Gzip
    musicPlayList = require("./services/musicPlayList"),
    musicUrl = require("./services/musicUrl"),
    loadLyrics = require("./services/loadLyrics");


console.log("在启动此实例前请确保已启动NeteaseCloudMusicApi ！");


/**
 * webpack-dev-middleware
 */
const webpack = require("webpack"),
    webpackDevMiddleware = require("webpack-dev-middleware"),
    webpackHotMiddleWare = require("webpack-hot-middleware"),
    webpackDevConfig = require("../webpack.babel.config"),
    compiler = webpack(webpackDevConfig),
    devMiddleware = webpackDevMiddleware(compiler, {
        publicPath: webpackDevConfig.output.publicPath,
        hot: true,
        lazy: false
    }),
    hotMiddleware = webpackHotMiddleWare(compiler);
app.use(devMiddleware);
app.use(hotMiddleware);

/* 开启GZIP */
app.use(compress());

// 处理 application/json
app.use(bodyParser.json());

/**
 * Vue Netease outchain
 */

/* 播放器获取列表 */
app.use("/api/musicPlayList", (req, res) => {
    console.log("接口被调用了");
    const listID = req.query.id || req.body.id;
    console.log(`listID: ${listID}`);
    musicPlayList(listID, data => res.json(data));
});

/* 播放器获取播放链接 */
app.use("/api/musicUrl", (req, res) => {
    console.log("接口被调用了");
    const musicID = req.query.id || req.body.id;
    console.log(`musicID: ${musicID}`);
    musicUrl(musicID, data => res.json(data));
});

/* 播放器获取歌词 */
app.use("/api/musicLyric", (req, res) => {
    console.log("接口被调用了");
    const lyricID = req.query.id || req.body.id;
    console.log(`lyricID: ${lyricID}`);
    loadLyrics(lyricID, data => res.set("Content-Type", "application/json").end(data));
});


/* 开启history模式 */
app.use((req, res) => {
    const filename = path.join(compiler.outputPath, 'index.html');
    compiler.outputFileSystem.readFile(filename, (error, result) => {
        if (error) {
            throw error;
        } else {
            res.set('Content-Type', 'text/html; charset=utf-8');
            res.end(result);
        }
    });
});

app.listen(port, () => {
    console.log(`Server is now running in localhost:${port}`);
    child_process.exec(`start http://localhost:${port}`);
});
