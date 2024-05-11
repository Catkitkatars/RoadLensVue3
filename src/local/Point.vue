<template>
    <l-feature-group>
      <l-marker ref="mainPoint" :icon="choosePointViewByType()" :lat-lng="pointData.data_object.geometry.coordinates"></l-marker>
      <l-circle ref="sectorPoint" :lat-lng="pointData.data_object.geometry.coordinates" :radius="defaultRadius" :options="sectorOptions" @add="renderSector"></l-circle>
<!--      <l-marker v-if="isEdited" ref="markerWidth" :icon="templateMovePoint" :lat-lng="getCoordsWidthPoint()" :draggable="isEdited" @drag=""></l-marker>-->
<!--      <l-marker v-if="isEdited" ref="markerDir" :icon="templateMovePoint" :lat-lng="getCoordsLengthPoint()" :draggable="isEdited" @drag=""></l-marker>-->
    </l-feature-group>
</template>

<script lang="ts">
import {LCircle, LFeatureGroup, LMarker} from "@vue-leaflet/vue-leaflet";
import "/src/services/sector.ts";
import PointType from "/src/enum/PointType.ts";

export default {
  components: {
    LFeatureGroup,
    LMarker,
    LCircle
  },
  props: {
    pointType:{
      type: Number,
      required: true
    },
    pointData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      iboxPointIcon: L.icon({
        iconUrl: '/img/icon/map-camera-default.svg',
        iconSize: [60, 82.5],
        iconAnchor: [30, 82.5],
      }),
      wanmaPoint: L.icon({
        iconUrl: '/img/icon/map-camera-aggregated-default.svg',
        iconSize: [60, 82.5],
        iconAnchor: [30, 82.5],
      }),
      defaultAngleWidth: 20,
      defaultRadius: 200,
      sectorOptions:{
        color: "#626a6d",
        fillOpacity: 0.5,
        weight: 0.5,
      },
    }
  },
  methods: {
    renderSector() {
      this.$refs.sectorPoint.leafletObject.setSector(this.pointData.data_object.properties.angle, this.defaultAngleWidth);
    },
    choosePointViewByType() {
      switch (this.pointType) {
        case PointType.IboxPoint:
          return this.iboxPointIcon
        case PointType.WanmaGroup:
          return this.wanmaPoint
        default:
          return this.iboxPointIcon
      }
    }
  },
}
</script>
