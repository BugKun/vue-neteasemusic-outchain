class Ajax{
    constructor(method, url){
        this.xhr = new XMLHttpRequest();
        this.method = method;
        this.url = url;
        this.data = null;
        this.ended = false;
    }

    parseParam(param, key){
        let paramStr = "";
        const paramType = typeof param;
        if(paramType === "string" || paramType === "number" || paramType === "boolean"){
            paramStr += `&${ key }=${ encodeURIComponent(param) }`;
        }else{
            for(let i in param){
                const k = key == null? i : key + (param instanceof Array? `[${ i }]` : "." + i);
                paramStr += `&${ this.parseParam(param[i], k) }`;
            }
        }
        return paramStr.substr(1);
    }

    query(data){
        if(typeof data === "object"){
            this.url += `?${this.parseParam(data)}`;
        }else {
            this.url += `?${data}`;
        }
        return this;
    }

    send(data){
        if(this.method.toUpperCase() === "POST"){
            if(typeof data === "object"){
                this.data = JSON.stringify(data);
            }else {
                this.data = data;
            }
            return this;
        }else {
            return this.query(data);
        }
    }

    then(func){
        if(this.ended && typeof func !== "function") return this;
        let xhr = this.xhr;
        xhr.open(this.method, this.url, true);
        xhr.onreadystatechange = () => {
            if (xhr.readyState !== 4) return;
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
                let res = {};
                try {
                    res = JSON.parse(xhr.responseText);
                } catch (e) {
                    res = xhr.responseText;
                }
                func(res);
            }
        };
        xhr.send(this.data);
        this.ended = true;
        return this;
    }

    catch(func){
        if(typeof func !== "function") return this;
        this.xhr.onerror = func;
    }
}

export default (method, url) => new Ajax(method, url)