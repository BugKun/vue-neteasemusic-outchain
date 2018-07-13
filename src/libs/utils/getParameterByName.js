export default function(name, search) {
    const match = RegExp('[?&]' + name + '=([^&]*)').exec(search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}