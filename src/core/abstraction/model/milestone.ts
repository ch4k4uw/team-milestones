export interface IMilestone {
    id?: string;
    year: number;
    month: number;
    day?: number;
    date?: Date;
    description: string;
    createdAt?: Date;
    updatedAt?: Date;
}