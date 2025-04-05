class LoseScreen {
    constructor(game, gameSetting, ctx, camera, enemySpawner) {
        Object.assign(this, {game, gameSetting, ctx, camera, enemySpawner});
        this.loseDiv = document.createElement('div');
        this.active = false;
        this.setup();
        this.createLoseScreen();
        this.startOverButton();
    }

    setup() {
        this.loseDiv.style.cssText = `
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
            gap: 20px;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            `;
    }
    createLoseScreen() {
        const loseText = document.createElement('img');
        loseText.src = "assets/sprites/resources/lose.png";

        loseText.width = 500;
        loseText.height = 250;

        this.loseDiv.appendChild(loseText);

    }

    startOverButton() {
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 20px;
            padding: 30px;
        `;

        const button = document.createElement('button');
        button.textContent = `Start Over`;
        button.style.cssText = `
                padding: 15px 30px;
                width: 210px;
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
            console.log("here");
            this.startOver();
        };

        buttonContainer.appendChild(button);

        this.loseDiv.appendChild(buttonContainer);

    }


    startOver() {
        location.reload();
    }


    activateLose() {
        if (!this.active) {
            this.active = true;
            document.body.appendChild(this.loseDiv); // Ensure the lose screen is added to the DOM
            ASSET_MANAGER.pauseBackgroundMusic();
            const defaultTrack = "assets/audio/music/lose_music.wav";
            console.log("Played successfully");
            ASSET_MANAGER.playAsset(defaultTrack);
            ASSET_MANAGER.adjustVolume(0.3);
            this.gameSetting.stopTimer();
        }
    }
}