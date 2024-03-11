'use client';

import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Vector2 } from '@/app/logics/vector2';
import { PolygonConstructor } from '@/app/logics/polygon-constructor';
import { Polygon } from "./logics/polygon";
import { TextField } from "@mui/material";
import { RotationalCentersAnalyzer } from "./logics/rotation-center-arc";
import { RotationCenterFinder } from "./logics/rotation-center-finder";
import { HandsOffDistance } from "./logics/similarity-calculator";

const CANVAS_MARGIN = 50;

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [polygon, setPolygon] = useState<Polygon>(new Polygon([]));
  const [edges, setEdges] = useState<number[]>([80, 100, 60, 120]);
  const [firstDegree, setFirstDegree] = useState<number>(90);
  const [secondVertexDegree, setSecondVertexDegree] = useState<number>(20);
  const [rotationalCenterJson, setRotationalCenterJson] = useState<string>("");
  const [comparisonRotationalCenters, setComparisonRotationalCenters] = useState<Vector2[]>([]);

  useEffect(() => {
    const polygonConstructor = new PolygonConstructor()
      .withEdges(edges)
      .withFirstVertex(new Vector2(300, 500))
      .withAngleBetweenFirstAndLastEdgeInDegree(firstDegree)
      .withEdge0AngleDegree(secondVertexDegree);
    setPolygon((c) => polygonConstructor.constructPolygon());
  }, [edges, firstDegree, secondVertexDegree]);

  // update the canvas when the polygon changes
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d') as CanvasRenderingContext2D;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    polygon.lines.forEach((line, index) => {
      // draw the line
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.moveTo(line.start.x, line.start.y);
      ctx.lineTo(line.end.x, line.end.y);
      ctx.strokeStyle = 'black';
      ctx.stroke();
      // draw the index of the line
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
    });
    polygon.vertices.forEach((vertex, index) => {
      ctx.beginPath();
      ctx.arc(vertex.x, vertex.y, 7, 0, 2 * Math.PI);
      ctx.fillStyle = "black"
      ctx.fill();
      ctx.beginPath();
      ctx.arc(vertex.x, vertex.y, 5, 0, 2 * Math.PI);
      ctx.fillStyle = "grey"
      ctx.fill();
    });

    // draw the rotational centers
    if (polygon.vertices.length === 4) {
      let centers = new RotationalCentersAnalyzer(polygon).findRotationalCenters();
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

    // draw the comparison rotational centers
    comparisonRotationalCenters.forEach((center, index) => {
      ctx.beginPath();
      ctx.arc(center.x, center.y, 1, 0, 2 * Math.PI);
      ctx.fillStyle = "green"
      ctx.fill();
    });

    // set the json of the rotational centers
    if (polygon.vertices.length === 4) {
      let centers = new RotationalCentersAnalyzer(polygon).findRotationalCenters();
      setRotationalCenterJson(JSON.stringify(centers));
    }
  }, [polygon, comparisonRotationalCenters]);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <canvas id="myCanvas" width={800} height={800} ref={canvasRef} style={{ margin: '5px' }}></canvas>

      {edges.map((edge, index) => (
        <TextField
          type="number"
          key={index}
          label={`边 ${index}`}
          value={edge}
          onChange={(e) => {
            setEdges(newEdges => newEdges.map((value, i) => i === index ? parseInt(e.target.value) : value));
          }}
        />
      ))}
      <TextField
        type="number"
        label="角度 ∠0,3"
        value={firstDegree}
        onChange={(e) => setFirstDegree(parseInt(e.target.value))} />

      <TextField
        type="number"
        label="边1角度"
        value={secondVertexDegree}
        onChange={(e) => setSecondVertexDegree(parseInt(e.target.value))} />

      <TextField
        label="Rotational Center"
        value={rotationalCenterJson}
        multiline
        rows={4}
        InputProps={{
          readOnly: true,
        }} />
      <TextField
        label="Comparison Rotational Centers"
        value={JSON.stringify(comparisonRotationalCenters)}
        onChange={(e) => setComparisonRotationalCenters(JSON.parse(e.target.value))}
        multiline
        rows={4} />

      <TextField
        label="Chamfer Distance"
        value={new HandsOffDistance(polygon.vertices, comparisonRotationalCenters).getSimilarity()}
        InputProps={{
          readOnly: true,
        }}
        hidden={comparisonRotationalCenters.length == 0}
      />


    </main>
  );
}
