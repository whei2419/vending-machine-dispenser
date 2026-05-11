<template>
  <div class="page-dispenser" :style="backgroundStyle">
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
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useFullscreen } from "@/composables/useFullscreen";
import bgEnglish from "@/assets/images/plain.webp";
import logoImg from "@/assets/images/001_Logo.webp";
import selectSoundFile from "@/assets/audio/select-sound.mp3";
import completeSoundFile from "@/assets/audio/completed.mp3";

export default {
  name: "SpecialPage",
  setup() {
    const router = useRouter();
    const route = useRoute();
    useFullscreen();
    const selectedLang = ref("english");
    const isLoading = ref(false);
    let hoverTimer = null;

    const buttonText = computed(() => {
      return "FINISH";
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
          name: "Start",
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
    });

    return {
      isLoading,
      buttonText,
      backgroundStyle,
      logoSrc,
      handleInteraction,
      handleMouseOut,
      goToConfig,
    };
  },
};
</script>

<style scoped lang="scss">
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
  bottom: 44%;
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
