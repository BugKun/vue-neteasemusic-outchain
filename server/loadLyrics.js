const httpGet = require("./httpGet");

module.exports = (id, cb) => {
    httpGet(`http://localhost:3000/lyric?id=${ id }`)
        .then(data => {
            cb(data);
        })
        .catch(err => {
            console.log("服务器异常！", err.stack);
        });
};
