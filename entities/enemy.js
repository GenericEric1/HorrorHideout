
class Enemy {
    constructor(game, x, y, targetX, targetY, tilemap, player, spritesheet) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.tileMap = tilemap;
        this.player = player;
        this.spritesheet = spritesheet;
        this.facing = 0; // 0 = down, 1 = up, 2 = left, 3 = right
        this.state = 0; // 0 = walking, 1 = attacking

        this.targetIndex = 0;

        this.speed = 50;
        this.health = 100;
        this.attackPower = 10;
        this.attackRange = 20;
        this.attackCooldown = 1;
        this.lastAttackTime = 0;
        this.separationDistance = 25;

        this.removeFromWorld = false;

        this.animation = [];
        this.loadAnimation();

        this.slashSoundPath = "assets/audio/effects/killer-slash.wav";
        this.slashSoundPool = ASSET_MANAGER.createAudioPool(this.slashSoundPath, 4);
        this.enemyDeathPath = "assets/audio/effects/enemy death.wav";
        this.enemyDeathPool = ASSET_MANAGER.createAudioPool(this.enemyDeathPath, 4);
     //   this.isSlashing = false;
    }

    loadAnimation() {
        for (let i = 0; i < 2; i++) { // 2 states
            this.animation.push([]);
            for (let j = 0; j < 4; j++) { // 4 facing directions
                this.animation[i].push([]);
            }
        }

        // walking animation for state = 0
        // facing down = 0
        this.animation[0][0] = new Animator(this.spritesheet, 0, 129, 64, 64.5, 9, 0.1, 0, false, true);

        // facing up = 1
        this.animation[0][1] = new Animator(this.spritesheet, 1, 1, 64, 64.5, 9, 0.1, 0, false, true);

        // facing left = 2
        this.animation[0][2] = new Animator(this.spritesheet, 0, 71, 64, 64.5, 9, 0.1, 0, false, true);

        // facing right = 3
        this.animation[0][3] = new Animator(this.spritesheet, 0, 195, 64, 64.5, 9, 0.1, 0, false, true);


        // attacking animation for state = 1
        const attackSpriteSheet = ASSET_MANAGER.getAsset("assets/sprites/pumpkin_head/killer_attack.png");
        // attacking down = 0
        this.animation[1][0] = new Animator(attackSpriteSheet, 0, 138, 64, 64.5, 6, 0.1, 0,false, true);

        // attacking up = 1
        this.animation[1][1] = new Animator(attackSpriteSheet, 1, 1, 64, 64.5, 6, 0.1, 0,false, true);

        // attacking left = 2
        this.animation[1][2] = new Animator(attackSpriteSheet, 0, 69, 63, 64.5, 6, 0.1, 0,false, true);

        // attacking right = 3
        this.animation[1][3] = new Animator(attackSpriteSheet, 0, 200, 64, 64.5, 6, 0.1, 0,false, true);

    }

    update() {
        if (this.health <= 0) {
            this.removeFromWorld = true;
            return;
        }

        const nearestBuilding = this.findNearestBuilding();
        const playerDistance = this.getDistance(this.player.x, this.player.y);
        const buildingDistance = nearestBuilding ? this.getDistance(nearestBuilding.col * nearestBuilding.width + nearestBuilding.width / 2, nearestBuilding.row * nearestBuilding.height + nearestBuilding.height / 2) : Infinity;

        const possibleTargets = [
            { x: 360, y: 310 }, //top left
            { x: 414, y: 310 }, //top right
            { x: 360, y: 428 }, //bottom left
            { x: 414, y: 428 } //bottom right
        ];

        let target = null;
        let targetDistance = Infinity;

        // Prioritize attacking the player if they're close
        if (playerDistance < 32) {
            target = this.player;
            targetDistance = playerDistance;
        } else if (nearestBuilding instanceof Cabin) {
            target = nearestBuilding;
            targetDistance = this.getDistance(possibleTargets[this.targetIndex].x, possibleTargets[this.targetIndex].y);
        } else {
            target = nearestBuilding;
            targetDistance = buildingDistance;
        }

        if (target) {
            if (targetDistance > this.attackRange) {
                // Move toward the target if not in range
                this.state = 0; // Walking

                if (target instanceof Hero) {
                    this.moveToward(target.x, target.y);
                } else if (!(target instanceof Cabin)) {
                    this.moveToward(nearestBuilding.col * nearestBuilding.width + nearestBuilding.width / 2, nearestBuilding.row * nearestBuilding.height + nearestBuilding.height / 2);
                } else {
                    this.moveToward(possibleTargets[this.targetIndex].x, possibleTargets[this.targetIndex].y);
                }


            } else if (targetDistance <= this.attackRange) {
                // Only attack if in range
                this.state = 1; // Attacking
                if (target === this.player) {
                    this.attackPlayer();
                } else {
                    this.attack(target);
                }
            }
        }

        this.avoidOtherEnemies();
    }

    getDistance(targetX, targetY) {
        const dx = targetX - this.x;
        const dy = targetY - this.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    findNearestBuilding() {
        let closestBuilding = null;
        let closestDistance = Infinity;

        for (let entity of this.game.entities) {
            if (entity instanceof Building && !(entity instanceof Cabin)) {
                // Calculate building center coordinates
                const buildingCenterX = (entity.col * entity.width) + (entity.width / 2);
                const buildingCenterY = (entity.row * entity.height) + (entity.height / 2);

                // Compute distance
                const distance = this.getDistance(buildingCenterX, buildingCenterY);

                // Update closest building if it's nearer
                if (distance < closestDistance) {
                    closestBuilding = entity;
                    closestDistance = distance;
                }
            } else if (entity instanceof Cabin) {
                const possibleTargets = [
                    { x: 360, y: 310 }, //top left
                    { x: 414, y: 310 }, //top right
                    { x: 360, y: 428 }, //bottom left
                    { x: 414, y: 428 } //bottom right
                ];

                for (let i = 0; i < possibleTargets.length; i++) {
                    // Compute distance
                    const distance = this.getDistance(possibleTargets[i].x, possibleTargets[i].y);

                    // Update closest building if it's nearer
                    if (distance < closestDistance) {
                        closestBuilding = entity;
                        closestDistance = distance;
                        this.targetIndex = i;
                    }
                }
            }
        }


        return closestBuilding;
    }

    moveToward(targetX, targetY) {
        const dx = targetX - this.x;
        const dy = targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if(this.x > 360 && this.x < 440 && this.y > 290 && this.y < 400){
            this.x -= (dx / distance) * this.speed * this.game.clockTick;
            this.y -= (dy / distance) * this.speed * this.game.clockTick;
        }

        if (distance > this.attackRange) {
            this.x += (dx / distance) * this.speed * this.game.clockTick;
            this.y += (dy / distance) * this.speed * this.game.clockTick;

            if (Math.abs(dx) > Math.abs(dy)) { // handles facing
                if (dx > 0) {
                    this.facing = 3; // right
                } else {
                    this.facing = 2; // left
                }
            } else {
                if (dy > 0) {
                    this.facing = 0; // down
                } else {
                    this.facing = 1; // up
                }
            }
        }
    }

    isInAttackRange(targetX, targetY) {
        const dx = targetX - this.x;
        const dy = targetY - this.y;
        return Math.sqrt(dx * dx + dy * dy) <= this.attackRange;
    }

    avoidOtherEnemies() {
        let moveX = 0, moveY = 0;
        let count = 0;

        for (let entity of this.game.entities) {
            if (entity instanceof Enemy && entity !== this) {
                const dx = this.x - entity.x;
                const dy = this.y - entity.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.separationDistance) {
                    moveX += dx / distance;
                    moveY += dy / distance;
                    count++;
                }
            }
        }
        if (count > 0) {
            this.x += (moveX / count) * this.speed * this.game.clockTick * 0.5; // Move away slightly
            this.y += (moveY / count) * this.speed * this.game.clockTick * 0.5;
        }
    }

    attack(building) {
        if (this.game.timer.gameTime - this.lastAttackTime >= this.attackCooldown) {
            building.takeDamage(this.attackPower);
            console.log(`Enemy attacked building at (${building.row}, ${building.col}). Health: ${building.health}`);

            this.lastAttackTime = this.game.timer.gameTime;
        }
    }

    attackPlayer() {
        if (this.game.timer.gameTime - this.lastAttackTime >= this.attackCooldown) {
            this.player.health -= this.attackPower;
            console.log(`Enemy attacked the player! Player health: ${this.player.health}`);

            if (ASSET_MANAGER.settings.isSoundEffectEnabled('enemySlash') && this.player.health > 0) {
                ASSET_MANAGER.playFromPool(this.slashSoundPool, 'enemySlash');
            }
        
            if (this.player.health <= 0) {
                console.log("Player is dead!");
            }

            this.lastAttackTime = this.game.timer.gameTime;
        }
    }

    takeDamage(damage) {
        this.health -= damage;

        if (this.health <= 0) {

            if (ASSET_MANAGER.settings.isSoundEffectEnabled('enemy death')) {
                ASSET_MANAGER.playFromPool(this.enemyDeathPool, 'enemyDeath');
            }

            this.removeFromWorld = true;
        }
    }

    draw(ctx) {
        const enemyWidth = 64;
        const enemyHeight = 64;

        const offsetX = enemyWidth / 2;
        const offsetY = enemyHeight / 2;

        const drawX = this.x - offsetX;
        const drawY = this.y - offsetY;

        // Check if enemy is within the first visibility circle (around the player)
        const playerX = this.player.x;
        const playerY = this.player.y;
        const visRadiusInPixels = (this.player.visionRadius * this.tileMap.tileSize) / 2;
        const distanceFromPlayer = Math.sqrt(Math.pow(this.x - playerX, 2) + Math.pow(this.y - playerY, 2));

        // Check if enemy is within the second visibility circle (camera center)
        const cameraX = this.game.camera.x + (this.game.ctx.canvas.width / 2) / this.game.camera.zoomLevel;
        const cameraY = this.game.camera.y + (this.game.ctx.canvas.height / 2) / this.game.camera.zoomLevel;
        const secondCircleRadius = visRadiusInPixels / 2;
        const distanceFromCamera = Math.sqrt(Math.pow(this.x - cameraX, 2) + Math.pow(this.y - cameraY, 2));

        const canvas = document.getElementById("gameWorld");
        const cabinCircleX = (canvas.width / 2); // Adjust the x-coordinate as needed
        const cabinCircleY = (canvas.height / 2); // Adjust the y-coordinate as needed
        const cabinCircleRadius = 5 * this.tileMap.tileSize; // Adjust the radius as needed
        const distanceFromCabin= Math.sqrt(Math.pow(this.x - cabinCircleX, 2) + Math.pow(this.y - cabinCircleY, 2));

        // Draw the enemy only if it's within one of the visibility circles
        if (distanceFromPlayer <= visRadiusInPixels || distanceFromCamera <= secondCircleRadius || distanceFromCabin <= cabinCircleRadius) {
            this.animation[this.state][this.facing].drawFrame(this.game.clockTick, ctx, drawX, drawY, 1);

            // Draw health bar
            ctx.fillStyle = "rgba(57, 255, 20, 1)";
            ctx.fillRect(this.x - 10, this.y - 25, (20 * this.health) / 100, 4);
        }
    }
}

