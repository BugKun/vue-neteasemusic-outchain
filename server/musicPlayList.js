const httpGet = require("./httpGet");

module.exports = (id, cb) => {
    httpGet(`http://localhost:3000/playlist/detail?id=${ id }`)
        .then(_data => {
            let data = null;
            try {
                data = JSON.parse(_data);
                if (data === null || typeof data !== "object") {
                    console.log("服务器异常！");
                    return { code: 500 };
                }
            } catch (e) {
                console.log("服务器异常：", e);
                return { code: 500 };
            }
            const cbData = {
                code: data.code,
                coverImgUrl: data.playlist.coverImgUrl,
                name: data.playlist.name,
                tracks: data.playlist.tracks.map(track => {
                    const picUrl = track.al.picUrl;
                    return {
                        name: track.name,
                        id: track.id,
                        duration: track.dt,
                        artists: track.ar.map(item => item.name).join(" / "),
                        picUrl: (picUrl)? picUrl.replace(/(http:\/\/)|(https:\/\/)/, "//") : picUrl,
                        pop: track.pop
                    };
                })
            };
            console.log(cbData);
            cb(cbData);
        })
        .catch(err => {
            console.log("服务器异常！", err.stack);
        });
};
