export default () => {
    return {
        MyRedirect: {
            method: "POST",
            playListUrl: "/api/musicPlayList",
            musicUrl: "/api/musicUrl",
            musicLyricUrl: "/api/musicLyric"
        },
        icons: {
            github: require('libs/icons/github.svg'),
            list: require('libs/icons/list.svg'),
            play: require('libs/icons/play.svg'),
            pause: require('libs/icons/pause.svg'),
            next: require('libs/icons/skip-next.svg'),
            prev: require('libs/icons/skip-previous.svg')
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
