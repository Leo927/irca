import React, { useContext, Dispatch, SetStateAction } from 'react';
import { Button, Tooltip } from '@mui/material';
import { HistoricalPolygonData } from '@/context/polygondatas';
import { PolygonDatasContext, PolygonDatasDispatchContext } from '@/context/polygondatas';
import Grid from '@mui/material/Grid';
import { HistoricalPolygonConstructionDataInfo } from './HistoricalPolygonConstructionDataInfo';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
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
                <Tooltip title="新建四连杆">
                    <Button onClick={() => {
                        const newItem = new HistoricalPolygonData();
                        props.setShowCurrent(true);
                        dispatchPolygonDatas({ type: 'add', payload: newItem });
                        props.setCurrentPolygonData(newItem);
                    }}
                        size='large'
                        variant='outlined'
                        style={{ height: '100%', width: '100%', minHeight: '150px', fontSize: '2.5em' }}
                        startIcon={< AddCircleOutlineIcon fontSize='large' />}
                        fullWidth> {/* Add fullWidth prop */}
                        新建四连杆
                    </Button>
                </Tooltip>
            </Grid>
        </Grid >
    );
}



