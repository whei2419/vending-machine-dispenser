<template>
  <div class="page-tryagain" :style="backgroundStyle">
    <img
      :src="logoSrc"
      alt="Logo"
      style="
        position: absolute;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 1000;
        max-width: 273px;
      "
    />
    <div class="score">
      <p id="score">{{ score }}</p>
    </div>

    <div class="individual-scores">
      <span id="appleScore">{{ apple }}</span>
      <span id="bananaScore">{{ banana }}</span>
      <span id="carrotScore">{{ carrot }}</span>
      <span id="eggScore">{{ egg }}</span>
      <span id="milkScore">{{ milk }}</span>
    </div>

    <div class="buttoncontainer">
      <button
        id="tryAgainButton"
        type="button"
        class="tryagain-button"
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
import bgEnglish from "@/assets/dutch/tryagain.webp";
import logoImg from "@/assets/dutch/logo.webp";
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
    const apple = ref(0);
    const banana = ref(0);
    const carrot = ref(0);
    const egg = ref(0);
    const milk = ref(0);
    let hoverTimer = null;

    const buttonText = computed(() => {
      return "CUBA LAGI";
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
      }
    };

    onMounted(() => {
      const lang = route.query.lang;
      if (lang) selectedLang.value = lang;

      score.value = route.query.score || 0;
      apple.value = route.query.apple || 0;
      banana.value = route.query.banana || 0;
      carrot.value = route.query.carrot || 0;
      egg.value = route.query.egg || 0;
      milk.value = route.query.milk || 0;
    });

    return {
      isLoading,
      buttonText,
      backgroundStyle,
      logoSrc,
      score,
      apple,
      banana,
      carrot,
      egg,
      milk,
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
}

.tryagain-button {
  background-color: $primary-color;
  color: $white;
  border: 10px solid $primary-color;
  font-size: 48px;
  cursor: pointer;
  width: 420px;
  height: 110px;
  border-radius: 70px;
  position: relative;
  @include flex-center;

  &.loading::after {
    content: "";
    position: absolute;
    width: 20px;
    height: 20px;
    right: 25px;
    top: 25px;
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

.score {
  font-size: 120px;
  color: $primary-color;
  position: absolute;
  bottom: 335px;
  left: 50%;
  transform: translateX(-50%);
}

.buttoncontainer {
  position: absolute;
  bottom: 11%;
  left: 50%;
  transform: translateX(-50%);
}

#score {
  font-size: 84px;
  color: $primary-color;
  padding: 0;
  margin: 0;
  line-height: 117px;
}

.individual-scores span {
  font-size: 50px;
  color: #114a9f;
  position: absolute;
  z-index: 99;
  display: block;
  text-align: left;
}

#appleScore {
  top: 605px;
  left: 400px;
}

#bananaScore {
  top: 605px;
  left: 179px;
}

#carrotScore {
  top: 605px;
  left: 862px;
}

#eggScore {
  top: 605px;
  left: 620px;
}

#milkScore {
  top: 477px;
  left: 500px;
}
</style>
