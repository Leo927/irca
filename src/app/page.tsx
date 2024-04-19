'use client';

import { useEffect } from "react";
import { useState } from "react";
import { Vector2 } from '@/app/logics/vector2';
import { PolygonConstructionData, PolygonConstructor } from '@/app/logics/polygon-constructor';
import { Polygon } from "@/app/logics/polygon";
import { Modal, TextField } from "@mui/material";
import { HandsOffDistance } from "./logics/similarity-calculator";
import Settings from "./settings/page";
import Box from '@mui/material/Box';
import PolygonInfoPanel from "./components/PolygonInfo";


export default function Home() {
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

  return (
    <main className="w-full bg-green-300 items-center mx-auto columns-1 p-6">
      <div className="items-end py-2" >
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => setSettingOpen(true)}>
          设置
        </button>
      </div>
      <div className="columns-2">

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

}
