import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'
import Vant from 'vant'
import 'vant/lib/index.css'
import './styles/index.less'
import { NavBar,Form} from 'vant'



Vue.use(NavBar)
Vue.use(Vant)
Vue.use(Form)


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
