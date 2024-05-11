<template>
    <div
        class="flex justify-center"
        :style="{ width: '100%', position: 'relative' }">
      <info-block
          v-if="activePoint"
          :point="activePoint"
          @set-active-point="setActivePoint"
      >

      </info-block>
      <div
          style="z-index: 1000"
          class="absolute -top-2 right-48 ">
        <Header/>
      </div>


      <l-map
          :style="{ height: '100vh', width: mapWidth, marginLeft: 'auto', position: 'relative' }"
          :useGlobalLeaflet="true"
          ref="map"
          :zoom="zoom"
          :center="center"
          @ready="onBoundsUpdate"
          @update:bounds="onBoundsUpdate">

<!--        <Section-->
<!--            v-for="(section, index) in sections"-->
<!--            :key="index"-->
<!--            :id="index"-->
<!--            :polyline-data="section"-->
<!--        ></Section>-->
        <l-point
            v-for="(point) in points"
            :key="point.properties.ulid"
            :section="sections[point.properties.isASC]"
            :properties="point.properties"
            @set-active-point="setActivePoint"
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
import InfoBlock from "@/components/InfoBlock.vue";
import Header from "@/components/Header.vue";

export default {
  setup() {
    const globalPoint = inject('globalPoint');
    return { globalPoint };
  },
  components: {
    Header,
    InfoBlock,
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
      activePoint: null,
      mapWidth: '100%'
    };
  },
  watch: {
    bounds: {
      handler() {
        this.getPoints();
      },
      immediate: true
    },
    activePoint: {
      handler() {
        if(!this.activePoint) {
          // this.mapWidth = '100%'
          this.$refs.map.leafletObject.setView(
              this.center,
              16)
        }
        if(this.activePoint) {
          this.$refs.map.leafletObject.setView(
              this.activePoint.properties.latLng,
              17)
          // this.mapWidth = (window.innerWidth - 600) + 'px'
          this.$nextTick(() => {
            this.zoom = this.$refs.map.leafletObject.getZoom();
            this.center = this.$refs.map.leafletObject.getCenter();
          })
        }
      }
    }
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
    setActivePoint() {
      this.activePoint = this.globalPoint.getActivePoint();
    },
  },
};

</script>

