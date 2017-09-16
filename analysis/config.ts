type PrestigeFn = (n: number) => number;

const MIN = 60;
const HR = 60 * MIN;
const DAY = 24 * HR;
const WEEK = 7 * DAY;
const floorLog = (n: number) => Math.pow(10, Math.floor(Math.log10(n / r)));
const r = 10e7;

export default {
    MIN, HR, DAY, WEEK,
    simLength: 1 * DAY + 1,
    resources: {
        H: {
            current: 15,
            total: 15,
            rate: 0
        },
        xH: {
            current: 0,
            total: 15
        }
    },
    coeff: 1.15,
    prestige: {
        default: (n: number) => Math.floor(Math.max(0, Math.log(n))),
        root: (n: number) => Math.floor(Math.sqrt(n)),
        combine: (n: number) => Math.floor(Math.max(0, Math.log(n) + Math.sqrt(n)) / 2),
        fancy: (n: number) => Math.floor(floorLog(n) / (1 + Math.pow(Math.E, -1 * ((n / r) - 5.747734128 * floorLog(n)) / floorLog(n))) + floorLog(n) / 10)
    }
};
