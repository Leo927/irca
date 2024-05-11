import { useRef } from "react";
import { useEffect, useState } from "react";
import { HistoricalPolygonData } from "@/context/polygondatas";
import { IconButton } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
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

  const handleZoomIn = () => {
    if (ctx !== null) {
      ctx.setZoom(ctx.getZoom() * 1.1);
    }
  };

  const handleZoomOut = () => {
    if (ctx !== null) {
      ctx.setZoom(ctx.getZoom() / 1.1);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <canvas className="self-center h-full" id="myCanvas" width="100%" height={400} ref={canvasRef}></canvas>
      <div style={{ position: "absolute", top: 0, right: 0 }}>
        <IconButton onClick={handleZoomIn}>
          <AddIcon />
        </IconButton>
        <IconButton onClick={handleZoomOut}>
          <RemoveIcon />
        </IconButton>
      </div>
    </div>
  );
}
