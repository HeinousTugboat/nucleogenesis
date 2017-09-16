import { Generator } from './generators';
import { Dependency, Purchasable } from './resource';

export function isUpgrade(g: Generator | Upgrade | Purchasable | Dependency): g is Upgrade {
    return (<Upgrade>g).type === 'upgrade';
}

/**
 * Upgrades are attached to a specific generator, and simply multiply the
 * generators production by their bonus function. Bonus functions can associate
 * any two generators.
 */
export class Upgrade implements Dependency, Purchasable {
    static list: Set<Upgrade> = new Set;
    public type: 'upgrade';
    public available = false;
    public bought = false;
    constructor(
        public name: string = 'Unnamed Upgrade',
        protected target: Generator,
        protected bonusFn: () => number = () => 1,
        protected price: number,
        protected deps: Dependency[],
        protected source: Generator = target) {
        target.upgrades.push(this);
        Upgrade.list.add(this);
    }

    purchase(): number {
        if (this.checkAvailable()) {
            this.bought = true;
            return this.getCost();
        } else {
            return 0;
        }
    }
    getValue(rate: number): number { // NB: This could possible introduce negatives.
        return this.getCost() * (1 / (rate * (this.bonus()) - 1) + 1 / rate);
    }
    isFulfilled(): boolean {
        return this.available && this.bought;
    }

    checkAvailable(): boolean {
        if (this.bought) {
            this.available = false;
        } else {
            this.available = this.deps.every((dep: Dependency) => dep.isFulfilled());
        }
        return this.available;
    }

    getCost(): number {
        if (!this.bought) {
            return this.price;
        } else {
            return 0;
        }
    }

    /**
     * Calculates the upgrade's multiplier and returns it.
     * @returns {number} Upgrade Bonus Multiplier
     */
    bonus(): number {
        if (this.bought) {
            return this.bonusFn();
        } else {
            return 1;
        }
    }
}

/**
 * Basic Upgrade is the simple multiplier upgrade.
 */
export class BasicUpgrade extends Upgrade {
    constructor(protected target: Generator,
        private mult: number,
        protected price: number,
        protected deps: Dependency[]) {
        super(`${target.name}: x${mult} Multiplier`, target, () => mult, price, deps);
    }
}

/**
 * Boost Upgrade multiplier is 1+mult*current/num, for instance, +10% for every 10 generators.
 */
export class BoostUpgrade extends Upgrade {
    constructor(protected target: Generator,
        private mult: number,
        private num: number,
        protected price: number,
        protected deps: Dependency[]
    ) {
        super(`${target.name}: ${mult}/${num} Boost`, target, () => 1 + Math.floor(target.num / num) * mult, price, deps);
    }
}

/**
 * Synergy Upgrade multiplier is 1+source number/100. For instance, boosting II by 1% of IV.
 */
export class SynergyUpgrade extends Upgrade {
    constructor(protected target: Generator,
        protected price: number,
        protected deps: Dependency[],
        protected source: Generator
    ) {
        super(`${target.name}: ${source.name} Synergy`, target, () => 1 + Math.floor(source.num / 100), price, deps, source);
    }
}