class BossEnemy extends Enemy {
    constructor(game, x, y, targetX, targetY, tileMap, player) {
        super(game, x, y, targetX, targetY, tileMap, player);

        this.health = 1500; // Boss has much more HP
        this.speed = 40; // Slightly slower
        this.attackPower = 50; // Hits much harder
        this.attackCooldown = 1.5; // Attacks every 1.5 seconds
        this.width = 128; // Twice the size of normal enemies
        this.height = 128;

        this.animation = [];
        this.loadAnimation();

        console.log("Boss has spawned!");
    }

    loadAnimation() {
        for (let i = 0; i < 4; i++) { // 4 directions
            this.animation.push([]);
        }
        // final boss animation
        const finalBoss = ASSET_MANAGER.getAsset("assets/sprites/boss/final_boss.png");
        // down = 0
        this.animation[0] = new Animator(finalBoss, 0, 0, 40, 40, 4, 0.1, 0, false, true);
        // up = 1
        this.animation[1] = new Animator(finalBoss, 0, 41, 40, 40, 4, 0.1, 0, false, true);
        // left = 2
        this.animation[2] = new Animator(finalBoss, 0, 86, 40, 40, 4, 0.1, 0, false, true);
        // right = 3
        this.animation[3] = new Animator(finalBoss, 0, 127, 40, 40, 4, 0.1, 0, false, true);

    }

