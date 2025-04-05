class WinScreen {
    constructor(game, gameSetting, ctx, camera, enemySpawner) {
        Object.assign(this, {game, gameSetting, ctx, camera, enemySpawner});
        this.winDiv = document.createElement('div');
        this.active = false;
        this.setup();
        this.createWinScreen();
        this.startOverButton();
    }

    setup() {
        this.winDiv.style.cssText = `
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
            background: rgba(0, 0, 0, 1);
            `;
    }

    createWinScreen() {
        const winText = document.createElement('img');
        winText.src = "assets/sprites/resources/winner.png";

        winText.width = 500;
        winText.height = 250;

        this.winDiv.appendChild(winText);
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
        button.textContent = `Play again`;
        button.style.cssText = `
                padding: 15px 30px;
                width: 210px;
                font-size: 18px;
                background: #333;
                font-family: boldFont,serif;
                color: white;
                border: none;
                cursor: pointer;
                transition: background 0.4s;
            `;

        button.onmouseover = () => button.style.background = '#555';
        button.onmouseout = () => button.style.background = '#333';

        button.onclick = () => {
            console.log("here");
            this.startOver();
        };

        buttonContainer.appendChild(button);

        this.winDiv.appendChild(buttonContainer);
    }


    startOver() {
        location.reload();
    }

    activateWin() {
        if (!this.active) {
            this.active = true;
            document.body.appendChild(this.winDiv);
            this.game.stop();
            ASSET_MANAGER.pauseBackgroundMusic();
            const defaultTrack = "assets/audio/music/game_complete.wav";
            console.log("Played win music successfully");
            ASSET_MANAGER.playAsset(defaultTrack);
            ASSET_MANAGER.adjustVolume(0.3);
            this.game.stopTimer();
        }
    }
}