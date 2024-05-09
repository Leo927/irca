import { fabric } from 'fabric';
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
    constructor(canvas: fabric.Canvas, constructionData: HistoricalPolygonData) {
        this.canvas = canvas;
        this.constructionData = constructionData;
        this.polygon = new PolygonConstructor(constructionData).constructPolygon();
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

        this.drawPolygonShape();

        // // draw the rotational centers
        // this.drawRotationalCenters();

        // // draw the current rotational center
        // this.drawCurrentRotationalCenter();

    }

    private drawPolygonShape(){
        var poly = new fabric.Polyline([
            { x: 10, y: 10 },
            { x: 50, y: 30 },
            { x: 40, y: 70 },
            { x: 60, y: 50 },
            { x: 100, y: 150 },
            { x: 40, y: 100 }
          ], {
          stroke: 'red',
          left: 100,
          top: 100
        });
        this.canvas.add(poly);
    }

    private drawCurrentRotationalCenter() {
        if (this.polygon.vertices.length === 4) {
            const rotationalCenter = new RotationCenterFinder(this.polygon).getRotationalCenter();
            this.canvas.beginPath();
            this.canvas.arc(rotationalCenter.x, rotationalCenter.y, 5, 0, 2 * Math.PI);
            this.canvas.fillStyle = "blue";
            this.canvas.fill();
        }
    }

    private drawRotationalCenters() {
        if (this.polygon.vertices.length === 4) {
            let centers = new RotationalCentersAnalyzer(this.constructionData).findRotationalCenters();
            centers.forEach((center, index) => {
                this.canvas.beginPath();
                this.canvas.arc(center.x, center.y, 1, 0, 2 * Math.PI);
                this.canvas.fillStyle = "red";
                this.canvas.fill();
            });
        }
    }

    drawLine(line: Line) {
        this.canvas.beginPath();
        this.canvas.lineWidth = 2;
        this.canvas.moveTo(line.start.x, line.start.y);
        this.canvas.lineTo(line.end.x, line.end.y);
        this.canvas.strokeStyle = 'black';
        this.canvas.stroke();
    }

    drawLineLabel(line: Line) {
        this.canvas.beginPath();
        const middleX = (line.start.x + line.end.x) / 2;
        const middleY = (line.start.y + line.end.y) / 2;
        const dx = line.end.x - line.start.x;
        const dy = line.end.y - line.start.y;
        const offsetX = -dy;
        const offsetY = dx;
        const offsetMagnitude = 10; // adjust the offset magnitude as needed
        const normalizedOffsetX = offsetX / Math.sqrt(offsetX * offsetX + offsetY * offsetY);
        const normalizedOffsetY = offsetY / Math.sqrt(offsetX * offsetX + offsetY * offsetY);
        const offsetPointX = middleX + normalizedOffsetX * offsetMagnitude;
        const offsetPointY = middleY + normalizedOffsetY * offsetMagnitude;
        this.canvas.font = '15px Arial';
        this.canvas.fillStyle = 'black';
        this.canvas.textAlign = 'center';
        this.canvas.textBaseline = 'middle';
        this.canvas.fillText(`${line.getLength()}`, offsetPointX, offsetPointY);
    }

}