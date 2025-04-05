class GameEngine {
    constructor(options) {
        this.ctx = null;

        // Everything that will be updated and drawn each frame
        this.entities = [];

        this.selectedBuilding = "ArcherTower";

        // // Information on the input
        this.click = null;
        this.mouse = null;
        this.wheel = null;
        this.keys = {};
        this.camera = null;
        this.enemySpawner = null;

        // initialize the keys for the character
        this.left = false;
        this.right = false;
        this.up = false;
        this.down = false;

        this.paused = false;

        // Options and the Details
        this.options = options || {
            debugging: false,
        };

        this.settings = {
            timerPaused: true,
            startTimer: () => {
                console.log("Timer started!");
            }
        };
    };

    init(ctx, camera, enemySpawner) {
        this.ctx = ctx;
        this.camera = camera;
        this.startInput();
        this.timer = new Timer();
        this.enemySpawner = enemySpawner;
    };

    start() {
        this.running = true;
        const gameLoop = () => {
            this.loop();
            requestAnimFrame(gameLoop, this.ctx.canvas);
        };
        gameLoop();
    };

    stop() {
        this.running = false;
    }

    startInput() {
        const getXandY = e => ({
            x: e.clientX - this.ctx.canvas.getBoundingClientRect().left,
            y: e.clientY - this.ctx.canvas.getBoundingClientRect().top
        });

        this.ctx.canvas.addEventListener("mousemove", e => {
            if (this.options.debugging) {
                console.log("MOUSE_MOVE", getXandY(e));
            }
            this.mouse = getXandY(e);
        });

        this.ctx.canvas.addEventListener("click", e => {
            if (this.options.debugging) {
                console.log("CLICK", getXandY(e));
            }
            this.click = getXandY(e);
        });

        this.ctx.canvas.addEventListener("wheel", e => {
            if (this.options.debugging) {
                console.log("WHEEL", getXandY(e), e.wheelDelta);
            }
            e.preventDefault(); // Prevent Scrolling
            this.wheel = e;
        });

        this.ctx.canvas.addEventListener("contextmenu", e => {
            if (this.options.debugging) {
                console.log("RIGHT_CLICK", getXandY(e));
            }
            e.preventDefault(); // Prevent Context Menu
            this.rightclick = getXandY(e);
        });

        this.ctx.canvas.addEventListener("keydown", (event) => {
            this.keys[event.key] = true

            switch (event.key) {
                case '1':
                    this.selectedBuilding = "ArcherTower";
                    break;
                case '2':
                    this.selectedBuilding = "Wall";
                    break;
                case '3':
                    this.selectedBuilding = "Campfire";
                    break;
                case '4':
                    this.selectedBuilding = "MageTower";
                    break;
                case '5':
                    this.selectedBuilding = "BombTower";
                    break;
            }
        });
        this.ctx.canvas.addEventListener("keyup", event => this.keys[event.key] = false);

    };

    addEntity(entity) {
        this.entities.push(entity);
    };

    draw() {
        // Clear the whole canvas with transparent color (rgba(0, 0, 0, 0))
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        if (this.camera) this.camera.applyTransformations(this.ctx);

        let buildings = [];
        let projectiles = [];
        let creatures = [];

        for (let entity of this.entities) {
            if (entity instanceof Building) {
                buildings.push(entity);
            } else if (entity instanceof Projectile) {
                projectiles.push(entity);
            } else if (entity instanceof Enemy || entity instanceof Hero) {
                creatures.push(entity);
            } else {
                entity.draw(this.ctx);
            }
        }

        for (let building of buildings) {
            building.draw(this.ctx);
        }

        for (let creature of creatures) {
            creature.draw(this.ctx);
        }

        for (let projectile of projectiles) {
            projectile.draw(this.ctx);
        }

        if (this.enemySpawner) this.enemySpawner.draw(this.ctx);

        if (this.camera) this.camera.resetTransformations(this.ctx);
    };

    update() {
        this.camera.update();

        if (this.enemySpawner) {
            this.enemySpawner.update();
        }

        let player = null;
        let tilemap = null;

        for (let entity of this.entities) {
            if (entity instanceof Hero) {
                player = entity;
            } else if (entity instanceof TileMap) {
                tilemap = entity;
            }
        }

        let entitiesCount = this.entities.length;

        for (let i = this.entities.length - 1; i >= 0; --i) {
            let entity = this.entities[i];
            if (!entity.removeFromWorld) {
                entity.update();
            } else {
                if (entity instanceof Enemy) {
                    this.enemySpawner.enemyDefeated();
                }
                this.entities.splice(i, 1);
            }
        }
    };

    loop() {
        this.clockTick = this.timer.tick();
        this.update();
        this.draw();
    };

}