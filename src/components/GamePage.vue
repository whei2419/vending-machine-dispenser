<template>
  <div class="page-game">
    <div id="preloadBackground" :style="{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundImage: `url(${mainBg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      zIndex: 0,
    }"></div>
    <!-- config button moved to StartPage (top-left) -->
    <div id="gameContainer" style="position: relative; z-index: 1"></div>
  </div>
</template>

<script>
import { onMounted, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useFullscreen } from "@/composables/useFullscreen";
import Phaser from "phaser";
import mainBg from "@/assets/images/plain.webp";

// Import all game assets
import collectSoundFile from "@/assets/audio/collect bird nest.mp3";
import winSoundFile from "@/assets/audio/game won.mp3";
import countDownSoundFile from "@/assets/audio/countdownsound.mp3";
import bgSoundFile from "@/assets/audio/bg.mp3";
import buzzerSoundFile from "@/assets/audio/long-buzzer.mp3";
import wrongSoundFile from "@/assets/audio/wrong item.mp3";

import goodBubble1Img from "@/assets/images/fallingObjects/good1.webp";
import goodBubble2Img from "@/assets/images/fallingObjects/good2.webp";
import goodBubble3Img from "@/assets/images/fallingObjects/good3.webp";
import badBubbleImg from "@/assets/images/fallingObjects/003_Bad Bubble.webp";

import explosionImg from "@/assets/images/exp.png";
import countdownImg from "@/assets/images/countdown.webp";
import countdownReadyImg from "@/assets/dutch/countdown_reaady.webp";
import bowlImg from "@/assets/images/003_Product.webp";
import timerImg from "@/assets/images/001_Time.webp";
import totalScoreImg from "@/assets/images/001_Total.webp";
import milkSplashImg from "@/assets/dutch/milk splash.png";

