<template>
  <div>
    <l-polyline :lat-lngs="polylineCoords" :color="color" :dash-array="dashArray" :opacity="opacity" ></l-polyline>
  </div>
</template>

<script lang="ts">
import { LPolyline } from "@vue-leaflet/vue-leaflet";

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
}
</script>