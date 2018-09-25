<template src="./template.html"/>
<style lang="scss" scoped src="./style.scss" />

<script>
    export default {
        name: "Cover",
        props:{
            src:{
                type: String,
                default: ""
            },
            songID:{
                type:Number,
                default: 0
            },
            playListID:{
                type:Number,
                default: 0
            }
        },
        computed:{
            href(){
                if(this.songID === 0){
                    return `//music.163.com/playlist?id=${this.playListID}`
                }else{
                    return `//music.163.com/song?id=${this.songID}`;
                }
            },
            title(){
                return `查看歌${(this.songID === 0)? "单" : "曲"}详细信息`;
            }
        }
    }
</script>
