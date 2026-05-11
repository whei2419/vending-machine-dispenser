<template>
  <div class="page-dispenser" :style="backgroundStyle" @mousemove="resetIdleTimer" @mousedown="resetIdleTimer"
    @touchstart="resetIdleTimer" @keydown="resetIdleTimer">
    <!-- Idle video overlay -->
    <Transition name="idle-fade">
      <div v-if="isIdle" class="idle-overlay" @click="resetIdleTimer" @touchstart="resetIdleTimer">
        <video ref="idleVideo" class="idle-video" src="@/assets/video/idlevideo.mp4" autoplay loop playsinline />
      </div>
    </Transition>

    <button class="config-button" @click="goToConfig" title="Settings" aria-label="Settings">
      <i class="fa-solid fa-gear"></i>
    </button>
    <!-- <img
      :src="logoSrc"
      alt="Logo"
      @click="goToConfig"
      style="
        position: absolute;
        top: 107px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 1000;
        max-width: 323px;
        cursor: pointer;
      "
    /> -->
    <div class="buttoncontainer">
      <button id="startButton" type="button" class="start-button" :class="{ loading: isLoading }"
        @mouseover="handleInteraction" @mouseout="handleMouseOut" @click="handleInteraction">
        {{ buttonText }}
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useFullscreen } from "@/composables/useFullscreen";
import bgEnglish from "@/assets/images/startPage.webp";
import logoImg from "@/assets/images/001_Logo.webp";
import selectSoundFile from "@/assets/audio/select-sound.mp3";
import completeSoundFile from "@/assets/audio/completed.mp3";

const IDLE_TIMEOUT_MS = 5000;

export default {
  name: "StartPage",
  setup() {
    const router = useRouter();
    const route = useRoute();
    useFullscreen();
    const selectedLang = ref("english");
    const isLoading = ref(false);
    const isIdle = ref(false);
    const idleVideo = ref(null);
    let hoverTimer = null;
    let idleTimer = null;

    const startIdleTimer = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        isIdle.value = true;
      }, IDLE_TIMEOUT_MS);
    };

    const resetIdleTimer = () => {
      if (isIdle.value) {
        isIdle.value = false;
      }
      startIdleTimer();
    };

    const buttonText = computed(() => {
      return selectedLang.value === "chinese" ? "开始" : "START";
    });

    const backgroundStyle = computed(() => {
      // Using the same background for both languages since Chinese version doesn't exist
      return { backgroundImage: `url(${bgEnglish})` };
    });

    const logoSrc = computed(() => logoImg);

    const handleInteraction = () => {
      if (isLoading.value) return;

      isLoading.value = true;
      const clickSound = new Audio(selectSoundFile);
      const completeSound = new Audio(completeSoundFile);
      clickSound.play();

      hoverTimer = setTimeout(() => {
        completeSound.play();
        router.push({
          name: "Instruction",
          query: { lang: selectedLang.value },
        });
      }, 1000);
    };

    const handleMouseOut = () => {
      if (!isLoading.value) {
        clearTimeout(hoverTimer);
      }
    };

    const goToConfig = () => {
      router.push({ name: "Config" });
    };

    onMounted(() => {
      const lang = route.query.lang;
      if (lang === "chinese") {
        selectedLang.value = "chinese";
      }
      startIdleTimer();
    });

    onUnmounted(() => {
      clearTimeout(idleTimer);
      clearTimeout(hoverTimer);
    });

    return {
      isLoading,
      isIdle,
      idleVideo,
      buttonText,
      backgroundStyle,
      logoSrc,
      handleInteraction,
      handleMouseOut,
      goToConfig,
      resetIdleTimer,
    };
  },
};
</script>

<style scoped lang="scss">
.idle-overlay {
  position: fixed;
  inset: 0;
  z-index: 2000;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.idle-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.idle-fade-enter-active,
.idle-fade-leave-active {
  transition: opacity 0.6s ease;
}

.idle-fade-enter-from,
.idle-fade-leave-to {
  opacity: 0;
}

.page-dispenser {
  @include fullscreen;
  @include background-cover;
  position: relative;

  // The background is set dynamically via :style binding
}

.start-button {
  @include bubble-button;
}

.buttoncontainer {
  position: absolute;
  bottom: 10%;
  left: 50%;
  transform: translateX(-50%);
}

.config-button {
  position: absolute;
  top: 18px;
  left: 18px;
  z-index: 1100;
  background: rgba(0, 0, 0, 0.35);
  border: none;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 6px;
}

.config-button:hover {
  background: rgba(0, 0, 0, 0.5);
}

.config-button i {
  color: #fff;
  font-size: 20px;
}
</style>
