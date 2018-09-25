<template src="./template.html"></template>

<script>
    import PlayList from './components/PlayList/index.vue';
    import Lyrics from './components/Lyrics/index.vue';
    import VolumeControl from './components/VolumeControl/index.vue';
    import Tracker from './components/Tracker/index.vue';

    export default {
        name: 'neteasemusic-outchain',
        components:{
            VolumeControl,
            PlayList,
            Lyrics,
            Tracker
        },
        props: {
            playlist: {
                type: Number,
                required: true
            },
            options: {
                type: Object,
                default: () => []
            }
        },
        mounted: require("./mounted"),
        beforeDestroy: require("./beforeDestroy"),
        data: require("./data"),
        computed: require("./computed"),
        watch: require("./watch"),
        methods: require("./methods")
    };
</script>

<style lang="scss" scoped src="./style.scss"></style>
<style>
    @keyframes NeteaseMusicOutchain-rotateAround
    {
        0%{
            transform: rotate(0deg) translateZ(0);
        }
        to{
            transform: rotate(1turn) translateZ(0);
        }
    }
</style>
