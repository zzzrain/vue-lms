import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    exChange: '',
    exSelect: '',
    userName: ''
  },
  mutations: {
    setChange (state, data) {
      state.exChange = data;
    },
    setSelect (state, data) {
      state.exSelect = data;
    },
    setUsername (state, data) {
      state.userName = data;
    }
  },
  getters: {
    getChange (state) {
      return state;
    }
  }
});
