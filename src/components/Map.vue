<template>

      <div
          style="z-index: 1000"
          class="absolute -top-2 right-48 ">
        <Header/>
      </div>
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
          <button class="bg-emerald-600 p-6 text-3xl w-8 h-8 flex justify-center items-center text-white" @click="createNewPoint">
            <span class="">+</span>
          </button>
        </l-control>
        <l-tile-layer
          :url="url"
          :attribution="attribution"
        ></l-tile-layer>
      </l-map>
</template>

<script lang="ts">
import "leaflet/dist/leaflet.css";
import {LMap, LTileLayer, LFeatureGroup, LControl} from "@vue-leaflet/vue-leaflet";
import pointService from "@/services/PointService";
import sectionService from "@/services/SectionService";
import LPoint from '@/components/Point.vue';
import Section from "@/components/Section.vue";
import InfoBlock from "@/components/InfoBlock.vue";
import Header from "@/components/Header.vue";
import store from "../store/store";

export default {
  components: {
    Header,
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
        if (!this.activePoint) {
          const map = this.$refs.map.leafletObject;
          this.$refs.map.leafletObject.setView(
              this.center,
              16
          );
          this.$nextTick(() => {
            this.zoom = map.getZoom();
            this.center = map.getCenter();
          });
        } else {
          const activePointLatLng = this.activePoint.properties.latLng;
          const map = this.$refs.map.leafletObject;

          let windowOffset = 200;

          if(map.getZoom() > 16) {
            windowOffset = 300;
          }

          const newCenter = map.containerPointToLatLng(
              map.latLngToContainerPoint(activePointLatLng)
                  .subtract([windowOffset, 0])
          );

          map.setView(newCenter, 17);

          this.$nextTick(() => {
            this.zoom = map.getZoom();
            this.center = map.getCenter();
          });
        }
      }

    }
  },
  methods: {
    init() {
      this.$store.dispatch('setMap', this.$refs.map.leafletObject);
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
        pointService.removePoint(points, activePoint.properties.ulid);
        points.push(pointService.createPoint(activePoint));
      }
      this.sections = sectionService.getSections(points)

      console.log(points);
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
      const promise = new Promise((resolve, reject) => {
        const clickHandler = (event) => {
          this.$refs.map.leafletObject.off('click', clickHandler);
          resolve([event.latlng.lat, event.latlng.lng]);
        };
        this.$refs.map.leafletObject.on('click', clickHandler);
      });

      promise.then((latlng) => {
        this.addNewPoint(latlng);
      }).catch((error) => {
        console.error('Ошибка при ожидании клика на карте:', error);
      });
    },

    addNewPoint(latlng) {
      const pointData = {
        properties: {
          ulid: null,
          country: 0,
          type: 1,
          model: 0,
          distance: 0,
          direction: 0,
          angle: 20,
          latLng: latlng,
          car_speed: 0,
          truck_speed: 0,
          dateCreate: '-',
          lastUpdate: '-',
        },
      };

      this.points.push(pointData);

      console.log(this.points);
      this.$nextTick(() => {
        const newPoint = store.getters.activePoint;
        console.log(newPoint);
        newPoint.isEdited = true;
        newPoint.isCreating = true;
        newPoint.sector.setStyle({ color: "#069668", fillOpacity: 0.8, weight: 2 });
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