    draw(ctx) {
        const enemyWidth = this.width;
        const enemyHeight = this.height;

        const offsetX = enemyWidth / 2;
        const offsetY = enemyHeight / 2;

        const drawX = this.x - offsetX;
        const drawY = this.y - offsetY;

        // Check if enemy is within the first visibility circle (around the player)
        const playerX = this.player.x;
        const playerY = this.player.y;
        const visRadiusInPixels = (this.player.visionRadius * this.tileMap.tileSize) / 2;
        const distanceFromPlayer = Math.sqrt(Math.pow(this.x - playerX, 2) + Math.pow(this.y - playerY, 2));

        // Check if enemy is within the second visibility circle (camera center)
        const cameraX = this.game.camera.x + (this.game.ctx.canvas.width / 2) / this.game.camera.zoomLevel;
        const cameraY = this.game.camera.y + (this.game.ctx.canvas.height / 2) / this.game.camera.zoomLevel;
        const secondCircleRadius = visRadiusInPixels / 2;
        const distanceFromCamera = Math.sqrt(Math.pow(this.x - cameraX, 2) + Math.pow(this.y - cameraY, 2));

        const canvas = document.getElementById("gameWorld");
        const cabinCircleX = (canvas.width / 2);
        const cabinCircleY = (canvas.height / 2);
        const cabinCircleRadius = 5 * this.tileMap.tileSize;
        const distanceFromCabin= Math.sqrt(Math.pow(this.x - cabinCircleX, 2) + Math.pow(this.y - cabinCircleY, 2));

        // Draw the enemy only if it's within one of the visibility circles
        if (distanceFromPlayer <= visRadiusInPixels || distanceFromCamera <= secondCircleRadius || distanceFromCabin <= cabinCircleRadius) {
            this.animation[this.facing].drawFrame(this.game.clockTick, ctx, drawX, drawY, 2);

            // Boss health bar
            ctx.fillStyle = "red";
            ctx.fillRect(this.x - 50, this.y - 70, 100, 10);
            ctx.fillStyle = "green";
            ctx.fillRect(this.x - 50, this.y - 70, (this.health / 1000) * 100, 10);
        }
    }
}

