<template>
  <label class="text-white" :for="id">
    {{ heading }}
  </label>
  <VueSelect
      :id="id"
      ref="select"
      class="bg-white rounded-md"
      :options="selectableItems"
      v-model="selectedItem"
      :multiple="multiple"
      :class="{ 'multiple-selected': multiple }"
      @option:selected="getCountryNumber"/>
</template>

<script>
import VueSelect from "vue-select";
import store from "../store/store.ts";

export default {
  emits: ['getCountryNumber'],
  components: {
    VueSelect
  },
  props: {
    heading: {
      type: String,
      default: 'Heading',
      required: true,
    },
    id: {
      type: String,
      required: true
    },
    selectedValue: {
      type: [Number, Array],
      default: 0
    },
    selectableItems: {
      type: Array,
      default: [],
      required: true,
    },
    multiple: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      selectedItem: this.multiple ? this.selectedMultiple(this.selectedValue) : this.selectableItems[this.selectedValue]
    };
  },
  methods: {
    selectedMultiple(selectedValue) {
      return selectedValue.map(item => {
        return this.selectableItems[parseInt(item) - 1];
      })
    },
    getCountryNumber(elem) {
      if(this.id === 'country') {
        this.$emit('getCountryNumber', Number(elem.value));
      }
    }
  },
  created() {
    if(this.id === 'country') {
      this.$emit('getCountryNumber', Number(this.selectedItem.value));
    }
  },
  watch: {
    selectedItem(newValue) {
      if(this.multiple) {
        store.getters.activePoint.properties[this.id] = newValue.map(item => {
          return item.value;
        })
        return;
      }
      if(this.id === 'type') {
        store.getters.activePoint.templateGeneralPoint = L.icon({
          iconUrl: `/public/${Number(this.selectedItem.value)}.png`,
          iconSize: [50, 50],
          iconAnchor: [25, 45],
        })
      }
      if(newValue && newValue.value !== '') {
        store.getters.activePoint.properties[this.id] = parseInt(this.selectedItem.value);
      }

      if (!newValue || newValue.value === '')
      {
        this.selectedItem = this.selectableItems[0]
        this.$emit('getCountryNumber', Number(this.selectedItem.value));

        store.getters.activePoint.properties[this.id] = 0;
      }
    },
  },

};
</script>

<style>
@import "vue-select/dist/vue-select.css";
.vs__dropdown-option--highlight {
  background: #069668;
}

.multiple-selected .vs__selected {
  background: #00bd7e;
  color: white;
}
</style>