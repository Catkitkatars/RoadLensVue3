<template>
  <l-feature-group @click="toggleActiveEditedStatus">
    <l-marker ref="generalPoint" :icon="templateGeneralPoint" :lat-lng="properties.latLng" :draggable="isEdited" @drag="generalPointDrag" @click="changeColorClick" @mouseover="changeColorMouseOverOut" @mouseout="changeColorMouseOverOut"></l-marker>
    <l-circle ref="sector" :lat-lng="properties.latLng" :radius="parseInt(properties.distance)" :options="sectorOptions" @click="changeColorClick" @mouseover="changeColorMouseOverOut" @mouseout="changeColorMouseOverOut" @add="renderSector"></l-circle>
    <l-marker v-if="isEdited" ref="markerWidth" :icon="templateMovePoint" :lat-lng="getCoordsWidthPoint()" :draggable="isEdited" @drag="widthPointDrag"></l-marker>
    <l-marker v-if="isEdited" ref="markerDir" :icon="templateMovePoint" :lat-lng="getCoordsLengthPoint()" :draggable="isEdited" @drag="lengthPointDrag"></l-marker>
  </l-feature-group>
</template>

<script>
import {LCircle, LFeatureGroup, LMarker} from "@vue-leaflet/vue-leaflet";
import "../services/sector.ts";
import store from "../store/store";

