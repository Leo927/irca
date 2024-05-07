import React, { useEffect, useContext, Dispatch } from 'react';
import { Container, Button, Card, CardHeader, CardActions, ToggleButton, Switch, FormControlLabel } from '@mui/material';
import { HistoricalPolygonData } from '@/context/polygondatas';
import { PolygonDatasContext, PolygonDatasDispatchContext } from '@/context/polygondatas';

export default function HistoryRotationalCenters(props: { setCurrentPolygonData: Dispatch<HistoricalPolygonData> }) {
    const polygonDatas = useContext(PolygonDatasContext);
    const dispatchPolygonDatas = useContext(PolygonDatasDispatchContext);
    
    // use local storage to store polygonDatas
    useEffect(() => {
        const storedPolygonDatas = JSON.parse(localStorage.getItem('polygonDatas') || '[]') as HistoricalPolygonData[];
        dispatchPolygonDatas({ type: 'set', payload: storedPolygonDatas});
        console.log(`Loading polygonDatas: ${JSON.stringify(storedPolygonDatas)}`);
    }, []);

    useEffect(() => {
        localStorage.setItem('polygonDatas', JSON.stringify(polygonDatas));
        console.log(`Saving polygonDatas: ${JSON.stringify(polygonDatas)}`);
    }, [polygonDatas]);

    return (
        <Container className='flex '>
            {polygonDatas.map((polygonData, index) => (
                <Card key={index}>
                    <CardHeader title={`Polygon ${index}`}></CardHeader>
                    <CardActions>
                        <Button onClick={() => dispatchPolygonDatas({ type: 'remove', payload: polygonData })}>删除</Button>
                        <Button onClick={() => props.setCurrentPolygonData(polygonData)}>使用</Button>
                        <FormControlLabel control={<Switch onChange={(show) => props.setCurrentPolygonData}></Switch>}
                            label='显示'></FormControlLabel>
                    </CardActions>
                </Card>
            ))}
        </Container>
    );
}



