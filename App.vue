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

/* ── Floating bubble layer ── */
.bubble-layer {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 50;
  overflow: hidden;
}

.bubble {
  position: absolute;
  bottom: -120px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 30%,
      rgba(255, 255, 255, 0.55) 0%,
      rgba(255, 255, 255, 0.12) 45%,
      rgba(255, 255, 255, 0.0) 100%);
  border: 1.5px solid rgba(255, 255, 255, 0.38);
  box-shadow:
    0 0 0 1.5px rgba(255, 255, 255, 0.12) inset,
    0 4px 24px rgba(255, 255, 255, 0.08);
  animation: bubble-rise linear infinite;
}

/* Generate 18 bubbles with varied sizes, positions, speeds */
.bubble--1 {
  left: 4%;
  width: 38px;
  height: 38px;
  animation-duration: 9s;
  animation-delay: 0s;
  opacity: 0.55;
}

.bubble--2 {
  left: 10%;
  width: 18px;
  height: 18px;
  animation-duration: 7s;
  animation-delay: 1.5s;
  opacity: 0.40;
}

.bubble--3 {
  left: 18%;
  width: 55px;
  height: 55px;
  animation-duration: 12s;
  animation-delay: 0.8s;
  opacity: 0.45;
}

.bubble--4 {
  left: 26%;
  width: 26px;
  height: 26px;
  animation-duration: 8s;
  animation-delay: 3.2s;
  opacity: 0.50;
}

.bubble--5 {
  left: 33%;
  width: 14px;
  height: 14px;
  animation-duration: 6s;
  animation-delay: 0.4s;
  opacity: 0.35;
}

.bubble--6 {
  left: 40%;
  width: 44px;
  height: 44px;
  animation-duration: 11s;
  animation-delay: 2.1s;
  opacity: 0.48;
}

.bubble--7 {
  left: 48%;
  width: 20px;
  height: 20px;
  animation-duration: 7.5s;
  animation-delay: 4.0s;
  opacity: 0.42;
}

.bubble--8 {
  left: 55%;
  width: 60px;
  height: 60px;
  animation-duration: 14s;
  animation-delay: 1.0s;
  opacity: 0.38;
}

.bubble--9 {
  left: 62%;
  width: 30px;
  height: 30px;
  animation-duration: 9s;
  animation-delay: 2.8s;
  opacity: 0.52;
}

.bubble--10 {
  left: 70%;
  width: 16px;
  height: 16px;
  animation-duration: 6.5s;
  animation-delay: 0.2s;
  opacity: 0.40;
}

.bubble--11 {
  left: 76%;
  width: 48px;
  height: 48px;
  animation-duration: 13s;
  animation-delay: 3.6s;
  opacity: 0.44;
}

.bubble--12 {
  left: 82%;
  width: 22px;
  height: 22px;
  animation-duration: 8s;
  animation-delay: 1.8s;
  opacity: 0.48;
}

.bubble--13 {
  left: 88%;
  width: 36px;
  height: 36px;
  animation-duration: 10s;
  animation-delay: 0.6s;
  opacity: 0.50;
}

.bubble--14 {
  left: 93%;
  width: 12px;
  height: 12px;
  animation-duration: 5.5s;
  animation-delay: 2.4s;
  opacity: 0.38;
}

.bubble--15 {
  left: 14%;
  width: 70px;
  height: 70px;
  animation-duration: 16s;
  animation-delay: 5.0s;
  opacity: 0.30;
}

.bubble--16 {
  left: 57%;
  width: 10px;
  height: 10px;
  animation-duration: 5s;
  animation-delay: 3.0s;
  opacity: 0.35;
}

.bubble--17 {
  left: 35%;
  width: 32px;
  height: 32px;
  animation-duration: 10.5s;
  animation-delay: 6.5s;
  opacity: 0.45;
}

.bubble--18 {
  left: 78%;
  width: 52px;
  height: 52px;
  animation-duration: 15s;
  animation-delay: 7.0s;
  opacity: 0.32;
}

@keyframes bubble-rise {
  0% {
    transform: translateY(0) translateX(0) scale(1);
    opacity: 0;
  }

  8% {
    opacity: 1;
  }

  /* gentle left-right sway */
  25% {
    transform: translateY(-25vh) translateX(18px) scale(1.02);
  }

  50% {
    transform: translateY(-50vh) translateX(-14px) scale(0.98);
  }

  75% {
    transform: translateY(-75vh) translateX(12px) scale(1.01);
  }

  92% {
    opacity: 1;
  }

  100% {
    transform: translateY(-110vh) translateX(0) scale(0.95);
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
