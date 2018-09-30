export default {
    lazyLoad(curVal){
        if (!curVal && !this.isLoaded) {
            this.isLoaded = true;
            this.init();
        }
    },
    redirect:{
        handler(curVal) {
            this.MyRedirect = {...this.MyRedirect, ...curVal };
        },
        deep: true
    },
    playlist() {
        this.audio.pause();
        if(this.audio.currentTime !== 0) this.audio.currentTime = 0;
        this.playingIndex = null;
        this.paused = true;
        this.lyricID = 0;
        this.getPlayList();
    }
}
