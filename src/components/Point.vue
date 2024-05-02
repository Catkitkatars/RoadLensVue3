<template>
  <l-feature-group @click="toggleIsActive">
    <l-marker ref="generalPoint" :icon="templateGeneralPoint" :lat-lng="newLatLng ? newLatLng : latLng" :draggable="isActive" @drag="generalPointDrag" @click="changeColorClick" @mouseover="changeColorMouseOverOut" @mouseout="changeColorMouseOverOut"></l-marker>
    <l-circle ref="sector" :lat-lng="newLatLng ? newLatLng : latLng" :radius="distance" :options="sectorOptions" @click="changeColorClick" @mouseover="changeColorMouseOverOut" @mouseout="changeColorMouseOverOut"></l-circle>
    <l-marker v-if="isActive" ref="markerWidth" :icon="templateMovePoint" :lat-lng="getCoordsWidthPoint()" :draggable="isActive" @drag="widthPointDrag"></l-marker>
    <l-marker v-if="isActive" ref="markerDir" :icon="templateMovePoint" :lat-lng="getCoordsLengthPoint()" :draggable="isActive" @drag="lengthPointDrag"></l-marker>
  </l-feature-group>
</template>

<script>
import {LCircle, LFeatureGroup, LMarker} from "@vue-leaflet/vue-leaflet";
import "../services/sector.js";
import { inject } from 'vue';

export default {
  setup() {
    const globalPoint = inject('globalPoint');
    return { globalPoint };
  },
  components: {
    LFeatureGroup,
    LMarker,
    LCircle
  },
  props: {
    id: {
      type: String,
      required: true
    },
    latLng: {
      type: Array,
      required: true
    },
    model: {
      type: Number,
      default: 1
    },
    distance: {
      type: Number,
      default: 400
    },
    direction: {
      type: Number,
      default: 90
    },
    angel: {
      type: Number,
      default: 20
    },
  },
  data() {
    return {
      templateMovePoint: L.icon({
        iconUrl: 'public/dot.svg',
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      }),
      templateGeneralPoint:L.icon({
        iconUrl: `public/${this.model}.png`,
        iconSize: [40, 40],
        iconAnchor: [20, 37],
      }),
      sector: null,
      markerDir:null,
      markerWidth:null,
      isActive: false,
      newLatLng: null,
      defaultColor: "#626a6d",
      sectorOptions:{
        color: "#626a6d",
        fillOpacity: 0.5,
        weight: 0.5,
      },
    };
  },
  methods: {
    getCoordsWidthPoint() {
      return this.sector.getStartAngleCoords();
    },
    getCoordsLengthPoint() {
      return this.sector.getMiddleAngleCoords();
    },
    generalPointDrag() {
      if(this.isActive) {
        const newLatLng = this.$refs.generalPoint.leafletObject.getLatLng();

        this.newLatLng = newLatLng;
        this.sector.setLatLng(newLatLng);
        this.markerWidth.setLatLng(this.sector.getStartAngleCoords());
        this.markerDir.setLatLng(this.sector.getMiddleAngleCoords());
      }
    },
    widthPointDrag() {
      const newLatLng = this.markerWidth.getLatLng();

      this.sector.setWidth(newLatLng);
      this.markerWidth.setLatLng(this.sector.getStartAngleCoords());
    },
    lengthPointDrag() {
      const newLatLng = this.markerDir.getLatLng();

      this.sector.setLength(newLatLng);
      this.sector.setDirection(newLatLng);
      this.markerWidth.setLatLng(this.sector.getStartAngleCoords())
    },
    renderSector() {
      this.sector.setSector(this.direction, this.angel);
    },
    changeColorMouseOverOut() {
      if(this.sector.options.color === this.defaultColor && this.sector.options.color !== "#1f4485")
      {
        this.sector.setStyle({color: "#313131"})
      }
      else if(this.sector.options.color !== "#1f4485")
      {
        this.sector.setStyle({color: '#626a6d'});
      }
    },
    changeColorClick() {
      if(this.sector.options.color === '#313131')
      {
        this.sector.setStyle({color: "#1f4485", fillOpacity: 0.7})
      }
      else
      {
        this.sector.setStyle({color: '#313131', fillOpacity: 0.5});
      }
    },
    toggleIsActive() {
      const activePoint = this.globalPoint.getActivePoint();

      if(activePoint === this){
        this.isActive = !this.isActive;
        this.sector.setStyle({color: '#313131'});
        this.globalPoint.setActivePoint(null);
        return;
      }
      if(activePoint)
      {
        activePoint.isActive = false;
        activePoint.changeColorClick();
        activePoint.changeColorMouseOverOut();
      }
      this.isActive = !this.isActive;
      this.globalPoint.setActivePoint(this);
    },
  },
  created() {
    this.$nextTick(()=> {
      this.sector = this.$refs.sector.leafletObject;
      this.renderSector();
      if(this.isActive) {
        this.markerDir = this.$refs.markerDir.leafletObject;
        this.markerWidth = this.$refs.markerWidth.leafletObject;
      }
    })
  },
  watch: {
    isActive: {
      immediate: true,
      handler(isActive) {
        this.$nextTick(()=> {
          if (isActive) {
            this.markerDir = this.$refs.markerDir.leafletObject;
            this.markerWidth = this.$refs.markerWidth.leafletObject;
          }
        })
      }
    }
  },
};
</script>