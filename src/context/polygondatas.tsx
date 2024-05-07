import { createContext, Dispatch } from "react";
import { PolygonConstructionData } from "@/app/logics/polygon-constructor";

export const PolygonDatasContext = createContext<HistoricalPolygonData[]>([]);
export const PolygonDatasDispatchContext = createContext< Dispatch<{
    type: string;
    payload: any;
}>>
(undefined as any);



export function polygonDatasReducer(state: HistoricalPolygonData[], action: { type: string, payload: any; }): HistoricalPolygonData[] {
    switch (action.type) {
        case 'add':
            if (action.payload === undefined || action.payload === null || !(action.payload instanceof HistoricalPolygonData || action.payload instanceof PolygonConstructionData)) {
                throw new PayloadValueError(`Invalid payload: ${JSON.stringify(action.payload)}`);
            }
            console.log(`Adding polygon data: ${JSON.stringify(action.payload)}`);
            
            var newValue = [...state, HistoricalPolygonData.fromJSON(action.payload).withIndex(state.length)];
            localStorage.setItem('polygonDatas', JSON.stringify(newValue));
            return newValue;
        case 'remove':
            console.log(`Removing polygon data: ${JSON.stringify(action.payload)}`);
            newValue =  state.filter((data) => data.index !== action.payload.index);
            localStorage.setItem('polygonDatas', JSON.stringify(newValue));
            return newValue;
        case 'update':
            console.log(`Updating polygon data: ${JSON.stringify(action.payload)}`);
            newValue= state.map((data, index) => index === action.payload.index ? action.payload : data);
            localStorage.setItem('polygonDatas', JSON.stringify(newValue));
        case 'clear':
            console.log('Clearing polygon data');
            localStorage.setItem('polygonDatas', JSON.stringify([]));
            return [];
        case 'set':
            console.log(`Setting polygon data: ${JSON.stringify(action.payload)}`);
            localStorage.setItem('polygonDatas', JSON.stringify(action.payload));
            return action.payload;
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