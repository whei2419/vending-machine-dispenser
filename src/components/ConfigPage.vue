<template>
  <div class="config-page">
    <div class="config-container">
      <h1>Game Configuration</h1>

      <form @submit.prevent="saveConfiguration">
        <div class="config-section">
          <h2>Object Scores</h2>
          <div class="config-group">
            <label for="appleScore">Apple Score:</label>
            <input
              type="number"
              id="appleScore"
              v-model.number="config.appleScore"
              min="-10"
              max="10"
            />
          </div>
          <div class="config-group">
            <label for="bananaScore">Banana Score:</label>
            <input
              type="number"
              id="bananaScore"
              v-model.number="config.bananaScore"
              min="-10"
              max="10"
            />
          </div>
          <div class="config-group">
            <label for="carrotScore">Carrot Score:</label>
            <input
              type="number"
              id="carrotScore"
              v-model.number="config.carrotScore"
              min="-10"
              max="10"
            />
          </div>
          <div class="config-group">
            <label for="eggScore">Egg Score:</label>
            <input
              type="number"
              id="eggScore"
              v-model.number="config.eggScore"
              min="-10"
              max="10"
            />
          </div>
          <div class="config-group">
            <label for="milkScore">Milk Score (Special):</label>
            <input
              type="number"
              id="milkScore"
              v-model.number="config.milkScore"
              min="-10"
              max="20"
            />
          </div>
          <div class="config-group">
            <label for="negativeScore">Negative Objects Score:</label>
            <input
              type="number"
              id="negativeScore"
              v-model.number="config.negativeScore"
              min="-10"
              max="10"
            />
          </div>
        </div>

        <div class="config-section">
          <h2>Game Settings</h2>
          <div class="config-group">
            <label for="winScore">Win Score Threshold:</label>
            <input
              type="number"
              id="winScore"
              v-model.number="config.winScore"
              min="1"
              max="1000"
            />
            <span class="help-text">Score needed to reach finish page</span>
          </div>
          <div class="config-group">
            <label for="gameTimer">Game Duration (seconds):</label>
            <input
              type="number"
              id="gameTimer"
              v-model.number="config.gameTimer"
              min="10"
              max="300"
            />
          </div>
        </div>

        <div class="config-section">
          <h2>Game Speed</h2>
          <div class="config-group">
            <label for="initialSpawnDelay">Initial Spawn Delay (ms):</label>
            <input
              type="number"
              id="initialSpawnDelay"
              v-model.number="config.initialSpawnDelay"
              min="100"
              max="5000"
              step="100"
            />
            <span class="help-text">Time between object spawns at start</span>
          </div>
          <div class="config-group">
            <label for="minSpawnDelay">Minimum Spawn Delay (ms):</label>
            <input
              type="number"
              id="minSpawnDelay"
              v-model.number="config.minSpawnDelay"
              min="100"
              max="2000"
              step="100"
            />
            <span class="help-text">Fastest spawn rate possible</span>
          </div>
          <div class="config-group">
            <label for="initialGravity">Initial Gravity:</label>
            <input
              type="number"
              id="initialGravity"
              v-model.number="config.initialGravity"
              min="100"
              max="1000"
              step="50"
            />
            <span class="help-text">Starting fall speed</span>
          </div>
          <div class="config-group">
            <label for="maxGravity">Maximum Gravity:</label>
            <input
              type="number"
              id="maxGravity"
              v-model.number="config.maxGravity"
              min="200"
              max="2000"
              step="50"
            />
            <span class="help-text">Maximum fall speed</span>
          </div>
        </div>

        <div class="button-group">
          <button type="submit" class="save-button">Save Configuration</button>
          <button type="button" class="reset-button" @click="resetToDefaults">
            Reset to Defaults
          </button>
          <button type="button" class="back-button" @click="goBack">
            Back to Game
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
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useFullscreen } from "@/composables/useFullscreen";

const router = useRouter();
useFullscreen();

const DEFAULT_CONFIG = {
  appleScore: 1,
  bananaScore: 1,
  carrotScore: 1,
  eggScore: 1,
  milkScore: 3,
  negativeScore: -1,
  winScore: 20,
  gameTimer: 30,
  initialSpawnDelay: 1200,
  minSpawnDelay: 600,
  initialGravity: 300,
  maxGravity: 900,
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
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  box-sizing: border-box;
  overflow-y: auto;
}

.config-container {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

h1 {
  color: #333;
  text-align: center;
  margin-bottom: 30px;
  font-size: 32px;
}

h2 {
  color: #555;
  font-size: 24px;
  margin-top: 0;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #f37021;
}

.config-section {
  margin-bottom: 40px;
}

.config-group {
  margin-bottom: 20px;
}

.config-group label {
  display: block;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
  font-size: 16px;
}

.config-group input[type="number"] {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 2px solid #ddd;
  border-radius: 5px;
  box-sizing: border-box;
  transition: border-color 0.3s;
}

.config-group input[type="number"]:focus {
  outline: none;
  border-color: #f37021;
}

.help-text {
  display: block;
  font-size: 12px;
  color: #666;
  margin-top: 5px;
  font-style: italic;
}

.button-group {
  display: flex;
  gap: 10px;
  margin-top: 30px;
  flex-wrap: wrap;
}

button {
  flex: 1;
  padding: 15px 30px;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  min-width: 150px;
}

.save-button {
  background-color: #4caf50;
  color: white;
}

.save-button:hover {
  background-color: #45a049;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(76, 175, 80, 0.3);
}

.reset-button {
  background-color: #ff9800;
  color: white;
}

.reset-button:hover {
  background-color: #e68900;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 152, 0, 0.3);
}

.back-button {
  background-color: #2196f3;
  color: white;
}

.back-button:hover {
  background-color: #0b7dda;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(33, 150, 243, 0.3);
}

.message {
  margin-top: 20px;
  padding: 15px;
  border-radius: 5px;
  text-align: center;
  font-weight: bold;
}

.message.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.message.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

@media (max-width: 600px) {
  .config-container {
    padding: 20px;
  }

  .button-group {
    flex-direction: column;
  }

  button {
    width: 100%;
  }
}
</style>
