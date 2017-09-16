// Should actually be able to cache this, I think, and just check if n is >10*r*result.
const floorLog = (n: number) => Math.pow(10, Math.floor(Math.log10(n / r)));
const r = 10e7;

type PrestigeFn = (n: number) => number;
type PrestigeFns = { [key: string]: PrestigeFn };

let { prestige: PrestigeFns } = config;

function prestige(fn: PrestigeFn = PrestigeFns.default) {
    let nextX = fn(currH);
    currX += nextX;
    totalX += nextX;
    currH = 0;
    rate = 1;
    for (let gen in gens) {
        gens[gen].num = 0;
        gens[gen].power = gens[gen].basePower;
    }
    gens['1'].num = 1;
    for (let upgrade in upgrades) {
        upgrades[upgrade].bought = false;
    }
    next = findBest();
}
