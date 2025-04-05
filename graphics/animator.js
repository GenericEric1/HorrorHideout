class Animator {
    constructor(spritesheet, xStart, yStart, frameWidth, frameHeight, frameCount, frameDuration, framePadding, reverse, loop) {
        Object.assign(this, { spritesheet, xStart, yStart, frameWidth, frameHeight, frameCount, frameDuration, framePadding, reverse, loop });

        this.elaspedTime = 0;
        this.totalTime = this.frameDuration * this.frameCount;
    }

    drawFrame(tick, ctx, x, y, scale) {
        this.elaspedTime += tick;

        if (this.isDone()) {
            if (this.loop) {
                this.elaspedTime -= this.totalTime;
            }
        }

        let frame = this.currentFrame();
        if (this.reverse) frame = this.frameCount - frame - 1;

        const sx = this.xStart + frame * (this.frameWidth + this.framePadding);

        ctx.drawImage(this.spritesheet,
            sx, this.yStart,
            this.frameWidth, this.frameHeight,
            x, y,
            this.frameWidth * scale, this.frameHeight * scale
        );
    }

    currentFrame() {
        return Math.floor(this.elaspedTime / this.frameDuration);
    }

    isDone() {
        return (this.elaspedTime >= this.totalTime);
    }
}
