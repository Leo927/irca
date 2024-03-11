'use client';

import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Vector2 } from '@/app/logics/vector2';
import { PolygonConstructionData, PolygonConstructor } from '@/app/logics/polygon-constructor';
import { Polygon } from "./logics/polygon";
import { Modal, TextField } from "@mui/material";
import { RotationalCentersAnalyzer } from "./logics/rotation-center-arc";
import { RotationCenterFinder } from "./logics/rotation-center-finder";
import { HandsOffDistance } from "./logics/similarity-calculator";
import Settings from "./settings/page";
import Box from '@mui/material/Box';
import PolygonInfoPanel from "./components/PolygonInfo";
import { Line } from "./logics/line";


export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [polygon, setPolygon] = useState<Polygon>(new Polygon([]));
  const [polygonData, setPolygonData] = useState<PolygonConstructionData>(
    new PolygonConstructionData()
      .withFirstVertex(new Vector2(300, 500))
      .withEdgeLengths([60, 100, 120, 100])
      .withAngleBetweenFirstAndLastEdgeInDegree(90)
      .withEdge0AngleDegree(0));
  const [comparisonRotationalCenters, setComparisonRotationalCenters] = useState<Vector2[]>([]);
  const [settingOpen, setSettingOpen] = useState<boolean>(false);

  useEffect(() => {
    const polygonConstructor = new PolygonConstructor(polygonData);
    setPolygon((c) => polygonConstructor.constructPolygon());
  }, [polygonData]);

  // update the canvas when the polygon changes
  useEffect(() => {
    if (polygon.vertices.length < 4) {
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
      let centers = new RotationalCentersAnalyzer(polygonData).findRotationalCenters();
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

  }, [polygon, comparisonRotationalCenters]);
  return (
    <main className="w-full bg-green-300 items-center mx-auto columns-1 p-6">
      <div className="items-end py-2" >
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => setSettingOpen(true)}>
          设置
        </button>
      </div>
      <div className="columns-2">
        <canvas className="w-full self-center h-full" id="myCanvas" width={800} height={800} ref={canvasRef} ></canvas>
        <PolygonInfoPanel data={polygonData} setData={setPolygonData} />

        <div>
          <TextField
            label="对比转动中心"
            value={JSON.stringify(comparisonRotationalCenters)}
            onChange={(e) => setComparisonRotationalCenters(JSON.parse(e.target.value))}
            multiline
            rows={4} />

        </div>
        <TextField
          label="Chamfer Distance"
          value={new HandsOffDistance(polygon.vertices, comparisonRotationalCenters).getSimilarity()}
          InputProps={{
            readOnly: true,
          }}
          hidden={comparisonRotationalCenters.length == 0}
        />
      </div>


      <Modal
        open={settingOpen}
        onClose={() => setSettingOpen(false)}
        aria-labelledby="设置"
        aria-describedby="设置"
      >
        <Box>
          <Settings />
        </Box>
      </Modal>

    </main >
  );

  function drawVertices(ctx: CanvasRenderingContext2D) {
    polygon.vertices.forEach((vertex, index) => {
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
}


