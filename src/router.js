import VueRouter from 'vue-router'
import Home from './views/Home';
import Vue from 'vue';


Vue.use(VueRouter);

const routes = {
    mode: 'history',
    routes: [{
        path: '/newmon', //monitoring
        component: Home
    }]

};

const router = new VueRouter(routes);

export default router
