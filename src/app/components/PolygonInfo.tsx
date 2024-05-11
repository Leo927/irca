import TextField from "@mui/material/TextField";
import { SetStateAction, useState, useContext } from "react";

import { Dispatch } from "react";
import { PolygonConstructionData } from "../logics/polygon-constructor";
import { Button } from "@mui/material";
import { PolygonDatasDispatchContext } from "@/context/polygondatas";
import { translateEdgeName } from "@/app/logics/helpers";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid";


export default function PolygonInfoPanel(props: {
    data: PolygonConstructionData,
    setData: Dispatch<SetStateAction<PolygonConstructionData>>,
}) {
    const setPolygonDatas = useContext(PolygonDatasDispatchContext);
    const [error, setError] = useState(false);
    const [errorDialogMessage, setErrorDialogMessage] = useState('' as string);

    function onSaveData() {
        const polygonData = props.data;
        setPolygonDatas({ type: 'add', payload: polygonData });
        console.log(`save button clicked, data: ${JSON.stringify(polygonData)}`);
    }

    return (
        <FormControl error={error} variant="standard" style={{ display: 'flex', flexDirection: 'row' }}>
            <Grid container spacing={1}>
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
                                    let newData = PolygonConstructionData.fromJSON(currentData);
                                    newData.edgeLengths = newEdges;
                                    return newData;
                                });
                            }}
                        />
                    </Grid>
                ))}
                <Grid item xs={6}>
                    <TextField
                        className="w-full"
                        type="number"
                        label="下连杆与前连杆初始角度"
                        value={props.data.angleBetweenFirstAndLastEdge}
                        onChange={(e) => props.setData(currentData => {
                            console.debug('updating angleBetweenFirstAndLastEdge');
                            let newData = PolygonConstructionData.fromJSON(currentData);
                            newData.angleBetweenFirstAndLastEdge = parseFloat(e.target.value);
                            return newData;
                        })} />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        className="w-full"
                        type="number"
                        label="下连杆水平夹角"
                        value={props.data.edge0Angle}
                        onChange={(e) => props.setData(currentData => {
                            console.debug('updating edge0Angle');
                            let newData = PolygonConstructionData.fromJSON(currentData);
                            newData.edge0Angle = parseFloat(e.target.value);
                            return newData;
                        })} />
                </Grid>
                <Grid item xs={12}>
                    <Button className="w-full" onClick={() => { onSaveData(); }}>保存</Button>
                </Grid>
                <FormHelperText>{errorDialogMessage}</FormHelperText>
            </Grid>
        </FormControl >
    );
}

