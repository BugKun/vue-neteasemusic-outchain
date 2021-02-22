# Vue-Netease-outchain
A outchain player for NeteaseCloudMusic on Vue. ( Vue上的网易云音乐外链播放器 )

## 预览
![preview1](https://raw.githubusercontent.com/BugKun/vue-neteasemusic-outchain/master/preview1.png)
![preview2](https://raw.githubusercontent.com/BugKun/vue-neteasemusic-outchain/master/preview2.png)

## 演示
<a href="https://nopast.gitee.io/demo-page/neteasemusic-player" target="_blank">Demo</a>

## 更新日志
**请注意3.0版本参数发生改变，请注意修改！**
<br/> 
<a href="//github.com/BugKun/vue-neteasemusic-outchain/blob/master/UPDATE.md" target="_blank">点击查看更新日志</a>

## 注意
* 正式版已发布(要求：Vue 2.1.8+)，组件已基本稳定。以后不再做功能更新，仅进行功能维护。
* 修BUG时，忍不住加了一个功能，如要使用1.0.5+的版本，对应的服务器要增加热度(pop)参数的传递，参考代码可以看下面的例子或查看实例的源码。
* 由于使用了弹性盒子布局，兼容性为IE10+。
* 此外链播放器需要服务器配合解析网易云音乐API才能正常使用。推荐使用：<a href="https://github.com/Binaryify/NeteaseCloudMusicApi" target="_blank">NeteaseCloudMusicApi</a><br>


你需要自行请求接口，并转换数据到下列样例的格式：
歌单信息转换后数据样例：
```json
{
    "code": 200,
    "coverImgUrl": "http://p2.music.126.net/zEnklGFAPEW_YXWaD_3MlQ==/18778559092618066.jpg",
    "name": "粤语流行",
    "tracks": [
        {
            "name": "天空之城",
            "id": 461519950,
            "duration": 259687,
            "artists": "Dough-Boy / 侧田",
            "picUrl": "//p4.music.126.net/zEnklGFAPEW_YXWaD_3MlQ==/18778559092618066.jpg",
            "pop": 90
        }
    ]
}
```
歌曲URL转换后数据样例：
```json
{
    "code": 200,
    "id": 461519950,
    "url": "//m8.music.126.net/20210222225630/e8c79332d0c52c82baa92d0658b31b7e/ymusic/b702/c5e6/31e2/16af4862b08bce265eb2a853ca21c43a.mp3",
    "br": 128000,
    "size": 4156230,
    "md5": "16af4862b08bce265eb2a853ca21c43a",
    "expi": 1200,
    "type": "mp3",
    "gain": 0,
    "fee": 8,
    "uf": null,
    "payed": 0,
    "flag": 256,
    "canExtend": false,
    "freeTrialInfo": null,
    "level": "standard",
    "encodeType": "mp3",
    "urlSource": 0
}
```
歌词转换后数据样例：
```json
{
    "sgc": false,
    "sfy": false,
    "qfy": false,
    "lrc": {
        "version": 23,
        "lyric": "[00:00.000] 作词 : Dough Boy/侧田/Geniuz F\n[00:00.158] 作曲 : Dough Boy/侧田\n[00:00.316]天空之城\n[00:01.430]盈藏在我的心\n[00:04.320]\n[00:05.610]站在那风之谷却没余韵\n[00:10.610]\n[00:11.710]天空之城才存着我的根\n[00:16.170]\n[00:17.700]到这里有人护荫\n[00:21.090]\n[00:23.900]即使几多次难过\n[00:26.980]此刻的心已再\n[00:29.860]不管几多的风雨信念也不改\n[00:35.010]\n[00:35.860]即使几多次难过\n[00:38.810]此刻的心已再\n[00:41.280]\n[00:41.830]不惜将它一一记载\n[00:45.610]\n[00:47.670]When I was young I saw the city through the TV screen\n[00:50.790]I didn't know what identity really means\n[00:53.480]The first time I came back the sky was so hazy\n[00:56.540]Jumped on the double decker bus with no AC\n[00:59.360]This the home of Kung fu flicks hometown of Bruce Lee\n[01:02.460]I'm walking through the streets that I saw in the movies\n[01:05.840]Finally united with the family\n[01:08.360]Took a lot of practicing to brush up my Cantonese\n[01:11.600]Looking out the window from my room I see a jungle\n[01:14.400]That's made of concrete so many stories left untold\n[01:17.420]You taught me to survive and u showed me love\n[01:20.630]Even though it's rocky like a ride on a mini bus\n[01:24.000]天空之城\n[01:25.390]盈藏在我的心\n[01:28.280]\n[01:29.970]站在那风之谷却没如搵\n[01:34.260]\n[01:35.650]天空之城才存着我的根\n[01:40.920]\n[01:41.970]到这里有人护荫\n[01:45.130]\n[01:47.130]即使几多次难过\n[01:50.880]此刻的心已再\n[01:53.180]\n[01:53.800]不管几多的风雨信念也不改\n[01:58.930]\n[01:59.830]即使几多次难过\n[02:02.820]此刻的心已再\n[02:05.260]\n[02:05.780]不惜将它一一记载\n[02:09.550]\n[02:11.770]A lot has changed since day of my arrival\n[02:14.290]It's hard to sail smooth when the currents turning tidal\n[02:17.160]I got my headphones on the train if the ride is too long\n[02:20.580]On my way to the studio up in kwun tong\n[02:23.470]Who gonna get what they want in the long shot\n[02:26.420]Sometimes it feels like the whole world's out in Mongkok\n[02:29.500]Everyone's got their dreams and ideal lives\n[02:32.460]We adapt to harsh times I just hope you realize\n[02:35.470]Looking out the window from my room I see a jungle\n[02:38.460]That's made of concrete so many stories left untold\n[02:41.550]Just wanna make music that the girls and the boys like\n[02:44.510]U know its made in Hong Kong when u hear a voice like\n[02:48.300]\n[02:49.110]一生不变改\n[02:51.150]\n[02:55.080]只因已存在热爱\n[02:59.620]\n[03:01.200]天空的国土在脑海\n[03:05.290]\n[03:05.800]即使几多次难过\n[03:08.860]此刻的心已再\n[03:11.260]\n[03:11.850]不管几多的风雨信念也不改\n[03:16.670]You know I never change\n[03:17.620]即使几多次难过\n[03:20.830]此刻的心已再\n[03:23.820]不惜将它一一记载\n[03:27.280]Good days never come, I still remember where I'm from\n[03:29.650]即使几多次难过\n[03:32.950]此刻的心已再\n[03:35.920]不管几多的风雨信念也不改\n[03:40.870]You know I never change\n[03:42.180]即使几多次难过\n[03:44.920]此刻的心已再\n[03:47.380]不惜将它一一记在\n[03:51.250]Good days never come, I still remember where I'm from\n[03:54.020]即使几多次难过\n[03:56.840]此刻的心已再\n[03:59.150]\n[03:59.720]不管几多的风雨信念也不改\n[04:05.090]\n[04:05.980]即使几多次难过\n[04:08.740]此刻的心已再\n[04:11.730]不惜将它一一记载\n[offset:300]"
    },
    "code": 200
}
```

### 安装
```bash
npm i -D vue-neteasemusic-outchain
```

### 相关参数
> playlist (Type:Number)：歌单ID，必须填入<br>
> maxWidth (Type:Number)：组件的最大宽度，必须填入<br>
> maxHeight (Type:Number)：组件的最大高度，必须填入<br>
> hideGit (Type:Boolean): 是否隐藏播放器内github的链接标志<br>
> lazyLoad (Type:Boolean)：懒加载（初始传入变量参数为false，当需要马上加载时传入变量改为true。注意：此设置会造成autoplay功能无法按预期执行）<br>
> autoPlay (Type:Boolean)：自动播放（true即为自动播放）<br>
> API (Type:Object)：获取网易云数据的API<br>
>> getPlayList (Type:Function<{id: string | number}, callback: Function<error, data>>)：获取播放列表的方法<br>
>> getMusicURL (Type:Function<{id: string | number}, callback: Function<error, data>>)：获取歌曲文件的方法<br>
>> getLyric (Type:Function<{id: string | number}, callback: Function<error, data>>)：获取歌词的方法<br>


### 使用演示
#### 浏览器直接引用
```JavaScript
Vue.use(window.VueNeteaseMusicOutchain);    
```
#### 全局使用
```JavaScript
import neteaseOutchain from 'vue-netease-outchain'
Vue.use(neteaseOutchain);    
```
* 其余部分与组件使用方式类似。
#### 组件使用方式
<a href="//github.com/BugKun/vue-neteasemusic-outchain/blob/master/example/src/pages/index.vue" target="_blank">点击查看实例</a>
