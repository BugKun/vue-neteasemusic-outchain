export default (type, url, data = null) => {
    return new Promise(function(resolve, reject) {
        const xhr = new XMLHttpRequest();
        xhr.open(type, url, true);
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
        xhr.send((typeof(data) === "object") ? JSON.stringify(data) : data);
    })
}