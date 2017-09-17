import config from './config';
import { Generator, isGen } from './generators';
import { Upgrade, isUpgrade } from './upgrades';
import { Purchasable } from './resource';

/**
 * Variables! For adjusting and stuff!
 */

const { MIN, HR, DAY } = config;
const { coeff } = config;
const { H, xH } = config.resources;
let currH = H.current;
let totalH = H.total;
let rate = H.rate;
let { current: currX, total: totalX } = xH;
let longest = 0;
let last = 0;

/** Duration of simulation. */
const MAX_TIME = 1 * DAY;
// const MAX_TIME = 7 * DAY + 1;
/** Num of exotic particles to prestige at.. */
const xThresh = Infinity;
/** Num of seconds to prestige at.. */
const tThresh = 24 * HR;
/** Last time prestige time */
let lastPrestige = 0;
/** Modifier each exotic particle has on resource generation */
const exoticPower = 0.001;
/** Print Value calculations every tick? **Ludicrously Huge File** */
const printVals = false;

/**
 * Output stuff
 */

const fs = require('fs');
const path = './analysis/sim-' + Date.now() + '.csv';
const stream = fs.createWriteStream(path);

/** List of every purchasable potentially available. */
let slush: Purchasable[] = [...Generator.list.values(), ...Upgrade.list.values()];

function findBest(): Purchasable {
    return slush.filter(item => item.checkAvailable())
        .reduce((prev, curr) => prev.getValue(rate) < curr.getValue(rate) ? prev : curr)
}

function getTotalRate(): number {
    let currRate = 0;
    for (const gen of Generator.list.values()) {
        currRate += gen.getTotalRate();
    }
    return currRate;
}

let next = findBest();

let out = 'i,rate,totalH,currH,longest,elapsed,';
for (const entry of Generator.list.entries()) {
    out += entry[0] + ','
    if (printVals) {
        out + entry[0] + '-val,';
    }

}
stream.write(out + 'bought,next\n');
for (let i = 0; i <= MAX_TIME; i++) {
    let bought: Purchasable;
    rate = getTotalRate();
    currH += rate;
    totalH += rate;
    let cost = next.getCost();
    if (currH >= cost) {
        currH -= next.purchase();
        bought = next;
        rate = getTotalRate();
        next = findBest();
        let time = i - last;
        if (time > longest) {
            longest = time;
        }
        last = i;
    }

    let out = `${i / DAY},${rate},${totalH},${currH},${longest.toFixed(1)},${(i - last).toFixed(1)},`;
    for (const gen of Generator.list.values()) {
        out += gen.num + ',';
        if (printVals) {
            out += gen.getValue(rate) + ',';
        }
    }
    stream.write(out + `${(bought && bought.name) || ""},${next.name || ""}\n`);
}

console.log('rate', rate, 'H', currH, 'total', totalH);
console.log('slush', slush.length);
console.log('next', findBest().name);
console.log('longest', longest / 60 + 'm');

