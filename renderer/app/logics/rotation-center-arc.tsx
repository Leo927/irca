import { Polygon } from "./polygon";
import { PolygonConstructionData, PolygonConstructor } from "./polygon-constructor";
import { Vector2 } from "./vector2";
import { Line, EdgesParallelOrCoincidentError } from "./line";
import { RotationCenterFinder } from "./rotation-center-finder";

export class RotationalCentersAnalyzer {
    INTERVAL = 1;
    data: PolygonConstructionData;
    startAngle = 0;
    endAngle = 359;

    constructor(data: PolygonConstructionData) {
        this.data = data;
    }

    setStartAngle(startAngle: number): RotationalCentersAnalyzer {
        this.startAngle = startAngle;
        return this;
    }

    setEndAngle(endAngle: number): RotationalCentersAnalyzer {
        this.endAngle = endAngle;
        return this;
    }

    findRotationalCenters(): Vector2[] {
        // for 0 degree to 359 degree, find the rotational center
        const rotationalCenters: Vector2[] = [];
        let startAngle, endAngle;
        if (this.endAngle < this.startAngle) {
            startAngle = this.endAngle;
            endAngle = this.startAngle;
        }
        else {
            startAngle = this.startAngle;
            endAngle = this.endAngle;
        }
        console.info(`Finding rotational centers between ${startAngle} and ${endAngle}`);

        for (let i = startAngle; i <= endAngle; i += this.INTERVAL) {
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
