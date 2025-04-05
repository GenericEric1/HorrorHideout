const gameEngine = new GameEngine();
const ASSET_MANAGER = new AssetManager();

// Sprites
ASSET_MANAGER.queueDownload("assets/sprites/hero/hero_walking.png");
ASSET_MANAGER.queueDownload("assets/sprites/hero/hero_attacking.png");
ASSET_MANAGER.queueDownload("assets/sprites/hero/hero_dying.png");
ASSET_MANAGER.queueDownload("assets/sprites/landscape/cabin.png");
ASSET_MANAGER.queueDownload("assets/sprites/landscape/tree.png");
ASSET_MANAGER.queueDownload("assets/sprites/pumpkin_head/killer_walk.png");
ASSET_MANAGER.queueDownload("assets/sprites/pumpkin_head/killer_attack.png");
ASSET_MANAGER.queueDownload("assets/sprites/landscape/grass.png");
ASSET_MANAGER.queueDownload("assets/sprites/resources/lose.png");
ASSET_MANAGER.queueDownload("assets/sprites/boss/final_boss.png");

// Resources
ASSET_MANAGER.queueDownload("assets/sprites/resources/wood.png");
ASSET_MANAGER.queueDownload("assets/sprites/resources/energy_drink_static.png");
ASSET_MANAGER.queueDownload("assets/sprites/resources/energy_drink.png");
ASSET_MANAGER.queueDownload("assets/sprites/resources/stone.png");

// Buildings
ASSET_MANAGER.queueDownload("assets/sprites/resources/totem.png");
ASSET_MANAGER.queueDownload("assets/sprites/resources/campfire.png");
ASSET_MANAGER.queueDownload("assets/sprites/resources/mage.png");
ASSET_MANAGER.queueDownload("assets/sprites/resources/ghost.png");
ASSET_MANAGER.queueDownload("assets/sprites/resources/grave.png");

// Music
ASSET_MANAGER.queueDownload("assets/audio/music/title-screen-music.wav");
ASSET_MANAGER.queueDownload("assets/audio/music/title-screen-music2.wav");
ASSET_MANAGER.queueDownload("assets/audio/music/level-1-music.wav");
ASSET_MANAGER.queueDownload("assets/audio/music/level-2-music.wav");
ASSET_MANAGER.queueDownload("assets/audio/music/Track-5-music.wav");
ASSET_MANAGER.queueDownload("assets/audio/music/Track-6-music.wav");
ASSET_MANAGER.queueDownload("assets/audio/music/trailer_song.wav");
ASSET_MANAGER.queueDownload("assets/audio/music/track-8.wav");
ASSET_MANAGER.queueDownload("assets/audio/music/lose_music.wav");
ASSET_MANAGER.queueDownload("assets/audio/music/track-9.wav");
ASSET_MANAGER.queueDownload("assets/audio/music/game_complete.wav");

// Effects
ASSET_MANAGER.queueDownload("assets/audio/effects/Grass_walk5.wav");
ASSET_MANAGER.queueDownload("assets/audio/effects/killer-slash.wav");
ASSET_MANAGER.queueDownload("assets/audio/effects/enemySpawn.wav");
ASSET_MANAGER.queueDownload("assets/audio/effects/enemy_entrance.wav");
ASSET_MANAGER.queueDownload("assets/audio/effects/enemy death.wav");
ASSET_MANAGER.queueDownload("assets/audio/effects/Ghost_spawn.wav");
ASSET_MANAGER.queueDownload("assets/audio/effects/Grave_spawn.wav");
ASSET_MANAGER.queueDownload("assets/audio/effects/Campfire_spawn.wav");
ASSET_MANAGER.queueDownload("assets/audio/effects/Mage_spawn.wav");
ASSET_MANAGER.queueDownload("assets/audio/effects/Totem_spawn.wav");

