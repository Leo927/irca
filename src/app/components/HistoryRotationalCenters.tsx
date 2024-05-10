import React, { useEffect, useContext, Dispatch } from 'react';
import { Container, Button, Card, CardHeader, CardActions, ToggleButton, Switch, FormControlLabel } from '@mui/material';
import { HistoricalPolygonData } from '@/context/polygondatas';
import { PolygonDatasContext, PolygonDatasDispatchContext } from '@/context/polygondatas';

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
                            <Switch onChange={(show) => dispatchPolygonDatas({ type: 'show', payload: polygonData })}
                                value={polygonData.show}>
                            </Switch>}
                            label='显示'></FormControlLabel>
                    </CardActions>
                </Card>
            ))}
        </Container>
    );
}



