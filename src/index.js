import NeteaseMusicOutchain from "./vue/index.vue";

NeteaseMusicOutchain.install = Vue => {
    Vue.component(NeteaseMusicOutchain.name, NeteaseMusicOutchain);
};

if (window) {
    window.VueNeteaseMusicOutchain = NeteaseMusicOutchain;
}

export default NeteaseMusicOutchain;
