export default {
    options: {
        handler(curVal) {
            if (curVal.redirect) this.redirect = {...this.redirect, ...curVal.redirect };
            if (!curVal.lazyLoad && !this.isLoaded) {
                this.isLoaded = true;
                this.init();
            }
        },
        deep: true
    },
    volume(curVal) {
        if (this.audio && !isNaN(curVal)) this.audio.volume = curVal;
    },
    playlist() {
        if (this.audio) {
            this.audio.pause();
            if(this.audio.currentTime !== 0) this.audio.currentTime = 0;
        }
        this.playingIndex = null;
        this.process = {
            barPlayed: "",
            time: "- 00:00"
        };
        this.paused = true;
        this.getPlayList();
    }
}
