import { createStore } from 'vuex';

export default createStore({
    state: {
        map: null,
        points: null,
        activePoint: null,
    },
    mutations: {
        setMap(state, map) {
            state.map = map;
        },
        setPoints(state, points) {
            state.points = points
        },
        setActivePoint(state, point) {
            state.activePoint = point;
        },
    },
    actions: {
        setMap({commit}, map) {
          commit('setMap', map);
        },
        setPoints({commit}, points) {
            commit('setPoints', points);
        },
        setActivePoint({ commit }, point) {
            commit('setActivePoint', point);
        },
    },
    getters: {
        map: state => state.map,
        points: state => state.points,
        activePoint: state => state.activePoint,
    }
});