class Building {
    constructor(row, col, tileMap, tileSize) {
        this.row = row;
        this.col = col;
        this.tileMap = tileMap;
        this.width = tileSize;
        this.height = tileSize;

        this.removeFromWorld = false;

        this.health = 100;
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.destroy();
        }
    }

    destroy() {
        this.tileMap.grid[this.row][this.col] = null;
        this.removeFromWorld = true;
    }

    draw(ctx) {
        const x = this.col * this.width;
        const y = this.row * this.height;

        ctx.fillStyle = 'orange';
        ctx.fillRect(x, y, this.width, this.height);

        // Optional: Draw outline
        ctx.strokeStyle = 'black';
        ctx.strokeRect(x, y, this.width, this.height);

    }

    update() {

    }

    findNearestEnemy(range) {
        let closestEnemy = null;
        let closestDistance = range;

        if (!gameEngine || !gameEngine.entities) {
            console.error("ArcherTower Error: gameEngine or entities undefined");
            return null;
        }

        for (let entity of gameEngine.entities) {
            if (entity instanceof Enemy) {
                const dx = entity.x - (this.col * this.width + this.width / 2);
                const dy = entity.y - (this.row * this.height + this.height / 2);
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < closestDistance) {
                    closestEnemy = entity;
                    closestDistance = distance;
                }
            }
        }
        return closestEnemy;
    }

    drawFiringRadius(ctx, range) {
        const x = this.col * this.width + this.width / 2;
        const y = this.row * this.height + this.height / 2;

        if (range) {  // Only draw if the building has a range
            ctx.strokeStyle = "rgba(0, 255, 0, 0.5)"; // Light green circle
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(x, y, range, 0, Math.PI * 2);
            ctx.stroke();
        }
    }

}

// TODO: change all buildings to images
class Wall extends Building {
    constructor(row, col, tileMap, tileSize) {
        super(row, col, tileMap, tileSize);
        this.health = 200;
    }

    draw(ctx) {
        const x = this.col * this.width;
        const y = this.row * this.height;

        ctx.drawImage(ASSET_MANAGER.getAsset("assets/sprites/resources/grave.png"), x, y, this.width, this.height);
    }
}

class ArcherTower extends Building {
    constructor(row, col, tileMap, tileSize) {
        super(row, col, tileMap, tileSize);
        this.range = 200;
        this.fireRate = 1.5;
        this.lastShotTime = 0;
    }

    draw(ctx) {
        const x = this.col * this.width;
        const y = this.row * this.height;

        ctx.drawImage(ASSET_MANAGER.getAsset("assets/sprites/resources/ghost.png"), x, y, this.width, this.height);

        this.drawFiringRadius(ctx, this.range);

    }

    update() {
        if (gameEngine.timer.gameTime - this.lastShotTime >= this.fireRate) {
            const target = this.findNearestEnemy(this.range);
            if (target) {
                this.shootArrow(target);
                this.lastShotTime = gameEngine.timer.gameTime;
            }
        }
    }

    shootArrow(target) {


        const arrow = new Projectile(
            this.col * this.width + this.width / 2,
            this.row * this.height + this.height / 2,
            target,
            200,      // Speed
            25,       // Damage
            "arrow"   // Type
        );

        gameEngine.addEntity(arrow);
    }
}


class Campfire extends Building {
    constructor(row, col, tileMap, tileSize) {
        super(row, col, tileMap, tileSize);
        this.health = 200;
    }

    draw(ctx) {
        const x = this.col * this.width;
        const y = this.row * this.height;

        ctx.drawImage(ASSET_MANAGER.getAsset("assets/sprites/resources/campfire.png"), x, y, this.width, this.height);
    }
}

class MageTower extends Building {
    constructor(row, col, tileMap, tileSize) {
        super(row, col, tileMap, tileSize);
        this.range = 250;
        this.fireRate = 2;
        this.lastShotTime = 0;
    }

    draw(ctx) {
        const x = this.col * this.width;
        const y = this.row * this.height;

        ctx.drawImage(ASSET_MANAGER.getAsset("assets/sprites/resources/mage.png"), x, y, this.width, this.height);

        this.drawFiringRadius(ctx, this.range);
    }

    update() {
        if (gameEngine.timer.gameTime - this.lastShotTime >= this.fireRate) {
            const target = this.findNearestEnemy(this.range);
            if (target) {
                this.castSpell(target);
                this.lastShotTime = gameEngine.timer.gameTime;
            }
        }
    }

    castSpell(target) {
        const spell = new Projectile(
            this.col * this.width + this.width / 2,
            this.row * this.height + this.height / 2,
            target,
            200,      // Speed
            40,       // Damage
            "spell"   // Type
        );

        gameEngine.addEntity(spell);
    }
}


class BombTower extends Building {
    constructor(row, col, tileMap, tileSize) {
        super(row, col, tileMap, tileSize);
        this.range = 200;
        this.fireRate = 3;
        this.lastShotTime = 0;
    }

    draw(ctx) {
        const x = this.col * this.width;
        const y = this.row * this.height;

        ctx.drawImage(ASSET_MANAGER.getAsset("assets/sprites/resources/totem.png"), x, y, this.width, this.height);

        this.drawFiringRadius(ctx, this.range);
    }

    update() {
        if (gameEngine.timer.gameTime - this.lastShotTime >= this.fireRate) {
            const target = this.findNearestEnemy(this.range);
            if (target) {
                this.launchBomb(target);
                this.lastShotTime = gameEngine.timer.gameTime;
            }
        }
    }

    launchBomb(target) {
        const bomb = new Projectile(
            this.col * this.width + this.width / 2,
            this.row * this.height + this.height / 2,
            target,
            150,      // Speed
            30,       // Damage
            "bomb",   // Type
            50        // Explosion radius
        );

        gameEngine.addEntity(bomb);
    }
}

