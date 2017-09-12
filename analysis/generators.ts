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

const gens: IGen = require('../build/data/generators.json');

for (const gen in gens) {
    new Generator(gens[gen]);
}
