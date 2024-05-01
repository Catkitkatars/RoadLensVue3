<template>
  <l-map :zoom="zoom" :center="center">
    <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
    <l-feature-group ref="features">
      <l-popup > <span> Yay I was opened by {{caller}}</span></l-popup>

    <l-marker :lat-lng="markerLatLng" @click="openPopUp(markerLatLng, 'marker')"></l-marker>
    <l-circle
        :lat-lng="circle.center"
        :radius="circle.radius"
        :color="circle.color"
        @click="openPopUp(circle.center, 'circle')"
    />
  </l-map>
</template>

<script lang="ts">
import {LMap, LTileLayer, LFeatureGroup, LPopup, LCircle, LMarker} from "@vue-leaflet/vue-leaflet";

export default {
  components: {
    LMap,
    LTileLayer,
    LFeatureGroup,
    LPopup,
    LCircle,
    LMarker
  },
  data () {
    return {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution:
          '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      zoom: 8,
      center: [47.313220, -1.319482],
      markerLatLng: [47.313220, -1.319482],
      caller: null,
      circle: {
        center: [47.413220, -1.0482],
        radius: 4500,
        color: 'red'
      }
    };
  },
  methods: {
    openPopUp (latLng, caller) {
      this.caller = caller;
      this.$refs.features.mapObject.openPopup(latLng);
    }
  }
}
</script>
