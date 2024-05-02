<template>
    <div style="height:100vh; width:100%">
      <l-map
          :useGlobalLeaflet="true"
          ref="map"
          :zoom="zoom"
          :center="center"
          @ready="onBoundsUpdate"
          @update:bounds="onBoundsUpdate">
        <l-point
            v-for="(point) in points"
            :key="point.properties.ulid"
            :id="point.properties.ulid"
            :lat-lng="[point.geometry.geometries[0].coordinates[1], point.geometry.geometries[0].coordinates[0]]"
            :distance="point.properties.distance"
            :direction="point.properties.direction"
            :angle="point.properties.angle"
            :model="point.properties.model"
        ></l-point>
        <l-tile-layer
          :url="url"
          :attribution="attribution"
        ></l-tile-layer>
      </l-map>
    </div>
</template>

<script lang="ts">
import "leaflet/dist/leaflet.css";
import {LMap, LTileLayer, LMarker, LIcon, LPolygon, LFeatureGroup} from "@vue-leaflet/vue-leaflet";
import cameraService from "@/services/CameraService";
import LPoint from './Point.vue';
import {inject} from "vue";
export default {
  setup() {
    const globalPoint = inject('globalPoint');
    return { globalPoint };
  },
  components: {
    LMap,
    LTileLayer,
    LFeatureGroup,
    LPoint,
  },
  data() {
    return {
      bounds: null,
      zoom: 16,
      center: [56.821024, 60.566954],
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '<a href="#">RoadLens 2024</a>',
      points: [],
    };
  },
  watch: {
    bounds: {
      handler() {
        this.getPoints();
      },
      immediate: true
    },
  },
  methods: {
    onBoundsUpdate() {
      this.bounds = this.$refs.map.leafletObject.getBounds();
    },
    async getPoints() {
      if (!this.bounds) {
        return;
      }
      this.points = await cameraService.getPoints(this.bounds);

      const sections = this.points.reduce((acc, item) => {
        if (item.properties.isASC === 0) {
          return acc;
        }

        const sectionId = item.properties.isASC;
        const pointId = item.properties.ulid;
        const coords = [item.geometry.geometries[0].coordinates[1], item.geometry.geometries[0].coordinates[0]];

        if (!acc[sectionId])
        {
          acc[sectionId] = { [pointId]: { coords } };
        }
        else
        {
          acc[sectionId][pointId] = { coords };
        }

        return acc;
      }, {});

      console.log(sections);
    },
  },
};

</script>

