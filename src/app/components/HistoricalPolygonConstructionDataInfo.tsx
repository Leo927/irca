import React, { useContext, Dispatch } from 'react';
import { Button, Card, CardHeader, CardActions, Switch, FormControlLabel, CardContent, Tooltip } from '@mui/material';
import { HistoricalPolygonData } from '@/context/polygondatas';
import { PolygonDatasDispatchContext } from '@/context/polygondatas';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { PolygonConstructionData } from '../logics/polygon-constructor';
import { PolygonComparator } from '../logics/similarity-calculator';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

const COLORS = [{ name: "黑色", value: "black" }, { name: "红色", value: "red" }, { name: "绿色", value: "green" }, { name: "蓝色", value: "blue" }, { name: "黄色", value: "yellow" }];
export function HistoricalPolygonConstructionDataInfo(props: { polygonData: HistoricalPolygonData, currentPolygonData: PolygonConstructionData, setCurrentPolygonData: Dispatch<PolygonConstructionData>; }) {

    const dispatchPolygonDatas = useContext(PolygonDatasDispatchContext);
    return (
        <Card key={props.polygonData.index} className='bg-gray-300'>
            <CardHeader title={`Polygon ${props.polygonData.index}`} action={
                <Tooltip title="删除该记录" placement="top">
                    <IconButton onClick={() => dispatchPolygonDatas({ type: 'remove', payload: props.polygonData })}>
                        <CloseIcon />
                    </IconButton>
                </Tooltip>
            }></CardHeader>
            <CardContent>
                HandsOffDistance {new PolygonComparator(props.currentPolygonData, props.polygonData).getHandsOffDistance().toFixed(2)}
            </CardContent>
            <CardActions>
                <Tooltip title="加载这组数据到编辑器中" placement="top">
                    <Button className='bg-gray-100' sx={{ boxShadow: 3 }} onClick={() => {
                        props.setCurrentPolygonData(props.polygonData);
                    }}>使用</Button>
                </Tooltip>

                <FormControl>
                    <InputLabel id="demo-simple-select-autowidth-label">颜色</InputLabel>
                    <Select
                        labelId="demo-simple-select-autowidth-label"
                        id="demo-simple-select-autowidth"
                        value={props.polygonData.color}
                        onChange={(event: SelectChangeEvent) => {
                            props.polygonData.color = event.target.value;
                            dispatchPolygonDatas({ type: 'update', payload: props.polygonData });
                        }}
                        autoWidth
                        label="颜色"
                    >
                        {
                            COLORS.map((color, index) => (
                                <MenuItem key={index} value={color.value}>{color.name}</MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>

                <Tooltip title="显示/隐藏" placement="top">
                    <Switch onChange={(show) => {
                        if (show.target.checked) {
                            dispatchPolygonDatas({ type: 'show', payload: props.polygonData });
                        } else {
                            dispatchPolygonDatas({ type: 'hide', payload: props.polygonData });
                        }
                    }}
                        checked={props.polygonData.show}
                    >
                    </Switch>
                </Tooltip>
            </CardActions>
        </Card>
    );
}