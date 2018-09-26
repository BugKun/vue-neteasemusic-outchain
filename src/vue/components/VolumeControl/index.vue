<template src="./template.html"/>
<style lang="scss" scoped src="./style.scss" />


<script>
    import { getOffset } from 'libs/utils';

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
                isDrag: false,
                icons: {
                    volume: require('libs/icons/volume.svg'),
                    mute: require('libs/icons/mute.svg')
                },
                active: false,
                volume: 0
            }
        },
        mounted(){
            this.changeVolume(this.defaultVolume);
        },
        methods:{
            changeVolume(val){
                this.volume = val;
                this.audio.volume = val;
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
