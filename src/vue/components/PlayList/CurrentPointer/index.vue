<script>
    import { isNumber } from 'Utils';

    export default {
        name: "CurrentPointer",
        props: {
            playingIndex:{
                type: Number,
                default: -1
            }
        },
        computed:{
            CurrentPosition(){
                const playingIndex = this.playingIndex;
                const style = `transform: translate3d(0, ${ isNumber(playingIndex)? 30 * playingIndex : -30 }px, 0)`;
                return style;
            },
            isShow(){
                return (isNumber(this.playingIndex) && this.playingIndex > -1)? 'show' : null;
            }
        }
    }
</script>

<template src="./template.html"/>
<style lang="less" scoped src="./style.less" />
