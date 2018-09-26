import { getParameterByName } from "libs/utils"

import NeteaseMusicOutchain from "./vue/index.vue"

NeteaseMusicOutchain.install = Vue => {
    Vue.component(NeteaseMusicOutchain.name, NeteaseMusicOutchain);
};

const isHot = JSON.parse(getParameterByName("hot", __resourceQuery));

if (isHot && window) {
    window.VueNeteaseMusicOutchain = NeteaseMusicOutchain;
}

export default NeteaseMusicOutchain
