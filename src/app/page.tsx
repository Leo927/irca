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
  const value = (JSON.parse(localStorage?.getItem('polygonDatas') || '[]') as Object[]).map(HistoricalPolygonData.fromJSON);
  return value;
}


export default function Home() {
  const [polygonData, setPolygonData] = useState<PolygonConstructionData>(
    new PolygonConstructionData());
  const [settingOpen, setSettingOpen] = useState<boolean>(false);
  const [polygonDatas, dispatchPolygonDatas] = useReducer(polygonDatasReducer, loadPolygonData());
  const [drawingDatas, setDrawingDatas] = useState<HistoricalPolygonData[]>([]);

  // initialize the polygon data
  useEffect(() => {
    setPolygonData(() => {
      let data = new PolygonConstructionData();
      data.edgeLengths = [60, 100, 120, 100];
      data.edge0Angle = 0;
      data.angleBetweenFirstAndLastEdge = 80;
      data.firstVertex = new Vector2(200, 200);
      return data;
    });
  }, []);

  useEffect(() => {
    setDrawingDatas([...polygonDatas.filter((data) => data.show)]);
  }, [polygonDatas]);

  return (
    <PolygonDatasContext.Provider value={polygonDatas}>
      <PolygonDatasDispatchContext.Provider value={dispatchPolygonDatas}>
        <main className="w-full bg-gray-50 items-center mx-auto columns-1 p-6">
          <Box className="items-end py-2" >
            <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => setSettingOpen(true)}>
              设置
            </Button>
          </Box>
          <Box className="columns-2">
            <Canvas polygonDatas={drawingDatas} />
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
