<script>
    import { getOffset } from 'Utils';

    export default {
        name: 'VolumeControl',
        props: {
            audio:{
                validator(value) {
                    return value instanceof Audio
                },
                required: true
            },
            defaultVolume:{
                type: Number,
                default: 0.5
            }
        },
        data() {
            return {
                loaded: false,
                isDrag: false,
                icons: {
                    pointer: require('Icons/pointer.svg'),
                    volume: require('Icons/volume.svg'),
                    mute: require('Icons/mute.svg')
                },
                active: false,
                volume: 0,
                pointer: ""
            }
        },
        watch:{
            active(curVal){
                if(!this.loaded && curVal){
                    this.$nextTick(this.init);
                }
            }
        },
        mounted(){
            this.audio.volume = this.volume = this.defaultVolume;
            if(this.active) this.init();
        },
        methods:{
            init(){
                this.changeVolume(this.defaultVolume);
                this.loaded = true;
            },
            changeVolume(val){
                this.volume = val;
                this.audio.volume = val;
                const volumeBar = this.$refs.volumeBar,
                    volumeBarHeight = volumeBar.offsetHeight;
                this.pointer =  `transform: translate3d(-50%, -${volumeBarHeight * this.volume}px, 0)`;
            },
            volumePointerDown(e) {
                this.isDrag = true;
                const volumeBarContainer = this.$refs.volumeBarContainer,
                    volumeBarContainerHeight = volumeBarContainer.offsetHeight,
                    volume = (getOffset(volumeBarContainer).top - e.clientY + volumeBarContainerHeight) / volumeBarContainerHeight;
                if (volume > 1) {
                    this.changeVolume(1);
                } else if (volume < 0) {
                    this.changeVolume(0);
                } else {
                    this.changeVolume(volume);
                }
            },
            volumePointerTouchDown(e) {
                this.volumePointerDown(e.changedTouches[0]);
            },
            volumePointerMove(e) {
                if (!this.isDrag) return;
                const volumeBarContainer = this.$refs.volumeBarContainer;
                if(!volumeBarContainer) return;
                const volumeBarContainerHeight = volumeBarContainer.offsetHeight,
                    volume = (getOffset(volumeBarContainer).top - e.clientY + volumeBarContainerHeight) / volumeBarContainerHeight;
                if (volume > 1) {
                    this.changeVolume(1);
                } else if (volume < 0) {
                    this.changeVolume(0);
                } else {
                    this.changeVolume(volume);
                }
            },
            volumePointerUp(e) {
                if (!this.isDrag) return;
                this.isDrag = false;
                const volumeBarContainer = this.$refs.volumeBarContainer;
                if(!volumeBarContainer) return;
                const volumeBarContainerHeight = volumeBarContainer.offsetHeight,
                    volume = (getOffset(volumeBarContainer).top - e.clientY + volumeBarContainerHeight) / volumeBarContainerHeight;
                if (volume > 1) {
                    this.changeVolume(1);
                } else if (volume < 0) {
                    this.changeVolume(0);
                } else {
                    this.changeVolume(volume);
                }
            }
        }
    }
</script>

<template src="./template.html"/>
<style lang="less" scoped src="./style.less" />
