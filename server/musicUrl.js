const httpGet = require("./httpGet");

module.exports = (id, cb) => {
    httpGet(`http://localhost:3000/music/url?id=${ id }`)
        .then(_data => {
            let data = null;
            try {
                data = JSON.parse(_data);
                if (data === null || typeof data !== "object") {
                    console.log("服务器异常！");
                    cb({ code: 500 });
                    return;
                }
            } catch (e) {
                console.log("服务器异常！");
                cb({ code: 500 });
                return;
            }
            let cbData = {};
            cbData.code = data.code;
            cbData.id = data.data[0].id;
            cbData.url = data.data[0].url;
            cbData.br = data.data[0].br;
            cbData.size = data.data[0].size;
            cbData.md5 = data.data[0].md5;
            cbData.type = data.data[0].type;
            console.log(cbData);
            cb(cbData);
        })
        .catch(err => {
            console.log("服务器异常！", err.stack);
        });
};
