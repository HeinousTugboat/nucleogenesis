export interface Resource {
    current: number;
    total: number;
    rate?: number;
}


export interface Dependency {
    isFulfilled: () => boolean;
}


export interface Purchasable {
    name: string;
    getCost: () => number;
    checkAvailable: () => boolean;
    getValue: (totalRate: number) => number;
    purchase: () => number;
}
