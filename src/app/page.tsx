'use client';

import { useEffect, useReducer } from "react";
import { useState } from "react";
import { Vector2 } from '@/app/logics/vector2';
import { PolygonConstructionData, PolygonConstructor } from '@/app/logics/polygon-constructor';
import { Polygon } from "@/app/logics/polygon";
import { Modal, TextField, Button } from "@mui/material";
import Settings from "@/app/settings/page";
import Box from '@mui/material/Box';
import PolygonInfoPanel from "@/app/components/PolygonInfo";
import Canvas from "@/app/components/Canvas";
import HistoryRotationalCenters from "./components/HistoryRotationalCenters";
import { PolygonDatasContext, PolygonDatasDispatchContext, polygonDatasReducer, HistoricalPolygonData } from '@/context/polygondatas';



function loadPolygonData() {
  return JSON.parse(localStorage?.getItem('polygonDatas') || '[]') as HistoricalPolygonData[];
}


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

  const [polygonDatas, dispatchPolygonDatas] = useReducer(polygonDatasReducer, loadPolygonData());


  useEffect(() => {
    const polygonConstructor = new PolygonConstructor(polygonData);
    setPolygon((c) => polygonConstructor.constructPolygon());
  }, [polygonData]);

  return (
    <PolygonDatasContext.Provider value={polygonDatas}>
      <PolygonDatasDispatchContext.Provider value={dispatchPolygonDatas}>
        <main className="w-full bg-green-300 items-center mx-auto columns-1 p-6">
          <Box className="items-end py-2" >
            <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => setSettingOpen(true)}>
              设置
            </Button>
          </Box>
          <Box className="columns-2">
            <Canvas polygon={polygon} polygonData={polygonData} />
            <PolygonInfoPanel data={polygonData} setData={setPolygonData} />

            <Box>

              <HistoryRotationalCenters setCurrentPolygonData={setPolygonData} />

            </Box>
          </Box>


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
      </PolygonDatasDispatchContext.Provider>
    </PolygonDatasContext.Provider>
  );

}
