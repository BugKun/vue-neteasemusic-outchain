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
                pointerStyle: "",
                pointerIcon: require('libs/icons/pointer.svg'),
                audioBuffered: 0,
                currentTime: 0
            }
        },
        computed:{
            bufferedStyle(){
                return `transform: translate3d(-${( 1 - this.audioBuffered / this.duration ) * 100}%, 0, 0)`
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
                    const bar = this.$refs.bar,
                        barWidth = bar.offsetWidth;
                    this.barPlayed = `transform: translate3d(-${( 1 - this.audio.currentTime / this.duration ) * 100}%, 0, 0)`;
                    this.pointerStyle = `transform: translate3d(${this.audio.currentTime / this.duration * barWidth}px, -50%, 0)`;
                }
            },
            progressPointerDown(e) {
                if (!this.audio) return;
                const bar = this.$refs.bar,
                    barWidth = bar.offsetWidth;
                this.isDrag = true;
                if (this.audio && this.audio.src !== ""){
                    this.barPlayed = `transform: translate3d(${e.clientX - getOffset(bar).left - barWidth}px, 0, 0)`;
                    this.pointerStyle = `transform: translate3d(${e.clientX - getOffset(bar).left}px, -50%, 0)`;
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
                    this.barPlayed = `transform: translate3d(${position  - barWidth}px, 0, 0)`;
                    this.pointerStyle = `transform: translate3d(${position}px, -50%, 0)`;
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
