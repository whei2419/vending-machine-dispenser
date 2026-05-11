<template>
  <div class="app">
    <!-- Ambient floating bubbles layer -->
    <div class="bubble-layer" aria-hidden="true">
      <span v-for="n in 18" :key="n" class="bubble" :class="`bubble--${n}`"></span>
    </div>

    <router-view v-slot="{ Component }">
      <transition name="bubble-wipe" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
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
  position: relative;
  overflow: hidden;
}

/* ── Floating particle layer ── */
.bubble-layer {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 50;
  overflow: hidden;
}

.bubble {
  position: absolute;
  bottom: -20px;
  border-radius: 50%;
  /* Bright hot core fading to transparent — light particle look */
  background: radial-gradient(circle,
      rgba(255, 255, 255, 1.0) 0%,
      rgba(255, 255, 255, 0.75) 25%,
      rgba(255, 255, 255, 0.0) 100%);
  /* Multi-layer glow: tight inner bloom + wide soft halo */
  box-shadow:
    0 0 2px 2px rgba(255, 255, 255, 0.60),
    0 0 6px 4px rgba(255, 255, 255, 0.25),
    0 0 14px 6px rgba(255, 255, 255, 0.08);
  /* No hard edge blur — the gradients handle softness */
  filter: none;
}

/* Assign different dust drift patterns across the 18 particles */
.bubble--1 {
  left: 4%;
  width: 2px;
  height: 2px;
  animation: dust-a 28s ease-in-out infinite;
  animation-delay: 0s;
  opacity: 0.55;
}

.bubble--2 {
  left: 10%;
  width: 2px;
  height: 2px;
  animation: dust-b 34s ease-in-out infinite;
  animation-delay: 1.5s;
  opacity: 0.45;
}

.bubble--3 {
  left: 18%;
  width: 1px;
  height: 1px;
  animation: dust-c 22s ease-in-out infinite;
  animation-delay: 0.8s;
  opacity: 0.60;
}

.bubble--4 {
  left: 25%;
  width: 2px;
  height: 2px;
  animation: dust-d 30s ease-in-out infinite;
  animation-delay: 3.2s;
  opacity: 0.50;
}

.bubble--5 {
  left: 33%;
  width: 1px;
  height: 1px;
  animation: dust-a 26s ease-in-out infinite;
  animation-delay: 0.4s;
  opacity: 0.45;
}

.bubble--6 {
  left: 40%;
  width: 3px;
  height: 3px;
  animation: dust-b 38s ease-in-out infinite;
  animation-delay: 2.1s;
  opacity: 0.50;
}

.bubble--7 {
  left: 47%;
  width: 1px;
  height: 1px;
  animation: dust-c 20s ease-in-out infinite;
  animation-delay: 4.0s;
  opacity: 0.55;
}

.bubble--8 {
  left: 54%;
  width: 2px;
  height: 2px;
  animation: dust-d 32s ease-in-out infinite;
  animation-delay: 1.0s;
  opacity: 0.48;
}

.bubble--9 {
  left: 61%;
  width: 2px;
  height: 2px;
  animation: dust-a 30s ease-in-out infinite;
  animation-delay: 2.8s;
  opacity: 0.55;
}

.bubble--10 {
  left: 68%;
  width: 1px;
  height: 1px;
  animation: dust-b 24s ease-in-out infinite;
  animation-delay: 0.2s;
  opacity: 0.50;
}

.bubble--11 {
  left: 75%;
  width: 3px;
  height: 3px;
  animation: dust-c 42s ease-in-out infinite;
  animation-delay: 3.6s;
  opacity: 0.42;
}

.bubble--12 {
  left: 81%;
  width: 1px;
  height: 1px;
  animation: dust-d 20s ease-in-out infinite;
  animation-delay: 1.8s;
  opacity: 0.60;
}

.bubble--13 {
  left: 87%;
  width: 2px;
  height: 2px;
  animation: dust-a 36s ease-in-out infinite;
  animation-delay: 0.6s;
  opacity: 0.50;
}

.bubble--14 {
  left: 93%;
  width: 1px;
  height: 1px;
  animation: dust-b 26s ease-in-out infinite;
  animation-delay: 2.4s;
  opacity: 0.50;
}

