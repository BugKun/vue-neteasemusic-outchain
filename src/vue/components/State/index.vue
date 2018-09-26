<template src="./template.html"/>
<style lang="scss" scoped src="./style.scss" />


<script>
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
                loadingIcon: require('!url-loader?limit=999999!libs/icons/loading.gif'),
                played: false
            }
        },
        computed:{
            playListHref(){
                return `//music.163.com/playlist?id=${this.playList}`
            },
            logoStyle(){
                return this.played? 'animation: NeteaseMusicOutchain-rotateAround 6s infinite linear;' : null
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

<style>
    @keyframes NeteaseMusicOutchain-rotateAround
    {
        0%{
            transform: rotate(0deg) translateZ(0);
        }
        to{
            transform: rotate(1turn) translateZ(0);
        }
    }
</style>

