export default function() {
    this.audio = new Audio();
    this.audio.volume = 0.5;
    this.audio.onended = () => {
        this.next();
    };
    this.audio.ontimeupdate = () => {
        if (!this.audio || !this.audio.currentTime) return;
        this.currentTime = this.audio.currentTime;
    };
    this.audio.onerror = () => {
        if (this.musicInfo.tracks[this.playingIndex]) this.musicInfo.tracks[this.playingIndex].playUrl = null;
        this.loadMusic(this.playingIndex, this.audio.currentTime);
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
    if (!this.lazyLoad) {
        this.isLoaded = true;
        this.init();
    }
}
