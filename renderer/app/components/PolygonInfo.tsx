import TextField from "@mui/material/TextField";
import { SetStateAction, useState, useContext } from "react";

import { Dispatch } from "react";
import { PolygonConstructionData } from "../logics/polygon-constructor";
import { Button, IconButton, Tooltip } from "@mui/material";
import { HistoricalPolygonData, PolygonDatasDispatchContext } from "../../context/polygondatas";
import { translateEdgeName } from "../../app/logics/helpers";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import NumField from "./NumField";


export default function PolygonInfoPanel(props: {
    className?: string,
    data: HistoricalPolygonData,
    setData: Dispatch<SetStateAction<HistoricalPolygonData>>,
    setShowCurrent: Dispatch<SetStateAction<boolean>>;
}) {
    const setPolygonDatas = useContext(PolygonDatasDispatchContext);
    const [error, setError] = useState(false);
    const [errorDialogMessage, setErrorDialogMessage] = useState('' as string);

    function onSaveData() {
        const polygonData = props.data;
        let newItem = HistoricalPolygonData.fromJSON(polygonData);
        newItem.show = true;
        setPolygonDatas({ type: 'add', payload: newItem });
        props.setShowCurrent(false);
        console.debug(`save button clicked`, polygonData);
    }

    function onCancel() {
        props.setShowCurrent(false);
        setPolygonDatas({ type: "show", payload: props.data });
    }

    return (
        <Box className={props.className}>
            <FormControl error={error} variant="standard" style={{ display: 'flex', flexDirection: 'row' }}>
                <Grid container spacing={1}>
                    <Grid item xs={10}>
                        <TextField
                            label="名称"
                            className="w-full"
                            value={props.data.name}
                            onChange={(e) => props.setData(currentData => {
                                console.debug('updating name');
                                let newData = HistoricalPolygonData.fromJSON(currentData);
                                newData.name = e.target.value;
                                return newData;
                            })} />
                    </Grid>
                    <Grid item xs={1}>
                        <Tooltip title="保存">
                            <IconButton onClick={onSaveData}>
                                <SaveOutlinedIcon />
                            </IconButton>
                        </Tooltip>
                    </Grid>
                    <Grid item xs={1}>
                        <Tooltip title="取消">
                            <IconButton onClick={onCancel}>
                                <ClearOutlinedIcon />
                            </IconButton>
                        </Tooltip>
                    </Grid>
                    {props.data.edgeLengths.map((edge, index) => (
                        <Grid item xs={3}
                            key={index}>
                            <TextField
                                type="number"
                                label={`${translateEdgeName(index)}`}
                                value={edge}
                                onChange={(e) => {
                                    props.setData(currentData => {
                                        console.debug('updating edgeLengths');
                                        let newEdges = currentData.edgeLengths.map((value, i) => i === index ? parseFloat(e.target.value) : value);
                                        let newData = HistoricalPolygonData.fromJSON(currentData);
                                        newData.edgeLengths = newEdges;
                                        return newData;
                                    });
                                }}
                            />
                        </Grid>
                    ))}
                    <Grid item xs={3}>
                        <NumField
                            label="前连杆与上连杆角度"
                            value={props.data.angleBetweenFirstAndLastEdge}
                            onChange={(e) => props.setData(currentData => {
                                console.debug('updating angleBetweenFirstAndLastEdge');
                                let newData = HistoricalPolygonData.fromJSON(currentData);
                                newData.angleBetweenFirstAndLastEdge = parseFloat(e.target.value);
                                return newData;
                            })} />
                    </Grid>
                    <Grid item xs={3}>
                        <NumField
                            label="下连杆水平夹角"
                            value={props.data.edge0Angle}
                            onChange={(e) => props.setData(currentData => {
                                console.debug('updating edge0Angle');
                                let newData = HistoricalPolygonData.fromJSON(currentData);
                                newData.edge0Angle = parseFloat(e.target.value);
                                return newData;
                            })} />
                    </Grid>
                    <Grid item xs={3}>
                        <NumField
                            label="前连杆与上连杆初始角度"
                            value={props.data.startAngle}
                            onChange={(e) => props.setData(currentData => {
                                console.debug('updating startAngle');
                                let newData = HistoricalPolygonData.fromJSON(currentData);
                                newData.startAngle = parseFloat(e.target.value);
                                return newData;
                            })} />
                    </Grid>
                    <Grid item xs={3}>
                        <NumField
                            label="前连杆与上连杆终止角度"
                            value={props.data.endAngle}
                            onChange={(e) => props.setData(currentData => {
                                console.debug('updating edge0Angle');
                                let newData = HistoricalPolygonData.fromJSON(currentData);
                                newData.endAngle = parseFloat(e.target.value);
                                return newData;
                            })} />
                    </Grid>
                    <FormHelperText>{errorDialogMessage}</FormHelperText>
                </Grid>
            </FormControl >
        </Box>
    );
}



const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
};