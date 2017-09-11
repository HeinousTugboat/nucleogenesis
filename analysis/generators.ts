import { Upgrade } from './upgrades';
export interface Generator {
    name: string;
    price: number;
    power: number;
    deps: string[];
    num?: number;
    basePower: number;
    type: 'generator';
}
export interface IGen {
    [key: string]: Generator
}

export function isGen(g: Generator | Upgrade): g is Generator {
    return (<Generator>g).type === 'generator';
}

export class Generator implements Generator {
    static list: Map<string, Generator> = new Map;
    public type: 'generator';
    public price: number = 0;
    public power: number = 0;
    public deps: string[] = [];
    public num?: number = 1;
    public basePower: number = 0;
    constructor(public name: string) {
        Generator.list.set(this.name, this);
    }

}


let g1 = new Generator('1');
console.log(g1);
console.log(Generator.list);
