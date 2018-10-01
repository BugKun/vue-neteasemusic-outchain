import { fixLength, getOffset, isNumber } from 'libs/utils';
import { $ajax, Lyrics } from 'libs/services';


export default {
    isNumber,
    init() {
        if (this.redirect.length > 1) this.MyRedirect = {...this.MyRedirect, ...this.redirect };
        this.getPlayList(() => {
            if (this.autoPlay) {
                this.play();
            }
        });
    },
    toggleList(){
        this.$refs.playList.toggleList();
    },
    getPlayList(cb) {
        $ajax(this.MyRedirect.method, this.MyRedirect.playListUrl)
            .send({ id: this.playlist })
            .end(res => {
                if (res.code !== 200) {
                    console.log(res);
                    return;
                }
                this.musicLoading = false;
                this.musicInfo = res;
                this.changeCover();
                if (cb) cb();
            })
            .catch(error => {
                console.log("Oops, error", error);
            })
    },
    getMusic(id, cb) {
        $ajax(this.MyRedirect.method, this.MyRedirect.musicUrl)
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
        this.lyricID = this.musicInfo.tracks[i].id;
    },
    playMusic(i, errorTime) {
        if (this.musicInfo.tracks[i].disabled) return this.next(i);
        this.audio.src = this.musicInfo.tracks[i].playUrl;
        this.audio.load();
        this.audio.play();
        if (errorTime) this.audio.currentTime = errorTime;
        this.paused = this.audio.paused;
        this.playingIndex = isNumber(i) ? i : null;
        this.changeCover(i);
    },
    play() {
        if (this.audio.currentTime === 0) {
            this.loadMusic(0);
        } else {
            this.audio.play();
        }
    },
    togglePlayPause(){
        if(this.audio.paused){
            this.play();
            this.paused = false;
        }else {
            this.audio.pause();
            this.paused = true;
        }
    },
    next(i) {
        if (isNumber(i)) this.playingIndex = i;
        if (this.playingIndex === null) return;
        let next = this.playingIndex + 1;
        if ((next + 1) > this.musicInfo.tracks.length) next = 0;
        this.loadMusic(next);
    },
    prev() {
        if (this.playingIndex === null) return;
        let prev = this.playingIndex - 1;
        if (prev < 0) prev = this.musicInfo.tracks.length - 1;
        this.loadMusic(prev);
    },
    setProcess() {
        let index = this.playingIndex;
        if (!isNumber(index) || !this.musicInfo || !this.musicInfo.tracks[index]) return;
        let duration = this.musicInfo.tracks[index].duration / 1000;
        this.process.duration = duration;
        let range = duration - this.audio.currentTime;
        if (!this.progressIsDrag) this.process.barPlayed = `width:${this.audio.currentTime / duration * 100}%`;
        let minute = Math.floor(range / 60),
            second = range - minute * 60;
        this.process.time = `- ${ fixLength(minute, 2) }:${ fixLength(Math.floor(second), 2) }`;
    },
    changeCover(i) {
        this.cover = (isNumber(i)) ? this.musicInfo.tracks[i].picUrl : this.musicInfo.coverImgUrl;
    },
    mouseMove(e) {
        if(this.$refs.VolumeControl) this.$refs.VolumeControl.volumePointerMove(e);
        if(this.$refs.Tracker) this.$refs.Tracker.progressPointerMove(e);
    },
    mouseUp(e) {
        if(this.$refs.VolumeControl) this.$refs.VolumeControl.volumePointerUp(e);
        if(this.$refs.Tracker) this.$refs.Tracker.progressPointerUp(e);
    },
    touchMove(e) {
        this.mouseMove(e.changedTouches[0]);
    },
    touchEnd(e) {
        this.mouseUp(e.changedTouches[0]);
    }
}
