<script setup lang="ts">

</script>

<template>
  <Menu/>
  <router-view/>
  <notifications
      classes="notification"
      position="bottom left"/>
</template>

<script>
import Menu from "@/components/Menu.vue";


export default {
  components: {
    Menu
  },
}
</script>


<style>
body {
  overflow-x:hidden;
}

.notification {
  margin: 0 5px 5px;
  padding: 10px;
  font-size: 12px;
  color: #ffffff;


  background: #44a4fc;
  border-left: 5px solid #187fe7;


  &.success {
    background: #069668;
    border-left-color: #42a85f;
  }

  &.warn {
    background: #ffb648;
    border-left-color: #f48a06;
  }

  &.error {
    background: #e54d42;
    border-left-color: #b82e24;
  }
}

</style>

