export default function() {
    this.aduioInit();
    if (!this.lazyLoad) {
        this.isLoaded = true;
        this.init();
    }
}
