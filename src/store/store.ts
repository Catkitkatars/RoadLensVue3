import { createStore } from 'vuex';

export default createStore({
    state: {
        map: null,
        activePoint: null,
    },
    mutations: {
        setMap(state, map) {
            state.map = map;
        },
        setActivePoint(state, point) {
            state.activePoint = point;
        },
    },
    actions: {
        setMap({commit}, map) {
          commit('setMap', map);
        },
        setActivePoint({ commit }, point) {
            commit('setActivePoint', point);
        },
    },
    getters: {
        map: state => state.map,
        activePoint: state => state.activePoint,
    }
});