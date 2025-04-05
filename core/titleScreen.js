class TitleScreen {
    constructor(game, gameSetting, ctx, camera, enemySpawner) {
        Object.assign(this, {game, gameSetting, ctx, camera, enemySpawner});
        this.menuDiv = document.createElement('div');
        this.settings = gameSetting;
        this.setupMenuStyles();
        this.createTitle();
        this.createButtons();
        this.show();

    }

    setupMenuStyles() {
        this.menuDiv.style.cssText = `
            position: absolute;
            width: 800px;
            height: 800px;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 100px;
        `;
    }

    createTitle() {
        const title = document.createElement('img');
        title.src = "assets/sprites/resources/title.png";

        title.width = 550;
        title.height = 150;

        const imageContainer = document.createElement('div');
        imageContainer.style.cssText = `
            display: flex;
            justify-content: center; 
            align-items: center;     
            gap: 50px;              
        `;
        this.menuDiv.appendChild(title);
    }

    createButtons() {
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 20px;
            padding: 30px;
        `;

            const button = document.createElement('button');
            button.textContent = `Play`;
            button.style.cssText = `
                padding: 15px 30px;
                width: 200px;
                font-size: 18px;
                font-family: boldFont,serif;
                background: #333;
                color: white;
                border: none;
                cursor: pointer;
                transition: background 0.3s;
            `;

            button.onmouseover = () => button.style.background = '#444';
            button.onmouseout = () => button.style.background = '#333';

            button.onclick = () => {
                this.startLevel();
            };

            buttonContainer.appendChild(button);

        this.menuDiv.appendChild(buttonContainer);
    }

    show() {
        document.body.appendChild(this.menuDiv);
    }

    hide() {
        this.menuDiv.remove();
    }

    startLevel() {
        this.hide();
        this.game.init(this.ctx, this.camera, this.enemySpawner);
        this.game.start();
        this.game.settings.timerPaused = false;
        this.settings.startTimer();
        setTimeout(() => document.getElementById("gameWorld").focus(), 0);

        const tracks = [
            "assets/audio/music/title-screen-music.wav",
            "assets/audio/music/title-screen-music2.wav",
            "assets/audio/music/level-1-music.wav",
            "assets/audio/music/level-2-music.wav",
            "assets/audio/music/Track-5-music.wav",
            "assets/audio/music/Track-6-music.wav",
            "assets/audio/music/trailer_song.wav",
            "assets/audio/music/track-8.wav",
            "assets/audio/music/track-9.wav",
            "assets/audio/music/game_complete.wav"
        ];
        const randomTrack = tracks[Math.floor(Math.random() * tracks.length)];
        ASSET_MANAGER.playAsset(randomTrack);
        this.settings.startWaveCountdown();
    }

    update() {
        this.heroX += this.heroSpeed * this.game.clockTick;

        // If the hero goes off-screen to the right, reset position
        if (this.heroX > this.game.ctx.canvas.width + 100) {
            this.heroX = -100;
        }

    }

    draw(ctx) {
        // Clear the canvas or draw background if needed
        ctx.clearRect(0, 0, this.game.ctx.canvas.width, this.game.ctx.canvas.height);
    }

}