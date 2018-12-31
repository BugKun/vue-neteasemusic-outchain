import { isNumber } from "Utils"

export default {
    trackID() {
        let ID = 0;
        if (isNumber(this.playingIndex) && this.musicInfo && this.musicInfo.tracks && this.musicInfo.tracks[this.playingIndex]) {
            ID = this.musicInfo.tracks[this.playingIndex].id;
        }
        return ID;
    },
    btnGroupRightWidth() {
        let count = 2;
        if(!this.hideGit) {
            if(this.isIOS){
                count++;
            }else if(this.maxWidth > 350){
                count++;
            }
        }
        if(!this.isIOS) {
            count++;
        }
        return `${ 1.5 * count }em`;
    },
    currentTrackDuration(){
        if(!this.musicInfo.tracks) return 0;
        const playingIndex = this.playingIndex || 0,
            duration = this.musicInfo.tracks[playingIndex].duration / 1000;
        return duration || 0;
    },
    playListMaxHeight(){
        return { limit: this.maxHeight - 92, lyrics: (this.showLyrics)? '3em' : null };
    }
}
