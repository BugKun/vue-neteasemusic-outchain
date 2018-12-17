﻿# Vue-Netease-outchain
A outchain player for NeteaseCloudMusic on Vue. ( Vue上的网易云音乐外链播放器 )

## 预览
![preview1](https://raw.githubusercontent.com/BugKun/vue-neteasemusic-outchain/master/preview1.png)
![preview2](https://raw.githubusercontent.com/BugKun/vue-neteasemusic-outchain/master/preview2.png)

## 演示
<a href="http://player.nopast.cn" target="_blank">Demo</a>

## 更新日志
**请注意2.0版本的接口参数发生改变，请注意修改！**
<br/> 
<a href="//github.com/BugKun/vue-neteasemusic-outchain/blob/master/UPDATE.md" target="_blank">点击查看更新日志</a>

## 注意
* 正式版已发布(要求：Vue 2.1.8+)，组件已基本稳定。以后不再做功能更新，仅进行功能维护。
* 修BUG时，忍不住加了一个功能，如要使用1.0.5+的版本，对应的服务器要增加热度(pop)参数的传递，参考代码可以看下面的例子或查看实例的源码。
* 由于使用了弹性盒子布局，兼容性为IE10+。
* 此外链播放器需要服务器配合解析网易云音乐API才能正常使用。推荐使用：<a href="https://github.com/Binaryify/NeteaseCloudMusicApi" target="_blank">NeteaseCloudMusicApi</a><br>
* 此外你还需要简化获取到的接口信息，以减少不必要的流量、带宽消耗和官方的API变动导致无法正常使用，并将接口设置为POST或GET请求（修改请求方式需要修改下面的配置）。

默认请求地址为：（默认POST请求，支持修改成GET请求）
```JavaScript
{
    method: "POST",
    playListUrl: "/api/musicPlayList",
    musicUrl: "/api/musicUrl",
    musicLyricUrl: "/api/musicLyric"
}
```
你需要修改获取到的官方返回的数据：
```JavaScript
http.get(`http://localhost:3000/playlist/detail?id=${postData.id}`, function (_res) {
    let _data = "";
    _res.setEncoding('utf8');
    _res.on('data', function (chunk) {
        _data += chunk;
    });
    _res.on("end", function(){
        if (!_data) {
            console.log("服务器异常！");
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
        res.json(cbData);
    });
}).on("error", function (err) {
    console.log("服务器异常！", err.stack);
});
```
```JavaScript
http.get(`http://localhost:3000/music/url?id=${postData.id}`, function (_res) {
    let _data = "";
    _res.on('data', function (chunk) {
        _data += chunk;
    });
    _res.on("end", function(){
        if (!_data) {
            console.log("服务器异常！");
        }
        const musicUrl = data.data[0].url;
        const cbData = {
            code: data.code,
            ...data.data[0],
            url: (musicUrl)? musicUrl.replace(/(http:\/\/)|(https:\/\/)/, "//") : musicUrl
        };
        console.log(cbData);
        res.json(cbData);
    });
}).on("error", function (err) {
    console.log("服务器异常！", err.stack);
});
```
http://localhost:3000/lyric 保持数据与官方一致

### 安装
> npm i -D vue-neteasemusic-outchain

### 相关参数
> playlist (Type:Number)：歌单ID，必须填入<br>
> maxWidth (Type:Number)：组件的最大宽度，必须填入<br>
> maxHeight (Type:Number)：组件的最大高度，必须填入<br>
> hideGit (Type:Boolean): 是否隐藏播放器内github的链接标志<br>
> lazyLoad (Type:Boolean)：懒加载（初始传入变量参数为false，当需要马上加载时传入变量改为true。注意：此设置会造成autoplay功能无法按预期执行）<br>
> autoPlay (Type:Boolean)：自动播放（true即为自动播放）<br>
> redirect (Type:Object)：修改获取参数的链接<br>
>> method (Type:String): 请求方式，只能是"POST"或"GET"<br>
>> playListUrl (Type:String)：修改获取播放列表的链接<br>
>> musicUrl (Type:String)：修改获取歌曲文件的链接<br>
>> musicLyricUrl (Type:String)：修改获取歌词的链接<br>


### 使用演示
#### 全局使用
```JavaScript
import neteaseOutchain from 'vue-netease-outchain'
Vue.use(neteaseOutchain);    
```
* 其余部分与组件使用方式类似。
#### 组件使用方式
<a href="//github.com/BugKun/vue-neteasemusic-outchain/blob/master/src/index.js" target="_blank">点击查看实例</a>
