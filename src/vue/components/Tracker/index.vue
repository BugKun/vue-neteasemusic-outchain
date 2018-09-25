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
            },
            duration:{
                type: Number,
                default: 0
            }
        },
        data() {
            return {
                isDrag: false,
                barPlayed: "",
                audioBuffered: 0,
                currentTime: 0
            }
        },
        mounted(){
            this.audio.addEventListener("loadstart", this.onloadstart);
            this.audio.addEventListener("progress", this.onprogress);
            this.audio.addEventListener("timeupdate", this.ontimeupdate);
        },
        beforeDestroy(){
            this.audio.removeEventListener("loadstart", this.onloadstart);
            this.audio.removeEventListener("progress", this.onprogress);
            this.audio.addEventListener("timeupdate", this.ontimeupdate);
        },
        methods:{
            onloadstart(){
                this.audioBuffered = 0
            },
            onprogress(){
                if (this.audio.buffered.length > 0)
                    this.audioBuffered = this.audio.buffered.end(this.audio.buffered.length - 1);
            },
            ontimeupdate(){
                this.currentTime = this.audio.currentTime;
                this.setProcess();
            },
            setProcess() {
                if (!this.isDrag) this.barPlayed = `width:${this.audio.currentTime / this.duration * 100}%`;
            },
            progressPointerDown(e) {
                if (!this.audio) return;
                const barContainer = this.$refs.barContainer;
                this.isDrag = true;
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
            }
        }
    }
</script>
