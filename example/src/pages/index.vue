<template src="./template.html" />
<style src="./index.css" />
<script>
    import VueNeteaseMusicOutchain from 'vue-neteasemusic-outchain';

    export default {
        name: "example",
        components: {
            NeteaseMusicOutchain: VueNeteaseMusicOutchain
        },
        data() {
            return {
                lazyLoad: false,
                autoPlay: false,
                hideGit: false,
                redirect: {
                    method: "GET"
                },
                playlist: 614245400,
                playlistInput: 614245400,
                maxHeight: 0,
                maxWidth: 0
            }
        },
        mounted() {
            this.playerResize();
            window.addEventListener("resize", this.playerResize);
        },
        beforeDestroy() {
            window.removeEventListener("resize", this.playerResize);
        },
        methods: {
            setPlaylist() {
                this.playlist = this.playlistInput;
            },
            playerResize() {
                this.maxHeight = window.innerHeight / 2;
                this.maxWidth = (window.innerWidth < 1000) ? window.innerWidth : 1000;
            }
        }
    }
</script>

