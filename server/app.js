const port = process.env.PORT || 8080,
    child_process = require("child_process"),
    express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    musicPlayList = require("./musicPlayList"),
    musicUrl = require("./musicUrl"),
    loadLyrics = require("./loadLyrics"),
    path = require("path"),
    isDev = process.env.NODE_ENV === "development";

/**
 * webpack-dev-middleware
 */
if (isDev) {
    const webpack = require("webpack"),
        webpackDevMiddleware = require("webpack-dev-middleware"),
        webpackHotMiddleWare = require("webpack-hot-middleware"),
        webpackDevConfig = require("../conf/webpack.dev.config"),
        compiler = webpack(webpackDevConfig),
        devMiddleware = webpackDevMiddleware(compiler, {
            publicPath: webpackDevConfig.output.publicPath,
            hot: true,
            lazy: false
        }),
        hotMiddleware = webpackHotMiddleWare(compiler);
    app.use(devMiddleware);
    app.use(hotMiddleware);
}

// 处理 application/json
app.use(bodyParser.json());

/**
 * Vue Netease outchain
 */

/* 播放器获取列表 */
app.get("/api/musicPlayList", (req, res) => {
    musicPlayList(req.query.id, data => res.json(data));
});

app.post("/api/musicPlayList", (req, res) => {
    console.log("数据接收完毕");
    const postData = req.body;
    console.log(postData);
    musicPlayList(postData.id, data => res.json(data));
});

/* 播放器获取播放链接 */
app.get("/api/musicUrl", (req, res) => {
    musicUrl(req.query.id, data => res.json(data));
});

app.post("/api/musicUrl", (req, res) => {
    const postData = req.body;
    console.log("数据接收完毕");
    console.log(postData);
    musicUrl(postData.id, data => res.json(data));
});
/* 播放器获取歌词 */
app.get("/api/musicLyric", (req, res) => {
    loadLyrics(req.query.id, data => res.set("Content-Type", "application/json").end(data));
});

app.post("/api/musicLyric", (req, res) => {
    const postData = req.body;
    console.log("数据接收完毕");
    console.log(postData);
    loadLyrics(postData.id, data => res.set("Content-Type", "application/json").end(data));
});

/* 挂载静态页面 */
app.use(express.static(path.join(__dirname, "../example")));

console.log("在启动此实例前请先启动NeteaseCloudMusicApi ！");

app.listen(port, () => {
    console.log(`Server is now running in localhost: ${ port }`);
    child_process.exec(`start http://localhost:${ port }`);
});
