const http = require("http");

module.exports = url =>
    new Promise((resolve, reject) => {
        http.get(url, res => {
            let data = "";
            res.setEncoding("utf8");
            res.on("data", chunk => {
                data += chunk;
            });
            res.on("end", () => {
                resolve(data);
            });
        }).on("error", reject);
    });
