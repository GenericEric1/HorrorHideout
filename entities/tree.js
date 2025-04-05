class Tree {
    constructor(game, spritesheet, cabinX, cabinY,dirX, dirY, player, tileMap) {
        Object.assign(this, {game, spritesheet, cabinX, cabinY, dirX, dirY,player, tileMap});

        this.x = cabinX + dirX;
        this.y = cabinY + dirY;

        console.log(this.x + "Tree")
        console.log(this.y + "Tree")
    }

    update() {}


    draw(ctx) {
        const treeWidth = 70;
        const treeHeight = 100;

        const offsetX = treeWidth / 2;
        const offsetY = treeHeight / 2;

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
            ctx.drawImage(this.spritesheet, drawX, drawY, treeWidth, treeHeight);
        }
    }
}