

import { useRef } from "react";
import { useEffect } from "react";
import { Polygon } from "@/app/logics/polygon";
import { Vector2 } from '@/app/logics/vector2';
import { Line } from "@/app/logics/line";
import { RotationalCentersAnalyzer } from "@/app/logics/rotation-center-arc";
import { RotationCenterFinder } from "@/app/logics/rotation-center-finder";
import { PolygonConstructionData } from "@/app/logics/polygon-constructor";
export default function Canvas(props: { polygon: Polygon, polygonData: PolygonConstructionData }) {

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // update the canvas when the polygon changes
  useEffect(() => {

    function drawVertices(ctx: CanvasRenderingContext2D) {
      props.polygon.vertices.forEach((vertex, index) => {
        ctx.beginPath();
        ctx.arc(vertex.x, vertex.y, 7, 0, 2 * Math.PI);
        ctx.fillStyle = "black";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(vertex.x, vertex.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = "grey";
        ctx.fill();
      });
    }


    function drawLine(ctx: CanvasRenderingContext2D, line: Line) {
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.moveTo(line.start.x, line.start.y);
      ctx.lineTo(line.end.x, line.end.y);
      ctx.strokeStyle = 'black';
      ctx.stroke();
    }

    function drawLineLabel(ctx: CanvasRenderingContext2D, line: Line) {
      ctx.beginPath();
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
      ctx.font = '15px Arial';
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${line.getLength()}`, offsetPointX, offsetPointY);
    }

    if (props.polygon.vertices.length < 4) {
      return;
    }
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d') as CanvasRenderingContext2D;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    props.polygon.lines.forEach((line, index) => {
      // draw the line
      drawLine(ctx, line);
      // draw the index of the line
      drawLineLabel(ctx, line);
    });
    drawVertices(ctx);

    // draw the rotational centers
    if (props.polygon.vertices.length === 4) {
      let centers = new RotationalCentersAnalyzer(props.polygonData).findRotationalCenters();
      centers.forEach((center, index) => {
        ctx.beginPath();
        ctx.arc(center.x, center.y, 1, 0, 2 * Math.PI);
        ctx.fillStyle = "red"
        ctx.fill();
      });
    }

    // draw the current rotational center
    if (props.polygon.vertices.length === 4) {
      const rotationalCenter = new RotationCenterFinder(props.polygon).getRotationalCenter();
      ctx.beginPath();
      ctx.arc(rotationalCenter.x, rotationalCenter.y, 5, 0, 2 * Math.PI);
      ctx.fillStyle = "blue"
      ctx.fill();
    }


  }, [props.polygon, props.polygonData]);
  return (
    <canvas className="w-full self-center h-full" id="myCanvas" width={800} height={800} ref={canvasRef} ></canvas>);


}


