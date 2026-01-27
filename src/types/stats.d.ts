declare module "stats.js" { 
    export default class Stats { 
        constructor(); 
        dom: HTMLDivElement; 
        showPanel(id: number): void; 
        begin(): void; 
        end(): void; 
    } 
}