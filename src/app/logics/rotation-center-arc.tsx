import { Polygon } from "./polygon";
import { PolygonConstructor } from "./polygon-constructor";
import { Vector2 } from "./vector2";
import { Line, EdgesParallelOrCoincidentError } from "./line";
import { RotationCenterFinder } from "./rotation-center-finder";

export class RotationalCentersAnalyzer {
    polygon: Polygon;

    constructor(polygon: Polygon) {
        if (polygon?.edges?.length !== 4) {
            throw new Error("Edges must have a length of 4");
        }
        this.polygon = polygon;
    }

    findRotationalCenters(): Vector2[] {
        // for 0 degree to 359 degree, find the rotational center
        const rotationalCenters: Vector2[] = [];
        for (let i = 0; i < 360; i++) {
            const polygon = new PolygonConstructor()
                .withEdges(this.polygon.edges.map(edge => edge.getLength()))
                .withFirstVertex(this.polygon.vertices[0])
                .withAngleBetweenFirstAndLastEdgeInDegree(i)
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