export default {
  components: {
    LFeatureGroup,
    LMarker,
    LCircle
  },
  props: {
    properties: {
      type: Object,
      required: true,
    },
    section: {
      object: Object,
      default: null
    },
  },
  data() {
    return {
      templateMovePoint: L.icon({
        iconUrl: '/public/dot.svg',
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      }),
      templateGeneralPoint:L.icon({
        iconUrl: `/public/${this.properties.type}.png`,
        iconSize: [50, 50],
        iconAnchor: [25, 45],
      }),
      sector: null,
      markerDir:null,
      markerWidth:null,
      isActive: false,
      isEdited:false,
      isCreating: false,
      defaultColor: "#626a6d",
      sectorOptions:{
        color: "#626a6d",
        fillColor: "#626a6d",
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
      if(this.isEdited) {
        const newLatLng = this.$refs.generalPoint.leafletObject.getLatLng();

        this.properties.latLng = [Number(newLatLng.lat).toFixed(6), Number(newLatLng.lng).toFixed(6)];
        this.sector.setLatLng(newLatLng);
        if(this.section) {
          this.section[this.properties.ulid].coords = [Number(newLatLng.lat), Number(newLatLng.lng)];
        }

        this.markerWidth.setLatLng(this.sector.getStartAngleCoords());
        this.markerDir.setLatLng(this.sector.getMiddleAngleCoords());
      }
    },
    setPointDirLenght(coords) {
      this.sector.setLength(coords);
      this.sector.setDirection(coords);
      this.markerWidth.setLatLng(this.sector.getStartAngleCoords())
      this.properties.direction = this.sector.options.direction
      this.properties.distance = this.sector.options.radius
    },
    widthPointDrag() {
      const newLatLng = this.markerWidth.getLatLng();

      this.sector.setWidth(newLatLng);
      this.markerWidth.setLatLng(this.sector.getStartAngleCoords());
      this.properties.angle = this.sector.options.angle;
    },
    lengthPointDrag() {
      const newLatLng = this.markerDir.getLatLng();
      this.sector.setLength(newLatLng);
      this.sector.setDirection(newLatLng);
      this.markerWidth.setLatLng(this.sector.getStartAngleCoords())
      this.properties.direction = this.sector.options.direction
      this.properties.distance = this.sector.options.radius
    },
    renderSector() {
      this.sector = this.$refs.sector.leafletObject.setSector(this.properties.direction, this.properties.angle);

      // need for added new point
      if(this.properties.ulid === null) {
        this.$store.dispatch('setActivePoint', this);
      }
    },
    changeColorMouseOverOut() {
      if(this.sector.options.fillColor === this.defaultColor && this.sector.options.fillColor !== "#069668")
      {
        this.sector.setStyle({fillColor: "#313131", color:"#626a6d"});
      }
      else if(this.sector.options.fillColor !== "#069668")
      {
        this.sector.setStyle({fillColor: '#626a6d', color:"#626a6d"});
      }
    },
    changeColorClick() {
      if(this.sector.options.fillColor === '#313131')
      {
        this.sector.setStyle({color: '#069668', fillColor: "#069668", fillOpacity: 0.8, weight: 1.5,})
      }
      else
      {
        this.sector.setStyle({color:"#626a6d", fillColor: '#313131', fillOpacity: 0.5, weight: 0.5,});
      }
    },
    toggleActiveEditedStatus() {
      const activePoint = store.getters.activePoint;
      if(activePoint && activePoint.isCreating) {
        const map = store.getters.map;
        map.off('mousemove');
        map.off('click');
        return;
      }
      if(!activePoint){
        this.isActive = true;
        this.$store.dispatch('setActivePoint', this);
        this.$router.push({ name: 'InfoBlock', params: { id: this.properties.ulid } })
        return;
      }
      if(activePoint === this) {
        activePoint.isEdited = false;
        activePoint.isActive = false;
        activePoint.sector.setStyle({color: '#313131'});
        const params = this.$route.params;
        this.$router.push({ name: 'Home', params: {
            lat: params.lat,
            lng: params.lng,
            zoom: params.zoom,
          } })
        this.$store.dispatch('setActivePoint', null);
        return;
      }
      if(activePoint) {
        activePoint.isEdited = false;
        activePoint.isActive = false;
        activePoint.changeColorClick();
        activePoint.changeColorMouseOverOut();
        this.$store.dispatch('setActivePoint', null);
        this.$store.dispatch('setActivePoint', this);
        this.isActive = true;
        this.$router.push({ name: 'InfoBlock', params: { id: this.properties.ulid } })
      }
    },
    setInputType(selectedType) {
      this.properties.type = parseInt(selectedType);
      console.log(this);
    },
    setInputWidth() {
      this.properties.angle = Number(this.properties.angle);
      if (this.properties.angle >= 5 && this.properties.angle <= 120) {
        this.sector.setSector(this.properties.direction, this.properties.angle)
        this.markerWidth.setLatLng(this.sector.getStartAngleCoords());
        this.properties.angle = this.sector.options.angle;
      }
    },
    setInputDirection() {
      this.properties.direction = Number(this.properties.direction);
      if(this.properties.direction < 0 || this.properties.direction > 359) {
        this.sector.setSector(0, this.properties.angle)
        this.markerWidth.setLatLng(this.sector.getStartAngleCoords())
        this.markerDir.setLatLng(this.sector.getMiddleAngleCoords())
        this.properties.direction = 0
        this.properties.distance = this.sector.options.radius
        return;
      }
      this.sector.setSector(this.properties.direction, this.properties.angle)
      this.markerWidth.setLatLng(this.sector.getStartAngleCoords())
      this.markerDir.setLatLng(this.sector.getMiddleAngleCoords())
      this.properties.direction = this.sector.options.direction
      this.properties.distance = this.sector.options.radius
    },
    setInputDistance(value) {
      if(value === '') {
        this.markerWidth.setLatLng(this.$refs.generalPoint.leafletObject.getLatLng());
        this.markerDir.setLatLng(this.$refs.generalPoint.leafletObject.getLatLng())
        this.properties.distance = 0;
        return;
      }
      if(value !== '') {
        this.properties.distance = Number(value);
        this.sector.setStyle({fillOpacity: 0.8});

        if(this.properties.distance <= 2000) {
          this.sector.setRadius(this.properties.distance);
          this.markerWidth.setLatLng(this.sector.getStartAngleCoords());
          this.markerDir.setLatLng(this.sector.getMiddleAngleCoords())
          return;
        }
        if(this.properties.distance > 2000) {
          this.properties.distance = 2000
          this.sector.setRadius(2000);
          this.markerWidth.setLatLng(this.sector.getStartAngleCoords());
          this.markerDir.setLatLng(this.sector.getMiddleAngleCoords())
        }
      }
    },
    setInputLatLng() {
      const lat = Number(this.properties.latLng[0]).toFixed(6);
      const lng = Number(this.properties.latLng[1]).toFixed(6);

      if(this.section) {
        this.section[this.properties.ulid].coords = [lat, lng];
      }

      this.sector.setLatLng([lat, lng]);
      this.$refs.generalPoint.leafletObject.setLatLng([lat, lng]);
      this.markerWidth.setLatLng(this.sector.getStartAngleCoords());
      this.markerDir.setLatLng(this.sector.getMiddleAngleCoords());
    },
  },
  watch: {
    isEdited: {
      handler() {
        if(this.isEdited) {
          this.$nextTick(()=> {
            this.markerDir = this.$refs.markerDir.leafletObject;
            this.markerWidth = this.$refs.markerWidth.leafletObject;
          })
        }
      }
    }
  },
};
</script>