export interface Upgrade {
    price: number;
    name: string;
    description: string;
    tiers: string[];
    deps: string[];
    exotic_deps: string[];
    dark_deps: string[];
    power?: number;
    bought?: boolean;
    type: 'upgrade';
}
export interface IUp {
    [key: string]: Upgrade
}
