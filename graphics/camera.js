class Camera {
    constructor(game, player, canvasWidth, canvasHeight) {
        this.game = game;
        this.player = player;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;

        this.zoomLevel = 1;
        this.maxZoom = 3;
        this.minZoom = 0.5;

        this.x = this.player.x - this.canvasWidth / 2;
        this.y = this.player.y - this.canvasHeight / 2;
    }

    update() {
        this.x = this.player.x - (this.canvasWidth / (2 * this.zoomLevel));
        this.y = this.player.y - (this.canvasHeight / (2 * this.zoomLevel));
    }

    applyTransformations(ctx) {
        ctx.setTransform(this.zoomLevel, 0, 0, this.zoomLevel, -this.x * this.zoomLevel, -this.y * this.zoomLevel);
    }

    resetTransformations(ctx) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    adjustZoom(delta) {
        this.zoomLevel = Math.max(this.minZoom, Math.min(this.zoomLevel + delta, this.maxZoom));
    }
}

window.Camera = Camera;