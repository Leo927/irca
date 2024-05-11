'use client';

import { Dispatch, useEffect, useReducer, SetStateAction } from "react";
import { useState } from "react";
import { Vector2 } from '@/app/logics/vector2';
import { PolygonConstructionData, PolygonConstructor } from '@/app/logics/polygon-constructor';
import { Polygon } from "@/app/logics/polygon";
import { Modal, TextField, Button, IconButton, Tooltip } from "@mui/material";
import Settings from "@/app/settings/page";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import PolygonInfoPanel from "@/app/components/PolygonInfo";
import Canvas from "@/app/components/Canvas";
import HistoryRotationalCenters from "./components/HistoryRotationalCenters";
import { PolygonDatasContext, PolygonDatasDispatchContext, polygonDatasReducer, HistoricalPolygonData } from '@/context/polygondatas';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import SaveAltOutlinedIcon from '@mui/icons-material/SaveAltOutlined';
import { UploadFileOutlined } from "@mui/icons-material";

function loadPolygonDatas() {
  const value = (JSON.parse(typeof window !== "undefined" ? window.localStorage.getItem('polygonDatas') || '[]' : "[]") as Object[]).map(HistoricalPolygonData.fromJSON);
  return value;
}

function loadPolygonData() {
  let value = window?.localStorage.getItem('polygonData');
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
  const [loaded, setLoaded] = useState<boolean>(false);
  const [polygonData, setPolygonData] = useState<PolygonConstructionData>(new PolygonConstructionData());
  const [settingOpen, setSettingOpen] = useState<boolean>(false);
  const [polygonDatas, dispatchPolygonDatas] = useReducer(polygonDatasReducer, []);
  const [drawingDatas, setDrawingDatas] = useState<HistoricalPolygonData[]>([]);

  useEffect(() => {
    let currentPolygon = HistoricalPolygonData.fromJSON(polygonData).withShow(true).withIndex(-1);
    console.debug('updating drawing datas', currentPolygon, polygonData);
    setDrawingDatas([...polygonDatas.filter((data) => data.show), currentPolygon.withColor('black')]);
  }, [polygonDatas, polygonData]);

  const savePolygonDataWithSave = (data: SetStateAction<PolygonConstructionData>) => {
    setPolygonData(data);
    localStorage.setItem('polygonData', JSON.stringify(data));
  };

  // load the polygon data
  useEffect(() => {
    dispatchPolygonDatas({ type: 'set', payload: loadPolygonDatas() });
    setPolygonData(loadPolygonData());
    setLoaded(true);
  }, []);

  // save the polygon data
  useEffect(() => {
    if (loaded)
      localStorage.setItem('polygonData', JSON.stringify(polygonData));
  }, [polygonData]);

  return (
    <PolygonDatasContext.Provider value={polygonDatas}>
      <PolygonDatasDispatchContext.Provider value={dispatchPolygonDatas}>
        <main className="w-full bg-gray-300 items-center mx-auto columns-1 p-6">
          <Box className="items-end py-2" >
            <Tooltip title="设置">
              <IconButton onClick={() => setSettingOpen(true)}>
                <SettingsOutlinedIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="导出数据">
              <IconButton onClick={() => setSettingOpen(true)}>
                <SaveAltOutlinedIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="导入数据">
              <IconButton onClick={() => setSettingOpen(true)}>
                <UploadFileOutlined />
              </IconButton>
            </Tooltip>
          </Box>
          <Grid container>
            <Grid item xs={6} className="bg-gray-200" padding="normal">
              <Canvas polygonDatas={drawingDatas} />
              <PolygonInfoPanel data={polygonData} setData={savePolygonDataWithSave} />
            </Grid>

            <Grid item xs={6} className="bg-gray-200">
              <HistoryRotationalCenters currentPolygonData={polygonData} setCurrentPolygonData={savePolygonDataWithSave} />
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
