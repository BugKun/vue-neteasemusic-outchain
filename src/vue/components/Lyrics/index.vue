<template src="./template.html"/>
<style lang="scss" scoped src="./style.scss" />


<script>
    import { Lyrics, $ajax } from 'libs/services';

    export default {
        name: 'Lyrics',
        props: {
            showLyrics: {
                type: Boolean,
                default: true
            },
            id: {
                type: Number,
                default: 0
            },
            currentTime:{
                type: Number,
                default: 0
            },
            redirect:{
                type: Object,
                required: true
            }
        },
        data() {
            return {
                isLoad: false,
                isReverse: false,
                isUpdate: false,
                lrc: {
                    func: null,
                    text: [],
                    active: -1
                },
                tlyric: {
                    func: null,
                },
                lyricsCache: {},
                lyricsCurrentTime: 0,
            }
        },
        mounted() {
            this.init(this.id);
        },
        watch:{
            id(curVal){
                this.isLoad = false;
                this.init(curVal);
            },
            currentTime(curVal){
                if(!this.showLyrics || !this.isLoad) return;

                const oldVal = this.lyricsCurrentTime;

                if(curVal < oldVal){
                    this.isReverse = true;
                    this.isUpdate = true;
                }else{
                    this.isUpdate = false;
                }
                this.lyricsCurrentTime = curVal;
                this.loadLyric(curVal);
            },
            showLyrics(curVal) {
                if (curVal) this.init(this.id);
            }
        },
        methods:{
            init(val){
                if(!this.showLyrics || this.isLoad) return;
                this.removeAllLyric();
                if(val > 0) {
                    this.setLyric(val);
                    this.isLoad = true;
                }
            },
            getLyric(id, cb) {
                $ajax(this.redirect.method, this.redirect.musicLyricUrl)
                    .send({ id })
                    .end(res => {
                        if (res.code !== 200) {
                            console.log(res);
                            return;
                        }
                        cb(res);
                    })
                    .catch(error => {
                        console.log("Oops, error", error);
                    })
            },
            setLyric(id) {
                if (this.lyricsCache[id]) {
                    let data = this.lyricsCache[id];
                    this.initLyric(data);
                } else {
                    this.getLyric(id, (data) => {
                        if (!data.lrc) {
                            // 没歌词
                            data.lrc = {};
                            if (data.sgc) {
                                data.lrc.lyric = "[00:00.00]还没有歌词哦~";
                            } else if (data.nolyric) {
                                // 纯音乐
                                data.lrc.lyric = "[00:00.00]纯音乐，请您欣赏";
                            }
                        } else {
                            data.lrc.lyric += "[offset:300]";
                        }
                        this.lyricsCache[id] = data;
                        this.initLyric(data);
                    });
                }
            },
            initLyric(data) {
                if (data.lrc && data.lrc.lyric) {
                    this.lrc.func = new Lyrics(data.lrc.lyric);
                    if (data.tlyric && data.tlyric.lyric) {
                        this.tlyric.func = new Lyrics(data.tlyric.lyric);
                        this.lrc.func.lrcMerge(this.tlyric.func.getLyrics(), 2); // 合并翻译歌词
                    }
                    const lyricsArr = this.lrc.func.getLyrics();
                    if(lyricsArr) this.lrc.text = lyricsArr.map(item => item.text);
                }
                this.isLoad = true;
            },
            removeAllLyric() {
                this.lrc.func = this.tlyric.func = null;
                this.isUpdate = this.isReverse = false;
                this.lrc.text = [];
                this.lrc.active = -1;
                this.lyricsCurrentTime = 0;
            },
            loadLyric(time) {
                if (!this.isLoad) return;
                if (this.lrc.text.length > 0) {
                    const isActive = this.lrc.func.select(time);
                    if (isActive !== this.lrc.active){
                        this.lrc.active = isActive;
                    }
                }
                if(this.isUpdate){
                    this.isUpdate = false;
                }else {
                    if(this.isReverse) this.isReverse = false;
                }
            }
        }
    }
</script>
