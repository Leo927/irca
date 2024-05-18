import { createContext, Dispatch } from "react";
import { PolygonConstructionData } from "@/app/logics/polygon-constructor";
import { fromJSON } from "postcss";
import { Vector2 } from "../app/logics/vector2";
import React from "react";
import ReactDOM from "react-dom";
import { v4 as uuid } from 'uuid';

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
            if (state.find((data) => data.uid === action.payload.uid) !== undefined) {
                newValue = state.map((data) => data.uid === action.payload.uid ? action.payload : data);
                savePolygonDatas(newValue);
                return newValue;
            }
            const newItem = HistoricalPolygonData.fromJSON(action.payload);
            var newValue = [...state, newItem];
            savePolygonDatas(newValue);
            return newValue;
        case 'remove':
            console.log(`Removing polygon data: ${JSON.stringify(action.payload)}`);
            newValue = state.filter((data) => data.uid !== action.payload.uid);
            savePolygonDatas(newValue);
            return newValue;
        case 'update':
            console.log(`Updating polygon data: ${JSON.stringify(action.payload)}`);
            newValue = state.map((data) => data.uid === action.payload.uid ? action.payload : data);
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
            newValue = state.map((data) => data.uid === action.payload.uid ? data.withShow(true) : data);
            savePolygonDatas(newValue);
            return newValue;
        case 'hide':
            console.log(`Hiding polygon data: ${JSON.stringify(action.payload)}`);
            newValue = state.map((data) => data.uid === action.payload.uid ? data.withShow(false) : data);
            savePolygonDatas(newValue);
            return newValue;
        default:
            throw new Error('Invalid action type');

    }
}


export class HistoricalPolygonData extends PolygonConstructionData {
    show: boolean;
    color: string;
    name: string;
    uid: string;


    constructor() {
        super();
        this.show = false;
        this.color = 'black';
        this.name = '新建四连杆';
        this.uid = uuid();
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
        historicalPolygonData.show = data.show;
        historicalPolygonData.color = data.color;
        historicalPolygonData.name = data.name;
        historicalPolygonData.uid = data.uid && typeof data.uid === 'string' ? data.uid : uuid();
        return historicalPolygonData;
    }

    withShow(show: boolean): HistoricalPolygonData {
        var copy = HistoricalPolygonData.fromJSON(this);
        copy.show = show;
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