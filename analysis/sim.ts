/**
 * Variables! For adjusting and stuff!
 */

import config from './config';
import { Generator, IGen, isGen } from './generators';
import { Upgrade, IUp } from './upgrades';

const { MIN, HR, DAY } = config;
// const MAX_TIME = 1 * DAY + 1;
const MAX_TIME = 10;
const { H, xH } = config.resources;

let currH = H.current;
let totalH = H.total;
let rate = H.rate;
const { coeff } = config;
let { current: currX, total: totalX } = xH;

/** Num of exotic particles to prestige at.. */
const xThresh = Infinity;
/** Num of seconds to prestige at.. */
const tThresh = 24 * HR;
/** Last time prestige time */
let lastPrestige = 0;
/** Modifier each exotic particle has on resource generation */
const exoticPower = 0.001;

const exForm = 'fancy';
/**
 * Output stuff
 */

const fs = require('fs');
const path = './analysis/sim-' + Date.now() + '.csv';
const stream = fs.createWriteStream(path);

let slush: (Generator | Upgrade)[] = [];

// const choices: (Generator | Upgrade)[] = [gens['1'], gens['2'], upgrades['1-1'], upgrades['2-1']];


let exoticDeps = {
    'x2': true,
    'x3': false
}

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

/**
 * Calculates cost of next generator based on current number.
 */
function calcCost(g: Generator | Upgrade) {
    if (isGen(g))
        return Math.ceil(g.price * Math.pow(coeff, g.num));
    else
        return g.price;
}

/**
 * This is the value calculation. The lowest result is currently best.
 */
function calcVal(g: Generator | Upgrade): number {
    return 1;
    // let currR = rate ? 1 / rate : 1;
    // if (isGen(g))
    //     return calcCost(g) * (currR + 1 / g.power);
    // else
    //     return g.price * (currR + 1 / (g.tiers.reduce((acc, val) => {
    //         return acc + gens[val].num * g.power;
    //     }, 0)));
}
/**
 * Check if generator's available for purchase by verifying its dependencies.
 */
function isAvail(g: Generator | Upgrade): boolean {
    return true;
    // if (isGen(g))
    //     return g.deps.every(val => {
    //         return !!gens[val].num;
    //     })
    // else {
    //     return (!g.bought && g.deps.every(val => {
    //         return upgrades[val].bought;
    //     }) && g.exotic_deps.every(val => {
    //         return exoticDeps[val];
    //     }));
    // }
}

function findBest(): Generator | Upgrade {
    return slush.filter(isAvail)
        .reduce((prev, curr) => calcVal(prev) < calcVal(curr) ? prev : curr)
}

/** This is used to determine after each purchase which choice is the optimal next */
// let val = Infinity;
/** At the beginning, we purchase one '1' generator to start */
let next = findBest();

stream.write('i,rate,totalH,currH,1,2,3,4,5,6,7,8,9,10,boughtGen,boughtUpgrade,didPrestige,next.name,currX,totalX,xH\n');
for (let i = 0; i <= MAX_TIME; i++) {

    let boughtGen: string = '';
    let boughtUpgrade: string = '';
    let didPrestige: boolean = false;
    let increase = rate * (1 + exoticPower * currX);
    currH += increase;
    totalH += increase;
    let cost = calcCost(next);
    let xH = PrestigeFns[exForm](currH);
    if (xH >= xThresh || (xH >= 1 && i - lastPrestige >= tThresh)) {
        prestige(PrestigeFns[exForm]);
        lastPrestige = i;
        didPrestige = true;
    } else if (currH >= cost) {
        if (isGen(next)) {
            boughtGen = next.name;
            rate += next.power;
            next.num++;
        } else {
            boughtUpgrade = next.name;
            next.tiers.forEach(val => {
                rate -= gens[val].power * gens[val].num;
                gens[val].power *= next.power;
                rate += gens[val].power * gens[val].num;
            })
            next.bought = true;
        }
        currH -= cost;
        next = findBest();
    }

    stream.write(`${i / DAY},${rate},${totalH},${currH},${gens['1'].num},${gens['2'].num},${gens['3'].num},${gens['4'].num},${gens['5'].num},${gens['6'].num},${gens['7'].num},${gens['8'].num},${gens['9'].num},${gens['10'].num},${boughtGen},${boughtUpgrade},${next.name},${didPrestige},${currX},${totalX},${xH}\n`);
}

console.log('rate', rate, 'H', currH, 'total', totalH);
console.log('currX', currX, 'totalX', totalX);
console.log(slush.length);
console.log(findBest().name);

