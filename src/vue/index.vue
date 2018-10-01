<template src="./template.html" />
<style lang="scss" scoped src="./global.scss" />
<style lang="scss" scoped src="./style.scss" />

<script>
    import PlayList from './components/PlayList/index.vue';
    import Lyrics from './components/Lyrics/index.vue';
    import VolumeControl from './components/VolumeControl/index.vue';
    import Tracker from './components/Tracker/index.vue';
    import Cover from './components/Cover/index.vue';
    import RemainingTime from './components/RemainingTime/index.vue';
    import State from './components/State/index.vue';

    export default {
        name: 'NeteaseMusicOutchain',
        components:{
            VolumeControl,
            PlayList,
            Lyrics,
            Tracker,
            Cover,
            RemainingTime,
            State,
        },
        props: {
            playlist: {
                type: Number,
                required: true
            },
            maxWidth:{
                type: Number,
                required: true
            },
            maxHeight:{
                type: Number,
                required: true
            },
            redirect:{
                type: Object,
                default: () => {}
            },
            lazyLoad:{
                type: Boolean,
                default: false
            },
            autoPlay:{
                type: Boolean,
                default: false
            },
            hideGit:{
                type: Boolean,
                default: false
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
