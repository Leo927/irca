import { Vector2 } from "./vector2";
import { Line } from "./line";
import { PolygonConstructionData } from "./polygon-constructor";
import { RotationalCentersAnalyzer } from "./rotation-center-arc";

export class PolygonComparator {
    private polygon1: PolygonConstructionData;
    private polygon2: PolygonConstructionData;
    constructor(polygon1: PolygonConstructionData, polygon2: PolygonConstructionData) {
        this.polygon1 = polygon1;
        this.polygon2 = polygon2;
    }
    public getHandsOffDistance(): number {
        const pointCloud1 = new RotationalCentersAnalyzer(this.polygon1).findRotationalCenters();
        const pointCloud2 = new RotationalCentersAnalyzer(this.polygon2).findRotationalCenters();
        const similarityCalculator = new HandsOffDistance(pointCloud1, pointCloud2);
        return similarityCalculator.getSimilarity();
    }

}

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
        });
        return sumDistance;
    }
}