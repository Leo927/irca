import { Vector2 } from "./vector2";
import { Line } from "./line";

export class SimilarityCalculator {
    protected pointCloud1: Vector2[];
    protected pointCloud2: Vector2[];
    constructor(pointCloud1: Vector2[], pointCloud2: Vector2[]) {
        this.pointCloud1 = pointCloud1;
        this.pointCloud2 = pointCloud2;
    }
    public getSimilarity(): number {
        throw new Error("Not implemented");
    }
}

export class HandsOffDistance extends SimilarityCalculator {
    getSimilarity(): number {
        this.pointCloud1;
        this.pointCloud2;
        let sumDistance = 0;
        this.pointCloud1.forEach((point, index) => {
            //find the closest point in point in pointCloud2
            let minDistance = Infinity;
            this.pointCloud2.forEach((point2) => {
                const distance = new Line(point, point2).getLength();
                if (distance < minDistance) {
                    minDistance = distance;
                }
            });
            sumDistance += minDistance;
        })
        return sumDistance;
    }
}