const httpGet = require("./httpGet");

module.exports = function(id, cb) {
    httpGet(`http://localhost:3000/playlist/detail?id=${id}`).then(_data => {
        let data = null;
        try {
            data = JSON.parse(_data);
            if (data === null || typeof data !== "object") {
                console.log("服务器异常！");
                return { code: 500 };
            }
        } catch (e) {
            console.log("服务器异常！");
            return { code: 500 };
        }
        let cbData = {};
        cbData.code = data.code;
        cbData.coverImgUrl = data.playlist.coverImgUrl;
        cbData.name = data.playlist.name;
        cbData.tracks = [];
        data.playlist.tracks.forEach(track => {
            cbData.tracks.push({
                name: track.name,
                id: track.id,
                duration: track.dt,
                artists: track.ar.map(item => item.name).join(" / "),
                picUrl: track.al.picUrl,
                pop: track.pop
            });
        });
        console.log(cbData);
        cb(cbData);
    }).catch(err => {
        console.log("服务器异常！", err.stack);
    });
};