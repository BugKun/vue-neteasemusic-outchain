<script>
    const UA = navigator.userAgent;

    export default {
        name: "State",
        props:{
            audio:{
                validator(value) {
                    return value instanceof Audio
                },
                required: true
            },
            playList: {
                type: Number,
                required: true
            },
            loading:{
                type: Boolean,
                default: true
            },
            playListName:{
                type: String,
                default: ""
            },
            trackName:{
                type: String,
                default: ""
            }
        },
        data(){
            return {
                neteaseMusicIcon: require('Icons/netease-cloud-music.svg'),
                loadingGifIcon: require('Icons/loading.gif'),
                loadingSVGIcon: require('Icons/loading.svg'),
                isIE: /(msie)|(rv:11.0)/i.test(UA) && !/opera/i.test(UA),
                played: false
            }
        },
        computed:{
            playListHref(){
                return `//music.163.com/playlist?id=${this.playList}`
            },
            logoStyle(){
                return this.played? 'animation: NMO-rotateAround 6s infinite linear;' : null
            }
        },
        mounted(){
            this.audio.addEventListener("pause", this.onPause);
            this.audio.addEventListener("play", this.onPlay);
        },
        beforeDestroy(){
            this.audio.removeEventListener("pause", this.onPause);
            this.audio.removeEventListener("play", this.onPlay);
        },
        methods:{
            onPause(){
                this.played = false;
            },
            onPlay(){
                this.played = true;
            }
        }
    }
</script>

<template src="./template.html"/>
<style src="./global.css" />
<style lang="less" scoped src="./style.less" />
