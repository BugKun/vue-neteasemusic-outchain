/**
 * param 将要转为URL参数字符串的对象
 * key URL参数字符串的前缀
 * 
 * return URL参数字符串
 */

const parseParam = (param, key) => {
    let paramStr = "";
    const paramType = typeof param;
    if(paramType === "string" || paramType === "number" || paramType === "boolean"){
        paramStr += `&${ key }=${ encodeURIComponent(param) }`;
    }else{
        for(let i in param){
            const k = key == null? i : key + (param instanceof Array? `[${ i }]` : "." + i);
            paramStr += `&${ parseParam(param[i], k) }`;
        }
    }
    return paramStr.substr(1);
};


export default (type, url, data = null) => {
    return new Promise(function(resolve, reject) {
        const xhr = new XMLHttpRequest();
        const Type = type.toUpperCase();
        switch(Type){
            case "GET": 
            xhr.open(type, `${ url }?${ parseParam(data) }`, true);
            break;

            case "POST": 
            xhr.open(type, url, true);
            break;

            default: 
            xhr.open(type, `${ url }?${ parseParam(data) }`, true);
        }       
        xhr.onreadystatechange = () => {
            if (xhr.readyState !== 4) return;
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
                let res = {};
                try {
                    res = JSON.parse(xhr.responseText);
                } catch (e) {
                    reject(e);
                }
                resolve(res);
            }
        };
        xhr.onerror = reject;
        xhr.send((typeof(data) === "object" && Type === "POST") ? JSON.stringify(data) : data);
    })
}