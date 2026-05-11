<template>
  <div class="config-page" :style="backgroundStyle">
    <img :src="logoSrc" alt="Logo" class="logo" />

    <h1 class="title">GAME SETTINGS</h1>

    <div class="config-container">

      <form @submit.prevent="saveConfiguration">
        <div class="config-section">
          <h2>Object Scores</h2>
          <div class="config-group">
            <label for="appleScore">Good Bubble 1 Score:</label>
            <input type="number" id="appleScore" v-model.number="config.appleScore" min="0" max="100000" step="100" />
          </div>
          <div class="config-group">
            <label for="bananaScore">Good Bubble 2 Score:</label>
            <input type="number" id="bananaScore" v-model.number="config.bananaScore" min="0" max="100000" step="100" />
          </div>
          <div class="config-group">
            <label for="carrotScore">Good Bubble 3 Score:</label>
            <input type="number" id="carrotScore" v-model.number="config.carrotScore" min="0" max="100000" step="100" />
          </div>
          <div class="config-group">
            <label for="negativeScore">Bad Bubble Score:</label>
            <input type="number" id="negativeScore" v-model.number="config.negativeScore" min="-100000" max="0"
              step="100" />
          </div>
        </div>

        <div class="config-section">
          <h2>Game Settings</h2>
          <div class="config-group">
            <label for="winScore">Win Score Threshold:</label>
            <input type="number" id="winScore" v-model.number="config.winScore" min="1000" max="1000000" step="1000" />
            <span class="help-text">Score needed to reach finish page</span>
          </div>
          <div class="config-group">
            <label for="gameTimer">Game Duration (seconds):</label>
            <input type="number" id="gameTimer" v-model.number="config.gameTimer" min="10" max="300" />
          </div>
          <div class="config-group">
            <label for="objectScale">Object Scale (0.1 - 2.0):</label>
            <input type="number" id="objectScale" v-model.number="config.objectScale" min="0.1" max="2" step="0.05" />
            <span class="help-text">Visual scale applied to falling objects</span>
          </div>
        </div>

        <div class="config-section">
          <h2>Game Speed</h2>
          <div class="config-group">
            <label for="initialSpawnDelay">Initial Spawn Delay (ms):</label>
            <input type="number" id="initialSpawnDelay" v-model.number="config.initialSpawnDelay" min="100" max="5000"
              step="100" />
            <span class="help-text">Time between object spawns at start</span>
          </div>
          <div class="config-group">
            <label for="minSpawnDelay">Minimum Spawn Delay (ms):</label>
            <input type="number" id="minSpawnDelay" v-model.number="config.minSpawnDelay" min="100" max="2000"
              step="100" />
            <span class="help-text">Fastest spawn rate possible</span>
          </div>
          <div class="config-group">
            <label for="initialGravity">Initial Gravity:</label>
            <input type="number" id="initialGravity" v-model.number="config.initialGravity" min="100" max="1000"
              step="50" />
            <span class="help-text">Starting fall speed</span>
          </div>
          <div class="config-group">
            <label for="maxGravity">Maximum Gravity:</label>
            <input type="number" id="maxGravity" v-model.number="config.maxGravity" min="200" max="2000" step="50" />
            <span class="help-text">Maximum fall speed</span>
          </div>
        </div>

        <div class="config-section">
          <h2>Idle Settings</h2>
          <div class="config-group">
            <label for="idleTimeout">Idle Video Delay (seconds):</label>
            <input type="number" id="idleTimeout" v-model.number="config.idleTimeout" min="5" max="300" step="5" />
            <span class="help-text">Time before idle video appears on Start screen</span>
          </div>
        </div>

        <div class="button-group">
          <button type="submit" class="save-button">Save</button>
          <button type="button" class="reset-button" @click="resetToDefaults">
            Reset
          </button>
          <button type="button" class="back-button" @click="goBack">
            Back
          </button>
        </div>
      </form>

      <div v-if="message.show" :class="['message', message.type]">
        {{ message.text }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useFullscreen } from "@/composables/useFullscreen";
import bgEnglish from "@/assets/images/plain.webp";
import logoImg from "@/assets/images/001_Logo.webp";

const backgroundStyle = computed(() => ({ backgroundImage: `url(${bgEnglish})` }));
const logoSrc = computed(() => logoImg);

const router = useRouter();
useFullscreen();

