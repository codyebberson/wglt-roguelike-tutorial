import { Game, TileMap, RNG } from 'wglt';
export declare const MAP_WIDTH = 64;
export declare const MAP_HEIGHT = 64;
export declare class MapGenerator {
    readonly game: Game;
    readonly map: TileMap;
    readonly rng: RNG;
    constructor(game: Game);
    makeMap(): void;
    private clearMap;
    private createRoom;
    private createHTunnel;
    private createVTunnel;
    private placeEntities;
    private randomWall;
}
