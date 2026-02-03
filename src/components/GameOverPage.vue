<template>
  <div class="page-gameover" :style="backgroundStyle">
    <img
      :src="logoSrc"
      alt="Logo"
      style="
        position: absolute;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 1000;
        max-width: 200px;
      "
    />
    <div class="buttoncontainer">
      <button
        id="startButton"
        class="start-button"
        :class="{ loading: isLoading }"
        @mouseover="handleInteraction"
        @mouseout="handleMouseOut"
        @click="handleInteraction"
      >
        {{ buttonText }}
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useFullscreen } from "@/composables/useFullscreen";
import logoImg from "@/assets/dutch/logo.webp";
import selectSoundFile from "@/assets/audio/select-sound.mp3";
import completeSoundFile from "@/assets/audio/completed.mp3";

export default {
  name: "GameOverPage",
  setup() {
    const router = useRouter();
    const route = useRoute();
    useFullscreen();
    const selectedLang = ref("english");
    const isLoading = ref(false);
    let hoverTimer = null;

    const buttonText = computed(() => {
      return selectedLang.value === "chinese" ? "再试一次" : "Try Again";
    });

    const backgroundStyle = computed(() => {
      // Using placeholder background - update when actual assets are available
      return { backgroundColor: "#002f87" };
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
        setTimeout(() => {
          router.push({
            name: "Start",
            query: { lang: selectedLang.value },
          });
        }, 500);
      }, 1000);
    };

    const handleMouseOut = () => {
      if (!isLoading.value) {
        clearTimeout(hoverTimer);
        isLoading.value = false;
      }
    };

    onMounted(() => {
      const lang = route.query.lang;
      if (lang === "chinese") {
        selectedLang.value = "chinese";
      }
    });

    return {
      isLoading,
      buttonText,
      backgroundStyle,
      logoSrc,
      handleInteraction,
      handleMouseOut,
    };
  },
};
</script>

<style scoped lang="scss">
.page-gameover {
  @include fullscreen;
  @include background-cover;
  position: relative;
}

.start-button {
  background-color: $primary-color;
  color: $white;
  border: 10px solid $primary-color;
  font-size: 48px;
  cursor: pointer;
  width: 400px;
  height: 110px;
  border-radius: 70px;
  position: relative;
  @include flex-center;

  &.loading::after {
    content: "";
    position: absolute;
    width: 20px;
    height: 20px;
    right: 20px;
    top: 20px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spinner 0.6s linear infinite;
  }
}

@keyframes spinner {
  to {
    transform: rotate(360deg);
  }
}

.buttoncontainer {
  position: absolute;
  bottom: 10%;
  left: 50%;
  transform: translateX(-50%);
}
</style>
