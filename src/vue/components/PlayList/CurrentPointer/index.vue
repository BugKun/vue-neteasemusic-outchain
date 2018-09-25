<template src="./template.html"/>
<style lang="scss" scoped src="./style.scss" />

<script>
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
                const style = `transform: translate3d(0, ${ (typeof playingIndex === "number")? 30 * playingIndex : -30 }px, 0)`;
                return style;
            }
        }
    }
</script>
