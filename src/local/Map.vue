<script lang="ts" setup>
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "vue-leaflet-markercluster/dist/style.css";

import { Point, PointDataObjectProperties } from "../models/Point";
import {
  LMap,
  LTileLayer,
  LMarker,
  LIcon,
  LPolygon,
} from "@vue-leaflet/vue-leaflet";
import { LMarkerClusterGroup } from "vue-leaflet-markercluster";
import PointData from "../dto/PointData";
import LPoint from './Point/Point.vue';
// import Point from "./Point/Point.vue";

globalThis.L = L;
</script>

<template>
  <l-map
    :useGlobalLeaflet="true"
    style="z-index: 50"
    id="map"
    :zoom="currentZoom"
    :center="center"
    ref="myMap"
    :class="mapClass"
    @click="onMapClick"
    @update:center="onMapDragEnd"
    @update:zoom="onMapZoomChanged"
  >
    <l-tile-layer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      layer-type="base"
      name="OpenStreetMap"
    />
    <l-marker-cluster-group
        v-if="points.length"
        :maxClusterRadius="45"
        :disableClusteringAtZoom="16"
        :spiderfyOnMaxZoom="false"
        :zoomToBoundsOnClick="true">

      <template v-for="pointGroup in points">
        <l-point
            v-for="point in pointGroup.data"
            :key="point.id"
            :point-type="pointGroup.type"
            :point-data="point"
            @click="onMarkerClick(point)">
        </l-point>
      </template>
    </l-marker-cluster-group>
  </l-map>
</template>

<script lang="ts">
export default {
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LIcon,
  },
  props: {
    points: {
      type: Array<PointData>,
      required: true,
    },
    markers: {
      type: Array<Number>,
      required: false,
    },
    center: {
      type: Array<Number>,
      required: false,
      default: [55.7887, 49.1221],
    },
    mapFocus: {
      type: Array<Number>,
      required: false,
      default: [],
    },
  },
  watch: {
    mapFocus: function (coordinates: Array<Number>) {
      this.onMapFocus(coordinates);
    },
  },
  computed: {
    isPolygonsVisible() {
      return this.currentZoom >= 16;
    },
  },
  data() {
    return {
      mapObject: null,
      mapClass: null,
      currentZoom: 12 as number,
    };
  },
  methods: {
    onMarkerClick(point: Point) {
      this.$emit("on-map-marker-click", point);
      console.log("clicked");
    },
    onMapClick(event: Object) {
      this.$emit("on-map-click", [event.latlng.lat, event.latlng.lng]);
    },
    onMapFocus(coordinates: Array<Number>) {
      console.log(coordinates);
      this.$refs.myMap.leafletObject.flyTo({
        lat: coordinates[0],
        lng: coordinates[1],
      });
    },
    onMapDragEnd(coordinates) {
      this.$emit("on-map-drag-end", coordinates.lat, coordinates.lng);
    },
    onMapZoomChanged(zoom: number) {
      this.currentZoom = zoom;
    },
    calculateCameraPolygon(lat: number, lng: number, angle: number) {
      const distance = 200;
      const angleDifference = 5;

      const firstPoint = [lat, lng];
      const secondPoint = this.destination(
        lat,
        lng,
        this.formatAngle(angle + angleDifference),
        distance
      );
      const thirdPoint = this.destination(
        lat,
        lng,
        this.formatAngle(angle - angleDifference),
        distance
      );

      var points = [
        firstPoint,
        [secondPoint.lat, secondPoint.lng],
        [thirdPoint.lat, thirdPoint.lng],
      ];

      return points;
    },
    formatAngle(angle: number): number {
      angle = angle - 180;

      if (angle < 0) {
        angle = 360 - Math.abs(angle);
      }

      if (angle > 360) {
        return angle - 360;
      }

      return angle;
    },
    destination(lat: number, lng: number, heading: number, distance: number) {
      heading = (heading + 360) % 360;
      var rad = Math.PI / 180,
        radInv = 180 / Math.PI,
        R = 6378137, // approximation of Earth's radius
        lon1 = lng * rad,
        lat1 = lat * rad,
        rheading = heading * rad,
        sinLat1 = Math.sin(lat1),
        cosLat1 = Math.cos(lat1),
        cosDistR = Math.cos(distance / R),
        sinDistR = Math.sin(distance / R),
        lat2 = Math.asin(
          sinLat1 * cosDistR + cosLat1 * sinDistR * Math.cos(rheading)
        ),
        lon2 =
          lon1 +
          Math.atan2(
            Math.sin(rheading) * sinDistR * cosLat1,
            cosDistR - sinLat1 * Math.sin(lat2)
          );
      lon2 = lon2 * radInv;
      lon2 = lon2 > 180 ? lon2 - 360 : lon2 < -180 ? lon2 + 360 : lon2;
      return L.latLng([lat2 * radInv, lon2]);
    },
  },
};
</script>

<style>
#map {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}
#map.content-opened {
  left: 885px;
}
</style>
