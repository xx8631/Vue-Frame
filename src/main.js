import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import create from '@/utils/create';
import Notice from '@/components/Notice.vue'

Vue.config.productionTip = false

//事件总线
Vue.prototype.$notice=function(props){
   return create(Notice,props)
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