.bubble--15 {
  left: 14%;
  width: 2px;
  height: 2px;
  animation: dust-c 46s ease-in-out infinite;
  animation-delay: 5.0s;
  opacity: 0.40;
}

.bubble--16 {
  left: 57%;
  width: 1px;
  height: 1px;
  animation: dust-d 18s ease-in-out infinite;
  animation-delay: 3.0s;
  opacity: 0.55;
}

.bubble--17 {
  left: 36%;
  width: 2px;
  height: 2px;
  animation: dust-a 32s ease-in-out infinite;
  animation-delay: 6.5s;
  opacity: 0.48;
}

.bubble--18 {
  left: 78%;
  width: 1px;
  height: 1px;
  animation: dust-b 38s ease-in-out infinite;
  animation-delay: 7.0s;
  opacity: 0.52;
}

/* dust-a: drifts right, rises lazily, bobs once */
@keyframes dust-a {
  0% {
    transform: translate(0, 0);
    opacity: 0;
  }

  5% {
    opacity: 1;
  }

  20% {
    transform: translate(30px, -12vh);
  }

  40% {
    transform: translate(55px, -28vh);
  }

  55% {
    transform: translate(40px, -35vh);
  }

  70% {
    transform: translate(70px, -52vh);
  }

  85% {
    transform: translate(50px, -68vh);
  }

  95% {
    opacity: 1;
  }

  100% {
    transform: translate(80px, -80vh);
    opacity: 0;
  }
}

/* dust-b: drifts left in a slow arc, rises ~60vh then fades */
@keyframes dust-b {
  0% {
    transform: translate(0, 0);
    opacity: 0;
  }

  5% {
    opacity: 1;
  }

  15% {
    transform: translate(-20px, -8vh);
  }

  35% {
    transform: translate(-50px, -22vh);
  }

  50% {
    transform: translate(-30px, -32vh);
  }

  65% {
    transform: translate(-65px, -46vh);
  }

  80% {
    transform: translate(-45px, -58vh);
  }

  95% {
    opacity: 1;
  }

  100% {
    transform: translate(-70px, -70vh);
    opacity: 0;
  }
}

/* dust-c: wanders side to side, moves up slowly — very floaty */
@keyframes dust-c {
  0% {
    transform: translate(0, 0);
    opacity: 0;
  }

  5% {
    opacity: 1;
  }

  10% {
    transform: translate(18px, -5vh);
  }

  25% {
    transform: translate(-12px, -14vh);
  }

  40% {
    transform: translate(28px, -24vh);
  }

  55% {
    transform: translate(-8px, -34vh);
  }

  70% {
    transform: translate(22px, -44vh);
  }

  85% {
    transform: translate(-18px, -54vh);
  }

  95% {
    opacity: 1;
  }

  100% {
    transform: translate(10px, -65vh);
    opacity: 0;
  }
}

/* dust-d: barely rises, drifts far sideways like surface dust */
@keyframes dust-d {
  0% {
    transform: translate(0, 0);
    opacity: 0;
  }

  5% {
    opacity: 1;
  }

  20% {
    transform: translate(40px, -6vh);
  }

  40% {
    transform: translate(80px, -10vh);
  }

  55% {
    transform: translate(60px, -8vh);
  }

  70% {
    transform: translate(100px, -16vh);
  }

  85% {
    transform: translate(75px, -22vh);
  }

  95% {
    opacity: 1;
  }

  100% {
    transform: translate(110px, -30vh);
    opacity: 0;
  }
}

/* ── Bubble-wipe page transition ── */
.bubble-wipe-enter-active,
.bubble-wipe-leave-active {
  transition: clip-path 0.55s cubic-bezier(0.65, 0, 0.35, 1),
    opacity 0.35s ease;
}

.bubble-wipe-enter-from {
  clip-path: circle(0% at 50% 50%);
  opacity: 0.6;
}

.bubble-wipe-enter-to {
  clip-path: circle(150% at 50% 50%);
  opacity: 1;
}

.bubble-wipe-leave-from {
  clip-path: circle(150% at 50% 50%);
  opacity: 1;
}

.bubble-wipe-leave-to {
  clip-path: circle(0% at 50% 50%);
  opacity: 0.6;
}
</style>
