<template src="./template.html" />
<style lang="scss" scoped src="./style.scss" />

<script>
    import { fixLength } from 'libs/utils';

    export default {
        name: "RemainingTime",
        props:{
            audio:{
                validator(value) {
                    return value instanceof Audio
                },
                required: true
            },
            duration:{
                type: Number,
                default: 0
            }
        },
        data(){
            return {
                remainingTime: "- 00:00"
            }
        },
        mounted(){
            this.audio.addEventListener("timeupdate", this.ontimeupdate);
        },
        beforeDestroy(){
            this.audio.removeEventListener("timeupdate", this.ontimeupdate);
        },
        methods:{
            ontimeupdate(){
                const duration = this.duration,
                    range = duration - this.audio.currentTime,
                    minute = Math.floor(range / 60),
                    second = range - minute * 60;

                this.remainingTime = `- ${ fixLength(minute, 2) }:${ fixLength(Math.floor(second), 2) }`
            }
        }
    }
</script>
