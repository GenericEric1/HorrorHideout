class Cabin extends Building {
    constructor(game, x, y, spritesheet, tilemap) {
        // Convert x, y (pixels) to row, col (tile units)
        const tileSize = tilemap.tileSize;
        const row = Math.floor(y / tileSize);
        const col = Math.floor(x / tileSize);

        super(row, col, tilemap, tileSize);

        this.width = 95;
        this.height = 120;

        Object.assign(this, {game, x, y, spritesheet});

        this.health = 300;
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.destroy();
            this.health = 0;
        }
    }

    destroy() {
        console.log("Cabin destroyed");
        this.game.loseScreen.activateLose();
    }

    update() {}

    draw(ctx) {
        ctx.drawImage(this.spritesheet, this.x, this.y, this.width, this.height);

        // Draw health bar
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y - 10, this.width, 5);

        ctx.fillStyle = "green";
        ctx.fillRect(this.x, this.y - 10, (this.health / 300) * this.width, 5);
    }
}
