<template>
      <Header/>
      <search/>

      <router-view/>
      <l-map
          id="map"
          class="flex justify-center"
          :style="{ height: '100vh', width: '100%', marginLeft: 'auto', position: 'relative' }"
          :useGlobalLeaflet="true"
          ref="map"
          :zoom="zoom"
          :center="center"
          @ready="init"
          @update:center="mapMove"
          @update:zoom="mapMove"
          @update:bounds="onBoundsUpdate">

        <Section
            v-for="(section, index) in sections"
            :key="index"
            :id="index"
            :polyline-data="section"
        ></Section>

        <l-point
            v-for="point in points"
            :key="point.properties.ulid"
            :section="sections[point.properties.isASC]"
            :properties="point.properties"
        />

        <l-control :position="'bottomright'">
          <button v-if="!creatingNew"
                  class="rounded bg-emerald-600 p-6 text-3xl w-8 h-8 flex justify-center items-center text-white " @click="createNewPoint">
            <span class="material-icons text-white cursor-pointer hover:text-slate-800 transition-colors">
              add
            </span>
          </button>
        </l-control>
        <l-tile-layer
          :url="url"
          :attribution="attribution"
        ></l-tile-layer>
      </l-map>
</template>

<script lang="ts">
import L from 'leaflet';
import "leaflet/dist/leaflet.css";
import {LMap, LTileLayer, LFeatureGroup, LControl} from "@vue-leaflet/vue-leaflet";
import pointService from "@/services/PointService";
import sectionService from "@/services/SectionService";
import LPoint from '@/components/Point.vue';
import Section from "@/components/Section.vue";
import InfoBlock from "@/components/InfoBlock.vue";
import Header from "@/components/Header.vue";
import Search from "@/components/Search.vue";

import store from "../store/store";

export default {
  components: {
    Header,
    Search,
    InfoBlock,
    Section,
    LMap,
    LTileLayer,
    LFeatureGroup,
    LPoint,
    LControl,
  },
  data() {
    return {
      bounds: null,
      zoom: this.$route.params.zoom,
      center: [this.$route.params.lat, this.$route.params.lng],
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '<a href="#">RoadLens 2024</a>',
      points: [],
      sections: [],
      activePoint: null,
      creatingNew: false,
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
    init() {
      this.$store.dispatch('setMap', this.$refs.map.leafletObject);
      this.$store.dispatch('setMapVue', this.$refs.map);

      this.onBoundsUpdate();
      this.center = this.$refs.map.leafletObject.getCenter();
      this.$router.push({
        name: 'Home',
        params: {lat: this.center.lat.toFixed(6), lng: this.center.lng.toFixed(6), zoom: this.zoom}
      });
    },
    mapMove() {
      this.zoom = this.$refs.map.leafletObject.getZoom();
      this.center = this.$refs.map.leafletObject.getCenter();
      const activePoint = store.getters.activePoint;

      if (activePoint && activePoint.properties.ulid === null) {
        this.$router.push({
          name: 'AddBlock',
          params: {lat: this.center.lat.toFixed(6), lng: this.center.lng.toFixed(6), zoom: this.zoom}
        });
        return;
      }
      if (activePoint && !activePoint.isEdited) {
        this.$router.push({
          name: 'InfoBlock',
          params: {
            lat: this.center.lat.toFixed(6),
            lng: this.center.lng.toFixed(6),
            zoom: this.zoom,
            id: activePoint.properties.ulid
          }
        });
      } else if (activePoint && activePoint.isEdited) {
        this.$router.push({
          name: 'EditBlock',
          params: {
            lat: this.center.lat.toFixed(6),
            lng: this.center.lng.toFixed(6),
            zoom: this.zoom,
            id: activePoint.properties.ulid
          }
        });
      } else {
        this.$router.push({
          name: 'Home',
          params: {lat: this.center.lat.toFixed(6), lng: this.center.lng.toFixed(6), zoom: this.zoom}
        });
      }
    },
    onBoundsUpdate() {
      this.bounds = this.$refs.map.leafletObject.getBounds();
    },
    async getPoints() {
      if (!this.bounds) {
        return;
      }

      const points = await pointService.getPoints(this.bounds);
      const activePoint = store.getters.activePoint;

      if (activePoint) {
        const index = points.findIndex(point => point.properties.ulid === activePoint.properties.ulid);

        if (index !== -1)
        {
          points.splice(index, 1, pointService.addPointToArr(activePoint));
        }
        else
        {
          points.push(pointService.addPointToArr(activePoint));
        }
      }
      this.sections = sectionService.getSections(points, activePoint);

      this.$store.dispatch('setPoints', points);
      this.points = points;
    },
    setActivePoint() {
      this.activePoint = store.getters.activePoint;
      if (this.activePoint) {
        this.$router.push({name: 'InfoBlock', params: {id: this.activePoint.properties.ulid}})
      } else {
        this.$router.push({name: 'Home'})
      }

    },
    createNewPoint() {
      if(store.getters.activePoint)
      {
        return;
      }

      const mapElement = this.$refs.map.leafletObject._container;
      let mousePoint = L.marker([0, 0],
          {icon: L.icon({
              iconUrl: `/public/0.png`,
              iconSize: [40, 40],
              iconAnchor: [20, 37],
            })}
      ).addTo(this.$refs.map.leafletObject)
      const mouseMoveHandler = (event) => {
        mousePoint.setLatLng(event.latlng)
      }
      this.$refs.map.leafletObject.on('mousemove', mouseMoveHandler);


      const promise = new Promise((resolve, reject) => {
        const clickHandler = (event) => {
          mousePoint.removeFrom(this.$refs.map.leafletObject);
          this.$refs.map.leafletObject.off('click', clickHandler);
          resolve([
              parseFloat(event.latlng.lat.toFixed(6)),
              parseFloat(event.latlng.lng.toFixed(6))
          ]);
        };
        this.$refs.map.leafletObject.on('click', clickHandler);
      });

      promise.then((latlng) => {
        this.addNewPoint(latlng);
        mapElement.style.cursor = 'pointer';
      }).catch((error) => {
        console.error('Ошибка при ожидании клика на карте:', error);
        mapElement.style.cursor = 'pointer';
        const map = store.getters.map;
        map.off('mousemove');
        map.off('click');
      });
    },
    addNewPoint(latlng) {
      const pointData = {
        properties: {
          ulid: null,
          country: 0,
          type: 0,
          model: 0,
          distance: 0,
          direction: 0,
          angle: 20,
          status:0,
          flags:[],
          latLng: latlng,
          carSpeed: 0,
          truckSpeed: 0,
        },
      };

      this.points.push(pointData);

      this.$nextTick(() => {
        const newPoint = store.getters.activePoint;
        newPoint.isEdited = true;
        newPoint.isCreating = true;
        newPoint.sector.setStyle({color: '#069668', fillColor: "#069668", fillOpacity: 0.8, weight: 1.5,})
        const mouseMoveHandler = (event) => {
          newPoint.setPointDirLenght(event.latlng);
        };

        this.$refs.map.leafletObject.on('mousemove', mouseMoveHandler);

        this.$router.push({ name: 'AddBlock' });
      });
    },
  },
  created() {
    const params = this.$route.params;
    if(params) {
      this.center = [parseFloat(params.lat), parseFloat(params.lng)];
      this.zoom = parseInt(params.zoom);
    }
  },
};

</script>


<style>

</style>
