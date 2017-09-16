import { Upgrade, BasicUpgrade, BoostUpgrade, SynergyUpgrade } from './upgrades';
import { Dependency, Purchasable } from './resource';

export function isGen(g: Generator | Upgrade | Purchasable | Dependency): g is Generator {
    return (<Generator>g).type === 'generator';
}

export class Generator implements Dependency, Purchasable {
    static list: Map<string, Generator> = new Map;
    public type: 'generator';
    public upgrades: Upgrade[] = [];
    public num: number = 0;
    // public basePower: number = 0;
    public available: boolean = false;
    constructor(public name: string = 'Unnamed Generator',
        public price: number = 0,
        public power: number = 0,
        public coeff: number,
        public deps: Generator[]) {
        if (deps.length == 0) {
            this.available = true;
        }
        Generator.list.set(this.name, this);
    }

    purchase(): number {
        if (this.available) {
            let cost = this.getCost();
            this.num++;
            return cost;
        } else {
            return 0;
        }
    }
    getValue(rate: number): number {
        return this.getCost() * (1 / this.getBaseRate() + 1 / rate);
    }

    isFulfilled(): boolean {
        return this.num > 0 && this.available;
    }
    /**
     * Checks whether all dependencies are fulfilled.
     */
    checkAvailable(): boolean {
        this.available = this.deps.every((item: Dependency) => item.isFulfilled());
        return this.available;
    }

    getBaseRate(): number {
        return this.upgrades.reduce((rate, upgrade) => {
            return rate * upgrade.bonus();
        }, this.power);
    }

    getTotalRate(): number {
        return this.getBaseRate() * this.num;
    }

    getCost(): number {
        return Math.floor(Math.pow(this.coeff, this.num) * this.price);
    }

}

let gens: Generator[] = [];
//                      Label   Cost  Power  Coeff  Deps
gens.push(new Generator('I', 1e1, 1, 1.12, []));
gens.push(new Generator('II', 1e2, 5, 1.12, [gens[0]]));
gens.push(new Generator('III', 1e3, 10, 1.12, [gens[1]]));
gens.push(new Generator('IV', 1e4, 25, 1.12, [gens[2]]));
gens.push(new Generator('V', 1e5, 50, 1.13, [gens[3]]));
gens.push(new Generator('VI', 1e6, 100, 1.14, [gens[4]]));
gens.push(new Generator('VII', 1e7, 250, 1.14, [gens[5]]));
gens.push(new Generator('VIII', 1e8, 500, 1.14, [gens[6]]));
gens.push(new Generator('IX', 1e9, 750, 1.15, [gens[7]]));
gens.push(new Generator('X', 1e10, 1000, 1.15, [gens[8]]));

gens.forEach(gen => {
    let basic = new BasicUpgrade(gen, 2, 1e5 * gen.power, [gen]);
    // let basic2 = new BasicUpgrade(gen, 3, ???, [gen, basic, xBasic3x]);
    // let boost = new BoostUpgrade(gen, 0.05, 10, ???, [gen, xBoost]);
    // let boost2 = new BoostUpgrade(gen, 0.25, 25, ???, [gen, boost, xBoost2]);
    // let boost3 = new BoostUpgrade(gen, 1, 50, ???, [gen, boost2, xBoost3]);
    // let boost4 = new BoostUpgrade(gen, 2.5, 100, ???, [gen, boost3, xBoost4]);
    gens.forEach(source => {
        if (gen !== source) {
            // let synergy = new SynergyUpgrade(gen, 10, [xSyn(source)], source);
        }
    })
});
