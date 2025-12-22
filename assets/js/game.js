//phazer game 
// caching game 
//rulle of the game  
// all objects give 10 points each
// 3 different falling objects available
// 3 sec countdown before start the game

var config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: 'gameContainer',
    render: {
        antialias: true,
        pixelArt: false,
        roundPixels: true
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

var timer = 30;
var score = 0;
// Individual scores for normal objects and special object
var appleScore = 0;
var bananaScore = 0;
var carrotScore = 0;
var eggScore = 0;
var milkScore = 0;

var countdownText;
var timerText;
var scoreText;

var isPaused = false;

const params = new URLSearchParams(window.location.search);
const lang = params.get('lang');
const cacheBuster = '?v=' + Date.now();

function preload() {
    this.load.audio('collectSound', '../assets/audio/collect bird nest.mp3');
    this.load.audio('win', '../assets/audio/game won.mp3');
    this.load.audio('countDown', '../assets/audio/countdownsound.mp3');
    this.load.audio('bg-sound', '../assets/audio/bg.mp3');
    this.load.audio('buzzer', '../assets/audio/long-buzzer.mp3');

    this.load.image('gamebg', '../assets/dutch/mainBackground.webp' + cacheBuster);  
    
    // Configurable scores for each object type
    const NORMAL_SCORE = 1;
    const NEGATIVE_SCORE = -1;
    const SPECIAL_SCORE = 3;
    
    // Load falling objects with their types and scores
    this.fallingObjects = [
        // Normal objects (+1 point each)
        { key: 'apple', path: '../assets/dutch/fallingObjects/normal/apple.webp' + cacheBuster, type: 'normal', points: NORMAL_SCORE },
        { key: 'banana', path: '../assets/dutch/fallingObjects/normal/banana.webp' + cacheBuster, type: 'normal', points: NORMAL_SCORE },
        { key: 'carrot', path: '../assets/dutch/fallingObjects/normal/carrot.webp' + cacheBuster, type: 'normal', points: NORMAL_SCORE },
        { key: 'egg', path: '../assets/dutch/fallingObjects/normal/egg.webp' + cacheBuster, type: 'normal', points: NORMAL_SCORE },
        
        // Negative objects (-1 point each)
        { key: 'negative_1', path: '../assets/dutch/fallingObjects/negative/(3B) 1 Minus One Point.webp' + cacheBuster, type: 'negative', points: NEGATIVE_SCORE },
        { key: 'negative_2', path: '../assets/dutch/fallingObjects/negative/(3B) 2 Minus One Point.webp' + cacheBuster, type: 'negative', points: NEGATIVE_SCORE },
        { key: 'negative_3', path: '../assets/dutch/fallingObjects/negative/(3B) 3 Minus One Point.webp' + cacheBuster, type: 'negative', points: NEGATIVE_SCORE },
        { key: 'negative_4', path: '../assets/dutch/fallingObjects/negative/(3B) 4 Minus One Point.webp' + cacheBuster, type: 'negative', points: NEGATIVE_SCORE },
        
        // Special objects (+3 points each)
        { key: 'milk', path: '../assets/dutch/fallingObjects/special/milk.webp' + cacheBuster, type: 'special', points: SPECIAL_SCORE },
    ];

    this.fallingObjects.forEach(obj => {
        this.load.image(obj.key, obj.path);
    });

    this.load.spritesheet('explosion', '../assets/images/exp.png' + cacheBuster, { frameWidth: 300, frameHeight: 300 });
    this.load.image('countdown', '../assets/images/countdown.webp' + cacheBuster);
    this.load.image('countdownReady', '../assets/dutch/countdown_reaady.webp' + cacheBuster);
    this.load.image('clock', '../assets/images/clock.png' + cacheBuster);
    this.load.image('bowl', '../assets/dutch/bowl.webp' + cacheBuster);
    this.load.image('logo', '../assets/dutch/logo.webp' + cacheBuster);
    this.load.image('timerContainerBg', '../assets/dutch/timer.webp' + cacheBuster);
    this.load.image('scoreContainerBg', '../assets/dutch/totalscore.webp' + cacheBuster);
    this.load.image('milkSplash', '../assets/dutch/milk splash.png' + cacheBuster);
}

function create() {
    // Set the bounds of the world
    this.physics.world.setBounds(0, 0, this.cameras.main.width, this.cameras.main.height);

    // create a sprite animation explosion
    this.anims.create({
        key: 'explosion',
        frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 21 }),
        frameRate: 16,
        repeat: 0,
        hideOnComplete: true
    });

    this.collectSound = this.sound.add('collectSound');
    this.winSound = this.sound.add('win');
    this.countdownSound = this.sound.add('countDown');
    this.bgSound = this.sound.add('bg-sound', { loop: true });
    this.buzzerSound = this.sound.add('buzzer', { loop: false });
 
    this.countdownSound.play();

    this.background = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'gamebg').setOrigin(0.5);
    this.background.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
    this.background.setScale(Math.max(this.cameras.main.width / this.background.width, this.cameras.main.height / this.background.height));

    this.logo = this.add.image(30, 30, 'logo').setOrigin(0, 0);
    this.logo.setScale(0.28);
    this.logo.setDepth(98);


    // Set up bowl and enable physics
    this.bowl = this.add.sprite(0, -40, 'bowl').setOrigin(0.5); // Adjust this Y value to move the bowl down
    this.bowl.setScale(0.4);
    const bowlWidth = this.bowl.displayWidth;
    const bowlHeight = this.bowl.displayHeight;

    // Create a container to hold the bowl
    this.bowlContainer = this.add.container(this.cameras.main.centerX, this.cameras.main.height - 250, [this.bowl]);
    this.bowlContainer.setSize(bowlWidth, bowlHeight);
    this.physics.world.enable(this.bowlContainer);
    this.bowlContainer.body.setCollideWorldBounds(true);
    this.bowlContainer.body.setSize(bowlWidth * 0.8, bowlHeight * 0.4);
    this.bowlContainer.body.setOffset(bowlWidth * 0.1, 40);
 
    this.spawnDelay = 1200; // Initial spawn delay (ms)
    this.dropGravity = 300; // Initial gravity for falling items
    this.spawnAcceleration = 0.98; // How much to multiply spawnDelay each interval (slower acceleration)
    this.gravityAcceleration = 1.03; // How much to multiply dropGravity each interval (slower acceleration)
    this.minSpawnDelay = 600; // Minimum spawn delay (slower minimum)
    this.maxDropGravity = 900; // Maximum gravity (slower max)
    this.isGameOver = false; // Track game over state

    // Create a physics group for falling items
    this.items = this.physics.add.group();

    // Timer and score backgrounds and text, moved slightly inward for better appearance
    this.timerContainerBg = this.add.image(this.cameras.main.width - 500, 100, 'timerContainerBg').setOrigin(0.5).setDepth(99);
    // Adjust the multiplier (e.g., 0.3) to resize the timer container
    this.timerContainerBg.setScale(Math.min(this.cameras.main.width / this.timerContainerBg.width, this.cameras.main.height / this.timerContainerBg.height) * 0.3);
    this.physics.add.existing(this.timerContainerBg, true);

    // Adjust the X and Y values below to position the timer text
    this.timerText = this.add.text(this.cameras.main.width - 490, 117, '00:30', {
        fontFamily: 'HvDTrial_Brevia-ExtraBlack-BF6493a4064f0ec', // Adjust font size here
        fontSize: '40px',
        color: "#FFFFFF",
        align: 'center',
        fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(100);

    this.scoreContainerBg = this.add.image(this.cameras.main.width - 170, 100, 'scoreContainerBg').setOrigin(0.5).setDepth(99);
    // Adjust the multiplier (e.g., 0.3) to resize the score container
    this.scoreContainerBg.setScale(Math.min(this.cameras.main.width / this.scoreContainerBg.width, this.cameras.main.height / this.scoreContainerBg.height) * 0.27);
    this.physics.add.existing(this.scoreContainerBg, true);

    // Adjust the X and Y values below to position the score text
    this.scoreText = this.add.text(this.cameras.main.width - 165, 117, '0', {
        fontFamily: 'HvDTrial_Brevia-ExtraBlack-BF6493a4064f0ec', // Adjust font size here
        fontSize: '40px',
        color: "#FFFFFF",
        align: 'center',
        fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(100);

    // Countdown text in the center
    this.countdownNumber = 3;
    // Add overlay for countdown with fade-in animation
    this.countdownOverlay = this.add.rectangle(
        this.cameras.main.centerX,
        this.cameras.main.centerY,
        this.cameras.main.width,
        this.cameras.main.height,
        0x000000,
        0.3
    ).setDepth(999).setAlpha(0);
    this.tweens.add({
        targets: this.countdownOverlay,
        alpha: 1,
        duration: 500,
        ease: 'Quad.easeIn'
    });
    
    // Add "Ready" image above countdown container
    this.countdownReadyImage = this.add.image(
        this.cameras.main.centerX, 
        this.cameras.main.centerY - 400, 
        'countdownReady'
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
        ease: 'Back.Out'
    });
    
    // Add background image for countdown timer with scale pop-in animation
    this.countdownBg = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'countdown')
        .setOrigin(0.5)
        .setDepth(1000)
        .setDisplaySize(130, 85)
        .setAlpha(0.95)
        .setScale(0.5);
    this.tweens.add({
        targets: this.countdownBg,
        scale: 0.55,
        duration: 400,
        ease: 'Back.Out'
    });
    // Countdown text styled and above background
    this.countdownText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, '3', {
        fontFamily: 'HvDTrial_Brevia-ExtraBlack-BF6493a4064f0ec',
        fontSize: '250px',
        color: "#F37021",
        fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(1001);

    // Define updateCountdown as a scene method
    this.updateCountdown = function() {
        this.countdownNumber--;
        if (this.countdownNumber > 0) {
            this.countdownText.setText(this.countdownNumber);
        } else {
            this.countdownText.setText('');
            // Animate overlay and background out
            this.tweens.add({
                targets: [this.countdownOverlay, this.countdownBg, this.countdownReadyImage],
                alpha: 0,
                duration: 100,
                onComplete: () => {
                    this.countdownOverlay.setVisible(false);
                    this.countdownBg.setVisible(false);
                    this.countdownReadyImage.setVisible(false);
                }
            });
            this.countdownEvent.remove();
            this.startGame();
        }
    }.bind(this);

    // Define startGame as a scene method
    this.startGame = function() {
        this.countdownSound.stop();
        this.buzzerSound.play();
        // Add a 2 second delay before starting the timers
        this.time.delayedCall(500, () => {
            //play bg music
            this.buzzerSound.stop();
            this.bgSound.play();

            this.timerText.setVisible(true);
            this.scoreText.setVisible(true);
            this.spawnItemEvent = this.time.addEvent({
                delay: 100,
                callback: this.spawnItem,
                callbackScope: this,
                loop: true
            });
            this.gameTimerEvent = this.time.addEvent({
                delay: 1000,
                callback: this.updateTimer,
                callbackScope: this,
                loop: true
            });
        });
        this.spawnDelay = 100;
        this.dropGravity = 300;
    }.bind(this);

    // Define spawnItem and updateTimer as scene methods for callbackScope
    this.spawnItem = spawnItem.bind(this);
    this.updateTimer = updateTimer.bind(this);

    this.countdownEvent = this.time.addEvent({
        delay: 1000,
        callback: this.updateCountdown,
        callbackScope: this,
        loop: true
    });

    // Add mouse movement listener for left/right movement
    this.input.on('pointermove', (pointer) => {
        // Only allow movement if countdown is finished and game is not over
        if (!this.countdownEvent || this.countdownNumber <= 0) {
            if (!this.isGameOver) {
                this.bowlContainer.x = Phaser.Math.Clamp(
                    pointer.x,
                    this.bowlContainer.width / 2,
                    this.cameras.main.width - this.bowlContainer.width / 2
                );
            }
        }
    });

    this.resizeGame = () => {
        this.cameras.main.setSize(window.innerWidth, window.innerHeight);
        this.physics.world.setBounds(0, 0, window.innerWidth, window.innerHeight);

        if (this.background) {
            this.background.displayWidth = window.innerWidth;
            this.background.displayHeight = window.innerHeight;
        }

    };

    // Resize the game when the window is resized
    window.addEventListener('resize', this.resizeGame);
    this.resizeGame();
}

function update() {
    // Still check for overlap
    this.physics.overlap(this.bowlContainer, this.items, catchItem, null, this);
}

function spawnItem() {
    if (this.isGameOver) return; // Prevent spawning after game ends
    // Adjust spawn delay and drop gravity over time
    this.spawnDelay = Math.max(this.minSpawnDelay, this.spawnDelay * this.spawnAcceleration);
    this.dropGravity = Math.min(this.maxDropGravity, this.dropGravity * this.gravityAcceleration);
    if (this.spawnItemEvent) {
        this.spawnItemEvent.remove();
    }
    this.spawnItemEvent = this.time.addEvent({
        delay: this.spawnDelay,
        callback: this.spawnItem,
        callbackScope: this,       
        loop: false
    });    this.bowl.setScale(0.4);

    // Spawn a random object from all types (normal, negative, special)
    var randomItem = Phaser.Math.RND.pick(this.fallingObjects);

    // Calculate item width for safe spawn
    const texture = this.textures.get(randomItem.key);
    const frame = texture.getSourceImage ? texture.getSourceImage() : null;
    const itemWidth = frame ? frame.width * 0.4 : 100 * 0.4; // 0.4 is your scale
    const minX = itemWidth / 2;
    const maxX = this.cameras.main.width - itemWidth / 2;
    var x = Phaser.Math.Between(minX, maxX);
    var y = -100;
    var item = this.items.create(x, y, randomItem.key);
    
    // Set item data including type and points
    item.setData('points', randomItem.points);
    item.setData('type', randomItem.type);
    
    item.setOrigin(0.5);
    item.setScale(0.14);
    item.body.setAllowGravity(true);
    item.body.gravity.y = this.dropGravity;
    item.body.velocity.x = Phaser.Math.Between(-30, 30);
    item.setData('outOfBoundsKill', true);
}

function updateTimer() {
    if (this.isGameOver) return;

    timer--;
    if (timer >= 0) {
        const minutes = Math.floor(timer / 60);
        const seconds = timer % 60;
        const formattedTime = String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
        this.timerText.setText(formattedTime);
    }

    if (timer <= 0) {
        this.isGameOver = true;
        this.physics.pause();
        this.bgSound.stop();
        this.winSound.play();


        // Redirect to finish or try again page based on score
        this.time.delayedCall(2000, () => {
            if (score >= 20) {
                window.location.href = `finish.html?score=${score}&apple=${appleScore}&banana=${bananaScore}&carrot=${carrotScore}&egg=${eggScore}&milk=${milkScore}&lang=${lang}`;
            } else {
                window.location.href = `tryagain.html?score=${score}&apple=${appleScore}&banana=${bananaScore}&carrot=${carrotScore}&egg=${eggScore}&milk=${milkScore}&lang=${lang}`;
            }
        });
    }
}


function catchItem(bowlContainer, item) {
    if (this.isGameOver) {
        return;
    }

    const points = item.getData('points');
    const objectType = item.getData('type');
    const objectKey = item.texture.key;

    if (points !== undefined && points !== null) {
        score += points;
        
        // Track individual object scores
        if (objectKey === 'apple') {
            appleScore += points;
        } else if (objectKey === 'banana') {
            bananaScore += points;
        } else if (objectKey === 'carrot') {
            carrotScore += points;
        } else if (objectKey === 'egg') {
            eggScore += points;
        } else if (objectKey === 'milk') {
            milkScore += points;
        }
        
        this.scoreText.setText(score);
        this.collectSound.play();

        // milk splash effect
        const splashX = item.x;
        const splashY = item.y;

        const milkSplash = this.add.image(splashX, splashY, 'milkSplash').setOrigin(0.5).setDepth(101).setScale(0.2);
        
        // Display score with + or - sign based on points value
        const scoreText = points > 0 ? `+${points}` : `${points}`;
        const scoreColor = points > 0 ? '#063591' : '#FF0000'; // Blue for positive, red for negative
        
        const scorePopup = this.add.text(splashX, splashY, scoreText, {
            fontFamily: 'HvDTrial_Brevia-ExtraBlack-BF6493a4064f0ec',
            fontSize: '40px',
            color: scoreColor,
            fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(102);

        this.tweens.add({
            targets: [milkSplash, scorePopup],
            alpha: 0,
            duration: 800, // 0.8 seconds fade out
            ease: 'Power1',
            onComplete: () => {
                milkSplash.destroy();
                scorePopup.destroy();
            }
        });

        // Animate the bowl: scale up, rotate, and bounce
        this.tweens.add({
            targets: this.bowl,
            scaleX: this.bowl.scaleX * 1.1, // Relative scale increase
            scaleY: this.bowl.scaleY * 1.1, // Relative scale increase
            rotation: 0.1,
            yoyo: true,
            repeat: 0,
            duration: 200,
            ease: 'Power1'
        });

        item.setVisible(false);
        item.body.enable = false;

        this.time.delayedCall(400, () => {
            item.destroy();
        });
    } else {
        // Destroy the item if it has no points
        item.destroy();
    }
}
