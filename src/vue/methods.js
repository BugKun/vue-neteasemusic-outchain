import { fixLength, getOffset } from 'libs/utils';
import { $ajax, Lyrics } from 'libs/services';

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
        this.windowWidth = window.innerWidth;
    },
    getListBox(dom) {
        this.listBox = dom;
    },
    getPlayList(cb) {
        $ajax(this.redirect.method, this.redirect.playListUrl)
            .send({ id: this.playlist })
            .end(res => {
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
        $ajax(this.redirect.method, this.redirect.musicUrl)
            .send({ id })
            .end(res => {
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
        this.lyricID = this.musicInfo.tracks[i].id;
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
        this.process.isReverse = false;
        this.process.isUpdate = false;
    },
    prev() {
        if (this.playingIndex === null) return;
        let prev = this.playingIndex - 1;
        if (prev < 0) prev = this.musicInfo.tracks.length - 1;
        this.loadMusic(prev);
        this.process.barPlayed = "";
        this.process.time = "- 00:00";
        this.process.isReverse = false;
        this.process.isUpdate = false;
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
        if (this.audio && this.audio.src !== ""){
            const currentTime = position / barContainerWidth * this.process.duration;
            this.audio.currentTime = currentTime;
        }
        this.setProcess("init");
    },
    progressPointerTouchDown(e) {
        this.progressPointerDown(e.changedTouches[0]);
    },
    mouseMove(e) {
        this.progressPointerMove(e);
        this.$refs.VolumeControl.volumePointerMove(e);
    },
    mouseUp(e) {
        this.progressPointerUp(e);
        this.$refs.VolumeControl.volumePointerUp(e);
    },
    touchMove(e) {
        this.mouseMove(e.changedTouches[0]);
    },
    touchEnd(e) {
        this.mouseUp(e.changedTouches[0]);
    }
}
