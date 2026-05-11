<template>
  <div class="app">
    <router-view />
  </div>
</template>

<script>
import { useFullscreen } from "./src/composables/useFullscreen";

export default {
  name: "App",
  setup() {
    useFullscreen();
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.app {
  width: 100%;
  height: 100vh;
}
</style>
