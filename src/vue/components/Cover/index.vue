<script>
    export default {
        name: "Cover",
        props:{
            src:{
                type: String,
                default: ""
            },
            trackID:{
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
                if(this.trackID === 0){
                    return `//music.163.com/playlist?id=${this.playListID}`
                }else{
                    return `//music.163.com/song?id=${this.trackID}`;
                }
            },
            title(){
                return `查看歌${(this.trackID === 0)? "单" : "曲"}详细信息`;
            }
        }
    }
</script>

<template src="./template.html"/>
<style lang="less" scoped src="./style.less" />
