import React, { useEffect, useContext, Dispatch } from 'react';
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


const COLORS = [{ name: "黑色", value: "black" }, { name: "红色", value: "red" }, { name: "绿色", value: "green" }, { name: "蓝色", value: "blue" }, { name: "黄色", value: "yellow" }];


export default function HistoryRotationalCenters(props: {currentPolygonData: PolygonConstructionData,  setCurrentPolygonData: Dispatch<PolygonConstructionData>; }) {
    const polygonDatas = useContext(PolygonDatasContext);
    const dispatchPolygonDatas = useContext(PolygonDatasDispatchContext);

    return (
        <Grid container spacing={2}>
            {polygonDatas.map((polygonData, index) => (
                <Grid item xs={6}  >
                    <Card key={index}>
                        <CardHeader title={`Polygon ${index}`}></CardHeader>
                        <CardActions>
                            <Button onClick={() => dispatchPolygonDatas({ type: 'remove', payload: polygonData })}>删除</Button>
                            <Button onClick={() => {
                                console.debug("setting current polygon data");
                                props.setCurrentPolygonData(polygonData);
                            }}>使用</Button>

                            <FormControl>
                                <InputLabel id="demo-simple-select-autowidth-label">Age</InputLabel>
                                <Select
                                    labelId="demo-simple-select-autowidth-label"
                                    id="demo-simple-select-autowidth"
                                    value={polygonData.color}
                                    onChange={(event: SelectChangeEvent) => {
                                        polygonData.color = event.target.value;
                                        dispatchPolygonDatas({ type: 'update', payload: polygonData });
                                    }}
                                    autoWidth
                                    label="Age"
                                >
                                    {
                                        COLORS.map((color, index) => (
                                            <MenuItem key={index} value={color.value}>{color.name}</MenuItem>
                                        ))
                                    }
                                </Select>
                            </FormControl>

                            <FormControlLabel control={
                                <Switch onChange={(show) => {
                                    if (show.target.checked) {
                                        dispatchPolygonDatas({ type: 'show', payload: polygonData });
                                    } else {
                                        dispatchPolygonDatas({ type: 'hide', payload: polygonData });
                                    }
                                }}
                                    checked={polygonData.show}
                                    >
                                </Switch>}
                                label='显示'></FormControlLabel>
                        </CardActions>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}



