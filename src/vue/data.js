export default function() {
    return {
        redirect: {
            method: "POST",
            playListUrl: "/api/musicPlayList",
            musicUrl: "/api/musicUrl",
            musicLyricUrl: "/api/musicLyric"
        },
        icons: {
            github: require('libs/icons/github.svg'),
            loading: require('!url-loader?limit=999999!libs/icons/loading.gif')
        },
        isLoaded: false,
        musicLoading: false,
        isIE: /(MSIE)|(rv:11.0)/.test(navigator.userAgent),
        isIOS: /iPhone|iPad|iPod/.test(navigator.userAgent),
        audio: null,
        volume: 0.5,
        musicInfo: {},
        musicUrl: {},
        copyright: "由于版权保护，您所在的地区暂时无法使用。",
        process: {
            time: "- 00:00"
        },
        paused: true,
        isListClosed: true,
        cover: null,
        playingIndex: null,
        progressIsDrag: false,
        showLyrics: false,
        lyricID: 0,
        currentTime: 0,
        listBox: null,
        listBoxHeight: 0,
        windowHeight: window.innerHeight,
        windowWidth: window.innerWidth
    }
}
