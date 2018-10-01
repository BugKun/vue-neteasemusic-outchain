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
                console.log("服务器异常：", e);
                cb({ code: 500 });
                return;
            }
            const musicUrl = data.data[0].url;
            const cbData = {
                code: data.code,
                ...data.data[0],
                url: (musicUrl)? musicUrl.replace(/(http:\/\/)|(https:\/\/)/, "//") : musicUrl
            };
            console.log(cbData);
            cb(cbData);
        })
        .catch(err => {
            console.log("服务器异常！", err.stack);
        });
};
