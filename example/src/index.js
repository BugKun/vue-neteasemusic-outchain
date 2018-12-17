import Vue from 'vue';
import App from './pages';

new Vue({
    el: "#app",
    components: { App },
    render: createElement => createElement('App')
});
