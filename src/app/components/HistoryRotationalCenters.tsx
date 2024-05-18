import React, { useEffect, useContext, Dispatch, SetStateAction } from 'react';
import { Container, Button, Card, CardHeader, CardActions, ToggleButton, Switch, FormControlLabel, Typography } from '@mui/material';
import { HistoricalPolygonData } from '@/context/polygondatas';
import { PolygonDatasContext, PolygonDatasDispatchContext } from '@/context/polygondatas';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { PolygonConstructionData } from '../logics/polygon-constructor';
import { HistoricalPolygonConstructionDataInfo } from './HistoricalPolygonConstructionDataInfo';






export default function HistoryRotationalCenters(props: { currentPolygonData: HistoricalPolygonData, setCurrentPolygonData: Dispatch<SetStateAction<HistoricalPolygonData>>; }) {
    const polygonDatas = useContext(PolygonDatasContext);
    const dispatchPolygonDatas = useContext(PolygonDatasDispatchContext);

    return (
        <Grid container spacing={2}>
            {polygonDatas.map((polygonData, index) => (
                <Grid item xs={6} key={index} >
                    <HistoricalPolygonConstructionDataInfo polygonData={polygonData} currentPolygonData={props.currentPolygonData} setCurrentPolygonData={props.setCurrentPolygonData} />
                </Grid>
            ))}
        </Grid>
    );
}



