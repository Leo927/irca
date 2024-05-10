

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
import PolygonDrawer from "@/app/logics/polygondrawer";

export default function Canvas(props: { polygonDatas: HistoricalPolygonData[]; }) {

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<fabric.Canvas | null>(null);


  // update the canvas when the polygon changes
  useEffect(() => {
    const ctx = new fabric.Canvas(canvasRef.current, {
      height: 800,
      width: 800,
    });
    fabric.Object.prototype.transparentCorners = true;
    ctx.relativePan(new fabric.Point(200, 200));
    setCtx(ctx);
    return () => {
      ctx.dispose();
    };
  }, []);

  // draw the polygons
  useEffect(() => {
    if (ctx === null) return;
    ctx.clear();
    props.polygonDatas.forEach((polygonData) => {
      const drawer = new PolygonDrawer(ctx, polygonData);
      drawer.drawPolygon();
    });
  }, [ctx, props.polygonDatas]);

  return (
    <canvas className="w-full self-center h-full" id="myCanvas" width={800} height={800} ref={canvasRef} ></canvas>);


}
