<template src="./template.html"/>
<style lang="scss" scoped src="./style.scss" />

<script>
    import VolumeControl from '../VolumeControl/index.vue';
    import Tracker from '..//Tracker/index.vue';
    import Cover from '..//Cover/index.vue';
    import RemainingTime from '../RemainingTime/index.vue';
    import State from '../State/index.vue';

    import { isNumber } from 'libs/utils';

    export default {
        name: "Player",
        components:{
            VolumeControl,
            Tracker,
            Cover,
            RemainingTime,
            State
        },
        props: {
            playingIndex:{
                type: Number,
                default: -1
            }
        },
        data(){
            return {

            }
        },
        computed:{

        },
        methods:{

        }
    }
</script>
