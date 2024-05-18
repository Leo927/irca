import React, { useContext, Dispatch, SetStateAction } from 'react';
import { IconButton } from '@mui/material';
import { HistoricalPolygonData } from '@/context/polygondatas';
import { PolygonDatasContext, PolygonDatasDispatchContext } from '@/context/polygondatas';
import Grid from '@mui/material/Grid';
import { HistoricalPolygonConstructionDataInfo } from './HistoricalPolygonConstructionDataInfo';
import AddIcon from '@mui/icons-material/Add';
import { ClassNames } from '@emotion/react';





export default function HistoryRotationalCenters(props: {
    currentPolygonData: HistoricalPolygonData, setCurrentPolygonData: Dispatch<SetStateAction<HistoricalPolygonData>>,
    setShowCurrent: Dispatch<SetStateAction<boolean>>;
}) {
    const polygonDatas = useContext(PolygonDatasContext);
    const dispatchPolygonDatas = useContext(PolygonDatasDispatchContext);

    return (
        <Grid container spacing={2}>
            {polygonDatas.map((polygonData, index) => (
                <Grid item xs={6} key={index} >
                    <HistoricalPolygonConstructionDataInfo polygonData={polygonData} currentPolygonData={props.currentPolygonData}
                        setCurrentPolygonData={props.setCurrentPolygonData}
                        setShowCurrent={props.setShowCurrent} />
                </Grid>
            ))}
            <Grid item xs={6}>
                <IconButton onClick={() => {
                    const newItem = new HistoricalPolygonData();
                    props.setShowCurrent(true);
                    dispatchPolygonDatas({ type: 'add', payload: newItem });
                    props.setCurrentPolygonData(newItem);
                }}>
                    <AddIcon fontSize='large'/>
                </IconButton>
            </Grid>
        </Grid>
    );
}



