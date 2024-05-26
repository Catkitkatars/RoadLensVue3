import { createStore } from 'vuex';

export default createStore({
    state: {
        map: null,
        mapVue:null,
        points: null,
        activePoint: null,
    },
    mutations: {
        setMap(state, map) {
            state.map = map;
        },
        setMapVue(state, mapVue) {
            state.mapVue = mapVue;
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
        setMapVue({commit}, mapVue) {
            commit('setMapVue', mapVue);
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
        mapVue: state => state.mapVue,
        points: state => state.points,
        activePoint: state => state.activePoint,
    }
});