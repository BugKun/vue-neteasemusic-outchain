<template src="./template.html"></template>

<script>
    import lyrics from './lyrics.js'
    import ncList from './components/nc-list.vue'

    export default {
        name: 'neteasemusic-outchain',
        components:{
            ncList
        },
        props: {
            playlist: {
                type: Number,
                required: true
            },
            options: {
                type: Object,
                default: () => []
            }
        },
        mounted() {
            if(!this.options.lazyLoad) this.init();
            this.windowResize = () =>{
                this.windowHeight = window.innerHeight;
            };
            window.addEventListener("resize",this.windowResize);
        },
        beforeRouteLeave() {
            window.removeEventListener("resize",this.windowResize);
        },
        data() {
            return {
                redirect:{
                    method: "POST",
                    playListUrl: "/api/musicPlayList",
                    musicUrl: "/api/musicUrl",
                    musicLyricUrl: "/api/musicLyric"
                },
                isIE: /(MSIE)|(rv:11.0)/.test(navigator.userAgent),
                audio: null,
                musicInfo: {},
                musicUrl: {},
                copyright: "由于版权保护，您所在的地区暂时无法使用。",
                process:{
                    barPlayed: "",
                    time: "- 00:00"
                },
                paused: true,
                isListClosed: true,
                cover: null,
                playingIndex: null,
                isDrag: false,
                showLyrics: false,
                lyrics: {
                    isLoad: false,
                    lrcText: "",
                    tlyricText:""
                },
                listbox: null,
                windowHeight: window.innerHeight
            }
        },
        watch:{
            windowResize(){},
            showLyrics(curVal){
                if(curVal) {
                    this.setLyric(this.playingIndex);
                }else{
                    this.lyrics = {};
                    this.lyrics.text = "";
                }
            },
            options:{
                handler(curVal){
                    if(curVal.redirect) this.redirect = {...this.redirect, ...curVal.redirect};
                    if(!curVal.lazyLoad) this.init();
                },
                deep:true
            },
            playlist(){
                if(this.audio){
                    this.audio.src = "";
                    this.audio = null;
                }
                this.playingIndex = null;
                this.process = {
                    barPlayed: "",
                    time: "- 00:00"
                };
                this.paused = true;
                this.lyrics.lrcText = "";
                this.lyrics.tlyricText = "";
                this.getPlayList();
            }
        },
        computed:{
            openArea(){
                if(!this.listbox) return;
                let adapt = "";
                if(this.isListClosed){
                    if(this.showLyrics){
                        adapt = "height: calc(92px + 3em);min-height: calc(92px + 3em);";
                    }else{
                        adapt = "height: 92px; min-height: 92px;";
                    }
                }else{
                    if(this.musicInfo.tracks){
                        let listHeight = 94 + this.listbox.offsetHeight;
                        if(listHeight > (this.windowHeight / 2)){
                            listHeight = this.windowHeight / 2;
                        }
                        if(this.showLyrics){
                            adapt = `min-height: calc(122px + 3em);height: calc(${ listHeight }px + 3em);`;
                        }else{
                            adapt = `min-height: calc(122px + 3em);height: ${ listHeight }px;`;
                        }
                    }
                }
                adapt += `max-height: ${ this.windowHeight / 2 }px;`;
                if(this.isIE || this.isDrag) adapt += "user-select: none;-ms-user-select: none;";
                return adapt;
            },
            musicLink(){
                let link = null;
                if(Number.isInteger(this.playingIndex) && this.musicInfo && this.musicInfo.tracks && this.musicInfo.tracks[this.playingIndex]){
                    link = "//music.163.com/song?id=" + this.musicInfo.tracks[this.playingIndex].id;
                }
                return link;
            }
        },
        methods: {
            init(){
                if(this.options.redirect)  this.redirect = this.redirect = {...this.redirect, ...this.options.redirect};
                this.getPlayList(()=>{
                    if(this.options.autoplay){
                        this.play();
                    }
                });
            },
            fixLength(num, length) {
                return ('' + num).length < length ? ((new Array(length + 1)).join('0') + num).slice(-length) : '' + num;
            },
            getListBox(dom){
                this.listbox = dom;
            },
            ajax(type, url, data = null) {
                return new Promise(function(resolve, reject){
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
            },
            getPlayList(cb){
                this.ajax(this.redirect.method, this.redirect.playListUrl, {id: this.playlist})
                    .then(res => {
                        if(res.code !== 200){
                            console.log(res);
                            return;
                        }
                        this.musicInfo = res;
                        this.changeCover();
                        if(cb) cb();
                    })
                    .catch(error =>{
                        console.log("Oops, error", error);
                    })
            },
            getMusic(id,cb){
                this.ajax(this.redirect.method, this.redirect.musicUrl, {id})
                    .then(res => {
                        if(res.code !== 200){
                            console.log(res);
                            return;
                        }
                        cb(res);
                    })
                    .catch(error =>{
                        console.log("Oops, error", error);
                    })
            },
            playMusic(i){
                if(!this.musicInfo.tracks) return this.init();
                if(!this.audio){
                    this.audio = new Audio();
                    this.audio.onended = () => {
                        this.next();
                    };
                    this.audio.ontimeupdate = () => {
                        if(!this.audio || !this.audio.currentTime) return;
                        this.setProcess();
                        this.loadLyric(this.audio.currentTime);
                    };
                }
                const $continue = () => {
                    if(this.musicInfo.tracks[i].disabled) return this.next(i);
                    let $musicUrl = this.musicInfo.tracks[i].playUrl;
                    this.audio.src = ($musicUrl) ? $musicUrl.replace(/(http:\/\/)|(https:\/\/)/,"//") : $musicUrl;
                    this.audio.load();
                    this.audio.play();
                    this.isPaused();
                    this.playingIndex = (Number.isInteger(i))? i : null;
                    this.changeCover(i);
                };
                if(this.musicInfo.tracks[i].playUrl){
                    $continue();
                }else{
                    this.getMusic(this.musicInfo.tracks[i].id, (data) => {
                        this.musicUrl = data;
                        if(this.musicUrl.url) {
                            this.musicInfo.tracks[i].playUrl = this.musicUrl.url;
                        }else{
                            this.musicInfo.tracks[i].playUrl = "";
                            this.musicInfo.tracks[i].disabled = true;
                        }
                        if(this.musicUrl.br) this.musicInfo.tracks[i].quality = this.musicUrl.br;
                        $continue();
                    });
                }
                if(this.showLyrics) this.setLyric(i);
            },
            isPaused(){
                let status = true;
                if(!this.audio) {
                    status =  true;
                }else if(this.audio.paused){
                    // 暂停中
                    status =  true;
                }else {
                    // 播放中
                    status = false;
                }
                this.paused = status;
            },
            playingStatus(i){
                let style = (i === this.playingIndex)? 'background: #e9e9e9;' : '';
                if(this.musicInfo.tracks && this.musicInfo.tracks[i].disabled) style += "color: #bbb !important;";
                return style;
            },
            play(){
                if(!this.audio) {
                    this.playMusic(0);
                }else{
                    this.audio.play();
                }
            },
            next(i){
                if(Number.isInteger(i)) this.playingIndex = i;
                if(this.playingIndex === null) return;
                let next = this.playingIndex + 1;
                if((next + 1) > this.musicInfo.tracks.length) next = 0;
                this.playMusic(next);
                this.process.barPlayed = "";
                this.process.time = "- 00:00";
                if(this.showLyrics) this.setLyric(next);
            },
            prev(){
                if(this.playingIndex === null) return;
                let prev = this.playingIndex - 1;
                if(prev < 0) prev = this.musicInfo.tracks.length - 1;
                this.playMusic(prev);
                this.process.barPlayed = "";
                this.process.time = "- 00:00";
                if(this.showLyrics) this.setLyric(prev);
            },
            setProcess(){
                let index = this.playingIndex;
                if(!Number.isInteger(index) || !this.musicInfo || !this.musicInfo.tracks[index]) return;
                let duration = this.musicInfo.tracks[index].duration / 1000;
                this.process.duration = duration;
                let range = duration - this.audio.currentTime;
                if(!this.isDrag) this.process.barPlayed = `width:${this.audio.currentTime / duration * 100}%`;
                let minute = Math.floor(range / 60), second = range - minute * 60;
                this.process.time = `- ${ this.fixLength(minute, 2) }:${ this.fixLength(Math.floor(second), 2) }`;
            },
            changeCover(i){
                let url = (Number.isInteger(i))? this.musicInfo.tracks[i].picUrl : this.musicInfo.coverImgUrl;
                this.cover = (url) ? url.replace(/(http:\/\/)|(https:\/\/)/,"//") : url;
            },
            pointerDown(e){
                if(!this.audio) return;
                this.isDrag = true;
                this.setProcess("paused");
                this.process.barPlayed = `width: ${e.clientX - this.getOffset(this.$refs.pointerBar).left}px`;
            },
            pointerMove(e){
                if(!this.isDrag) return;
                let position = e.clientX - this.getOffset(this.$refs.pointerBar).left;
                if(position < 0){
                    position = 0;
                }else if(position > this.$refs.pointerBar.offsetWidth){
                    position = this.$refs.pointerBar.offsetWidth;
                }
                if(this.isDrag) this.process.barPlayed = `width: ${ position }px`;
            },
            pointerUp(e){
                if(!this.isDrag) return;
                let position = e.clientX - this.getOffset(this.$refs.pointerBar).left;
                if(position < 0){
                    position = 0;
                }else if(position > this.$refs.pointerBar.offsetWidth){
                    position = this.$refs.pointerBar.offsetWidth;
                }
                if(this.isDrag) this.process.barPlayed = `width: ${ position }px`;
                this.isDrag = false;
                if(this.audio) this.audio.currentTime = position / this.$refs.pointerBar.offsetWidth * this.process.duration;
                this.setProcess("init");
            },
            pointerTouchDown(e){
                this.pointerDown(e.changedTouches[0]);
            },
            pointerTouchMove(e){
                this.pointerMove(e.changedTouches[0]);
            },
            pointerTouchUp(e){
                this.pointerUp(e.changedTouches[0]);
            },
            getOffset(el) {
                let _x = 0, _y = 0;
                while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
                    _x += el.offsetLeft - el.scrollLeft;
                    _y += el.offsetTop - el.scrollTop;
                    el = el.offsetParent;
                }
                return { top: _y, left: _x };
            },
            setLyric(index){
                this.lyrics = {
                    isLoad: false,
                    lrcText: "",
                    tlyricText:""
                };
                if(!Number.isInteger(index) || !this.musicInfo || !this.musicInfo.tracks[index]) return;
                if(this.musicInfo.tracks[index].lyricData){
                    let data = this.musicInfo.tracks[index].lyricData;
                    if(data.lrc && data.lrc.lyric) this.lyrics.lrc = new lyrics(data.lrc.lyric);
                    if(data.tlyric && data.tlyric.lyric) this.lyrics.tlyric = new lyrics(data.tlyric.lyric);
                    this.lyrics.hasTranslate = false;
                    this.lyrics.type = 0;
                    this.lyrics.isLoad = true;
                }
                else{
                    let id = this.musicInfo.tracks[index].id;
                    this.getLyric(id,(data) => {
                        this.lyrics.id = id;
                        this.musicInfo.tracks[index].lyricData = data;
                        if(data.lrc.lyric) this.lyrics.lrc = new lyrics(data.lrc.lyric);
                        if(data.tlyric.lyric) this.lyrics.tlyric = new lyrics(data.tlyric.lyric);
                        this.lyrics.hasTranslate = false;
                        this.lyrics.type = 0;
                        this.lyrics.isLoad = true;
                    });
                }
            },
            getLyric(id,cb){
                this.ajax(this.redirect.method, this.redirect.musicLyricUrl, {id})
                    .then(res => {
                        if(res.code !== 200){
                            console.log(res);
                            return;
                        }
                        cb(res);
                    })
                    .catch(error =>{
                        console.log("Oops, error", error);
                    })
            },
            loadLyric(time){
                if(!this.lyrics.isLoad) return;
                if(this.lyrics.lrc){
                    let lrcIndex = this.lyrics.lrc.select(time);
                    this.lyrics.lrcText = (this.lyrics.lrc.getLyric(lrcIndex))? this.lyrics.lrc.getLyric(lrcIndex).text :  "";
                }
                if(this.lyrics.tlyric){
                    let tlyricIndex = this.lyrics.tlyric.select(time);
                    this.lyrics.tlyricText = (this.lyrics.tlyric.getLyric(tlyricIndex))? this.lyrics.tlyric.getLyric(tlyricIndex).text :  "";
                }
            },
        }
    }
</script>

<style lang="scss" scoped src="./style.scss"></style>
<style>
    @keyframes NeteaseMusicOutchain-rotateAround
    {
        0%{
            transform:rotate(0deg);
        }
        to{
            transform:rotate(1turn);
        }
    }
</style>
