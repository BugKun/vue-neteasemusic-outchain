export default function() {
    this.audio = new Audio();
    this.audio.onended = () => {
        this.next();
    };
    this.audio.ontimeupdate = () => {
        if (!this.audio || !this.audio.currentTime) return;
        this.setProcess();
        this.currentTime = this.audio.currentTime;
    };
    this.audio.onerror = () => {
        if (this.musicInfo.tracks[this.playingIndex]) this.musicInfo.tracks[this.playingIndex].playUrl = null;
        this.loadMusic(this.playingIndex, this.audio.currentTime);
    };
    this.audio.onloadstart = () => {
        this.audioBuffered = 0
    };
    this.audio.oncanplaythrough = () => {
        this.musicLoading = false;
    };
    this.audio.onwaiting = () => {
        this.musicLoading = true
    };
    this.audio.onseeked = () => {
        this.musicLoading = false
    };
    this.audio.onprogress = () => {
        if (this.audio && this.audio.buffered.length > 0)
            this.audioBuffered = this.audio.buffered.end(this.audio.buffered.length - 1);
    };
    this.audio.volume = this.volumeStatus.value;
    if (!this.options.lazyLoad) {
        this.isLoaded = true;
        this.init();
    }
    window.addEventListener("resize", this.windowResize);
}
