export default () => {
    return {
        icons: {
            github: require('Icons/github.svg'),
            list: require('Icons/list.svg'),
            play: require('Icons/play.svg'),
            pause: require('Icons/pause.svg'),
            next: require('Icons/skip-next.svg'),
            prev: require('Icons/skip-previous.svg')
        },
        isLoaded: false,
        musicLoading: false,
        isIOS: /iPhone|iPad|iPod/.test(navigator.userAgent),
        audio: null,
        musicInfo: {},
        musicUrl: {},
        paused: true,
        isListClosed: true,
        cover: null,
        playingIndex: null,
        showLyrics: false,
        lyricID: 0,
        currentTime: 0
    }
}
