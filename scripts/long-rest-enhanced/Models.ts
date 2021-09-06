export interface LongRestResult {
    dhd: number;
    dhp: number;
    updateData: Record<string, number>;
    updateItems: Record<string, number>; // This type might be wrong
    longRest: boolean;
    newDay: boolean;
}