

import { useRef } from "react";
import { useEffect, useState } from "react";
import { HistoricalPolygonData } from "@/context/polygondatas";
import * as fabric from 'fabric';

import PolygonDrawer from "@/app/logics/polygondrawer";

export default function Canvas(props: { polygonDatas: HistoricalPolygonData[]; }) {

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<fabric.Canvas | null>(null);


  // update the canvas when the polygon changes
  useEffect(() => {
    const ctx = new fabric.Canvas("myCanvas", {
      height: 400,
      width: 800,
      objectCaching: false,
    });
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
    <canvas className="self-center h-full" id="myCanvas" width="100%" height={400} ref={canvasRef} ></canvas>);


}
