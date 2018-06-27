import NeteaseMusicOutchain from "./lib/vue-neteasemusic-outchain.vue"

NeteaseMusicOutchain.install = Vue => {
    Vue.component(NeteaseMusicOutchain.name, NeteaseMusicOutchain)
}

function getParameterByName(name, search) {
    const match = RegExp('[?&]' + name + '=([^&]*)').exec(search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

const isHot = JSON.parse(getParameterByName("hot", __resourceQuery));

if(isHot && window){
    window.VueNeteaseMusicOutchain = NeteaseMusicOutchain;
}

export default NeteaseMusicOutchain
