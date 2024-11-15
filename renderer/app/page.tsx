'use client';

import { Dispatch, useEffect, useReducer, SetStateAction } from "react";
import { useState } from "react";
import { Vector2 } from '../app/logics/vector2';
import { PolygonConstructionData, PolygonConstructor } from '../app/logics/polygon-constructor';
import { Polygon } from "../app/logics/polygon";
import { Modal, TextField, Button, IconButton, Tooltip } from "@mui/material";
import Settings from "../app/settings/page";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import PolygonInfoPanel from "../app/components/PolygonInfo";
import Canvas from "../app/components/Canvas";
import HistoryRotationalCenters from "./components/HistoryRotationalCenters";
import { PolygonDatasContext, PolygonDatasDispatchContext, polygonDatasReducer, HistoricalPolygonData } from '../context/polygondatas';
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
    let data = new HistoricalPolygonData();
    data.edgeLengths = [60, 100, 120, 100];
    data.edge0Angle = 0;
    data.angleBetweenFirstAndLastEdge = 80;
    data.firstVertex = new Vector2(0, 0);
    return data;
  } else {
    try {
      return HistoricalPolygonData.fromJSON(JSON.parse(value));
    } catch (error) {
      return new HistoricalPolygonData();
    }
  }
}


export default function Home() {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [polygonData, setPolygonData] = useState<HistoricalPolygonData>(new HistoricalPolygonData());
  const [settingOpen, setSettingOpen] = useState<boolean>(false);
  const [polygonDatas, dispatchPolygonDatas] = useReducer(polygonDatasReducer, []);
  const [drawingDatas, setDrawingDatas] = useState<HistoricalPolygonData[]>([]);
  const [showCurrent, setShowCurrent] = useState<boolean>(false);

  useEffect(() => {
    let currentPolygon = HistoricalPolygonData.fromJSON(polygonData).withShow(true);
    console.debug('updating drawing datas', currentPolygon, polygonData);
    let newDraws = polygonDatas.filter((data) => data.show);
    if (showCurrent) {
      newDraws.push(currentPolygon);
    }
    setDrawingDatas(newDraws);
  }, [polygonDatas, polygonData, showCurrent]);

  const savePolygonDataWithSave = (data: SetStateAction<HistoricalPolygonData>) => {
    setPolygonData(data);
    localStorage.setItem('polygonData', JSON.stringify(data));
  };

  function dumpData() {
    const data = { polygonDatas, polygonData };
    const jsonData = JSON.stringify(data);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const datetime = new Date().toISOString().replace(/[-:.]/g, '');
    link.download = `四连杆分析数据_${datetime}.json`;
    link.click();
  }

  function loadData() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.onchange = (event) => {
      if (event === null || event.currentTarget === null) return;
      const target = event.target as HTMLInputElement;
      if (target.files === null) return;
      const file = target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          if (e.target === null) return;
          const jsonData = e.target.result as string;
          const data = JSON.parse(jsonData);
          const { polygonDatas, polygonData } = data;
          dispatchPolygonDatas({ type: 'set', payload: polygonDatas.map(HistoricalPolygonData.fromJSON) });
          setPolygonData(HistoricalPolygonData.fromJSON(polygonData));
        } catch (error) {
          console.error('Error loading data:', error);
        }
      };
      reader.readAsText(file);
    };
    fileInput.click();
  }

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
        <main className="w-full bg-gray-300 items-center mx-auto columns-1 p-6" style={{ "minHeight": "100vh" }}>
          <Box className="items-end py-2" >
            <Tooltip title="设置">
              <IconButton onClick={() => setSettingOpen(true)}>
                <SettingsOutlinedIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="导出数据">
              <IconButton onClick={dumpData}>
                <SaveAltOutlinedIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="导入数据">
              <IconButton onClick={loadData}>
                <UploadFileOutlined />
              </IconButton>
            </Tooltip>
          </Box>
          <Grid container style={{ "minHeight": "100vh" }}>
            <Grid item xs={6} className="bg-gray-200" padding="normal">
              <Canvas polygonDatas={drawingDatas} />

              {showCurrent && (
                <PolygonInfoPanel style={{ position: "absolute", width: "50%", left: 0, bottom: 0 }} data={polygonData} setData={savePolygonDataWithSave} setShowCurrent={setShowCurrent} />
              )}
            </Grid>

            <Grid item xs={6} className="bg-gray-200">
              <HistoryRotationalCenters currentPolygonData={polygonData} setCurrentPolygonData={savePolygonDataWithSave} setShowCurrent={setShowCurrent} />
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

};