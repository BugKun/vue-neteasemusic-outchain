const http = require("http");

const httpGet = url => {
    return new Promise(function(resolve, reject){
        http.get(url, function (res) {
            var data = "";
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                data += chunk;
            });
            res.on("end", function(){
                resolve(data);
            });
        }).on("error", reject);
    })
}

module.exports = httpGet;