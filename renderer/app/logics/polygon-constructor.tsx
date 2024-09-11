import { Polygon } from "./polygon";
import { Vector2 } from "./vector2";

/**
 * Draw a polygon like 
 * D--------C
 * |        |
 * |        |
 * A--------B
 * they are ordered A,B,C,D
 * And the edges are ordered AB, BC, CD, DA
 */

export class PolygonConstructor {
    /**
     * Calculates the position of all vertices of a 4 sided polygon
     * Given: 
     * 1. Length of all edges, each edges can be different
     * 2. The position of the first vertex
     * 3. The angle between the first and the last edge
     * 4. The second vertex has the same y coord as the first vertex. Its x coord is the sum of the length of the first edge and the x coord of the first vertex
     * 5. The order going counter clockwise is first vertex, first edge, second vertex, second edge, third vertex, third edge, forth vertex, forth edge, first vertex
     */

    data: PolygonConstructionData = new PolygonConstructionData();
    vertices: (Vector2 | null)[] = [null, null, null, null];

    constructor(data: PolygonConstructionData) {
        this.data = data;
        this.vertices[0] = data.firstVertex;
    }

    /**
     * Calculate the position of the second vertex
     */
    calculateSecondVertex(): void {
        if (this.vertices[0] === null) {
            throw new Error("First vertex does not exist");
        }

        let firstVertex = this.vertices[0];
        // calculate the position of the second vertex using first point, first edge length, and the edge0 angle

        let secondVertex = new Vector2(firstVertex.x + this.data.edgeLengths[0] * Math.cos(toRadians(-this.data.edge0Angle)),
            firstVertex.y + this.data.edgeLengths[0] * Math.sin(toRadians(-this.data.edge0Angle)));
        this.vertices[1] = secondVertex;
    }

    calculateForthVertex(): void {
        // we know |AD|, |DC|, and <ADC
        // we also know xA, yA, xC, yC
        // find D
        let A = this.vertices[0];
        let C = this.vertices[2];
        if (A === null || C === null) {
            throw new Error("First or third vertex does not exist");
        }
        let AD = this.data.edgeLengths[3];
        let DC = this.data.edgeLengths[2];
        let ADC = this.data.angleBetweenFirstAndLastEdge;
        let AC = Math.sqrt(AD * AD + DC * DC - 2 * AD * DC * Math.cos(toRadians(ADC)));

        // find the angle between AC and AD
        let angleDAC = Math.acos((AC * AC + AD * AD - DC * DC) / (2 * AC * AD));
        // if the angle between AC and AD is obtuse, then the angle between AC and AD is 180 - angleDAC
        // if the angle between AC and AD is acute, then the angle between AC and AD is angleDAC
        if (Math.sin(toRadians(ADC)) < 0) {
            angleDAC = - angleDAC;
        }
        // rotate AC by angleDAC to get AD        
        let xAD = (C.x - A.x) * Math.cos(-angleDAC) - (C.y - A.y) * Math.sin(-angleDAC);
        let yAD = (C.x - A.x) * Math.sin(-angleDAC) + (C.y - A.y) * Math.cos(-angleDAC);
        let AdDirectionVectorLength = Math.sqrt(xAD * xAD + yAD * yAD);
        let xD = A.x + xAD / AdDirectionVectorLength * AD;
        let yD = A.y + yAD / AdDirectionVectorLength * AD;
        let D = new Vector2(xD, yD);
        this.vertices[3] = D;

    }

    calculateThirdVertex(): void {
        // we know |AD|, |DC|, and <ADC
        // calculate length of AC: |AC| = sqrt(|AD|^2 + |DC|^2 - 2 * |AD| * |DC| * cos(<ADC))        
        let AD = this.data.edgeLengths[3];
        let DC = this.data.edgeLengths[2];
        let ADC = this.data.angleBetweenFirstAndLastEdge;
        let AC = Math.sqrt(AD * AD + DC * DC - 2 * AD * DC * Math.cos(toRadians(ADC)));
        let BC = this.data.edgeLengths[1];
        let B = this.vertices[1];
        let A = this.vertices[0];

        if (A === null || B === null) {
            throw new Error("First or second vertex does not exist");
        }
        // Find C by interecting BC and AC
        let [intersection1, intersection2] = this.findCirclesIntersection(A, AC, B, BC);
        // take the intersection with larger yvalue
        let C = intersection1;
        this.vertices[2] = C;



    }

    findCirclesIntersection(
        circle1Center: Vector2,
        circle1Radius: number,
        circle2Center: Vector2,
        circle2Radius: number
    ): Vector2[] {
        // https://stackoverflow.com/questions/3349125/circle-circle-intersection-points
        // Find the distance between the centers.
        const dx = circle1Center.x - circle2Center.x;
        const dy = circle1Center.y - circle2Center.y;

        // Find the distance between the centers.
        const d = Math.sqrt(dy * dy + dx * dx);

        // Find a and h.
        const a =
            (circle1Radius * circle1Radius - circle2Radius * circle2Radius + d * d) /
            (2 * d);
        const h = Math.sqrt(circle1Radius * circle1Radius - a * a);

        // Find P2.
        const x2 = circle1Center.x + (a * (circle2Center.x - circle1Center.x)) / d;
        const y2 = circle1Center.y + (a * (circle2Center.y - circle1Center.y)) / d;

        // Get the points P3.
        const x3 = x2 + (h * (circle2Center.y - circle1Center.y)) / d;
        const y3 = y2 - (h * (circle2Center.x - circle1Center.x)) / d;
        const x4 = x2 - (h * (circle2Center.y - circle1Center.y)) / d;
        const y4 = y2 + (h * (circle2Center.x - circle1Center.x)) / d;

        return [new Vector2(x3, y3), new Vector2(x4, y4)];
    }

    constructPolygon(): Polygon {
        this.calculateSecondVertex();
        this.calculateThirdVertex();
        this.calculateForthVertex();
        if (this.vertices[0] === null || this.vertices[1] === null || this.vertices[2] === null || this.vertices[3] === null) {
            throw new Error("One or more vertices are missing");
        }
        return new Polygon([this.vertices[0], this.vertices[1], this.vertices[2], this.vertices[3]]);
    }

}

export class CircleNotIntersectException extends Error {
    constructor() {
        super("Circles do not intersect");
    }
}

export class PolygonConstructionData {
    edgeLengths: number[] = [0, 0, 0, 0];
    edge0Angle: number = 0;
    angleBetweenFirstAndLastEdge: number = 0;
    firstVertex: Vector2 = new Vector2(0, 0);



    static fromJSON(data: any): PolygonConstructionData {
        const polygonData = new PolygonConstructionData();
        polygonData.edgeLengths = data.edgeLengths;
        polygonData.edge0Angle = data.edge0Angle;
        polygonData.angleBetweenFirstAndLastEdge = data.angleBetweenFirstAndLastEdge;
        polygonData.firstVertex = Vector2.fromJson(data.firstVertex);
        return polygonData;
    }

    withAngleBetweenFirstAndLastEdgeInDegree(angle: number): PolygonConstructionData {
        let data = this.copy();
        data.angleBetweenFirstAndLastEdge = angle;
        return data;
    }

    copy(): PolygonConstructionData {
        const data = new PolygonConstructionData();
        data.edgeLengths = this.edgeLengths;
        data.edge0Angle = this.edge0Angle;
        data.angleBetweenFirstAndLastEdge = this.angleBetweenFirstAndLastEdge;
        data.firstVertex = this.firstVertex;
        return data;
    }
}

function toRadians(angle: number): number {
    return angle * Math.PI / 180;
}