<template>
  <div class="page-instruction" :style="backgroundStyle">
    <!-- <img
      :src="logoSrc"
      alt="Logo"
      style="
        position: absolute;
        top: 34px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 1000;
        max-width: 283px;
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
import bgEnglish from "@/assets/images/instructionPage.webp";
import logoImg from "@/assets/images/001_Logo.webp";
import selectSoundFile from "@/assets/audio/select-sound.mp3";
import completeSoundFile from "@/assets/audio/completed.mp3";

export default {
  name: "InstructionPage",
  setup() {
    const router = useRouter();
    const route = useRoute();
    useFullscreen();
    const selectedLang = ref("english");
    const isLoading = ref(false);
    let hoverTimer = null;

    const buttonText = computed(() => {
      return "NEXT";
    });

    const backgroundStyle = computed(() => {
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
        setTimeout(() => {
          router.push({
            name: "Game",
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
.page-instruction {
  @include fullscreen;
  @include background-cover;
  position: relative;
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
</style>
