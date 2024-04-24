<script setup lang="ts">
  import "leaflet/dist/leaflet.css";
  import {LMap, LTileLayer, LMarker, LIcon, LPolygon, LFeatureGroup} from "@vue-leaflet/vue-leaflet";


  import cameraService from "@/services/CameraService";
</script>

<template>
    <div style="height:100vh; width:100%">
      <l-map
          @ready="onBoundsUpdate"
          @update:bounds="onBoundsUpdate"
          :useGlobalLeaflet="true"
          ref="map"
          :zoom="zoom"
          :center="center">

<!--        <l-marker-->
<!--            v-for="(point, index) in points"-->
<!--            :key="index"-->
<!--            :lat-lng="[-->
<!--                point.geometry.geometries[0].coordinates[1],-->
<!--                point.geometry.geometries[0].coordinates[0]-->
<!--              ]"-->
<!--        ></l-marker>-->
        <l-feature-group ref="featureGroup"></l-feature-group>
        <l-tile-layer
          :url="url"
          :attribution="attribution"
        ></l-tile-layer>
      </l-map>
    </div>
</template>

<script lang="ts">

import { reactive } from 'vue';
export default {
  components: {
    LMap,
    LTileLayer,
    LFeatureGroup
  },
  data() {
    return {
      bounds: null,
      zoom: 16,
      center: [56.821024, 60.566954],
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '<a href="#">RoadLens 2024</a>',
      newPoints: [],
      renderedPoints: {},
      activePoint: null,
      unicUlidsPoints: [],
    };
  },
  watch: {
    bounds: {
      handler() {
        this.getPoints();
      },
      immediate: true
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
      this.newPoints = await cameraService.getPoints(this.bounds);
      // console.log(this.newPoints);
      this.checkPoints();
      this.renderPoints();
      console.log(this.renderedPoints);
    },
    checkPoints() {
      this.unicUlidsPoints = this.unicUlidsPoints.map((item) => {
        if (!this.newPoints.hasOwnProperty(item)) {

          this.renderedPoints[item].removeFrom(this.$refs.map.leafletObject)

          // update to reactive this object
        }
      })
    },
    renderPoints() {
      for(let pointUlid in this.newPoints) {
        if(this.unicUlidsPoints.includes(pointUlid)){
          continue;
        }
        let reactiveObject = reactive(this.newPoints[pointUlid])
        reactiveObject.addTo(this.$refs.featureGroup.leafletObject);
        // update this

        this.renderedPoints[pointUlid] = this.newPoints[pointUlid];
        this.unicUlidsPoints.push(pointUlid);
      }
    },
    deletePointsOutOfBounds() {
      console.log(this.unicUlidsPoints)
      console.log(this.newPoints);
    }
  },
//Разобраться с реактивностью объектов на карте.
  // Добавлять объекты на карту с возможностью реактивного удаления, если они выпали из зоны getBounds

};

</script>
