export default function() {
    window.removeEventListener("resize", this.windowResize);
    this.audio.pause();
    this.audio = null;
}