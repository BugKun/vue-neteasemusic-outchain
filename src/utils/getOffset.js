export default (el) => {
    const rect = el.getBoundingClientRect(),
        pageYScroll = window.pageYOffset || document.documentElement.scrollTop;

    return { left: rect.left, top: rect.top + pageYScroll };
}
