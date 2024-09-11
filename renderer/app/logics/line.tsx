import { Vector2 } from "./vector2";
const MAX_SAFE_INTEGER = 100000;
export class Line {
    private startVector2: Vector2;
    private endVector2: Vector2;

    constructor(startVector2: Vector2, endVector2: Vector2) {
        this.startVector2 = startVector2;
        this.endVector2 = endVector2;
    }

    getStartVector2(): Vector2 {
        return this.startVector2;
    }

    setStartVector2(startVector2: Vector2): void {
        this.startVector2 = startVector2;
    }

    getEndVector2(): Vector2 {
        return this.endVector2;
    }

    setEndVector2(endVector2: Vector2): void {
        this.endVector2 = endVector2;
    }

    getLength(): number {
        const dx = this.endVector2.x - this.startVector2.x;
        const dy = this.endVector2.y - this.startVector2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    get start(): Vector2 {
        return this.startVector2;
    }

    get end(): Vector2 {
        return this.endVector2;
    }

    toString(): string {
        return `[${this.startVector2}, ${this.endVector2}]`;
    }

    static line_intersect(line1: Line, line2: Line): Vector2 {
        let x1 = line1.startVector2.x;
        let y1 = line1.startVector2.y;
        let x2 = line1.endVector2.x;
        let y2 = line1.endVector2.y;
        let x3 = line2.startVector2.x;
        let y3 = line2.startVector2.y;
        let x4 = line2.endVector2.x;
        let y4 = line2.endVector2.y;



        // Check if none of the lines are of length 0
        if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
            throw new EdgesParallelOrCoincidentError();
        }

        const denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);

        // Lines are parallel
        if (denominator === 0) {
            throw new EdgesParallelOrCoincidentError();
        }

        let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
        let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;

        // Return a object with the x and y coordinates of the intersection
        let x = x1 + ua * (x2 - x1);
        let y = y1 + ua * (y2 - y1);
        if (Number.isNaN(x) || Number.isNaN(y)) {
            throw new EdgesParallelOrCoincidentError();

        }

        if (Math.abs(x) > MAX_SAFE_INTEGER || Math.abs(y) > MAX_SAFE_INTEGER) {
            throw new EdgesParallelOrCoincidentError();
        }

        return new Vector2(x, y);
    }
}


export class EdgesParallelOrCoincidentError extends Error {
    constructor() {
        super("Edges are parallel or coincident");
    }
}