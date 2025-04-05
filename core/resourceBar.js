class ResourceBar {
    constructor(game) {
        this.game = game;
        this.barHeight = 80;
        this.barWidth = 300;
        this.boxSize = 60;
        this.spacing = 20;

        this.woodImage = ASSET_MANAGER.getAsset("assets/sprites/resources/wood.png");
        this.drinkImage = ASSET_MANAGER.getAsset("assets/sprites/resources/energy_drink_static.png");
        this.stoneImage = ASSET_MANAGER.getAsset("assets/sprites/resources/stone.png");

        this.resources = [
            { isImage: true, image: this.woodImage, amount: 0 }, // wood
            { isImage: true, image: this.stoneImage, amount: 0 }, // stone
            { isImage: true, image: this.drinkImage, amount: 0 } // energy drink
        ];
    }


    update() {
        // Update resource amounts if needed
    }

    draw(ctx) {
        this.game.camera.resetTransformations(ctx);

        const canvasHeight = ctx.canvas.height;
        const canvasWidth = ctx.canvas.width;

        const barY = canvasHeight - this.barHeight - 20;
        const barX = (canvasWidth - this.barWidth) / 2;

        // Semi-transparent black background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(barX, barY, this.barWidth, this.barHeight);

        // Draw resource boxes
        this.resources.forEach((resource, i) => {
            const x = barX + this.spacing + (this.boxSize + this.spacing) * i;

            // Box background
            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.fillRect(x, barY + 10, this.boxSize, this.boxSize);

            // Resource icon
            if (resource.isImage && resource.image) {
                ctx.drawImage(resource.image, x + 15, barY + 25, 30, 30);
            } else {
                ctx.fillStyle = resource.color;
                ctx.fillRect(x + 15, barY + 25, 30, 30);
            }

            // Resource amount
            ctx.fillStyle = 'white';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(resource.amount, x + this.boxSize/2, barY + this.boxSize + 5);
        });

        this.game.camera.applyTransformations(ctx);
    }

    incrementAmount(index){
        if (index >= 0 && index < this.resources.length) {
            this.resources[index].amount++;
        }
    }

    setResourceAmount(index, amount) {
        if (index >= 0 && index < this.resources.length) {
            this.resources[index].amount = amount;
        }
    }

    getResourceAmount(index) {
        if (index >= 0 && index < this.resources.length) {
            return this.resources[index].amount;
        }
    }
}