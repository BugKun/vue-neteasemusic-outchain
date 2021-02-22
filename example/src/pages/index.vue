<script>
    import VueNeteaseMusicOutchain from 'vue-neteasemusic-outchain'
    import request from 'reqwest'
    import './polyfill'

    const defaultPlaylist = 614245400
    const defaultNeteaseCloudMusicApi = 'http://127.0.0.1:3000'
    const initServerStatus = {
        color: 'inherit',
        text: '待检查'
    }


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
                serverStatus: {
                    ...initServerStatus
                },
                API: {
                    getPlayList: (params, cb) => {
                        request({
                            url: `${this.NeteaseCloudMusicApi}/playlist/detail?id=${params.id}`,
                            method: 'get',
                            crossOrigin: true,
                            error: (err) => {
                                this.setServer(err)
                                require.ensure([], function(require) {
                                    var mockData = require('./mockData');
                                    cb(null, mockData.playlist)
                                });
                            },
                            success: (data) => {
                                this.setServer()
                                console.log({
                                    code: data.code,
                                    coverImgUrl: data.playlist.coverImgUrl,
                                    name: data.playlist.name,
                                    tracks: data.playlist.tracks.map(track => {
                                        const picUrl = track.al.picUrl;
                                        return {
                                            name: track.name,
                                            id: track.id,
                                            duration: track.dt,
                                            artists: track.ar.map(item => item.name).join(" / "),
                                            picUrl: (picUrl)? picUrl.replace(/(http:\/\/)|(https:\/\/)/, "//") : picUrl,
                                            pop: track.pop
                                        };
                                    })
                                })
                                cb(null, {
                                    code: data.code,
                                    coverImgUrl: data.playlist.coverImgUrl,
                                    name: data.playlist.name,
                                    tracks: data.playlist.tracks.map(track => {
                                        const picUrl = track.al.picUrl;
                                        return {
                                            name: track.name,
                                            id: track.id,
                                            duration: track.dt,
                                            artists: track.ar.map(item => item.name).join(" / "),
                                            picUrl: (picUrl)? picUrl.replace(/(http:\/\/)|(https:\/\/)/, "//") : picUrl,
                                            pop: track.pop
                                        };
                                    })
                                })
                            }
                        })
                    },
                    getMusicURL: (params, cb) => {
                        request({
                            url: `${this.NeteaseCloudMusicApi}/song/url?id=${params.id}`,
                            method: 'get',
                            crossOrigin: true,
                            error: (err) => {
                                this.setServer(err)
                                require.ensure([], function(require) {
                                    var mockData = require('./mockData');
                                    cb(null, mockData.musicURL.find(item => item.id == params.id))
                                });
                            },
                            success: (data) => {
                                this.setServer()
                                const musicUrl = data.data[0].url;
                                console.log({
                                    code: data.code,
                                    ...data.data[0],
                                    url: (musicUrl)? musicUrl.replace(/(http:\/\/)|(https:\/\/)/, "//") : musicUrl
                                })
                                cb(null, {
                                    code: data.code,
                                    ...data.data[0],
                                    url: (musicUrl)? musicUrl.replace(/(http:\/\/)|(https:\/\/)/, "//") : musicUrl
                                })
                            }
                        })
                    },
                    getLyric: (params, cb) => {
                        request({
                            url: `${this.NeteaseCloudMusicApi}/Lyric/url?id=${params.id}`,
                            method: 'get',
                            crossOrigin: true,
                            error: (err) => {
                                this.setServer(err)
                                require.ensure([], function(require) {
                                    var mockData = require('./mockData');
                                    cb(null, mockData.lyric.find(item => item.id == params.id))
                                });
                            },
                            success: (data) => {
                                this.setServer()
                                cb(null, {
                                    ...data
                                })
                            }
                        })
                    }
                },
                playlist: defaultPlaylist,
                playlistInput: defaultPlaylist,
                NeteaseCloudMusicApiInput: defaultNeteaseCloudMusicApi,
                NeteaseCloudMusicApi: defaultNeteaseCloudMusicApi,
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
            setConfig() {
                this.playlist = this.playlistInput;
                this.NeteaseCloudMusicApi = this.NeteaseCloudMusicApiInput;
                this.serverStatus = {
                    ...initServerStatus
                }
            },
            playerResize() {
                this.maxHeight = window.innerHeight / 2;
                this.maxWidth = (window.innerWidth < 1000) ? window.innerWidth : 1000;
            },
            setServer(err) {
                if(err) {
                    console.log(err)
                    this.serverStatus.color = 'red'
                    this.serverStatus.text = '链接失败，使用MOCK数据'
                } else {
                    this.serverStatus.color = 'green'
                    this.serverStatus.text = '链接成功'
                }
            }
        }
    }
</script>

<template src="./template.html" />
<style src="./index.css" />
