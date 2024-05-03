<template>
    <div style="height:100vh; width:100%">
      <l-map
          :useGlobalLeaflet="true"
          ref="map"
          :zoom="zoom"
          :center="center"
          @ready="onBoundsUpdate"
          @update:bounds="onBoundsUpdate">
        <Section
            v-for="(section, index) in sections"
            :key="index"
            :id="index"
            :polyline-data="section"
        ></Section>
        <l-point
            v-for="(point) in points"
            :key="point.properties.ulid"
            :id="point.properties.ulid"
            :section="sections[point.properties.isASC]"
            :properties="point.properties"
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
import pointService from "@/services/PointService";
import sectionService from "@/services/SectionService";
import LPoint from '@/components/Point.vue';
import Section from "@/components/Section.vue";
import {inject} from "vue";

export default {
  setup() {
    const globalPoint = inject('globalPoint');
    return { globalPoint };
  },
  components: {
    Section,
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
      sections: [],
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

      const points = await pointService.getPoints(this.bounds);
      const selectedPoint = this.globalPoint.getActivePoint();

      if(selectedPoint) {
        pointService.removePoint(points, selectedPoint.properties.ulid);
        points.push(pointService.createPoint(selectedPoint));
      }
      this.sections = sectionService.getSections(points)

      this.points = points;
    },
  },
};

</script>