const DEFAULT_CONFIG = {
  appleScore: 1000,
  bananaScore: 1000,
  carrotScore: 1000,
  objectScale: 0.9,
  negativeScore: -1000,
  winScore: 24000,
  gameTimer: 30,
  initialSpawnDelay: 1200,
  minSpawnDelay: 600,
  initialGravity: 300,
  maxGravity: 900,
  idleTimeout: 30,
};

const config = ref({ ...DEFAULT_CONFIG });
const message = ref({
  show: false,
  text: "",
  type: "success",
});

// Load configuration from localStorage
const loadConfig = () => {
  const savedConfig = localStorage.getItem("gameConfig");
  if (savedConfig) {
    config.value = JSON.parse(savedConfig);
  }
};

// Save configuration
const saveConfiguration = () => {
  localStorage.setItem("gameConfig", JSON.stringify(config.value));
  showMessage("Configuration saved successfully!", "success");
};

// Reset to defaults
const resetToDefaults = () => {
  if (
    confirm("Are you sure you want to reset all settings to default values?")
  ) {
    config.value = { ...DEFAULT_CONFIG };
    localStorage.setItem("gameConfig", JSON.stringify(config.value));
    showMessage("Configuration reset to defaults!", "success");
  }
};

// Show message
const showMessage = (text, type) => {
  message.value = {
    show: true,
    text,
    type,
  };

  setTimeout(() => {
    message.value.show = false;
  }, 3000);
};

// Go back
const goBack = () => {
  router.push("/");
};

onMounted(() => {
  loadConfig();
});
</script>

<style scoped lang="scss">
.config-page {
  @include fullscreen;
  @include background-cover;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 48px 60px;
  box-sizing: border-box;
  overflow-y: auto;
}

.logo {
  width: 434px;
  margin-bottom: 60px;
  margin-top: 60px;
  flex-shrink: 0;
}

.title {
  font-size: 70px;
  color: #8b0000;
  font-weight: 900;
  margin: 0 0 48px;
  text-align: center;
  letter-spacing: 2px;
}

.config-container {
  background:
    radial-gradient(ellipse at 40% 15%, rgba(255, 255, 255, 0.55) 0%, transparent 60%),
    linear-gradient(135deg, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.10) 100%);
  border-radius: 36px;
  padding: 48px 60px;
  width: 90%;
  box-sizing: border-box;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.10), 0 1.5px 0 rgba(255, 255, 255, 0.7) inset;
  border: 1.5px solid rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(18px) saturate(1.6);
  -webkit-backdrop-filter: blur(18px) saturate(1.6);
  margin-bottom: 60px;
}

h2 {
  font-size: 22px;
  color: #8b0000;
  font-weight: 700;
  margin: 0 0 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid rgba(139, 0, 0, 0.25);
}

.config-section {
  margin-bottom: 36px;
}

.config-group {
  margin-bottom: 16px;
}

.config-group label {
  display: block;
  font-weight: 600;
  color: #8b0000;
  margin-bottom: 4px;
  font-size: 15px;
}

.config-group input[type="number"] {
  width: 100%;
  padding: 10px 14px;
  font-size: 16px;
  color: #8b0000;
  background: rgba(255, 255, 255, 0.55);
  border: 1.5px solid rgba(139, 0, 0, 0.25);
  border-radius: 10px;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.config-group input[type="number"]:focus {
  outline: none;
  border-color: #8b0000;
  background: rgba(255, 255, 255, 0.75);
}

.help-text {
  display: block;
  font-size: 12px;
  color: rgba(139, 0, 0, 0.6);
  margin-top: 4px;
  font-style: italic;
}

.button-group {
  display: flex;
  gap: 16px;
  margin-top: 36px;
  flex-wrap: wrap;
  justify-content: center;
}

.save-button,
.reset-button,
.back-button {
  @include bubble-button;
  flex: 1;
  min-width: 120px;
  font-size: 28px !important;
  padding: 18px 32px !important;
  min-height: unset !important;
}

.message {
  margin-top: 20px;
  padding: 14px;
  border-radius: 12px;
  text-align: center;
  font-weight: 600;
  font-size: 16px;
}

.message.success {
  background: rgba(139, 0, 0, 0.08);
  color: #8b0000;
  border: 1px solid rgba(139, 0, 0, 0.2);
}

.message.error {
  background: rgba(200, 0, 0, 0.1);
  color: #8b0000;
  border: 1px solid rgba(200, 0, 0, 0.3);
}
</style>
