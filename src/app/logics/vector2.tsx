export class Vector2 {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    copy(): Vector2 {
        return new Vector2(this.x, this.y);
    }

    add(other: Vector2): Vector2 {
        return new Vector2(this.x + other.x, this.y + other.y);
    }

    subtract(other: Vector2): Vector2 {
        return new Vector2(this.x - other.x, this.y - other.y);
    }

    multiply(scalar: number): Vector2 {
        return new Vector2(this.x * scalar, this.y * scalar);
    }

    divide(scalar: number): Vector2 {
        return new Vector2(this.x / scalar, this.y / scalar);
    }

    magnitude(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize(): Vector2 {
        const magnitude = this.magnitude();
        return new Vector2(this.x / magnitude, this.y / magnitude);
    }
    toString(): string {
        return `(${this.x}, ${this.y})`;
    }
    loadFromJson(json: any): Vector2 {
        return new Vector2(json.x, json.y);
    }
    toJson(): any {
        return { x: this.x, y: this.y };
    }
}