export default {
  name: "GamePage",
  setup() {
    const router = useRouter();
    const route = useRoute();
    useFullscreen();

    let game = null;
    const lang = route.query.lang || "english";

    // Game configuration from localStorage or defaults
    const getConfig = () => {
      const savedConfig = localStorage.getItem("gameConfig");
      if (savedConfig) {
        try {
          const cfg = JSON.parse(savedConfig);
          let migrated = false;
          if (cfg.appleScore === 1) {
            cfg.appleScore = 1000;
            migrated = true;
          }
          if (cfg.bananaScore === 1) {
            cfg.bananaScore = 1000;
            migrated = true;
          }
          if (cfg.carrotScore === 1) {
            cfg.carrotScore = 1000;
            migrated = true;
          }
          if (migrated) localStorage.setItem("gameConfig", JSON.stringify(cfg));
          return cfg;
        } catch (e) {
          return JSON.parse(savedConfig);
        }
      }
      return {
        appleScore: 1000,
        bananaScore: 1000,
        carrotScore: 1000,
        // egg and milk removed
        objectScale: 0.45,
        negativeScore: -1,
        winScore: 20,
        gameTimer: 30,
        initialSpawnDelay: 1200,
        minSpawnDelay: 600,
        initialGravity: 300,
        maxGravity: 900,
      };
    };

    const gameConfig = getConfig();

    const initGame = () => {
      const cacheBuster = "?v=" + Date.now();
      let timer = gameConfig.gameTimer;
      let score = 0;
      let appleScore = 0;
      let bananaScore = 0;
      let carrotScore = 0;

      const config = {
        type: Phaser.AUTO,
        width: window.innerWidth,
        height: window.innerHeight,
        parent: "gameContainer",
        backgroundColor: "transparent",
        render: {
          antialias: true,
          pixelArt: false,
          roundPixels: true,
          transparent: true,
        },
        physics: {
          default: "arcade",
          arcade: {
            gravity: { y: 0 },
            debug: false,
          },
        },
        scene: {
          preload: preload,
          create: create,
          update: update,
        },
      };

      function preload() {
        this.load.audio("collectSound", collectSoundFile);
        this.load.audio("win", winSoundFile);
        this.load.audio("countDown", countDownSoundFile);
        this.load.audio("bg-sound", bgSoundFile);
        this.load.audio("buzzer", buzzerSoundFile);
        this.load.audio("wrongSound", wrongSoundFile);

        this.load.image("gamebg", mainBg);

        this.fallingObjects = [
          {
            key: "apple",
            path: goodBubble1Img,
            type: "normal",
            points: gameConfig.appleScore,
          },
          {
            key: "banana",
            path: goodBubble2Img,
            type: "normal",
            points: gameConfig.bananaScore,
          },
          {
            key: "carrot",
            path: goodBubble3Img,
            type: "normal",
            points: gameConfig.carrotScore,
          },
          {
            key: "badBubble",
            path: badBubbleImg,
            type: "negative",
            points: gameConfig.negativeScore,
          },
        ];

        this.fallingObjects.forEach((obj) => {
          this.load.image(obj.key, obj.path);
        });

        this.load.spritesheet("explosion", explosionImg, {
          frameWidth: 300,
          frameHeight: 300,
        });
        this.load.image("countdown", countdownImg);
        this.load.image("countdownReady", countdownReadyImg);
        this.load.image("bowl", bowlImg);
        this.load.image("timerContainerBg", timerImg);
        this.load.image("scoreContainerBg", totalScoreImg);
        this.load.image("milkSplash", milkSplashImg);
      }

      function create() {
        const preloadBg = document.getElementById("preloadBackground");
        if (preloadBg) {
          preloadBg.style.transition = "opacity 0.3s";
          preloadBg.style.opacity = "0";
          setTimeout(() => preloadBg.remove(), 300);
        }

        this.physics.world.setBounds(
          0,
          0,
          this.cameras.main.width,
          this.cameras.main.height,
        );

        this.anims.create({
          key: "explosion",
          frames: this.anims.generateFrameNumbers("explosion", {
            start: 0,
            end: 21,
          }),
          frameRate: 16,
          repeat: 0,
          hideOnComplete: true,
        });

        this.collectSound = this.sound.add("collectSound");
        this.winSound = this.sound.add("win");
        this.countdownSound = this.sound.add("countDown");
        this.bgSound = this.sound.add("bg-sound", { loop: true });
        this.buzzerSound = this.sound.add("buzzer", { loop: false });
        this.wrongSound = this.sound.add("wrongSound");

        this.countdownSound.play();

        this.background = this.add
          .image(this.cameras.main.centerX, this.cameras.main.centerY, "gamebg")
          .setOrigin(0.5);
        this.background.setDisplaySize(
          this.cameras.main.width,
          this.cameras.main.height,
        );
        this.background.setScale(
          Math.max(
            this.cameras.main.width / this.background.width,
            this.cameras.main.height / this.background.height,
          ),
        );


        this.bowl = this.add.sprite(0, -40, "bowl").setOrigin(0.5);
        this.bowl.setScale(0.4);
        const bowlWidth = this.bowl.displayWidth;
        const bowlHeight = this.bowl.displayHeight;

        this.bowlContainer = this.add.container(
          this.cameras.main.centerX,
          this.cameras.main.height - 250,
          [this.bowl],
        );
        this.bowlContainer.setSize(bowlWidth, bowlHeight);
        this.physics.world.enable(this.bowlContainer);
        this.bowlContainer.body.setCollideWorldBounds(true);
        this.bowlContainer.body.setSize(bowlWidth * 0.8, bowlHeight * 0.4);
        this.bowlContainer.body.setOffset(bowlWidth * 0.1, 40);

        // Increase fall speed: reduce spawn delay and boost gravity
        this.spawnDelay = Math.max(
          100,
          Math.round(gameConfig.initialSpawnDelay * 0.8),
        );
        this.dropGravity = Math.round(gameConfig.initialGravity * 1.5);
        this.spawnAcceleration = 0.98;
        this.gravityAcceleration = 1.03;
        this.minSpawnDelay = Math.max(
          50,
          Math.round(gameConfig.minSpawnDelay * 0.8),
        );
        this.maxDropGravity = Math.round(gameConfig.maxGravity * 1.5);
        this.isGameOver = false;

        this.items = this.physics.add.group();

        this.timerContainerBg = this.add
          .image(170, 80, "timerContainerBg")
          .setOrigin(0.5)
          .setDepth(99);
        this.timerContainerBg.setScale(
          Math.min(
            this.cameras.main.width / this.timerContainerBg.width,
            this.cameras.main.height / this.timerContainerBg.height,
          ) * 0.3,
        );

        this.timerText = this.add
          .text(200, 95, "00:30", {
            fontFamily: "Arial",
            fontSize: "47px",
            color: "#8B1A1A",
            fontStyle: "normal",
          })
          .setOrigin(0.5)
          .setDepth(100);

        this.scoreContainerBg = this.add
          .image(this.cameras.main.width - 170, 80, "scoreContainerBg")
          .setOrigin(0.5)
          .setDepth(99);
        this.scoreContainerBg.setScale(
          Math.min(
            this.cameras.main.width / this.scoreContainerBg.width,
            this.cameras.main.height / this.scoreContainerBg.height,
          ) * 0.27,
        );

        this.scoreText = this.add
          .text(this.cameras.main.width - 150, 95, "0", {
            fontFamily: "Arial",
            fontSize: "47px",
            color: "#8B1A1A",
            fontStyle: "normal",
          })
          .setOrigin(0.5)
          .setDepth(100);

        this.countdownNumber = 3;

        // Dark transparent overlay
        this.countdownOverlay = this.add
          .rectangle(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            this.cameras.main.width,
            this.cameras.main.height,
            0x000000,
            0.5,
          )
          .setDepth(999)
          .setAlpha(0);
        this.tweens.add({
          targets: this.countdownOverlay,
          alpha: 1,
          duration: 400,
          ease: "Quad.easeIn",
        });

        // Invisible placeholder (kept for cleanup compatibility)
        this.countdownBg = this.add
          .rectangle(0, 0, 0, 0, 0x000000, 0)
          .setDepth(999);

        // "GET READY!" label
        this.countdownReadyImage = this.add
          .text(
            this.cameras.main.centerX,
            this.cameras.main.centerY - 200,
            "GET READY!",
            {
              fontFamily: "Arial, sans-serif",
              fontSize: "64px",
              color: "#FFFFFF",
              fontStyle: "normal",
            },
          )
          .setOrigin(0.5)
          .setDepth(1002)
          .setAlpha(0);
        this.tweens.add({
          targets: this.countdownReadyImage,
          alpha: 1,
          duration: 400,
          ease: "Quad.easeIn",
        });

        // Large countdown number
        this.countdownText = this.add
          .text(
            this.cameras.main.centerX,
            this.cameras.main.centerY + 20,
            "3",
            {
              fontFamily: "Arial, sans-serif",
              fontSize: "120px",
              color: "#FFFFFF",
              fontStyle: "normal",
            },
          )
          .setOrigin(0.5)
          .setDepth(1001);

        // Invisible overlay placeholder (kept for cleanup in updateCountdown)
        this.countdownBg = this.add
          .rectangle(0, 0, 0, 0, 0x000000, 0)
          .setDepth(999);

        this.updateCountdown = function () {
          this.countdownNumber--;
          if (this.countdownNumber > 0) {
            this.countdownText.setText(this.countdownNumber);
          } else {
            this.countdownText.setText("");
            this.tweens.add({
              targets: [
                this.countdownOverlay,
                this.countdownBg,
                this.countdownReadyImage,
                this.countdownText,
              ],
              alpha: 0,
              duration: 100,
              onComplete: () => {
                this.countdownOverlay.setVisible(false);
                this.countdownBg.setVisible(false);
                this.countdownReadyImage.setVisible(false);
                this.countdownText.setVisible(false);
              },
            });
            this.countdownEvent.remove();
            this.startGame();
          }
        }.bind(this);

        this.startGame = function () {
          this.countdownSound.stop();
          this.buzzerSound.play();

          setTimeout(() => {
            this.bgSound.play();
          }, 2500);

          this.input.on("pointermove", (pointer) => {
            if (!this.isGameOver) {
              this.bowlContainer.x = Phaser.Math.Clamp(
                pointer.x,
                this.bowlContainer.width / 2,
                this.cameras.main.width - this.bowlContainer.width / 2,
              );
            }
          });

          this.physics.add.overlap(
            this.bowlContainer,
            this.items,
            catchItem,
            null,
            this,
          );

          this.time.addEvent({
            delay: 1000,
            callback: updateTimer,
            callbackScope: this,
            loop: true,
          });

          this.time.addEvent({
            delay: this.spawnDelay,
            callback: spawnItem,
            callbackScope: this,
            loop: true,
          });
        }.bind(this);

        this.countdownEvent = this.time.addEvent({
          delay: 1000,
          callback: this.updateCountdown,
          callbackScope: this,
          loop: true,
        });
      }

      function update() {
        // Clean up off-screen items
        this.items.getChildren().forEach((item) => {
          if (item.y > this.cameras.main.height + 150) {
            item.destroy();
          }
        });
      }

      function spawnItem() {
        if (this.isGameOver) return;

        const randomItem = Phaser.Utils.Array.GetRandom(this.fallingObjects);
        const randomX = Phaser.Math.Between(100, this.cameras.main.width - 100);
        const item = this.items.create(randomX, -50, randomItem.key);

        item.setData("points", randomItem.points);
        item.setData("type", randomItem.type);

        item.setOrigin(0.5);
        const sizeVariant = Phaser.Math.FloatBetween(0.7, 1.3);
        const finalScale = (gameConfig.objectScale || 0.45) * sizeVariant;
        item.setScale(finalScale);
        item.setData("itemScale", finalScale);

        item.body.setAllowGravity(true);
        item.body.gravity.y = this.dropGravity;
        item.body.velocity.x = Phaser.Math.Between(-30, 30);
        item.setData("outOfBoundsKill", true);
      }

      function updateTimer() {
        if (this.isGameOver) return;

        timer--;

        // Scale speed linearly: faster as time runs out
        const totalTime = gameConfig.gameTimer;
        const elapsed = totalTime - timer;
        const progress = Math.min(elapsed / totalTime, 1); // 0 → 1 over game duration

        this.dropGravity = Math.round(
          gameConfig.initialGravity + (gameConfig.maxGravity - gameConfig.initialGravity) * progress
        );

        const newDelay = Math.round(
          gameConfig.initialSpawnDelay - (gameConfig.initialSpawnDelay - gameConfig.minSpawnDelay) * progress
        );
        if (newDelay !== this.spawnDelay) {
          this.spawnDelay = newDelay;
          // Restart spawn timer with new delay
          if (this.spawnEvent) this.spawnEvent.remove();
          this.spawnEvent = this.time.addEvent({
            delay: this.spawnDelay,
            callback: spawnItem,
            callbackScope: this,
            loop: true,
          });
        }

        if (timer >= 0) {
          const minutes = Math.floor(timer / 60);
          const seconds = timer % 60;
          const formattedTime =
            String(minutes).padStart(2, "0") +
            ":" +
            String(seconds).padStart(2, "0");
          this.timerText.setText(formattedTime);
        }

        if (timer <= 0) {
          this.isGameOver = true;
          this.physics.pause();
          this.bgSound.stop();
          this.winSound.play();

          this.time.delayedCall(2000, () => {
            if (score >= gameConfig.winScore) {
              router.push({
                name: "Finish",
                query: {
                  score,
                  apple: appleScore,
                  banana: bananaScore,
                  carrot: carrotScore,
                  lang,
                },
              });
            } else {
              router.push({
                name: "TryAgain",
                query: {
                  score,
                  apple: appleScore,
                  banana: bananaScore,
                  carrot: carrotScore,
                  lang,
                },
              });
            }
          });
        }
      }

      function catchItem(bowlContainer, item) {
        if (this.isGameOver) {
          return;
        }

        const points = item.getData("points");
        const objectType = item.getData("type");
        const objectKey = item.texture.key;

        if (points !== undefined && points !== null) {
          score += points;
          // Prevent overall score from going below 0
          score = Math.max(0, score);

          if (objectKey === "apple") {
            appleScore += points;
          } else if (objectKey === "banana") {
            bananaScore += points;
          } else if (objectKey === "carrot") {
            carrotScore += points;
          }

          this.scoreText.setText(score);

          if (objectType === "negative") {
            this.wrongSound.play();
          } else {
            this.collectSound.play();
          }

          const scoreText = points > 0 ? `+${points}` : `${points}`;
          const scoreColor = points > 0 ? "#7B0000" : "#7B0000";
          const scorePopup = this.add
            .text(item.x, item.y, scoreText, {
              fontFamily: "Arial",
              fontSize: "20px",
              color: scoreColor,
              fontStyle: "normal",
            })
            .setOrigin(0.5)
            .setDepth(102);
          this.tweens.add({
            targets: scorePopup,
            alpha: 0,
            y: item.y - 80,
            duration: 800,
            ease: "Power1",
            onComplete: () => scorePopup.destroy(),
          });

          const bowlBaseScale = 0.4;
          this.tweens.add({
            targets: this.bowl,
            scaleX: bowlBaseScale * 1.1,
            scaleY: bowlBaseScale * 1.1,
            rotation: 0.1,
            yoyo: true,
            repeat: 0,
            duration: 200,
            ease: "Power1",
            onComplete: () => {
              this.bowl.setScale(bowlBaseScale);
              this.bowl.setRotation(0);
            },
          });

          item.setVisible(false);
          item.body.enable = false;

          this.time.delayedCall(400, () => {
            item.destroy();
          });
        } else {
          item.destroy();
        }
      }

      game = new Phaser.Game(config);
    };

    onMounted(async () => {
      await document.fonts.load("bold 64px Arial");
      initGame();
    });

    onUnmounted(() => {
      if (game) {
        game.destroy(true);
      }
    });

    const openConfig = () => {
      router.push({ name: "Config" });
    };

    return {
      mainBg,
      openConfig,
    };
  },
};
</script>

<style scoped lang="scss">
.page-game {
  @include fullscreen;
  position: relative;
  overflow: hidden;
}

/* config button moved to StartPage.vue */
</style>
