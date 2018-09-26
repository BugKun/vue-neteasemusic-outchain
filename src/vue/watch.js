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
