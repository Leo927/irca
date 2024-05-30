import * as fabric from 'fabric';
import { HistoricalPolygonData } from '@/context/polygondatas';
import { Line } from '@/app/logics/line';
import { PolygonConstructor } from '@/app/logics/polygon-constructor';
import { RotationalCentersAnalyzer } from '@/app/logics/rotation-center-arc';
import { RotationCenterFinder } from '@/app/logics/rotation-center-finder';
import { Polygon } from '@/app/logics/polygon';
export default class PolygonDrawer {
    canvas: fabric.Canvas;
    constructionData: HistoricalPolygonData;
    polygon: Polygon;
    group: fabric.Group;
    constructor(canvas: fabric.Canvas, constructionData: HistoricalPolygonData) {
        if (constructionData instanceof HistoricalPolygonData === false) {
            throw new Error("Invalid construction data");
        }
        this.canvas = canvas;
        this.constructionData = constructionData;
        this.polygon = new PolygonConstructor(constructionData).constructPolygon();
        this.group = new fabric.Group();
    }

    drawPolygon() {

        if (this.polygon.vertices.length < 4) {
            console.error("Polygon must have 4 vertices");
            return;
        }

        // this.polygon.lines.forEach((line, index) => {
        //     // draw the line
        //     this.drawLine(line);
        //     // draw the index of the line
        //     this.drawLineLabel(line);
        // });
        this.group = new fabric.Group([], {
            hasControls: false,
            hoverCursor: "pointer",
            selectable: false,
            objectCaching: false,
        });
        this.drawPolygonShape();
        this.drawRotationalCenters();
        this.drawCurrentRotationalCenter();
        this.canvas.add(this.group);

    }

    private drawPolygonShape() {
        var poly = new fabric.Polyline([...this.polygon.vertices, this.polygon.vertices[0]], {
            stroke: this.constructionData.color,
            fill: '',
            strokeWidth: 2,
            selectable: true,
            hasControls: false,
            hasBorders: true,
            hoverCursor: "pointer",
            objectCaching: false,
        });
        this.group.add(poly);
    }

    private drawCurrentRotationalCenter() {
        if (this.polygon.vertices.length === 4) {
            try {
                const rotationalCenter = new RotationCenterFinder(this.polygon).getRotationalCenter();
                let circle = new fabric.Circle({
                    stroke: this.constructionData.color,
                    radius: 5,
                    fill: '',
                    left: rotationalCenter.x,
                    top: rotationalCenter.y,
                    hasControls: false,
                    hoverCursor: "pointer",
                    objectCaching: false,
                });
                this.group.add(circle);
            } catch (e) {
                console.error("Error", e);
            }
        }
    }

    private drawRotationalCenters() {
        if (this.polygon.vertices.length === 4) {
            let centers = new RotationalCentersAnalyzer(this.constructionData).setStartAngle(this.constructionData.startAngle).setEndAngle(this.constructionData.endAngle).findRotationalCenters();
            let line = new fabric.Polyline(centers, {
                transparentCorners: true,
                stroke: this.constructionData.color,
                fill: '',
                selectable: true,
                hasControls: false,
                hasBorders: true,
                hoverCursor: "pointer",
                objectCaching: false,
            });
            this.group.add(line);
        }
    }
}