<template>
  <l-feature-group>
    <l-marker ref="generalPoint" :icon="templateGeneralPoint" :lat-lng="latLng" :draggable="isActive" @drag="generalPointDrag"></l-marker>
    <l-circle ref="sector" :lat-lng="latLng" :radius="radius" :options="options"></l-circle>
    <l-marker v-if="isActive" ref="markerWidth" :icon="templateMovePoint" :lat-lng="latLng" :draggable="isActive" @drag="widthPointDrag"></l-marker>
    <l-marker v-if="isActive" ref="markerDir" :icon="templateMovePoint" :lat-lng="latLng"  :draggable="isActive" @drag="lengthPointDrag"></l-marker>
  </l-feature-group>
</template>

<script>
import {LCircle, LFeatureGroup, LMarker} from "@vue-leaflet/vue-leaflet";
import "../services/leaflet.circle-sector.js";

export default {
  data() {
    return {
      templateMovePoint: L.icon({
        iconUrl: 'public/dot.svg',
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      }),
      templateGeneralPoint:L.icon({
        iconUrl: 'public/1.png',
        iconSize: [40, 40],
        iconAnchor: [19, 36],
      }),
      sector: null,
      markerDir:null,
      markerWidth:null
    };
  },
  components: {
    LFeatureGroup,
    LMarker,
    LCircle
  },
  props: {
    isActive: {
      type: Boolean,
      required: true
    },
    latLng: {
      type: Array,
      required: true
    },
    radius: {
      type: Number,
      required: true
    },
    direction: {
      type: Number,
      default: 90
    },
    angel: {
      type: Number,
      default: 20
    },
    options: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    getCoordsWidthPoint() {
      this.markerWidth.setLatLng(this.sector.getStartAngleCoords())
    },
    getCoordsLengthPoint() {
      this.markerDir.setLatLng(this.sector.getMiddleAngleCoords())
    },
    generalPointDrag() {
      if(this.isActive) {
        const newLatLng = this.$refs.generalPoint.leafletObject.getLatLng();

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
    }
  },
  created() {
    this.$nextTick(()=> {
      this.sector = this.$refs.sector.leafletObject;
      this.renderSector();
      if(this.isActive) {
        this.markerDir = this.$refs.markerDir.leafletObject;
        this.markerWidth = this.$refs.markerWidth.leafletObject;
        this.getCoordsLengthPoint();
        this.getCoordsWidthPoint();
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
            this.getCoordsLengthPoint();
            this.getCoordsWidthPoint();
          }
        })
      }
    }
  },
};
</script>