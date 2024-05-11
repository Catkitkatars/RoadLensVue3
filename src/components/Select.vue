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
      @option:selected="getCountryNumber"></VueSelect>
</template>

<script>
import VueSelect from "vue-select";

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
      type: Number,
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
      selectedItem: this.multiple ? null : this.selectableItems[this.selectedValue]
    };
  },
  methods: {
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
      if(newValue === null) {
        this.selectedItem = this.selectableItems[0]
        this.$emit('getCountryNumber', Number(this.selectedItem.value));
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