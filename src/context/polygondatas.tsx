import { createContext, Dispatch } from "react";
import { PolygonConstructionData } from "@/app/logics/polygon-constructor";
import { fromJSON } from "postcss";
import { Vector2 } from "../app/logics/vector2";

export const PolygonDatasContext = createContext<HistoricalPolygonData[]>([]);
export const PolygonDatasDispatchContext = createContext<Dispatch<{
    type: string;
    payload: any;
}>>
    (undefined as any);

function savePolygonDatas(polygonDatas: HistoricalPolygonData[]) {
    console.debug('Saving polygon datas', polygonDatas);
    localStorage.setItem('polygonDatas', JSON.stringify(polygonDatas));
}

export function polygonDatasReducer(state: HistoricalPolygonData[], action: { type: string, payload: any; }): HistoricalPolygonData[] {
    switch (action.type) {
        case 'add':
            if (action.payload === undefined || action.payload === null || !(action.payload instanceof HistoricalPolygonData || action.payload instanceof PolygonConstructionData)) {
                throw new PayloadValueError(`Invalid payload: ${JSON.stringify(action.payload)}`);
            }
            console.log(`Adding polygon data: ${JSON.stringify(action.payload)}`);

            const newItem = HistoricalPolygonData.fromJSON(action.payload).withIndex(state.reduce((max, data) => Math.max(max, data.index), -1) + 1);
            if (action.payload instanceof PolygonConstructionData) {
                newItem.color = 'black';
            }
            var newValue = [...state, newItem];
            savePolygonDatas(newValue);
            return newValue;
        case 'remove':
            console.log(`Removing polygon data: ${JSON.stringify(action.payload)}`);
            newValue = state.filter((data) => data.index !== action.payload.index);
            savePolygonDatas(newValue);
            return newValue;
        case 'update':
            console.log(`Updating polygon data: ${JSON.stringify(action.payload)}`);
            newValue = state.map((data, index) => index === action.payload.index ? action.payload : data);
            savePolygonDatas(newValue);
            return newValue;
        case 'clear':
            console.log('Clearing polygon data');
            savePolygonDatas([]);
            return [];
        case 'set':
            console.log(`Setting polygon data: ${JSON.stringify(action.payload)}`);
            savePolygonDatas(action.payload);
            return action.payload;
        case 'show':
            console.log(`Showing polygon data: ${JSON.stringify(action.payload)}`);
            newValue = state.map((data) => data.index === action.payload.index ? data.withShow(true) : data);
            savePolygonDatas(newValue);
            return newValue;
        case 'hide':
            console.log(`Hiding polygon data: ${JSON.stringify(action.payload)}`);
            newValue = state.map((data) => data.index === action.payload.index ? data.withShow(false) : data);
            savePolygonDatas(newValue);
            return newValue;
        default:
            throw new Error('Invalid action type');

    }
}


export class HistoricalPolygonData extends PolygonConstructionData {
    index: number;
    show: boolean;
    color: string;


    constructor() {
        super();
        this.index = 0;
        this.show = false;
        this.color = 'black';
    }

    static fromJSON(data: any): HistoricalPolygonData {
        if (data === undefined || data === null) {
            throw new PayloadValueError(`Invalid payload: ${JSON.stringify(data)}`);
        }
        const historicalPolygonData = new HistoricalPolygonData();
        historicalPolygonData.edgeLengths = data.edgeLengths;
        historicalPolygonData.edge0Angle = data.edge0Angle;
        historicalPolygonData.angleBetweenFirstAndLastEdge = data.angleBetweenFirstAndLastEdge;
        historicalPolygonData.firstVertex = new Vector2(data.firstVertex.x, data.firstVertex.y);
        historicalPolygonData.index = data.index;
        historicalPolygonData.show = data.show;
        historicalPolygonData.color = data.color;
        return historicalPolygonData;
    }

    withShow(show: boolean): HistoricalPolygonData {
        var copy = HistoricalPolygonData.fromJSON(this);
        copy.show = show;
        return copy;
    }

    withIndex(index: number): HistoricalPolygonData {
        var copy = HistoricalPolygonData.fromJSON(this);
        copy.index = index;
        return copy;
    }

    withColor(color: string): HistoricalPolygonData {
        var copy = HistoricalPolygonData.fromJSON(this);
        copy.color = color;
        return copy;
    }
}


class PayloadValueError extends Error {
    constructor(msg?: string) {
        super(msg || 'Payload value is invalid');
    }
}