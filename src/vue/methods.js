import { fixLength, getOffset } from 'libs/utils'
import { $ajax, lyrics } from 'libs/services'

export default {
    init() {
        if (this.options.redirect) this.redirect = this.redirect = {...this.redirect, ...this.options.redirect };
        this.getPlayList(() => {
            if (this.options.autoplay) {
                this.play();
            }
        });
    },
    windowResize() {
        this.windowHeight = window.innerHeight;
    },
    getListBox(dom) {
        this.listBox = dom;
    },
    getPlayList(cb) {
        let data = { id: this.playlist },
            url = this.redirect.playListUrl;
        if (this.redirect.method.toUpperCase() === "GET") {
            data = null;
            url += `?id=${this.playlist}`
        }
        this.musicLoading = true;
        $ajax(this.redirect.method, url, data)
            .then(res => {
                if (res.code !== 200) {
                    console.log(res);
                    return;
                }
                this.musicLoading = false;
                this.musicInfo = res;
                this.changeCover();
                this.$nextTick(function() {
                    this.listBoxHeight = this.listBox.offsetHeight
                });
                if (cb) cb();
            })
            .catch(error => {
                console.log("Oops, error", error);
            })
    },
    getMusic(id, cb) {
        let data = { id },
            url = this.redirect.musicUrl;
        if (this.redirect.method.toUpperCase() === "GET") {
            data = null;
            url += `?id=${id}`
        }
        this.musicLoading = true;
        $ajax(this.redirect.method, url, data)
            .then(res => {
                if (res.code !== 200) {
                    console.log(res);
                    return;
                }
                this.musicLoading = false;
                cb(res);
            })
            .catch(error => {
                console.log("Oops, error", error);
            })
    },
    getLyric(id, cb) {
        let data = { id },
            url = this.redirect.musicLyricUrl;
        if (this.redirect.method.toUpperCase() === "GET") {
            data = null;
            url += `?id=${id}`
        }
        $ajax(this.redirect.method, url, data)
            .then(res => {
                if (res.code !== 200) {
                    console.log(res);
                    return;
                }
                cb(res);
            })
            .catch(error => {
                console.log("Oops, error", error);
            })
    },
    loadMusic(i, errorTime = null) {
        if (!this.musicInfo.tracks) return this.init();

        if (this.musicInfo.tracks[i].playUrl) {
            this.playMusic(i, errorTime);
        } else {
            this.getMusic(this.musicInfo.tracks[i].id, (data) => {
                this.musicUrl = data;
                if (this.musicUrl.url) {
                    this.musicInfo.tracks[i].playUrl = this.musicUrl.url;
                } else {
                    this.musicInfo.tracks[i].playUrl = "";
                    this.musicInfo.tracks[i].disabled = true;
                }
                if (this.musicUrl.br) this.musicInfo.tracks[i].quality = this.musicUrl.br;
                this.playMusic(i, errorTime);
            });
        }
        this.lyrics.isLoad = false;
        this.removeAllLyric();
        if (this.showLyrics) this.setLyric(i);
    },
    playMusic(i, errorTime) {
        if (this.musicInfo.tracks[i].disabled) return this.next(i);
        let $musicUrl = this.musicInfo.tracks[i].playUrl;
        this.audio.src = ($musicUrl) ? $musicUrl.replace(/(http:\/\/)|(https:\/\/)/, "//") : $musicUrl;
        this.audio.load();
        this.audio.play();
        if (errorTime) this.audio.currentTime = errorTime;
        this.isPaused();
        this.playingIndex = (Number.isInteger(i)) ? i : null;
        this.changeCover(i);
    },
    isPaused() {
        let status = true;
        if (!this.audio) {
            status = true;
        } else if (this.audio.paused) {
            // 暂停中
            status = true;
        } else {
            // 播放中
            status = false;
        }
        this.paused = status;
    },
    playingStatus(i) {
        let style = (i === this.playingIndex) ? 'background: #e9e9e9;' : '';
        if (this.musicInfo.tracks && this.musicInfo.tracks[i].disabled) style += "color: #bbb !important;";
        return style;
    },
    play() {
        if (!this.audio || this.audio.currentTime === 0) {
            this.loadMusic(0);
        } else {
            this.audio.play();
        }
    },
    next(i) {
        if (Number.isInteger(i)) this.playingIndex = i;
        if (this.playingIndex === null) return;
        let next = this.playingIndex + 1;
        if ((next + 1) > this.musicInfo.tracks.length) next = 0;
        this.loadMusic(next);
        this.process.barPlayed = "";
        this.process.time = "- 00:00";
    },
    prev() {
        if (this.playingIndex === null) return;
        let prev = this.playingIndex - 1;
        if (prev < 0) prev = this.musicInfo.tracks.length - 1;
        this.loadMusic(prev);
        this.process.barPlayed = "";
        this.process.time = "- 00:00";
    },
    setProcess() {
        let index = this.playingIndex;
        if (!Number.isInteger(index) || !this.musicInfo || !this.musicInfo.tracks[index]) return;
        let duration = this.musicInfo.tracks[index].duration / 1000;
        this.process.duration = duration;
        let range = duration - this.audio.currentTime;
        if (!this.progressIsDrag) this.process.barPlayed = `width:${this.audio.currentTime / duration * 100}%`;
        let minute = Math.floor(range / 60),
            second = range - minute * 60;
        this.process.time = `- ${ fixLength(minute, 2) }:${ fixLength(Math.floor(second), 2) }`;
    },
    changeCover(i) {
        let url = (Number.isInteger(i)) ? this.musicInfo.tracks[i].picUrl : this.musicInfo.coverImgUrl;
        this.cover = (url) ? url.replace(/(http:\/\/)|(https:\/\/)/, "//") : url;
    },
    progressPointerDown(e) {
        if (!this.audio) return;
        const barContainer = this.$refs.barContainer;
        this.progressIsDrag = true;
        this.setProcess("paused");
        if (this.audio && this.audio.src !== "")
            this.process.barPlayed = `width: ${e.clientX - getOffset(barContainer).left}px`;
    },
    progressPointerMove(e) {
        if (!this.progressIsDrag) return;
        const barContainer = this.$refs.barContainer,
            barContainerWidth = barContainer.offsetWidth;
        let position = e.clientX - getOffset(barContainer).left;
        if (position < 0) {
            position = 0;
        } else if (position > barContainerWidth) {
            position = barContainerWidth;
        }
        if (this.audio && this.audio.src !== "" && this.progressIsDrag)
            this.process.barPlayed = `width: ${ position }px`;
    },
    progressPointerUp(e) {
        if (!this.progressIsDrag) return;
        const barContainer = this.$refs.barContainer,
            barContainerWidth = barContainer.offsetWidth;
        let position = e.clientX - getOffset(barContainer).left;
        if (position < 0) {
            position = 0;
        } else if (position > barContainerWidth) {
            position = barContainerWidth;
        }
        if (this.audio && this.audio.src !== "" && this.progressIsDrag)
            this.process.barPlayed = `width: ${ position }px`;
        this.progressIsDrag = false;
        if (this.audio && this.audio.src !== "")
            this.audio.currentTime = position / barContainerWidth * this.process.duration;
        this.setProcess("init");
    },
    volumePointerDown(e) {
        if (!this.audio) return;
        this.volumeIsDrag = true;
        const volumeBarContainer = this.$refs.volumeBarContainer,
            volumeBarContainerHeight = volumeBarContainer.offsetHeight,
            volume = (getOffset(volumeBarContainer).top - e.clientY + volumeBarContainerHeight) / volumeBarContainerHeight;
        if (volume > 1) {
            this.volumeStatus.value = 1;
        } else if (volume < 0) {
            this.volumeStatus.value = 0;
        } else {
            this.volumeStatus.value = volume;
        }
    },
    volumePointerMove(e) {
        if (!this.volumeIsDrag) return;
        const volumeBarContainer = this.$refs.volumeBarContainer,
            volumeBarContainerHeight = volumeBarContainer.offsetHeight,
            volume = (getOffset(volumeBarContainer).top - e.clientY + volumeBarContainerHeight) / volumeBarContainerHeight;
        if (volume > 1) {
            this.volumeStatus.value = 1;
        } else if (volume < 0) {
            this.volumeStatus.value = 0;
        } else {
            this.volumeStatus.value = volume;
        }
    },
    volumePointerUp(e) {
        if (!this.volumeIsDrag) return;
        this.volumeIsDrag = false;
        const volumeBarContainer = this.$refs.volumeBarContainer,
            volumeBarContainerHeight = volumeBarContainer.offsetHeight,
            volume = (getOffset(volumeBarContainer).top - e.clientY + volumeBarContainerHeight) / volumeBarContainerHeight;
        if (volume > 1) {
            this.volumeStatus.value = 1;
        } else if (volume < 0) {
            this.volumeStatus.value = 0;
        } else {
            this.volumeStatus.value = volume;
        }
    },
    progressPointerTouchDown(e) {
        this.progressPointerDown(e.changedTouches[0]);
    },
    progressPointerTouchMove(e) {
        this.progressPointerMove(e.changedTouches[0]);
    },
    progressPointerTouchEnd(e) {
        this.progressPointerUp(e.changedTouches[0]);
    },
    volumePointerTouchDown(e) {
        this.volumePointerDown(e.changedTouches[0]);
    },
    volumePointerTouchMove(e) {
        this.volumePointerMove(e.changedTouches[0]);
    },
    volumePointerTouchEnd(e) {
        this.volumePointerUp(e.changedTouches[0]);
    },
    mouseMove(e) {
        this.progressPointerMove(e);
        this.volumePointerMove(e);
    },
    mouseUp(e) {
        this.progressPointerUp(e);
        this.volumePointerUp(e);
    },
    touchMove(e) {
        this.progressPointerTouchMove(e);
        this.volumePointerTouchMove(e);
    },
    touchEnd(e) {
        this.progressPointerTouchEnd(e);
        this.volumePointerTouchEnd(e);
    },
    setLyric(index) {
        if (!Number.isInteger(index) || !this.musicInfo || !this.musicInfo.tracks[index]) return;
        if (this.musicInfo.tracks[index].lyricData) {
            let data = this.musicInfo.tracks[index].lyricData;
            this.initLyric(data);
        } else {
            let id = this.musicInfo.tracks[index].id;
            this.getLyric(id, (data) => {
                this.lyrics.id = id;
                if (!data.lrc) {
                    // 没歌词
                    data.lrc = {};
                    if (data.sgc) {
                        data.lrc.lyric = "[00:00.00]还没有歌词哦~";
                    } else if (data.nolyric) {
                        // 纯音乐
                        data.lrc.lyric = "[00:00.00]纯音乐，请您欣赏";
                    }
                } else {
                    data.lrc.lyric += "[offset:300]";
                }
                this.musicInfo.tracks[index].lyricData = data;
                this.initLyric(data);
            });
        }
    },
    initLyric(data) {
        if (data.lrc && data.lrc.lyric) {
            this.lyrics.lrc.func = new lyrics(data.lrc.lyric);
            if (data.tlyric && data.tlyric.lyric) {
                this.lyrics.tlyric.func = new lyrics(data.tlyric.lyric);
                this.lyrics.lrc.func.lrcMerge(this.lyrics.tlyric.func.getLyrics(), 2);
            }
            this.lyrics.lrc.text = this.lyrics.lrc.func.getLyrics().map(item => item.text);
        }
        this.lyrics.isLoad = true;
    },
    removeAllLyric() {
        this.lyrics.lrc.func = this.lyrics.tlyric.func = null;
        this.lyrics.lrc.text = [];
        this.lyrics.lrc.active = -1;
    },
    loadLyric(time) {
        if (!this.lyrics.isLoad) return;
        if (this.lyrics.lrc.text.length > 0) {
            const isActive = this.lyrics.lrc.func.select(time);
            if (isActive !== this.lyrics.lrc.active){
                this.lyrics.lrc.active = isActive;
            }
        }
    }
}