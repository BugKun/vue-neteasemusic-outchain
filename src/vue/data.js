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
            volume: require('libs/icons/volume.svg'),
            mute: require('libs/icons/mute.svg'),
            loading: require('!url-loader?limit=999999!libs/icons/loading.gif')
        },
        isLoaded: false,
        musicLoading: false,
        audioBuffered: 0,
        isIE: /(MSIE)|(rv:11.0)/.test(navigator.userAgent),
        isIOS: /iPhone|iPad|iPod/.test(navigator.userAgent),
        audio: null,
        volumeStatus: {
            value: .5,
            active: false
        },
        musicInfo: {},
        musicUrl: {},
        copyright: "由于版权保护，您所在的地区暂时无法使用。",
        process: {
            barPlayed: "",
            time: "- 00:00",
            duration: 0
        },
        paused: true,
        isListClosed: true,
        cover: null,
        playingIndex: null,
        progressIsDrag: false,
        volumeIsDrag: false,
        showLyrics: false,
        lyrics: {
            id: 0,
            isLoad: false,
            lrc: {
                func: null,
                text: [],
                active: -1
            },
            tlyric: {
                func: null,
            },
        },
        listBox: null,
        listBoxHeight: 0,
        windowHeight: window.innerHeight,
        windowWidth: window.innerWidth
    }
}