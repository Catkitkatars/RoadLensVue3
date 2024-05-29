<template>
  <div>
    <l-polyline ref="polyline" :lat-lngs="polylineCoords" :color="color" :dash-array="dashArray" :opacity="opacity"></l-polyline>
  </div>
</template>

<script lang="ts">
import { LPolyline } from "@vue-leaflet/vue-leaflet";
import L from 'leaflet';
import 'leaflet-polylinedecorator';
import store from "../store/store";

export default {
  components: {
    LPolyline,
  },
  props: {
    polylineData: {
      type: Object,
      required: true
    },
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      color: 'red',
      dashArray: '10, 10',
      opacity: 0.7,
      pointsInSection: [],
    }
  },
  computed: {
    polylineCoords() {
      const coords = [];
      for (const key in this.polylineData) {
        this.pointsInSection.push(key);
        if(key === 'id') {
          continue;
        }
        if (this.polylineData.hasOwnProperty(key)) {
          coords.push(this.polylineData[key].coords);
        }
      }
      return coords;
    }
  },
  methods: {
    setDecor() {
      const map = store.getters.map;
      L.polylineDecorator(this.$refs.polyline.leafletObject, {
        patterns: [
          { offset: 25, repeat: 50, symbol: L.Symbol.arrowHead({ pixelSize: 5, polygon: false, pathOptions: { color: 'red', opacity: 0.1 } }) }
        ]
      }).addTo(map);
    }
  }
}
</script>