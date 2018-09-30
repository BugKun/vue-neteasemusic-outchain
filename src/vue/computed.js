import { isNumber } from "libs/utils"

export default {
    openArea() {
       /* let adapt = "";
        if (this.showLyrics){
            adapt = "height: calc(92px + 3em);";
        }
        if (this.listOpened){
            adapt = `height: ${this.maxHeight}px;`;
        }
        /!*    if (this.isListClosed) {
            if (this.showLyrics) {
                adapt = "height: calc(92px + 3em);";
            } else {
                adapt = "height: 92px;";
            }
        } else {
            if (this.musicInfo.tracks) {
                let listBoxHeight = 94 + 30;
                if (listBoxHeight > this.maxHeight) {
                    listBoxHeight = this.maxHeight;
                }
                if (this.showLyrics) {
                    adapt = `height: ${this.maxHeight};`;
                } else {
                    adapt = `height: calc(${ listBoxHeight }px - 3em);height: ${ listBoxHeight }px;`;
                }
            }
        }*!/
        if (this.isIE || this.progressIsDrag) adapt += "user-select: none;-ms-user-select: none;";
        return adapt;*/

       return null
    },
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
    }
}
