<script>
    import { getOffset, fixLength } from 'Utils';


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
                pointerIcon: require('Icons/pointer.svg'),
                audioBuffered: 0,
                currentTime: 0
            }
        },
        computed:{
            bufferedStyle(){
                return `width: ${(this.audioBuffered / this.duration) * 100}%`
            },
            dragClass(){
                return (this.isDrag)? "drag" : null;
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
                if (!this.isDrag) {
                    this.barPlayed = `width: ${(this.audio.currentTime / this.duration) * 100}%`;
                }
            },
            progressPointerDown(e) {
                if (!this.audio) return;
                const bar = this.$refs.bar,
                    barWidth = bar.offsetWidth;
                this.isDrag = true;
                if (this.audio && this.audio.src !== ""){
                    this.barPlayed = `width: ${(e.clientX - getOffset(bar).left - barWidth) / barWidth * 100}%`;
                }
            },
            progressPointerTouchDown(e){
                this.progressPointerDown(e.changedTouches[0]);
            },
            changePointerPosition(e){
                const bar = this.$refs.bar,
                    barWidth = bar.offsetWidth;

                let position = e.clientX - getOffset(bar).left;

                if (position < 0) {
                    position = 0;
                } else if (position > barWidth) {
                    position = barWidth;
                }

                if (this.audio.src !== "" && this.isDrag){
                    this.barPlayed = `width: ${position / barWidth * 100}%`;
                }

                return { position, barWidth };
            },
            progressPointerMove(e) {
                if (!this.isDrag) return;
                this.changePointerPosition(e);
            },
            progressPointerUp(e) {
                if (!this.isDrag) return;
                const { position, barWidth } = this.changePointerPosition(e);
                this.isDrag = false;
                if (this.audio && this.audio.src !== ""){
                    const currentTime = position / barWidth * this.duration;
                    this.audio.currentTime = currentTime;
                }
            }
        }
    }
</script>

<template src="./template.html"/>
<style lang="less" scoped src="./style.less" />
