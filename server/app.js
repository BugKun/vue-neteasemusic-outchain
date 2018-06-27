const  port = process.env.PORT || 8080,
    child_process = require('child_process'),
    express = require('express'),
    app = express(),
    http = require("http"),
    path = require("path"),
    isDev = process.env.NODE_ENV === "development";


/**
 * webpack-dev-middleware
 */
if(isDev){
    const webpack = require('webpack'),
        webpackDevMiddleware = require('webpack-dev-middleware'),
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

/**
 * Vue Netease outchain
 */
/* 播放器获取列表 */
app.post("/api/musicPlayList", (req, res) => {
    let setlog = `\r\n${new Date().toLocaleString()}\r\n[UserAgent]:${req.headers["user-agent"]}`;
    req.setEncoding('utf-8');
    let postData;
    req.addListener("data", function (postDataChunk) {
        postData = JSON.parse(postDataChunk);
        console.log(postData);
    });
    req.addListener("end", function () {
        console.log('数据接收完毕');
        http.get(`http://localhost:3000/playlist/detail?id=${postData.id}`, function (_res) {
            var _data = "";
            _res.setEncoding('utf8');
            _res.on('data', function (chunk) {
                _data += chunk;
            });
            _res.on("end", function(){
                if (!_data) {
                    console.log("服务器异常！");
                }
                let data = JSON.parse(_data);
                let cbData = {};
                cbData.code = data.code;
                cbData.coverImgUrl = data.playlist.coverImgUrl;
                cbData.name = data.playlist.name;
                cbData.tracks = [];
                for(let i in data.playlist.tracks){
                    let track = data.playlist.tracks[i];
                    let artistsName = "";
                    for(let j in track.artists){
                        artistsName += track.artists[j].name + " / ";
                    }
                    cbData.tracks.push({name: track.name, id: track.id, duration: track.dt, artists: artistsName.substring(0,artistsName.length - 3), picUrl: track.al.picUrl});
                }
                console.log(cbData);
                res.json(cbData);
            });
        }).on("error", function (err) {
            console.log("服务器异常！", err.stack);
        });
    });
});
/* 播放器获取播放链接 */
app.post("/api/musicUrl", (req, res) => {
    let setlog = `\r\n${new Date().toLocaleString()}\r\n[UserAgent]:${req.headers["user-agent"]}`;
    req.setEncoding('utf-8');
    let postData;
    req.addListener("data", function (postDataChunk) {
        postData = JSON.parse(postDataChunk);
        console.log(postData);
    });
    req.addListener("end", function () {
        console.log('数据接收完毕');
        http.get(`http://localhost:3000/music/url?id=${postData.id}`, function (_res) {
            var _data = "";
            _res.on('data', function (chunk) {
                _data += chunk;
            });
            _res.on("end", function(){
                if (!_data) {
                    console.log("服务器异常！");
                }
                let data = JSON.parse(_data);
                let cbData = {};
                cbData.code = data.code;
                cbData.id = data.data[0].id;
                cbData.url = data.data[0].url;
                cbData.br = data.data[0].br;
                cbData.size = data.data[0].size;
                cbData.md5 = data.data[0].md5;
                cbData.type = data.data[0].type;
                console.log(cbData);
                res.json(cbData);
            });
        }).on("error", function (err) {
            console.log("服务器异常！", err.stack);
        });
    });
});
/* 播放器获取歌词 */
app.post("/api/musicLyric", (req, res) => {
    let setlog = `\r\n${new Date().toLocaleString()}\r\n[UserAgent]:${req.headers["user-agent"]}`;
    req.setEncoding('utf-8');
    let postData;
    req.addListener("data", function (postDataChunk) {
        postData = JSON.parse(postDataChunk);
        console.log(postData);
    });
    req.addListener("end", function () {
        console.log('数据接收完毕');
        http.get(`http://localhost:3000/lyric?id=${postData.id}`, function (_res) {
            var _data = "";
            _res.on('data', function (chunk) {
                _data += chunk;
            });
            _res.on('end', function () {
                if (!_data) {
                    console.log("服务器异常！");
                }
                let data = JSON.parse(_data);
                console.log(data);
                res.json(data);
            });
        }).on("error", function (err) {
            console.log("服务器异常！", err.stack);
        });
    });
});


/* 挂载静态页面 */
app.use(express.static(path.join(__dirname, '../example')));

console.log("在启动此实例前请先启动NeteaseCloudMusicApi ！");
app.listen(port, () => {
    console.log("Server is now running in localhost: " + port);
    child_process.exec(`start http://localhost:${port}`);
});
