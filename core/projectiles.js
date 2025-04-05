class Projectile {
    constructor(x, y, target, speed, damage, type = "basic", explosionRadius = 0) {
        this.x = x;
        this.y = y;
        this.target = target;
        this.speed = speed;
        this.damage = damage;
        this.type = type; // "arrow", "bomb", "spell"
        this.explosionRadius = explosionRadius;
        this.removeFromWorld = false;
    }

    update() {
        if (!this.target || this.target.health <= 0) {
            this.removeFromWorld = true;
            return;
        }

        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 5) {
            this.hitTarget();
            this.removeFromWorld = true;
        } else {
            this.x += (dx / distance) * this.speed * gameEngine.clockTick;
            this.y += (dy / distance) * this.speed * gameEngine.clockTick;
        }
    }

    hitTarget() {
        switch (this.type) {
            case "bomb":
                this.explode();
                break;
            case "spell":
                this.target.takeDamage(this.damage);
                break;
            default: // Arrow or basic
                this.target.takeDamage(this.damage);
                break;
        }
    }

    explode() {
        for (let entity of gameEngine.entities) {
            if (entity instanceof Enemy) {
                let dx = entity.x - this.x;
                let dy = entity.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance <= this.explosionRadius) {
                    entity.takeDamage(this.damage);
                }
            }
        }
    }

    draw(ctx) {
        switch (this.type) {
            case "arrow":
                ctx.fillStyle = "white";
                break;
            case "bomb":
                ctx.fillStyle = "red";
                break;
            case "spell":
                ctx.fillStyle = "yellow";
                break;
            default:
                ctx.fillStyle = "gray";
                break;
        }

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.type === "bomb" ? 7 : 4, 0, Math.PI * 2);
        ctx.fill();
    }
}
