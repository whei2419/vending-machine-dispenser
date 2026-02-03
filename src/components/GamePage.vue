<template>
  <div class="page-game">
    <div
      id="preloadBackground"
      :style="{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundImage: `url(${mainBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        zIndex: 0,
      }"
    ></div>
    <div id="gameContainer" style="position: relative; z-index: 1"></div>
  </div>
</template>

<script>
import { onMounted, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useFullscreen } from "@/composables/useFullscreen";
import Phaser from "phaser";
import mainBg from "@/assets/dutch/mainBackground.webp";

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
        return JSON.parse(savedConfig);
      }
      return {
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
    };

    const gameConfig = getConfig();

    const initGame = () => {
      const cacheBuster = "?v=" + Date.now();
      let timer = gameConfig.gameTimer;
      let score = 0;
      let appleScore = 0;
      let bananaScore = 0;
      let carrotScore = 0;
      let eggScore = 0;
      let milkScore = 0;

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
        this.load.audio(
          "collectSound",
          "/src/assets/audio/collect bird nest.mp3",
        );
        this.load.audio("win", "/src/assets/audio/game won.mp3");
        this.load.audio("countDown", "/src/assets/audio/countdownsound.mp3");
        this.load.audio("bg-sound", "/src/assets/audio/bg.mp3");
        this.load.audio("buzzer", "/src/assets/audio/long-buzzer.mp3");
        this.load.audio("wrongSound", "/src/assets/audio/wrong item.mp3");

        this.load.image(
          "gamebg",
          "/src/assets/dutch/mainBackground.webp" + cacheBuster,
        );

        this.fallingObjects = [
          {
            key: "apple",
            path:
              "/src/assets/dutch/fallingObjects/normal/apple.webp" +
              cacheBuster,
            type: "normal",
            points: gameConfig.appleScore,
          },
          {
            key: "banana",
            path:
              "/src/assets/dutch/fallingObjects/normal/banana.webp" +
              cacheBuster,
            type: "normal",
            points: gameConfig.bananaScore,
          },
          {
            key: "carrot",
            path:
              "/src/assets/dutch/fallingObjects/normal/carrot.webp" +
              cacheBuster,
            type: "normal",
            points: gameConfig.carrotScore,
          },
          {
            key: "egg",
            path:
              "/src/assets/dutch/fallingObjects/normal/egg.webp" + cacheBuster,
            type: "normal",
            points: gameConfig.eggScore,
          },
          {
            key: "negative_1",
            path:
              "/src/assets/dutch/fallingObjects/negative/(3B) 1 Minus One Point.webp" +
              cacheBuster,
            type: "negative",
            points: gameConfig.negativeScore,
          },
          {
            key: "negative_2",
            path:
              "/src/assets/dutch/fallingObjects/negative/(3B) 2 Minus One Point.webp" +
              cacheBuster,
            type: "negative",
            points: gameConfig.negativeScore,
          },
          {
            key: "negative_3",
            path:
              "/src/assets/dutch/fallingObjects/negative/(3B) 3 Minus One Point.webp" +
              cacheBuster,
            type: "negative",
            points: gameConfig.negativeScore,
          },
          {
            key: "negative_4",
            path:
              "/src/assets/dutch/fallingObjects/negative/(3B) 4 Minus One Point.webp" +
              cacheBuster,
            type: "negative",
            points: gameConfig.negativeScore,
          },
          {
            key: "milk",
            path:
              "/src/assets/dutch/fallingObjects/special/milk.webp" +
              cacheBuster,
            type: "special",
            points: gameConfig.milkScore,
          },
        ];

        this.fallingObjects.forEach((obj) => {
          this.load.image(obj.key, obj.path);
        });

        this.load.spritesheet(
          "explosion",
          "/src/assets/images/exp.png" + cacheBuster,
          { frameWidth: 300, frameHeight: 300 },
        );
        this.load.image(
          "countdown",
          "/src/assets/images/countdown.webp" + cacheBuster,
        );
        this.load.image(
          "countdownReady",
          "/src/assets/dutch/countdown_reaady.webp" + cacheBuster,
        );
        this.load.image("bowl", "/src/assets/dutch/bowl.webp" + cacheBuster);
        this.load.image("logo", "/src/assets/dutch/logo.webp" + cacheBuster);
        this.load.image(
          "timerContainerBg",
          "/src/assets/dutch/timer.webp" + cacheBuster,
        );
        this.load.image(
          "scoreContainerBg",
          "/src/assets/dutch/totalscore.webp" + cacheBuster,
        );
        this.load.image(
          "milkSplash",
          "/src/assets/dutch/milk splash.png" + cacheBuster,
        );
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

        this.logo = this.add.image(30, 30, "logo").setOrigin(0, 0);
        this.logo.setScale(0.28);
        this.logo.setDepth(98);

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
          .image(this.cameras.main.width - 500, 100, "timerContainerBg")
          .setOrigin(0.5)
          .setDepth(99);
        this.timerContainerBg.setScale(
          Math.min(
            this.cameras.main.width / this.timerContainerBg.width,
            this.cameras.main.height / this.timerContainerBg.height,
          ) * 0.3,
        );
        this.physics.add.existing(this.timerContainerBg, true);

        this.timerText = this.add
          .text(this.cameras.main.width - 490, 117, "00:30", {
            fontFamily: "HvDTrial_Brevia-ExtraBlack-BF6493a4064f0ec",
            fontSize: "40px",
            color: "#FFFFFF",
            align: "center",
            fontStyle: "bold",
          })
          .setOrigin(0.5)
          .setDepth(100);

        this.scoreContainerBg = this.add
          .image(this.cameras.main.width - 170, 100, "scoreContainerBg")
          .setOrigin(0.5)
          .setDepth(99);
        this.scoreContainerBg.setScale(
          Math.min(
            this.cameras.main.width / this.scoreContainerBg.width,
            this.cameras.main.height / this.scoreContainerBg.height,
          ) * 0.27,
        );
        this.physics.add.existing(this.scoreContainerBg, true);

        this.scoreText = this.add
          .text(this.cameras.main.width - 165, 117, "0", {
            fontFamily: "HvDTrial_Brevia-ExtraBlack-BF6493a4064f0ec",
            fontSize: "40px",
            color: "#FFFFFF",
            align: "center",
            fontStyle: "bold",
          })
          .setOrigin(0.5)
          .setDepth(100);

        this.countdownNumber = 3;
        this.countdownOverlay = this.add
          .rectangle(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            this.cameras.main.width,
            this.cameras.main.height,
            0x000000,
            0.3,
          )
          .setDepth(999)
          .setAlpha(0);
        this.tweens.add({
          targets: this.countdownOverlay,
          alpha: 1,
          duration: 500,
          ease: "Quad.easeIn",
        });

        this.countdownReadyImage = this.add
          .image(
            this.cameras.main.centerX,
            this.cameras.main.centerY - 400,
            "countdownReady",
          )
          .setOrigin(0.5)
          .setDepth(1002)
          .setAlpha(0)
          .setScale(0.5);
        this.tweens.add({
          targets: this.countdownReadyImage,
          alpha: 1,
          scale: 0.5,
          duration: 500,
          ease: "Back.Out",
        });

        this.countdownBg = this.add
          .image(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            "countdown",
          )
          .setOrigin(0.5)
          .setDepth(1000)
          .setDisplaySize(130, 85)
          .setAlpha(0.95)
          .setScale(0.5);
        this.tweens.add({
          targets: this.countdownBg,
          scale: 0.55,
          duration: 400,
          ease: "Back.Out",
        });

        this.countdownText = this.add
          .text(this.cameras.main.centerX, this.cameras.main.centerY, "3", {
            fontFamily: "HvDTrial_Brevia-ExtraBlack-BF6493a4064f0ec",
            fontSize: "250px",
            color: "#F37021",
            fontStyle: "bold",
          })
          .setOrigin(0.5)
          .setDepth(1001);

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
              ],
              alpha: 0,
              duration: 100,
              onComplete: () => {
                this.countdownOverlay.setVisible(false);
                this.countdownBg.setVisible(false);
                this.countdownReadyImage.setVisible(false);
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

      function update() {}

      function spawnItem() {
        if (this.isGameOver) return;

        const randomItem = Phaser.Utils.Array.GetRandom(this.fallingObjects);
        const randomX = Phaser.Math.Between(100, this.cameras.main.width - 100);
        const item = this.items.create(randomX, -50, randomItem.key);

        item.setData("points", randomItem.points);
        item.setData("type", randomItem.type);

        item.setOrigin(0.5);
        item.setScale(0.14);

        item.body.setAllowGravity(true);
        item.body.gravity.y = this.dropGravity;
        item.body.velocity.x = Phaser.Math.Between(-30, 30);
        item.setData("outOfBoundsKill", true);
      }

      function updateTimer() {
        if (this.isGameOver) return;

        timer--;
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
                  egg: eggScore,
                  milk: milkScore,
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
                  egg: eggScore,
                  milk: milkScore,
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
          } else if (objectKey === "egg") {
            eggScore += points;
          } else if (objectKey === "milk") {
            milkScore += points;
          }

          this.scoreText.setText(score);

          if (objectType === "negative") {
            this.wrongSound.play();
          } else {
            this.collectSound.play();
          }

          const splashX = item.x;
          const splashY = item.y;

          const milkSplash = this.add
            .image(splashX, splashY, "milkSplash")
            .setOrigin(0.5)
            .setDepth(101)
            .setScale(0.2);

          const scoreText = points > 0 ? `+${points}` : `${points}`;
          const scoreColor = points > 0 ? "#063591" : "#FF0000";

          const scorePopup = this.add
            .text(splashX, splashY, scoreText, {
              fontFamily: "HvDTrial_Brevia-ExtraBlack-BF6493a4064f0ec",
              fontSize: "40px",
              color: scoreColor,
              fontStyle: "bold",
            })
            .setOrigin(0.5)
            .setDepth(102);

          this.tweens.add({
            targets: [milkSplash, scorePopup],
            alpha: 0,
            duration: 800,
            ease: "Power1",
            onComplete: () => {
              milkSplash.destroy();
              scorePopup.destroy();
            },
          });

          this.tweens.add({
            targets: this.bowl,
            scaleX: this.bowl.scaleX * 1.1,
            scaleY: this.bowl.scaleY * 1.1,
            rotation: 0.1,
            yoyo: true,
            repeat: 0,
            duration: 200,
            ease: "Power1",
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

    onMounted(() => {
      initGame();
    });

    onUnmounted(() => {
      if (game) {
        game.destroy(true);
      }
    });

    return {
      mainBg,
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
</style>
