import { Polygon } from "./polygon";
import { Vector2 } from "./vector2";
import { Line } from "./line";
export class RotationCenterFinder {
    polygon: Polygon;
    constructor(polygon: Polygon) {
        this.polygon = polygon;
    }

    getRotationalCenter(): Vector2 {
        const edge2 = this.polygon.lines[1];
        const edge4 = this.polygon.lines[3];
        // Find the intersection point of edge2 and edge4
        const intersection = Line.line_intersect(edge2, edge4);
        return intersection;
    }

}

