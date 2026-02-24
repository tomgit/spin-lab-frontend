import { Container, Sprite, Spritesheet } from "pixi.js";

export class Reel {
    container = new Container();
    symbols: Sprite[] = [];

    constructor(
        private sheet: Spritesheet,
        private symbolNames: string[],
        private symbolsPerReel: number,
        private spacing: number = 300
    ) {}

    createSymbols() {
        for (let i = 0; i < this.symbolsPerReel; i++) {
            const randomName = this.getRandomSymbolName();
            const tex = this.sheet.textures[randomName];
            const symbol = new Sprite(tex);
            symbol.anchor.set(0.5);
            symbol.scale.set(0.82);
            symbol.y = (i - 1) * this.spacing;
            this.container.addChild(symbol);
            this.symbols.push(symbol);
        }
    }

    private getRandomSymbolName() {
        const idx = Math.floor(Math.random() * this.symbolNames.length);
        return this.symbolNames[idx];
    }
}
