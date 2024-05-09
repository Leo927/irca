

import { useRef } from "react";
import { useEffect, useState } from "react";
import { Polygon } from "@/app/logics/polygon";
import { Vector2 } from '@/app/logics/vector2';
import { Line } from "@/app/logics/line";
import { RotationalCentersAnalyzer } from "@/app/logics/rotation-center-arc";
import { RotationCenterFinder } from "@/app/logics/rotation-center-finder";
import { PolygonConstructionData, PolygonConstructor } from "@/app/logics/polygon-constructor";
import { HistoricalPolygonData } from "@/context/polygondatas";
import { fabric } from 'fabric';
export default function Canvas(props: { polygonDatas: HistoricalPolygonData[] }) {

  const canvasRef = useRef<HTMLCanvasElement>(null);



  function drawPolygon(data: HistoricalPolygonData){
    const polygon = new PolygonConstructor(data).constructPolygon();
    function drawVertices(ctx: CanvasRenderingContext2D) {
      polygon.vertices.forEach((vertex) => {
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

    if (polygon.vertices.length < 4) {
      console.error("Polygon must have 4 vertices");
      return;
    }
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d') as CanvasRenderingContext2D;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    polygon.lines.forEach((line, index) => {
      // draw the line
      drawLine(ctx, line);
      // draw the index of the line
      drawLineLabel(ctx, line);
    });
    drawVertices(ctx);

    // draw the rotational centers
    if (polygon.vertices.length === 4) {
      let centers = new RotationalCentersAnalyzer(data).findRotationalCenters();
      centers.forEach((center, index) => {
        ctx.beginPath();
        ctx.arc(center.x, center.y, 1, 0, 2 * Math.PI);
        ctx.fillStyle = "red"
        ctx.fill();
      });
    }

    // draw the current rotational center
    if (polygon.vertices.length === 4) {
      const rotationalCenter = new RotationCenterFinder(polygon).getRotationalCenter();
      ctx.beginPath();
      ctx.arc(rotationalCenter.x, rotationalCenter.y, 5, 0, 2 * Math.PI);
      ctx.fillStyle = "blue"
      ctx.fill();
    }
  }
  // update the canvas when the polygon changes
  useEffect(() => {
    const ctx = new fabric.Canvas('myCanvas', {
      height: 800,
      width: 800,
      backgroundColor: 'white'
    });
    props.polygonDatas.forEach(drawPolygon);
  }, [props.polygonDatas]);
  return (
    <canvas className="w-full self-center h-full" id="myCanvas" width={800} height={800} ref={canvasRef} ></canvas>);


}


