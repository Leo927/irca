'use client';

import { useEffect, useReducer } from "react";
import { useState } from "react";
import { Vector2 } from '@/app/logics/vector2';
import { PolygonConstructionData, PolygonConstructor } from '@/app/logics/polygon-constructor';
import { Polygon } from "@/app/logics/polygon";
import { Modal, TextField, Button } from "@mui/material";
import Settings from "@/app/settings/page";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import PolygonInfoPanel from "@/app/components/PolygonInfo";
import Canvas from "@/app/components/Canvas";
import HistoryRotationalCenters from "./components/HistoryRotationalCenters";
import { PolygonDatasContext, PolygonDatasDispatchContext, polygonDatasReducer, HistoricalPolygonData } from '@/context/polygondatas';



function loadPolygonDatas() {
  const value = (JSON.parse(localStorage?.getItem('polygonDatas') || '[]') as Object[]).map(HistoricalPolygonData.fromJSON);
  return value;
}

function loadPolygonData() {
  let value = localStorage.getItem('polygonData');
  if (value === null || value === undefined) {
    let data = new PolygonConstructionData();
    data.edgeLengths = [60, 100, 120, 100];
    data.edge0Angle = 0;
    data.angleBetweenFirstAndLastEdge = 80;
    data.firstVertex = new Vector2(0, 0);
    return data;
  } else {
    try {
      return PolygonConstructionData.fromJSON(JSON.parse(value));
    } catch (error) {
      return new PolygonConstructionData();
    }
  }
}


export default function Home() {
  const [polygonData, setPolygonData] = useState<PolygonConstructionData>(loadPolygonData());
  const [settingOpen, setSettingOpen] = useState<boolean>(false);
  const [polygonDatas, dispatchPolygonDatas] = useReducer(polygonDatasReducer, loadPolygonDatas());
  const [drawingDatas, setDrawingDatas] = useState<HistoricalPolygonData[]>([]);

  useEffect(() => {
    let currentPolygon = HistoricalPolygonData.fromJSON(polygonData).withShow(true).withIndex(-1);
    console.debug('updating drawing datas', currentPolygon, polygonData);
    setDrawingDatas([...polygonDatas.filter((data) => data.show), currentPolygon.withColor('black')]);
  }, [polygonDatas, polygonData]);

  // save the polygon data
  useEffect(() => {
    localStorage.setItem('polygonData', JSON.stringify(polygonData));
  }, [polygonData]);

  return (
    <PolygonDatasContext.Provider value={polygonDatas}>
      <PolygonDatasDispatchContext.Provider value={dispatchPolygonDatas}>
        <main className="w-full bg-gray-300 items-center mx-auto columns-1 p-6">
          <Box className="items-end py-2" >
            <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => setSettingOpen(true)}>
              设置
            </Button>
          </Box>
          <Grid container>
            <Grid item xs={6} className="bg-gray-200" padding="normal">
              <Canvas polygonDatas={drawingDatas} />
              <PolygonInfoPanel data={polygonData} setData={setPolygonData} />
            </Grid>

            <Grid item xs={6} className="bg-gray-200">
              <HistoryRotationalCenters currentPolygonData={polygonData} setCurrentPolygonData={setPolygonData} />
            </Grid>

          </Grid>


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
