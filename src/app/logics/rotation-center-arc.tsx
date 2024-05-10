import { Polygon } from "./polygon";
import { PolygonConstructionData, PolygonConstructor } from "./polygon-constructor";
import { Vector2 } from "./vector2";
import { Line, EdgesParallelOrCoincidentError } from "./line";
import { RotationCenterFinder } from "./rotation-center-finder";

export class RotationalCentersAnalyzer {
    INTERVAL = 1;
    data: PolygonConstructionData;

    constructor(data: PolygonConstructionData) {
        this.data = data;
    }

    findRotationalCenters(): Vector2[] {
        // for 0 degree to 359 degree, find the rotational center
        const rotationalCenters: Vector2[] = [];
        for (let i = 0; i < 360; i+=this.INTERVAL) {
            const polygon = new PolygonConstructor(this.data.withAngleBetweenFirstAndLastEdgeInDegree(i))
                .constructPolygon();
            try {
                const rotationalCenter = new RotationCenterFinder(polygon).getRotationalCenter();
                rotationalCenters.push(rotationalCenter);
            } catch (e) {
                if (e instanceof EdgesParallelOrCoincidentError) {
                    continue;
                } else {
                    throw e;
                }
            }
        }
        return rotationalCenters;
    }
}
