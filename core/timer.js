class Timer {
    constructor() {
        this.gameTime = 0;
        this.maxStep = 0.05;
        this.lastTimestamp = 0;
        this.paused = false;  // Add this line
    };

    tick() {
        if (this.paused) {  // Add this check
            this.lastTimestamp = Date.now();
            return 0;
        }

        const current = Date.now();
        const delta = (current - this.lastTimestamp) / 1000;
        this.lastTimestamp = current;

        const gameDelta = Math.min(delta, this.maxStep);
        this.gameTime += gameDelta;
        return gameDelta;
    };
}