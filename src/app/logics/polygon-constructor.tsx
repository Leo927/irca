import { Polygon } from "./polygon";
import { Vector2 } from "./vector2";

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

        let secondVertex = new Vector2(firstVertex.x + this.data.edgeLengths[0] * Math.cos(this.data.edge0Angle),
            firstVertex.y + this.data.edgeLengths[0] * Math.sin(this.data.edge0Angle));
        this.vertices[1] = secondVertex;
    }

    calculateForthVertex(): void {
        if (this.vertices[0] === null) {
            throw new Error("First vertex does not exist");
        }

        let firstVertex = this.vertices[0];
        let thirdVertex = new Vector2(firstVertex.x + this.data.edgeLengths[3] * Math.cos(this.data.angleBetweenFirstAndLastEdge),
            firstVertex.y + this.data.edgeLengths[3] * Math.sin(this.data.angleBetweenFirstAndLastEdge));
        this.vertices[3] = thirdVertex;
    }

    calculateThirdVertex(): void {
        if (this.vertices[1] === null) {
            throw new CircleNotIntersectException();
        }

        if (this.vertices[3] === null) {
            throw new CircleNotIntersectException();
        }
        // given position of the second vertex and the length of the second edge. Also given the position of the forth vertex and the length of the third edge
        // We can calculate the position of the third vertex by finding the intersection of two circles
        let secondVertex = this.vertices[1];
        let forthVertex = this.vertices[3];
        let [intersection1, intersection2] = this.findCirclesIntersection(secondVertex, this.data.edgeLengths[1], forthVertex, this.data.edgeLengths[2]);
        let thirdVertex = intersection1.y < intersection2.y ? intersection1 : intersection2;
        this.vertices[2] = thirdVertex;
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
        this.calculateForthVertex();
        this.calculateThirdVertex();
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



    static fromJSON(data: any) : PolygonConstructionData{
        const polygonData = new PolygonConstructionData();
        polygonData.edgeLengths = data.edgeLengths;
        polygonData.edge0Angle = data.edge0Angle;
        polygonData.angleBetweenFirstAndLastEdge = data.angleBetweenFirstAndLastEdge;
        polygonData.firstVertex = Vector2.fromJson(data.firstVertex);
        return polygonData;
    }
}