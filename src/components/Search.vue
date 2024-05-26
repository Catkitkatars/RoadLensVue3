<template>
  <div style="position:absolute; top: 10px; right: 400px; z-index:1000; width: 300px">
    <input
        class="appearance-none border rounded font-russo py-2 px-3 text-emerald-600  leading-tight focus:outline-none focus:shadow-outline "
        style="width: 300px; position: relative; box-shadow: 0px 0px 8px rgba(16,185,129,1);"
        id="search" type="search" autocomplete="off" v-model="search"
        @keyup.enter="startSearch"
    />
    <div class="absolute right-2 top-2 bg-white">
      <span
          v-if="!search"
          class="material-icons text-emerald-600 cursor-pointer hover:text-emerald-700">
            location_searching
      </span>
      <span
          @click="clearInput"
          v-if="search"
          class="material-icons text-emerald-600 cursor-pointer hover:text-emerald-700">
            close
      </span>
    </div>
  </div>

</template>

<script>
import L from 'leaflet';
import store from "../store/store";

export default {
  components: {

  },
  props: {

  },
  data() {
    return {
      search: null,
      marker: null,
    }
  },
  methods: {
    clearInput() {
      this.search = null;
      if(this.marker) {
        const map = store.getters.map;
        this.marker.removeFrom(map);
      }
    },
    startSearch() {
      let searchStr = this.search.trim();
      let coords = searchStr.match(/-?\d+\.\d+/g)

      if(coords) {
        coords = coords.map(item => {
          return parseFloat(item);
        });

        this.createMarker(coords);
      }
    },
    createMarker(coords) {
      const map = store.getters.map;

      map.setView(coords);
      this.marker = L.marker(coords,
          {icon: L.icon({
              iconUrl: `/public/search.png`,
              iconSize: [60, 85],
              iconAnchor: [29.7, 83],
            })}
      );


      this.marker.addTo(map)
    }


  },
};
</script>

<style>

</style>