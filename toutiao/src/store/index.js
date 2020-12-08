import Vue from 'vue'
import Vuex from 'vuex'
import { getItem , setItem } from '../utils/storage'

Vue.use(Vuex)

// 这样做的目的可以避免访问和获取数据的名字不一致导致的问题

const USER_KEY = 'TOUTIAO_USER'

export default new Vuex.Store({
  state: {
    user: getItem( USER_KEY )  //当前登录用户的token数据
  },
  mutations: {
    setUser(state , data){
      state.user = data
      setItem( USER_KEY , state.user)
    }
  },
  actions: {

  }
})
