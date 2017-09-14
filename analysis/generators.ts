import { Upgrade } from './upgrades';

export interface GenJSON {
    name: string;
    price: number;
    power: number;
    deps: string[];
    upgrades: string[];
    type: 'generator';
}
export interface IGen {
    [key: string]: GenJSON
}

export function isGen(g: Generator | Upgrade): g is Generator {
    return (<Generator>g).type === 'generator';
}

export class Generator {
    static list: Map<string, Generator> = new Map;
    public type: 'generator';
    public name: string = 'Unnamed Generator';
    public price: number = 0;
    public power: number = 0;
    public deps: string[] = [];
    public upgrades: string[] = [];
    public num: number = 0;
    public basePower: number = 0;
    constructor(json: GenJSON) {
        ({
            price: this.price,
            name: this.name,
            power: this.power,
            deps: [...this.deps],
            upgrades: [...this.upgrades]
        } = json);

        Generator.list.set(this.name, this);
    }

}

// const gens: IGen = require('../build/data/generators.json');
// for (const gen in gens) {
//     new Generator(gens[gen]);
// }

let gens = [
    { "label": "I",    "coeff": 1.12, "price": 1e1,  "power":    1 },
    { "label": "II",   "coeff": 1.12, "price": 1e2,  "power":    5 },
    { "label": "III",  "coeff": 1.12, "price": 1e3,  "power":   10 },
    { "label": "IV",   "coeff": 1.12, "price": 1e4,  "power":   25 },
    { "label": "V",    "coeff": 1.13, "price": 1e5,  "power":   50 },
    { "label": "VI",   "coeff": 1.14, "price": 1e6,  "power":  100 },
    { "label": "VII",  "coeff": 1.14, "price": 1e7,  "power":  250 },
    { "label": "VIII", "coeff": 1.14, "price": 1e8,  "power":  500 },
    { "label": "IX",   "coeff": 1.15, "price": 1e9,  "power":  750 },
    { "label": "X",    "coeff": 1.15, "price": 1e10, "power": 1000 }

]
