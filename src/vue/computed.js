export default {
    openArea() {
        if (!this.listBox) return null;
        let adapt = "";
        if (this.isListClosed) {
            if (this.showLyrics) {
                adapt = "height: calc(92px + 3em);min-height: calc(92px + 3em);";
            } else {
                adapt = "height: 92px; min-height: 92px;";
            }
        } else {
            if (this.musicInfo.tracks) {
                let listBoxHeight = 94 + this.listBoxHeight;
                if (listBoxHeight > (this.windowHeight / 2)) {
                    listBoxHeight = this.windowHeight / 2;
                }
                if (this.showLyrics) {
                    adapt = `min-height: 92px;height: calc(${ listBoxHeight }px + 3em);`;
                } else {
                    adapt = `min-height: 92px;height: ${ listBoxHeight }px;`;
                }
            }
        }
        adapt += `max-height: ${ this.windowHeight / 2 }px;`;
        if (this.isIE || this.progressIsDrag) adapt += "user-select: none;-ms-user-select: none;";
        return adapt;
    },
    musicLink() {
        let link = null;
        if (Number.isInteger(this.playingIndex) && this.musicInfo && this.musicInfo.tracks && this.musicInfo.tracks[this.playingIndex]) {
            link = "//music.163.com/song?id=" + this.musicInfo.tracks[this.playingIndex].id;
        }
        return link;
    }
}