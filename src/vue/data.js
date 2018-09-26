export default function() {
    return {
        MyRedirect: {
            method: "POST",
            playListUrl: "/api/musicPlayList",
            musicUrl: "/api/musicUrl",
            musicLyricUrl: "/api/musicLyric"
        },
        icons: {
            github: require('libs/icons/github.svg')
        },
        isLoaded: false,
        musicLoading: false,
        isIE: /(MSIE)|(rv:11.0)/.test(navigator.userAgent),
        isIOS: /iPhone|iPad|iPod/.test(navigator.userAgent),
        audio: null,
        musicInfo: {},
        musicUrl: {},
        copyright: "由于版权保护，您所在的地区暂时无法使用。",
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
    }
}
