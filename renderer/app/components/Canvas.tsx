import { useRef } from "react";
import { useEffect, useState } from "react";
import { HistoricalPolygonData } from "../../context/polygondatas";
import { IconButton, Tooltip } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import * as fabric from 'fabric';
import CenterFocusStrongOutlinedIcon from '@mui/icons-material/CenterFocusStrongOutlined';
import { PolygonConstructor } from "../../app/logics/polygon-constructor";

import PolygonDrawer from "../../app/logics/polygondrawer";
import { CenterFocusStrong, CenterFocusStrongOutlined } from "@mui/icons-material";
import { Vector2 } from "../logics/vector2";

export default function Canvas(props: { className?: string, polygonDatas: HistoricalPolygonData[]; }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);

  // update the canvas when the polygon changes
  useEffect(() => {
    let dragging = false;
    let LastPoint = new fabric.Point(0, 0);

    const ctx = new fabric.Canvas("myCanvas", {
      objectCaching: false,
    });

    const parentHeight = divRef.current.offsetHeight;
    const parentWidth = divRef.current.offsetWidth;
    ctx.setDimensions({ width: parentWidth, height: parentHeight });
    console.info("canvas created", parentHeight, parentWidth);
    ctx.absolutePan(new fabric.Point(-parentHeight / 2, -parentWidth / 2));
    setCanvas(ctx);
    setHeight(parentHeight);
    setWidth(parentWidth);

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
  }, [divRef.current]);
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

  const autoFocus = () => {
    let vertices = props.polygonDatas.map(p => new PolygonConstructor(p).constructPolygon()).reduce((acc, curr) => acc.concat(curr.vertices), []);
    // find the center of the polygon given the vertices
    console.debug(vertices);
    let center = vertices.reduce((acc, curr) => new Vector2(acc.x + curr.x, acc.y + curr.y), new Vector2(0, 0)).multiply(1 / props.polygonDatas.length / 4);
    canvas.absolutePan(new fabric.Point(center.x - width / 2, center.y - height / 2));
    console.debug("auto focus" + center);
  };

  return (
    <div style={{ position: "relative", "minHeight": "80vh" }} ref={divRef} className={props.className} id="canvasContainer">
      <canvas className="self-center h-full" id="myCanvas" ref={canvasRef} style={{ "minHeight": "100%", "minWidth": "100%" }}></canvas>
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
        <Tooltip title="自动聚焦">
          <IconButton onClick={autoFocus}>
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
