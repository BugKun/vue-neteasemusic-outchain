<template src="./template.html"/>
<style lang="scss" scoped src="./style.scss" />

<script>
    import { getOffset, fixLength } from 'libs/utils';

    export default {
        name: "Tracker",
        props:{
            audio:{
                validator(value) {
                    return value instanceof Audio
                },
                required: true
            },
            index:{
                type: Number,
                default: 0
            }
        },
        data() {
            return {
                isDrag: false,
                barPlayed: "",
                duration: 0,
                audioBuffered: 0,
            }
        },
        mounted(){
            console.log(this.audio)

        },
        methods:{
            setProcess() {
                let index = this.playingIndex;
                if (!Number.isInteger(index) || !this.musicInfo || !this.musicInfo.tracks[index]) return;
                let duration = this.musicInfo.tracks[index].duration / 1000;
                this.duration = duration;
                let range = duration - this.audio.currentTime;
                if (!this.isDrag) this.barPlayed = `width:${this.audio.currentTime / duration * 100}%`;
                let minute = Math.floor(range / 60),
                    second = range - minute * 60;
                this.process.time = `- ${ fixLength(minute, 2) }:${ fixLength(Math.floor(second), 2) }`;
            },
            progressPointerDown(e) {
                if (!this.audio) return;
                const barContainer = this.$refs.barContainer;
                this.isDrag = true;
                this.setProcess("paused");
                if (this.audio && this.audio.src !== "")
                    this.barPlayed = `width: ${e.clientX - getOffset(barContainer).left}px`;
            },
            progressPointerTouchDown(e){
                this.progressPointerDown(e.changedTouches[0]);
            },
            progressPointerMove(e) {
                if (!this.isDrag) return;
                const barContainer = this.$refs.barContainer,
                    barContainerWidth = barContainer.offsetWidth;
                let position = e.clientX - getOffset(barContainer).left;
                if (position < 0) {
                    position = 0;
                } else if (position > barContainerWidth) {
                    position = barContainerWidth;
                }
                if (this.audio && this.audio.src !== "" && this.isDrag)
                    this.barPlayed = `width: ${ position }px`;
            },
            progressPointerUp(e) {
                if (!this.isDrag) return;
                const barContainer = this.$refs.barContainer,
                    barContainerWidth = barContainer.offsetWidth;
                let position = e.clientX - getOffset(barContainer).left;
                if (position < 0) {
                    position = 0;
                } else if (position > barContainerWidth) {
                    position = barContainerWidth;
                }
                if (this.audio && this.audio.src !== "" && this.isDrag)
                    this.barPlayed = `width: ${ position }px`;
                this.isDrag = false;
                if (this.audio && this.audio.src !== ""){
                    const currentTime = position / barContainerWidth * this.duration;
                    this.audio.currentTime = currentTime;
                }
                this.setProcess("init");
            },
        }
    }
</script>
