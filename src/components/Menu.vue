<template>
  <div
      @click="toggleActive"
      :class="{ 'cross-active': isActive }"
      style="z-index: 1002; "
      class="smooth absolute cursor-pointer top-3 right-1.5 w-14 flex flex-col justify-center items-center ">
    <div
        :class="{'line-active': isActive }"
        class="line rounded w-12 h-2 bg-emerald-600"
    ></div>
    <div
        class="line rounded w-12 h-2 bg-emerald-600 my-2"
    ></div>
    <div
        :class="{'line-active': isActive }"
        class="line rounded w-12 h-2 bg-emerald-600"
    ></div>
  </div>
  <section
      :class="{ 'square-active': isActive }"
      class="square">
      <ul class="circle-menu">
        <li class="text-white font-russo p-4 cursor-pointer hover:text-slate-800 transition-colors">Главная</li>
        <li class="text-white font-russo p-4 cursor-pointer hover:text-slate-800 transition-colors">Фильтр</li>
        <li class="text-white font-russo p-4 cursor-pointer hover:text-slate-800 transition-colors">О камерах</li>
        <li class="text-white font-russo p-4 cursor-pointer hover:text-slate-800 transition-colors">О проекте</li>
      </ul>
      <div
          style="top: 255px; right: 240px;"
          class="flex items-center justify-center text-center w-16 h-16 rounded-full bg-slate-700 absolute cursor-pointer">
          <span
              style="margin:0 auto"
              class="login material-icons text-white ">
            login
          </span>
      </div>
  </section>
</template>

<script>

export default {
  components: {

  },
  props: {

  },
  data() {
    return {
      isActive: false
    }
  },
  methods: {
    toggleActive() {
      this.isActive = !this.isActive;
    }
  },
};
</script>

<style>
.square {
  transition: transform 0.5s ease;
  position: absolute;
  z-index: 1000;
  top: 0;
  right: 0;
  width: 350px;
  height: 350px;
  background-color: #069668;
  border-radius: 100% 0 0 0;
  transform: rotate(270deg) translate(300px, 300px);
}
.square-active {
  transition: transform .5s ease;
  transform: rotate(270deg) translate(0, 0);
}

.circle-menu {
  position: absolute;
  list-style: none;
  padding: 0;
  margin: 0;
  top: 15%;
  right: 30%;

  text-align: center;
  transform: rotate(40deg);
}
.login {
  transform: rotate(90deg)
}

.circle-menu li {
  width: 100%;
}

.circle-menu li:nth-child(1) {
  transform: rotate(20deg) translateY(-10px) translateX(-12px);
}

.circle-menu li:nth-child(2) {
  transform: rotate(12deg) translateY(-10px) translateX(-28px);
}

.circle-menu li:nth-child(3) {
  transform: rotate(5deg) translateY(-14px) translateX(-32px);
}

.circle-menu li:nth-child(4) {
  transform: rotate(-2deg) translateY(-18px) translateX(-26px);
}

.line-active {
  background: white;
}

.smooth .line {
  transition: transform 0.3s ease;
}

.cross-active .line:nth-child(1) {
  transform: rotate(45deg) translate(15px, 15px);
}

.cross-active .line:nth-child(2) {
  opacity: 0;
}

.cross-active .line:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -7px);
}
</style>