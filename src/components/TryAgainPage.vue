<template>
  <div class="page-tryagain" :style="backgroundStyle">
    <img :src="logoSrc" alt="Logo" class="logo" />

    <h1 class="title">BETTER LUCK<br>NEXT TIME!</h1>

    <div class="score-card">
      <p class="you-won">YOUR SCORE</p>
      <p class="score-number">{{ Number(score).toLocaleString() }}</p>
      <p class="score-label">your score</p>
      <p class="score-message">Give it another shot and catch more bubbles!</p>
    </div>

    <div class="buttoncontainer">
      <button type="button" class="tryagain-button" :class="{ loading: isLoading }" @mouseover="handleInteraction"
        @mouseout="handleMouseOut" @click="handleInteraction">
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
  name: "TryAgainPage",
  setup() {
    const router = useRouter();
    const route = useRoute();
    useFullscreen();
    const selectedLang = ref("english");
    const isLoading = ref(false);
    const score = ref(0);
    let hoverTimer = null;

    const buttonText = computed(() => {
      return "TRY AGAIN";
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
            name: "Instruction",
            query: { lang: selectedLang.value },
          });
        }, 500);
      }, 1000);
    };

    const handleMouseOut = () => {
      if (!isLoading.value) {
        clearTimeout(hoverTimer);
      }
    };

    onMounted(() => {
      const lang = route.query.lang;
      if (lang) selectedLang.value = lang;

      score.value = route.query.score || 0;
    });

    return {
      isLoading,
      buttonText,
      backgroundStyle,
      logoSrc,
      score,
      handleInteraction,
      handleMouseOut,
    };
  },
};
</script>

<style scoped lang="scss">
.page-tryagain {
  @include fullscreen;
  @include background-cover;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 32px 60px;
  box-sizing: border-box;
}

.logo {
  width: 220px;
  margin-bottom: 24px;
}

.title {
  font-size: 38px;
  color: #8b0000;
  font-weight: 900;
  margin: 0 0 32px;
  text-align: center;
  letter-spacing: 2px;
}

.score-card {
  background: rgba(255, 255, 255, 0.75);
  border-radius: 28px;
  padding: 44px 52px;
  text-align: center;
  width: 360px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.9);
}

.you-won {
  font-size: 26px;
  color: #8b0000;
  font-weight: 700;
  margin: 0 0 12px;
}

.score-number {
  font-size: 80px;
  color: #8b0000;
  font-weight: 900;
  margin: 0 0 4px;
  line-height: 1;
}

.score-label {
  font-size: 18px;
  color: #8b0000;
  font-weight: 400;
  text-transform: lowercase;
  margin: 0 0 24px;
}

.score-message {
  font-size: 14px;
  color: #8b0000;
  font-weight: 400;
  text-transform: none;
  margin: 0;
  line-height: 1.6;
}

.tryagain-button {
  @include bubble-button;
}

.buttoncontainer {
  margin-top: auto;
  display: flex;
  justify-content: center;
}
</style>
