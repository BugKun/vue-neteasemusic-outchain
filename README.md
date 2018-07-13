﻿# Vue-Netease-outchain
A outchain player for NeteaseCloudMusic( 网易云音乐外链播放器 ).

## 注意
* 正式版已发布(要求：Vue 2.1.8+)，组件已基本稳定，以后不再做功能更新，仅进行功能维护。
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
            var _data = "";
            _res.setEncoding('utf8');
            _res.on('data', function (chunk) {
                _data += chunk;
            });
            _res.on("end", function(){
                if (!_data) {
                    console.log("服务器异常！");
                }
                let cbData = {};
                cbData.code = data.code;
                cbData.coverImgUrl = data.playlist.coverImgUrl;
                cbData.name = data.playlist.name;
                cbData.tracks = [];
                for (let i in data.playlist.tracks) {
                    let track = data.playlist.tracks[i];
                    let artistsName = "";
                    for (let j in track.ar) {
                        artistsName += track.ar[j].name + " / ";
                    }
                    cbData.tracks.push({ name: track.name, id: track.id, duration: track.dt, artists: artistsName.substring(0, artistsName.length - 3), picUrl: track.al.picUrl });
                }
                console.log(cbData);
                res.json(cbData);
            });
        }).on("error", function (err) {
            console.log("服务器异常！", err.stack);
        });
```
```JavaScript
http.get(`http://localhost:3000/music/url?id=${postData.id}`, function (_res) {
            var _data = "";
            _res.on('data', function (chunk) {
                _data += chunk;
            });
            _res.on("end", function(){
                if (!_data) {
                    console.log("服务器异常！");
                }
                let data = JSON.parse(_data);
                let cbData = {};
                cbData.code = data.code;
                cbData.id = data.data[0].id;
                cbData.url = data.data[0].url;
                cbData.br = data.data[0].br;
                cbData.size = data.data[0].size;
                cbData.md5 = data.data[0].md5;
                cbData.type = data.data[0].type;
                console.log(cbData);
                res.json(cbData);
            });
        }).on("error", function (err) {
            console.log("服务器异常！", err.stack);
        });
```
http://localhost:3000/lyric 保持数据与官方一致

### 安装
> npm i vue-neteasemusic-outchain

### 相关参数
> playlist ID (Type:Number)：必须填入<br>
> options (Type:Object)：相关设置<br>
>> hideGit (Type:Boolean): 是否隐藏播放器内github的链接标志<br>
>> lazyLoad (Type:Boolean)：懒加载（初始传入变量参数为false，当需要马上加载时传入变量改为true。注意：此设置会造成autoplay功能无法按预期执行）<br>
>> autoplay (Type:Boolean)：自动播放（true即为自动播放）<br>
>> redirect (Type:Object)：修改获取参数的链接<br>
>>> method (Type:String): 请求方式，只能是"POST"或"GET"<br>
>>> playListUrl (Type:String)：修改获取播放列表的链接<br>
>>> musicUrl (Type:String)：修改获取歌曲文件的链接<br>
>>> musicLyricUrl (Type:String)：修改获取歌词的链接<br>


### 使用演示
#### 全局使用
```JavaScript
import neteaseOutchain from 'vue-netease-outchain'
Vue.use(neteaseOutchain);    
```
#### 组件使用方式
```JavaScript
import neteaseOutchain from 'vue-netease-outchain'
 export default {
        name: 'app',
        components: {
            neteaseOutchain
        },
        data(){
            return {
                playlist: 614245400,
                showMusicPanel: false,
                options: {
                    lazyLoad: true,
                    autoplay: false,
                    redirect: {
                        method: "POST",
                        playListUrl: "/api/musicPlayList",
                        musicUrl: "/api/musicUrl",
                        musicLyricUrl: "/api/musicLyric"
                    }
                }
            }
        },
        methods:{
            isShowMusicPanel(){
                this.showMusicPanel = (this.showMusicPanel)? false : true;
                this.options.lazyLoad = false;
            }
        }
    }
    
```
```HTML
<div class="player-box" v-show="showMusicPanel"><netease-outchain :playlist="playlist" :options="options"></netease-outchain></div>
<button @click="isShowMusicPanel">加载播放器</button>
```
