class BuildingFactory {
    static createBuilding(type, row, col, tileMap, tileSize) {
        switch (type) {
            case "ArcherTower":
                return new ArcherTower(row, col, tileMap, tileSize);
            case "Wall":
                return new Wall(row, col, tileMap, tileSize);
            case "Campfire":
                return new Campfire(row, col, tileMap, tileSize);
            case "MageTower":
                return new MageTower(row, col, tileMap, tileSize);
            case "BombTower":
                return new BombTower(row, col, tileMap, tileSize);
            default:
                console.error(`Unknown building type: ${type}`);
                return null;
        }
    }
}
