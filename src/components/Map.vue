<script setup lang="ts">
  import "leaflet/dist/leaflet.css";
  import {LMap, LTileLayer, LMarker, LIcon, LPolygon, LFeatureGroup} from "@vue-leaflet/vue-leaflet";
  import cameraService from "@/services/CameraService";

</script>

<template>
    <div style="height:100vh; width:100%">
      <l-map
          :useGlobalLeaflet="true"
          ref="map"
          :zoom="zoom"
          :center="center">
        <l-point
            :is-active="isActive"
            @click="toggleIsActive"
            :lat-lng="center"
            :radius="radius"
            :direction="direction"
            :angle="angle"
            :options="sectorOptions"
        ></l-point>
        <l-tile-layer
          :url="url"
          :attribution="attribution"
        ></l-tile-layer>
      </l-map>
    </div>
</template>

<script lang="ts">
import LPoint from './Point.vue';
export default {
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
      newPoints: [],
      renderedPoints: {},
      activePoint: null,
      isActive: false,
      radius: 400, // example radius
      direction: 90, // example start angle in degrees
      angle: 30, // example end angle in degrees
      sectorOptions: {
        color: 'red', // example color
        // fillOpacity: 0.5, // example fill opacity
        weight: 0.5
        // you can add more options here as needed
      }
    };
  },
  // watch: {
  //   bounds: {
  //     handler() {
  //       this.getPoints();
  //     },
  //     immediate: true
  //   },
  //   newPoints: {
  //     handler() {
  //       this.deletePointsOutOfBounds()
  //       this.renderPoints()
  //     },
  //     immediate: true
  //   }
  //
  // },


  methods: {
    toggleIsActive() {
      this.isActive = !this.isActive;
      this.sectorOptions.fillOpacity = 0.5
    }
    // onBoundsUpdate() {
    //   this.bounds = this.$refs.map.leafletObject.getBounds();
    // },
    // async getPoints() {
    //   if (!this.bounds) {
    //     return;
    //   }
    //   this.newPoints = await cameraService.getPoints(this.bounds);
    // },
    // renderPoints() {
    //   for(let pointKey in this.newPoints) {
    //     if (this.renderedPoints.hasOwnProperty(pointKey)){
    //       continue;
    //     }
    //     console.log(this.newPoints[pointKey]);
    //     let point = L.geotagPhoto.camera(this.newPoints[pointKey], this.option)
    //     point.properties = this.newPoints[pointKey].properties;
    //     point.addTo(this.$refs.map.leafletObject);
    //     this.renderedPoints[this.newPoints[pointKey].properties.ulid] = point;
    //   }
    // },
    // deletePointsOutOfBounds() {
    //   for(let pointKey in this.renderedPoints) {
    //     if (!this.newPoints.hasOwnProperty(pointKey)){
    //       this.renderedPoints[pointKey].removeFrom(this.$refs.map.leafletObject);
    //       delete this.renderedPoints[pointKey];
    //     }
    //   }
    // },
    // createSector(map, center, radius, startAngle, endAngle) {
    //   // Создаем круг с заданным центром и радиусом
    //   var circle = turf.circle(center, radius, {steps: 64});
    //
    //   // Вычисляем точки на окружности сектора
    //   var startAngleRad = (startAngle * Math.PI) / 180;
    //   var endAngleRad = (endAngle * Math.PI) / 180;
    //   var startCoord = turf.destination(center, radius, startAngleRad, 'kilometers').geometry.coordinates;
    //   var endCoord = turf.destination(center, radius, endAngleRad, 'kilometers').geometry.coordinates;
    //
    //   // Создаем сектор, добавляя к кругу линии от центра к начальной и конечной точкам сектора
    //   var sector = turf.lineString([
    //     center,
    //     [startCoord[1], startCoord[0]],
    //     [endCoord[1], endCoord[0]],
    //     center
    //   ]);
    // }
  },
  // mounted() {
  //   this.$nextTick(() => {
  //     var sector = L.circle([56.821024, 60.566954], {
  //       radius: 1234,
  //       startAngle: 60,
  //       endAngle: 120,
  //     }).addTo(this.$refs.map.leafletObject);
  //   })
  //
  // },
};

</script>

<!--<template>-->
<!--  <div style="height:100vh; width:100%">-->
<!--    <l-map-->
<!--        :useGlobalLeaflet="true"-->
<!--        ref="map"-->
<!--        :zoom="zoom"-->
<!--        :center="center">-->
<!--      <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>-->
<!--      <l-circle-sector :lat-lng="center" :radius="radius" :start-angle="startAngle" :end-angle="endAngle" :options="sectorOptions"></l-circle-sector>-->
<!--    </l-map>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--import { LMap, LTileLayer } from '@vue-leaflet/vue-leaflet';-->


<!--export default {-->
<!--  components: {-->
<!--    LMap,-->
<!--    LTileLayer,-->
<!--    LCircleSector-->
<!--  },-->
<!--  data() {-->
<!--    return {-->
<!--      zoom: 16,-->
<!--      center: [56.821024, 60.566954],-->
<!--      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',-->
<!--      attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',-->
<!--    };-->
<!--  }-->
<!--};-->
<!--</script>-->
