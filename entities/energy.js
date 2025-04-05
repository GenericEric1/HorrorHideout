class Energy {
    constructor(game, spritesheet, cabinX, cabinY, player, tileMap, resourceBar) {
        Object.assign(this, {game, spritesheet, player, tileMap, resourceBar});

        const randomOffsetX = 200 + Math.random() * 100;
        const randomOffsetY = 200 + Math.random() * 100;

        // Randomly choose positive or negative direction
        const dx = Math.random() < 0.5? randomOffsetX: -randomOffsetX;
        const dy = Math.random() < 0.5? randomOffsetY: -randomOffsetY;

        this.x = cabinX + dx;
        this.y = cabinY + dy;

        this.animator = new Animator(this.spritesheet, 0, 0, 64, 64.5, 6, 0.1, 0,false, true);

    }

    update() {
        const distanceToPlayer = Math.sqrt(
            Math.pow(this.x - this.player.x, 2) + Math.pow(this.y - this.player.y, 2)
        );

        if (distanceToPlayer < 30) {
            this.removeFromWorld = true;
            this.resourceBar.incrementAmount(2);
        }
    }

    draw(ctx) {
        const energyWidth = 45;
        const energyHeight = 60;

        const offsetX = energyWidth / 2;
        const offsetY = energyHeight / 2;

        const drawX = this.x - offsetX;
        const drawY = this.y - offsetY;

        const playerX = this.player.x;
        const playerY = this.player.y;

        const visRadiusInPixels = (this.player.visionRadius * this.tileMap.tileSize) / 2;
        const distanceFromPlayer = Math.sqrt(Math.pow(this.x - playerX, 2) + Math.pow(this.y - playerY, 2));

        const cameraX = this.game.camera.x + (this.game.ctx.canvas.width / 2) / this.game.camera.zoomLevel;
        const cameraY = this.game.camera.y + (this.game.ctx.canvas.height / 2) / this.game.camera.zoomLevel;
        const secondCircleRadius = visRadiusInPixels / 2;
        const distanceFromCamera = Math.sqrt(Math.pow(this.x - cameraX, 2) + Math.pow(this.y - cameraY, 2));


        if (distanceFromPlayer <= visRadiusInPixels || distanceFromCamera <= secondCircleRadius ) {
            this.animator.drawFrame(this.game.clockTick, ctx, drawX, drawY,1);
        }
    }
}