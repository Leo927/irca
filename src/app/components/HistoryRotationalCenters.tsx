import React, { useEffect, useContext, Dispatch } from 'react';
import { Container, Button, Card, CardHeader, CardActions, ToggleButton, Switch, FormControlLabel } from '@mui/material';
import { HistoricalPolygonData } from '@/context/polygondatas';
import { PolygonDatasContext, PolygonDatasDispatchContext } from '@/context/polygondatas';
const COLORS = [{ name: "红色", value: "red" }, { name: "绿色", value: "green" }, { name: "蓝色", value: "blue" }, { name: "黄色", value: "yellow" }];


export default function HistoryRotationalCenters(props: { setCurrentPolygonData: Dispatch<HistoricalPolygonData>; }) {
    const polygonDatas = useContext(PolygonDatasContext);
    const dispatchPolygonDatas = useContext(PolygonDatasDispatchContext);

    return (
        <Container className='flex '>
            {polygonDatas.map((polygonData, index) => (
                <Card key={index}>
                    <CardHeader title={`Polygon ${index}`}></CardHeader>
                    <CardActions>
                        <Button onClick={() => dispatchPolygonDatas({ type: 'remove', payload: polygonData })}>删除</Button>
                        <Button onClick={() => {
                            console.debug("setting current polygon data");
                            props.setCurrentPolygonData(polygonData);
                        }}>使用</Button>

                        <FormControlLabel control={
                            <Switch onChange={(show) => {
                                if(show.target.checked){
                                    dispatchPolygonDatas({ type: 'show', payload: polygonData });
                                }   else{
                                    dispatchPolygonDatas({ type: 'hide', payload: polygonData });
                                }
                            }}
                                checked={polygonData.show}>
                            </Switch>}
                            label='显示'></FormControlLabel>
                    </CardActions>
                </Card>
            ))}
        </Container>
    );
}



