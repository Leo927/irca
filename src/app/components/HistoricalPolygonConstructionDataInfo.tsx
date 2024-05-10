import React, { useContext, Dispatch } from 'react';
import { Button, Card, CardHeader, CardActions, Switch, FormControlLabel } from '@mui/material';
import { HistoricalPolygonData } from '@/context/polygondatas';
import { PolygonDatasDispatchContext } from '@/context/polygondatas';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { PolygonConstructionData } from '../logics/polygon-constructor';
const COLORS = [{ name: "黑色", value: "black" }, { name: "红色", value: "red" }, { name: "绿色", value: "green" }, { name: "蓝色", value: "blue" }, { name: "黄色", value: "yellow" }];
export function HistoricalPolygonConstructionDataInfo(props: { polygonData: HistoricalPolygonData, currentPolygonData: PolygonConstructionData, setCurrentPolygonData: Dispatch<PolygonConstructionData>; }) {

    const dispatchPolygonDatas = useContext(PolygonDatasDispatchContext);
    return (
        <Card key={props.polygonData.index}>
            <CardHeader title={`Polygon ${props.polygonData.index}`}></CardHeader>
            <CardActions>
                <Button onClick={() => dispatchPolygonDatas({ type: 'remove', payload: props.polygonData })}>删除</Button>
                <Button onClick={() => {
                    console.debug("setting current polygon data");
                    props.setCurrentPolygonData(props.polygonData);
                }}>使用</Button>

                <FormControl>
                    <InputLabel id="demo-simple-select-autowidth-label">Age</InputLabel>
                    <Select
                        labelId="demo-simple-select-autowidth-label"
                        id="demo-simple-select-autowidth"
                        value={props.polygonData.color}
                        onChange={(event: SelectChangeEvent) => {
                            props.polygonData.color = event.target.value;
                            dispatchPolygonDatas({ type: 'update', payload: props.polygonData });
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
                            dispatchPolygonDatas({ type: 'show', payload: props.polygonData });
                        } else {
                            dispatchPolygonDatas({ type: 'hide', payload: props.polygonData });
                        }
                    }}
                        checked={props.polygonData.show}
                    >
                    </Switch>}
                    label='显示'></FormControlLabel>
            </CardActions>
        </Card>
    );
}