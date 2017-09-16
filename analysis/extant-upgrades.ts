import { Generator } from './generators';

export interface UpgradeJSON {
    name: string;
    description: string;
    deps: string[];
    exotic_deps: string[];
    dark_deps: string[];
    function: string;
    price: number;
    tiers: string[];
}
export interface IUp {
    [key: string]: UpgradeJSON
}
type upgradeFn = 'multiplier' | 'synergies' | 'boost';

const upgradeFns = {
    'multiplier': (power, prod, tier) => prod * power,
    'synergies': (power, prod, tier) => prod * (1 + Generator.list.get(tier).num / 100),
    'boost': (power, prod, tier) => prod * (1 + Math.floor(Generator.list.get(tier).num) / power.qty) * power.percent
};

const genRanks = {
    1: 'I', 2: 'II',
    3: 'III', 4: 'IV',
    5: 'V', 6: 'VI',
    7: 'VII', 8: 'VIII',
    9: 'IX', 10: 'X'
}

const boostRanks = {
    1: { percent: 0.05, qty: 10 },
    2: { percent: 0.25, qty: 25 },
    3: { percent: 1.00, qty: 50 },
    4: { percent: 2.50, qty: 100 }
}

interface Boost {
    qty: number;
    percent: number;
}

export class Upgrade {
    static list: Map<string, Upgrade> = new Map;
    public type: 'upgrade';
    public name: string = 'Unnamed Upgrade';
    public description: string = 'Unknown Description';
    public price: number = 0;
    public deps: string[] = [];
    public exoticDeps: string[] = [];
    public darkDeps: string[] = [];
    public tiers: string[];
    public num: number = 0;
    public baseTier: string;
    public basePower: (number | string) = 0;
    public upgradeType: upgradeFn;
    constructor(public label: string, json: UpgradeJSON) {
        ({
            name: this.name,
            description: this.description,
            deps: [...this.deps],
            exotic_deps: [...this.exoticDeps],
            dark_deps: [...this.darkDeps],
            price: this.price,
            tiers: [...this.tiers]
        } = json);
        const [labelName, labelRank, labelTier] = label.split('-');
        this.upgradeType = (<upgradeFn>labelName);
        this.baseTier = genRanks[labelTier];
        switch (this.upgradeType) {
            case 'multiplier':
                this.basePower = parseInt(labelRank) + 1;
            case 'synergies':
                this.basePower = 0;
            case 'boost':
                this.basePower = boostRanks[parseInt(labelRank)];
        }

        Upgrade.list.set(this.name, this);
    }
}


const upgrades: IUp = require('../build/data/upgrades.json');

for (const upgrade in upgrades) {
    new Upgrade(upgrade, upgrades[upgrade]);
}
