
class EnemySpawner {
    constructor(game, tileMap, player, spritesheet) {
        this.game = game;
        this.tileMap = tileMap;
        this.player = player;
        this.spritesheet = spritesheet;

        this.enemySpawnPath = "assets/audio/effects/enemy_entrance.wav";
        this.spawnSoundPool = ASSET_MANAGER.createAudioPool(this.enemySpawnPath, 4);

        this.enemyWavePath = "assets/audio/effects/enemySpawn.wav";
        this.waveSoundPool = ASSET_MANAGER.createAudioPool(this.enemyWavePath, 4);

        this.totalWaves = 10;
        this.waveNumber = 1;
        this.enemiesRemaining = 0;
        this.timeBetweenWaves = 25; // Seconds
        this.lastWaveEndTime = 0;
        this.spawning = false;
    }

    update() {
        const currentTime = this.game.timer.gameTime;

        if (this.enemiesRemaining <= 0 && !this.spawning) {
            if (this.waveNumber <= this.totalWaves) {
                if (currentTime - this.lastWaveEndTime >= this.timeBetweenWaves) {
                    if (ASSET_MANAGER.settings.isSoundEffectEnabled('enemyWave')) {
                        ASSET_MANAGER.playFromPool(this.waveSoundPool, 'enemyWave');
                    }
                    this.startNextWave();
                }
            } else if (this.waveNumber === this.totalWaves + 1) {
                // Final boss wave
                if (currentTime - this.lastWaveEndTime >= this.timeBetweenWaves) {
                    this.spawnBoss();
                    this.waveNumber++;
                }
            }
        }
    }

    startNextWave() {
        console.log(`Starting Wave ${this.waveNumber}`);

        this.spawning = true;
        const enemiesToSpawn = 5 + this.waveNumber; // Scale enemy count

        this.enemiesRemaining = enemiesToSpawn;
        let enemiesSpawned = 0;

        const spawnInterval = setInterval(() => {
            if (enemiesSpawned < enemiesToSpawn) {
                this.spawnEnemy();
                enemiesSpawned++;
            } else {
                clearInterval(spawnInterval);
                this.spawning = false;
                this.lastWaveEndTime = this.game.timer.gameTime;
                this.waveNumber++;
                console.log(`Wave ${this.waveNumber - 1} Complete!`);

                // If all normal waves are done, prepare for the boss
                if (this.waveNumber > this.totalWaves) {
                    console.log("Final Boss Incoming!");
                }
            }
        }, 1000);
    }

    spawnEnemy() {
        const edge = Math.floor(Math.random() * 4); // Random edge
        let x, y;
        const mapSize = this.tileMap.rows * this.tileMap.tileSize;

        switch (edge) {
            case 0: x = Math.random() * mapSize; y = -20; break;      // Top edge
            case 1: x = Math.random() * mapSize; y = mapSize + 20; break; // Bottom edge
            case 2: x = -20; y = Math.random() * mapSize; break;      // Left edge
            case 3: x = mapSize + 20; y = Math.random() * mapSize; break; // Right edge
        }

        const enemy = new Enemy(
            this.game,
            x,
            y,
            this.tileMap.cols * this.tileMap.tileSize / 2,
            this.tileMap.rows * this.tileMap.tileSize / 2,
            this.tileMap,
            this.player,
            this.spritesheet
        );

        // Scale health and speed with wave
        enemy.health = 100 + this.waveNumber * 10;
        enemy.speed = 50 + this.waveNumber * 2;

        this.game.addEntity(enemy);

        if (ASSET_MANAGER.settings.isSoundEffectEnabled('enemySpawn')) {
            ASSET_MANAGER.playFromPool(this.spawnSoundPool, 'enemySpawn');
        }
        console.log(`Spawned enemy at (${x}, ${y}) with ${enemy.health} HP.`);
    }

    spawnBoss() {
        console.log("Boss Wave! Prepare for battle!");

        // Spawn only one boss
        const x = this.tileMap.cols * this.tileMap.tileSize / 2;
        const y = -100; // Spawn off-screen at the top

        const boss = new BossEnemy(
            this.game,
            x,
            y,
            this.tileMap.cols * this.tileMap.tileSize / 2,
            this.tileMap.rows * this.tileMap.tileSize / 2,
            this.tileMap,
            this.player
        );

        this.game.addEntity(boss);
        this.enemiesRemaining = 1; // Only one boss

        if (ASSET_MANAGER.settings.isSoundEffectEnabled('enemySpawn')) {
            ASSET_MANAGER.playFromPool(this.spawnSoundPool, 'enemySpawn');
        }
    }

    enemyDefeated() {
        this.enemiesRemaining--;
        console.log(`Enemy defeated! ${this.enemiesRemaining} remaining.`);

        if (this.waveNumber > this.totalWaves + 1 && this.enemiesRemaining <= 0) {
            console.log("Game Complete! You survived all waves.");
            this.game.winScreen.activateWin();
        }
    }

    draw(ctx) {
    }
}
