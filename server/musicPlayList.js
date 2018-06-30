const httpGet = require("./httpGet");

module.exports = function (id, cb) {
    httpGet(`http://localhost:3000/playlist/detail?id=${id}`).then(_data =>{
        let data = null;
        try {
            data = JSON.parse(_data);
            if(data === null || typeof data !== "object"){
                console.log("服务器异常！");
                return {code: 500};
            }
        } catch(e) {
            console.log("服务器异常！");
            return {code: 500};
        } 
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
        cb(cbData);
    }).catch(err => {
        console.log("服务器异常！", err.stack);
    });
};