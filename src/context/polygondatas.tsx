import { createContext, Dispatch } from "react";
import { PolygonConstructionData } from "@/app/logics/polygon-constructor";

export const PolygonDatasContext = createContext<HistoricalPolygonData[]>([]);
export const PolygonDatasDispatchContext = createContext< Dispatch<{
    type: string;
    payload: HistoricalPolygonData;
}>>
(undefined as any);



export function polygonDatasReducer(state: HistoricalPolygonData[], action: { type: string, payload: HistoricalPolygonData; }): HistoricalPolygonData[] {
    switch (action.type) {
        case 'add':
            if (action.payload === undefined || action.payload === null || !(action.payload instanceof HistoricalPolygonData)) {
                throw new PayloadValueError(`Invalid payload: ${JSON.stringify(action.payload)}`);
            }
            return [...state, action.payload.withIndex(state.length)];
        case 'remove':
            return state.filter((_, index) => index !== action.payload.index);
        case 'update':
            return state.map((data, index) => index === action.payload.index ? action.payload : data);
        default:
            throw new Error('Invalid action type');
    }
}


export class HistoricalPolygonData extends PolygonConstructionData {
    index: number;
    show: boolean;

    constructor(data: PolygonConstructionData) {
        super();
        this.index = 0;
        this.show = false;
    }

    static fromJSON(data: any): HistoricalPolygonData {
        const historicalPolygonData = new HistoricalPolygonData(PolygonConstructionData.fromJSON(data));
        historicalPolygonData.index = data.index;
        historicalPolygonData.show = data.show;
        return historicalPolygonData;
    }

    withShow(show: boolean): HistoricalPolygonData {
        const copy = JSON.parse(JSON.stringify(this)) as HistoricalPolygonData;
        copy.show = show;
        return copy;
    }

    withIndex(index: number): HistoricalPolygonData {
        const copy = JSON.parse(JSON.stringify(this)) as HistoricalPolygonData;
        copy.index = index;
        return copy;
    }
}


class PayloadValueError extends Error {
    constructor(msg?: string) {
        super(msg || 'Payload value is invalid');
    }
}