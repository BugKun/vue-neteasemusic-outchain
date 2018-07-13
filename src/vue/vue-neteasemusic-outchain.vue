<template src="./template.html"></template>

<script>
    import ncList from './components/nc-list.vue'

    export default {
        name: 'neteasemusic-outchain',
        components:{
            ncList
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
    }
</script>

<style lang="scss" scoped src="./style.scss"></style>
<style>
    @keyframes NeteaseMusicOutchain-rotateAround
    {
        0%{
            transform:rotate(0deg);
        }
        to{
            transform:rotate(1turn);
        }
    }
</style>
