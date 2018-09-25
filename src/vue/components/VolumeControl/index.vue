<template src="./template.html"/>
<style lang="scss" scoped src="./style.scss" />


<script>
    import { getOffset } from 'libs/utils';

    export default {
        name: 'VolumeControl',
        props: {
            value:{
                type: Number,
                default: .5
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
                volumeStatus: {
                    value: .5,
                },
                isIOS: /iPhone|iPad|iPod/.test(navigator.userAgent),
                $volume: .5
            }
        },
        mounted(){
            if(this.volume !== this.$volume) this.$volume = this.volume;
        },
        methods:{
            changeVolume(val){
                this.$emit('input', val);
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
