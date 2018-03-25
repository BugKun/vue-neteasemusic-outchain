# Vue-Netease-outchain
A outchain player for NeteaseCloudMusic( 网易云音乐外链播放器 ).

## 注意
* 此外链播放器需要服务器配合解析网易云音乐API才能正常使用。推荐使用：<a href="https://github.com/Binaryify/NeteaseCloudMusicApi" target="_blank">NeteaseCloudMusicApi</a><br>
* 此外你可能还需要简化获取到的接口信息，以减少不必要的流量和带宽消耗，并将接口设置为POST请求。
*默认请求地址为：
```JavaScript
{
      playListUrl: "/api/musicPlayList",
      musicUrl: "/api/musicUrl",
      musicLyricUrl: "/api/musicLyric"
}
```
你需要修改获取到的官方返回的数据：
```JavaScript
request.get('http://localhost:3000/playlist/detail')
            .query({id: postData.id})
            .on('error', function (err) {
                if (err) {
                    console.log("服务器异常！", err);
                    return false;
                }
            })
            .then(function (_res) {
                let data = JSON.parse(_res.text);
                if(data.code != 200){
                    res.json(data);
                    return;
                }
                let cbData = {};
                cbData.code = data.code;
                cbData.coverImgUrl = data.result.coverImgUrl;
                cbData.name = data.result.name;
                cbData.tracks = [];
                for(let i in data.result.tracks){
                    let track = data.result.tracks[i];
                    let artistsName = "";
                    for(let j in track.artists){
                        artistsName += track.artists[j].name + " / ";
                    }
                    cbData.tracks.push({name: track.name, id: track.id, duration: track.duration, artists: artistsName.substring(0,artistsName.length - 3), picUrl: track.album.picUrl});
                }
                console.log(cbData);
                res.json(cbData);
            });
```
```JavaScript
request.get('http://localhost:3000/music/url')
            .query({id: postData.id})
            .on('error', function (err) {
                if (err) {
                    console.log("服务器异常！", err);
                    return false;
                }
            })
            .then(function (_res) {
                let data = JSON.parse(_res.text);
                if(data.code != 200){
                    res.json(data);
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
                res.json(cbData);
            });
```
http://localhost:3000/lyric 保持数据与官方一致

### 安装
> npm i vue-netease-outchain

### 相关参数
> playlist ID (Type:Number)： 必须填入<br>
> options (Type:Object) ：相关设置<br>
>> lazyLoad (Type:Boolean)：懒加载（初始传入变量参数为false，当需要马上加载时传入变量改为true。注意：此设置会造成autoplay功能无法按预期执行）<br>
>> autoplay (Type:Boolean)：自动播放（true即为自动播放）<br>
>> redirect (Type:Object)：修改获取参数的链接<br>
>>> playListUrl (Type:String)：修改获取播放列表的链接<br>
>>> musicUrl (Type:String)：修改获取歌曲文件的链接<br>
>>> musicLyricUrl (Type:String)：修改获取歌词的链接<br>


### 使用演示
```JavaScript
import neteaseOutchain from 'vue-netease-outchain'
 export default {
        name: 'app',
        components: {
            neteaseOutchain
        },
        data(){
            return {
                playlist: 48149387,
                showMusicPanel: false,
                options: {
                    lazyLoad: true,
                    autoplay: false,
                    redirect:{
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
<button @click="">加载播放器</button>
```
