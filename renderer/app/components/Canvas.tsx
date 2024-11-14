import { useRef } from "react";
import { useEffect, useState } from "react";
import { HistoricalPolygonData } from "../../context/polygondatas";
import { IconButton, Tooltip } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import * as fabric from 'fabric';
import CenterFocusStrongOutlinedIcon from '@mui/icons-material/CenterFocusStrongOutlined';

import PolygonDrawer from "../../app/logics/polygondrawer";
import { CenterFocusStrong, CenterFocusStrongOutlined } from "@mui/icons-material";

export default function Canvas(props: { className?: string, polygonDatas: HistoricalPolygonData[]; }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);

  // update the canvas when the polygon changes
  useEffect(() => {
    let dragging = false;
    let LastPoint = new fabric.Point(0, 0);

    const ctx = new fabric.Canvas("myCanvas", {
      height: 600,
      width: 800,
      objectCaching: false,
    });
    ctx.relativePan(new fabric.Point(400, 300));
    setCanvas(ctx);

    ctx.on('mouse:wheel', function (opt) {
      var delta = opt.e.deltaY;
      var zoom = ctx.getZoom();
      zoom *= 0.999 ** delta;
      if (zoom > 20) zoom = 20;
      if (zoom < 0.01) zoom = 0.01;
      ctx.zoomToPoint(new fabric.Point(opt.e.offsetX, opt.e.offsetY), zoom);
      opt.e.preventDefault();
      opt.e.stopPropagation();
    });

    ctx.on('mouse:down', function (opt) {
      console.debug('mouse down');
      ctx.selection = false;
      dragging = true;
      LastPoint = opt.viewportPoint;
    });

    ctx.on('mouse:up', function () {
      console.debug('mouse up');
      ctx.selection = true;
      dragging = false;
    });

    ctx.on('mouse:move', function (opt) {
      if (dragging) {
        console.debug('mouse move');
        var delta = new fabric.Point(opt.viewportPoint.x - LastPoint.x, opt.viewportPoint.y - LastPoint.y);
        ctx.relativePan(delta);
        LastPoint = opt.viewportPoint;
      }
    });

    return () => {
      ctx.dispose();
    };
  }, []);

  // draw the polygons
  useEffect(() => {
    if (canvas === null) return;
    canvas.clear();
    props.polygonDatas.forEach((polygonData) => {
      const drawer = new PolygonDrawer(canvas, polygonData);
      drawer.drawPolygon();
    });
  }, [canvas, props.polygonDatas]);

  const handleZoomIn = () => {
    if (canvas !== null) {
      canvas.setZoom(canvas.getZoom() * 1.1);
    }
  };

  const handleZoomOut = () => {
    if (canvas !== null) {
      canvas.setZoom(canvas.getZoom() / 1.1);
    }
  };

  return (
    <div style={{ position: "relative" }} className={props.className}>
      <canvas className="self-center h-full" id="myCanvas" ref={canvasRef}></canvas>
      <div style={{ position: "absolute", top: 0, right: 0 }}>
        <Tooltip title="放大">
          <IconButton onClick={handleZoomIn}>
            <AddIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="缩小">
          <IconButton onClick={handleZoomOut}>
            <RemoveIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="自动聚焦(未实装）">
          <IconButton onClick={() => { }}>
            <CenterFocusStrongOutlined />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
}

function loadViewPortPoint(): fabric.Point {
  const item = JSON.parse(localStorage.getItem("pan") || '{ x: 0, y: 0 }');
  return new fabric.Point(item.x, item.y);
}

function saveViewPortPoint(point: fabric.Point) {
  localStorage.setItem("pan", JSON.stringify({ x: point.x, y: point.y }));
}

function loadZoom(): number {
  return parseFloat(localStorage.getItem("zoom") || '1');
}

function saveZoom(zoom: number) {
  localStorage.setItem("zoom", zoom.toString());
}