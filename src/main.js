import Vue from 'vue';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import excel from 'vue-excel-export'
import { Service } from './service';
import CircularCountDownTimer from "vue-circular-count-down-timer";

Vue.use(CircularCountDownTimer);
Vue.use(excel)


Vue.directive('click-outside', {
    bind: function (el, binding, vnode) {
        console.log(el)
      this.event = function (event) {
        if (!(el == event.target || el.contains(event.target)) && !el.class=='selectBox') {
          vnode.context[binding.expression](event);
        }
      };
      document.body.addEventListener('click', this.event)
    },
    unbind: function () {
      document.body.removeEventListener('click', this.event)
    },
  });
let vue = new Vue({
    // added by router plugin
    router,

    vuetify,
    render: h => h(App)
}).$mount('#app')

Service.prototype.$vue = vue;