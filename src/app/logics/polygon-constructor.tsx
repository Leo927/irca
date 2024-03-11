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

    length1: number = 0;
    length2: number = 0;
    length3: number = 0;
    length4: number = 0;
    edge0Angle: number = 0;
    vertices: (Vector2 | null)[] = [null, null, null, null];
    angleBetweenFirstAndLastEdge: number = 0;

    constructor() { }

    withEdges(lengths: number[]): PolygonConstructor {
        if (lengths.length !== 4) {
            throw new Error("Lengths must have 4 elements");
        }
        this.length1 = lengths[0];
        this.length2 = lengths[1];
        this.length3 = lengths[2];
        this.length4 = lengths[3];
        return this;
    }

    withLength1(length1: number): PolygonConstructor {
        this.length1 = length1;
        return this;
    }

    withLength2(length2: number): PolygonConstructor {
        this.length2 = length2;
        return this;
    }

    withLength3(length3: number): PolygonConstructor {
        this.length3 = length3;
        return this;
    }

    withLength4(length4: number): PolygonConstructor {
        this.length4 = length4;
        return this;
    }

    withFirstVertex(firstVertex: Vector2): PolygonConstructor {
        if (firstVertex === undefined || firstVertex === null) {
            throw new Error("First vertex is undefined or null");
        }
        this.vertices[0] = firstVertex;
        return this;
    }

    withAngleBetweenFirstAndLastEdge(angleBetweenFirstAndLastEdge: number): PolygonConstructor {
        this.angleBetweenFirstAndLastEdge = angleBetweenFirstAndLastEdge;
        return this;
    }

    withAngleBetweenFirstAndLastEdgeInDegree(angleBetweenFirstAndLastEdge: number): PolygonConstructor {
        this.angleBetweenFirstAndLastEdge = angleBetweenFirstAndLastEdge * Math.PI / 180;
        return this;
    }

    withEdge0AngleDegree(edge0Angle: number): PolygonConstructor {
        if (edge0Angle < 0 || edge0Angle > 360) {
            throw new Error("Edge 0 angle must be between 0 and 360");
        }
        this.edge0Angle = edge0Angle * Math.PI / 180;
        return this;
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

        let secondVertex = new Vector2(firstVertex.x + this.length1 * Math.cos(this.edge0Angle),
            firstVertex.y - this.length1 * Math.sin(this.edge0Angle));
        this.vertices[1] = secondVertex;
    }

    calculateForthVertex(): void {
        if (this.vertices[0] === null) {
            throw new Error("First vertex does not exist");
        }

        let firstVertex = this.vertices[0];
        let thirdVertex = new Vector2(firstVertex.x + this.length4 * Math.cos(this.angleBetweenFirstAndLastEdge),
            firstVertex.y - this.length4 * Math.sin(this.angleBetweenFirstAndLastEdge));
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
        let [intersection1, intersection2] = this.findCirclesIntersection(secondVertex, this.length2, forthVertex, this.length3);
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