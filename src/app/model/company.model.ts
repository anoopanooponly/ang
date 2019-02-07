export class Company {
    _id: string;
    name?: string;
    shifts?: Array<Shift>;
    lat?: number;
    lng?: number;
    address?: string;
    city?: string;
    province?: string;
    postalCode?: string;
    country?: string;
};
export class Shift {
    _id: string;
    name: string;
    start: number;
    end: number;
};