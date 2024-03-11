import { Vector2 } from '@/app/logics/vector2';
import { Line } from '@/app/logics/line';

export class Polygon {
    vertices: Vector2[];

    constructor(vertices: Vector2[]) {
        this.vertices = vertices;
    }

    // Add other methods and properties as needed

    get area(): number {
        // Calculate the area of the polygon
        // You can use any algorithm you prefer, such as Shoelace formula
        // Here's a simple implementation using the Shoelace formula:
        let area = 0;
        const n = this.vertices.length;

        for (let i = 0; i < n; i++) {
            const current = this.vertices[i];
            const next = this.vertices[(i + 1) % n];
            area += current.x * next.y - next.x * current.y;
        }

        return Math.abs(area / 2);
    }

    get lines(): Line[] {
        // Calculate the lines of the polygon
        const n = this.vertices.length;
        const lines = [];

        for (let i = 0; i < n; i++) {
            const start = this.vertices[i];
            const end = this.vertices[(i + 1) % n];
            lines.push(new Line(start, end));
        }

        return lines;
    }

    get edges(): Line[] { return this.lines };
}

// Usage example
const vertices = [
    new Vector2(0, 0),
    new Vector2(0, 5),
    new Vector2(5, 5),
    new Vector2(5, 0),
];
const polygon = new Polygon(vertices);
console.log(polygon.area); // Output: 25