<template>
  <div class="page-tryagain" :style="backgroundStyle">
    <img :src="logoSrc" alt="Logo" class="logo" />

    <h1 class="title">TRY AGAIN</h1>

    <div class="score-card">
      <p class="you-won">YOUR SCORE</p>
      <p class="score-number">{{ Number(score).toLocaleString() }}</p>
      <p class="score-label">your score</p>
      <p class="score-message">Opssss.. So close please try again</p>
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
  padding: 60px 48px 220px;
  box-sizing: border-box;
}

.logo {
  width: 434px;
  margin-bottom: 100px;
  margin-top: 100px;
}

.title {
  font-size: 70px;
  color: #8b0000;
  font-weight: 900;
  margin: 0 0 200px;
  text-align: center;
  align-self: center;
  letter-spacing: 2px;
}

.score-card {
  background:
    radial-gradient(ellipse at 40% 15%, rgba(255, 255, 255, 0.55) 0%, transparent 60%),
    linear-gradient(135deg, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.10) 100%);
  border-radius: 36px;
  padding: 52px 60px;
  text-align: center;
  width: 70%;
  box-sizing: border-box;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.10), 0 1.5px 0 rgba(255, 255, 255, 0.7) inset;
  border: 1.5px solid rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(18px) saturate(1.6);
  -webkit-backdrop-filter: blur(18px) saturate(1.6);
}

.you-won {
  font-size: 70px;
  color: #8b0000;
  font-weight: 700;
  margin: 0 0 90px;
}

.score-number {
  font-size: 150px;
  color: #8b0000;
  font-weight: 900;
  margin: 0 0 10px;
  line-height: 1;
}

.score-label {
  font-size: 30px;
  color: #8b0000;
  font-weight: 400;
  text-transform: lowercase;
  margin: 0 0 50px;
}

.score-message {
  font-size: 16px;
  color: #8b0000;
  font-weight: 400;
  margin: 0;
  line-height: 1.6;
}

.tryagain-button {
  @include bubble-button;
}

.buttoncontainer {
  position: absolute;
  bottom: 200px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
}
</style>
