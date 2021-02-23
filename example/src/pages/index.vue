<script>
    import VueNeteaseMusicOutchain from 'vue-neteasemusic-outchain'
    import request from 'reqwest'
    import './polyfill'

    const defaultPlaylist = 614245400
    const defaultNeteaseCloudMusicApi = 'http://127.0.0.1:3000'


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
                compKey: Date.now(),
                API: {
                    getPlayList: (params, cb) => {
                        if(this.dataSource == '0') {
                            require.ensure([], function(require) {
                                var mockData = require('./mockData');
                                cb(null, mockData.playlist)
                            });
                        } else {
                            request({
                                url: `${this.NeteaseCloudMusicApi}/playlist/detail?id=${params.id}`,
                                method: 'get',
                                crossOrigin: true,
                                error: (err) => {
                                    this.showAlert('playlist', err)
                                },
                                success: (data) => {
                                    cb(null, {
                                        code: data.code,
                                        coverImgUrl: this.fixURL(data.playlist.coverImgUrl),
                                        name: data.playlist.name,
                                        tracks: data.playlist.tracks.map(track => {
                                            const picUrl = track.al.picUrl;
                                            return {
                                                name: track.name,
                                                id: track.id,
                                                duration: track.dt,
                                                artists: track.ar.map(item => item.name).join(" / "),
                                                picUrl: this.fixURL(picUrl),
                                                pop: track.pop
                                            };
                                        })
                                    })
                                }
                            });
                        }
                    },
                    getMusicURL: (params, cb) => {
                        if(this.dataSource == '0') {
                            require.ensure([], function(require) {
                                var mockData = require('./mockData');
                                cb(null, mockData.musicURL.find(item => item.id == params.id))
                            });
                        } else {
                            request({
                                url: `${this.NeteaseCloudMusicApi}/song/url?id=${params.id}`,
                                method: 'get',
                                crossOrigin: true,
                                error: (err) => {
                                    this.showAlert('music url', err)
                                },
                                success: (data) => {
                                    const musicUrl = data.data[0].url;
                                    cb(null, {
                                        code: data.code,
                                        ...data.data[0],
                                        url: this.fixURL(musicUrl)
                                    });
                                }
                            });
                        }
                    },
                    getLyric: (params, cb) => {
                        if(this.dataSource == '0') {
                            require.ensure([], function(require) {
                                var mockData = require('./mockData');
                                cb(null, mockData.lyric.find(item => item.id == params.id))
                            });
                        } else {
                            request({
                                url: `${this.NeteaseCloudMusicApi}/lyric/url?id=${params.id}`,
                                method: 'get',
                                crossOrigin: true,
                                error: (err) => {
                                    this.showAlert('lyric', err)
                                },
                                success: (data) => {
                                    cb(null, {
                                        ...data
                                    });
                                }
                            })
                        }
                    }
                },
                playlistInput: defaultPlaylist,
                playlist: defaultPlaylist,
                dataSourceInput: '0',
                dataSource: '0',
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
                this.dataSource = this.dataSourceInput;
                this.compKey = Date.now();
            },
            playerResize() {
                this.maxHeight = window.innerHeight / 2;
                this.maxWidth = (window.innerWidth < 1000) ? window.innerWidth : 1000;
            },
            showAlert(target, err) {
                console.log(err)
                alert(`请求${target}失败，请检查本地是否启动NeteaseCloudMusicApi或服务地址配置是否正确！`)
            },
            fixURL(url) {
                return (url)? url.replace(/(http|https):\/\//, "//") : url
            }
        }
    }
</script>

<template src="./template.html" />
<style src="./index.css" />