ASSET_MANAGER.downloadAll(() => {
    const canvas = document.getElementById("gameWorld");

    // Auto-start music function from left snippet
    const startMusic = () => {
        const defaultTrack = "assets/audio/music/title-screen-music.wav";
        ASSET_MANAGER.playAsset(defaultTrack);
        ASSET_MANAGER.adjustVolume(0.1);
        document.removeEventListener('click', startMusic);
        document.removeEventListener('keydown', startMusic);
    };

    // Helps refocus the canvas after interacting with audio
    function refocusCanvas() {
        setTimeout(() => canvas.focus(), 50);
    }

    // Audio control event listeners (combining both)
    document.getElementById("playMusic").addEventListener("click", () => {
        const selectedTrack = document.getElementById("trackSelector").value;
        ASSET_MANAGER.playAsset(selectedTrack);
        refocusCanvas();
    });

    document.getElementById("stopMusic").addEventListener("click", () => {
        ASSET_MANAGER.stopMusic();
        refocusCanvas();
    });

    document.getElementById("muteMusic").addEventListener("click", () => {
        const selectedTrack = document.getElementById("trackSelector").value;
        ASSET_MANAGER.muteAudio(selectedTrack);
        refocusCanvas();
    });

    document.getElementById("volume").addEventListener("input", (event) => {
        const volumeLevel = event.target.value;
        ASSET_MANAGER.adjustVolume(volumeLevel);
        refocusCanvas();
    });

    // Effect volume control from right snippet
    document.getElementById("effectVolume").addEventListener("input", (event) => {
        const effectLevel = event.target.value;
        ASSET_MANAGER.adjustEffect(effectLevel);
        refocusCanvas();
    });

    document.getElementById("trackSelector").addEventListener("change", refocusCanvas);

    document.getElementById("enemySpawnToggle").addEventListener("change", (event) => {
        gameSetting.toggleSoundEffect('enemySpawn');
        refocusCanvas();
    });
    
    document.getElementById("enemySlashToggle").addEventListener("change", (event) => {
        gameSetting.toggleSoundEffect('enemySlash');
        refocusCanvas();
    });

    document.getElementById("enemyDeathToggle").addEventListener("change", (event) => {
        gameSetting.toggleSoundEffect('enemyDeath');
        refocusCanvas();
    });

    document.getElementById("enemyWaveToggle").addEventListener("change", (event) => {
        gameSetting.toggleSoundEffect('enemyWave');
        refocusCanvas();
    });

    document.getElementById("ghostSpawnToggle").addEventListener("change", (event) => {
        gameSetting.toggleSoundEffect('ghostSpawn');
        refocusCanvas();
    });

    document.getElementById("graveSpawnToggle").addEventListener("change", (event) => {
        gameSetting.toggleSoundEffect('graveSpawn');
        refocusCanvas();
    });

    document.getElementById("campfireSpawnToggle").addEventListener("change", (event) => {
        gameSetting.toggleSoundEffect('campfireSpawn');
        refocusCanvas();
    });

    document.getElementById("MageSpawnToggle").addEventListener("change", (event) => {
        gameSetting.toggleSoundEffect('mageSpawn');
        refocusCanvas();
    });

    document.getElementById("TotemSpawnToggle").addEventListener("change", (event) => {
        gameSetting.toggleSoundEffect('totemSpawn');
        refocusCanvas();
    });

    document.getElementById("walkingToggle").addEventListener("change", (event) => {
        gameSetting.toggleSoundEffect('walking');
        // If turning off walking sound, stop it if it's currently playing
        if (!event.target.checked && player.currentWalkSound) {
            player.currentWalkSound.pause();
            player.currentWalkSound.currentTime = 0;
            player.isWalking = false;
        }
        refocusCanvas();
    });

    const heroWalking = ASSET_MANAGER.getAsset("assets/sprites/hero/hero_walking.png");
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const grass = ASSET_MANAGER.getAsset("assets/sprites/landscape/grass.png");
    const tree = ASSET_MANAGER.getAsset("assets/sprites/landscape/tree.png")
    const tilemap = new TileMap(20, 20, 40, gameEngine, grass, tree);
    const resourceBar = new ResourceBar(gameEngine);
    const player = new Hero(gameEngine, centerX, centerY, heroWalking, tilemap, resourceBar);
    const enemyWalking = ASSET_MANAGER.getAsset("assets/sprites/pumpkin_head/killer_walk.png");
    const enemySpawner = new EnemySpawner(gameEngine, tilemap, player, enemyWalking);
    const gameSetting = new Settings(gameEngine,player, enemySpawner);
    gameSetting.settings = gameSetting;
    ASSET_MANAGER.setSettings(gameSetting);

    // Game setup
    const loseScreen = new LoseScreen(gameEngine, gameSetting);
    gameEngine.loseScreen = loseScreen;

    gameEngine.winScreen = new WinScreen(gameEngine, gameSetting);

    canvas.setAttribute("tabindex", "0");
    const ctx = canvas.getContext("2d");

    // Important: Fix the TileMap creation by providing the grass spritesheet
    const stone = ASSET_MANAGER.getAsset("assets/sprites/resources/stone.png")
    const energyAnimate = ASSET_MANAGER.getAsset("assets/sprites/resources/energy_drink.png")
    const energy = ASSET_MANAGER.getAsset("assets/sprites/resources/energy_drink_static.png")


    const camera = new Camera(gameEngine, player, canvas.width, canvas.height);

    const cabin = ASSET_MANAGER.getAsset("assets/sprites/landscape/cabin.png");

    const minimap = new Minimap(gameEngine);


    // Draw override
    const originalDraw = gameEngine.draw.bind(gameEngine);
    gameEngine.draw = function() {
        tilemap.draw(ctx, this.mouse, player.validPlacementTiles);
        originalDraw();

        if (loseScreen.active) {
            loseScreen.activateLose();
        }
    };

    // Zoom event listener
    canvas.addEventListener("wheel", (e) => {
        e.preventDefault();
        camera.adjustZoom(e.deltaY > 0 ? -0.1 : 0.1);
    });

    gameEngine.addEntity(tilemap);
    gameEngine.addEntity(new Cabin(gameEngine, 350, 300, cabin, tilemap));


    function getRandomPosition() {
        const directions = [
            { dx: 0, dy: -280 },
            { dx: 280, dy: 0 },
            { dx: 0, dy: 280 },
            { dx: -280, dy: 0 }
        ];

        const randomDirection = directions[Math.floor(Math.random() * directions.length)];
        return {
            x: randomDirection.dx,
            y: randomDirection.dy
        };
    }

    let treePosition, stonePosition;
    do {
        treePosition = getRandomPosition();
        stonePosition = getRandomPosition();
    } while (treePosition.x === stonePosition.x && treePosition.y === stonePosition.y);

    gameEngine.addEntity(new Tree(gameEngine, tree, 350, 300, treePosition.x, treePosition.y, player, tilemap));
    gameEngine.addEntity(new Stone(gameEngine, stone, 350, 300, stonePosition.x, stonePosition.y, player, tilemap));
    gameEngine.addEntity(new Energy(gameEngine, energyAnimate, 350, 300, player, tilemap, resourceBar));
    gameEngine.addEntity(gameSetting);
    gameEngine.addEntity(resourceBar);
    gameEngine.addEntity(player);
    gameEngine.addEntity(minimap);

    // Create title screen
    new TitleScreen(gameEngine, gameSetting, ctx, camera, enemySpawner);
});

document.addEventListener('DOMContentLoaded', function() {
    const resourceDescriptions = document.querySelectorAll('.resource-description');

    resourceDescriptions.forEach(description => {
        const tooltip = description.querySelector('.tooltip');

        description.addEventListener('mouseover', () => {
            tooltip.style.display = 'block';
        });

        description.addEventListener('mouseout', () => {
            tooltip.style.display = 'none';
        });
    });
});