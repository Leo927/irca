import TextField from "@mui/material/TextField";
import { SetStateAction, useState, useContext } from "react";

import { Dispatch } from "react";
import { PolygonConstructionData } from "../logics/polygon-constructor";
import { Button } from "@mui/material";
import { HistoricalPolygonData, PolygonDatasDispatchContext } from "@/context/polygondatas";
import { translateEdgeName } from "@/app/logics/helpers";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";


export default function PolygonInfoPanel(props: {
    data: HistoricalPolygonData,
    setData: Dispatch<SetStateAction<HistoricalPolygonData>>,
}) {
    const setPolygonDatas = useContext(PolygonDatasDispatchContext);
    const [error, setError] = useState(false);
    const [errorDialogMessage, setErrorDialogMessage] = useState('' as string);
    const [showRename, setShowRename] = useState(false);
    const [name, setName] = useState("");

    function onSaveData() {
        const polygonData = props.data;
        let newItem = HistoricalPolygonData.fromJSON(polygonData);
        newItem.color = "black";
        newItem.name = name;
        setPolygonDatas({ type: 'add', payload: newItem });
        setShowRename(false);
        console.debug(`save button clicked`, polygonData);
    }

    function onSaveButtonPressed() {
        setShowRename(true);
        setName("未命名");
    }

    function onNameChange(event: React.ChangeEvent<HTMLInputElement>) {
        setName(event.target.value);
    }

    return (
        <Box>
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
                                        let newData = HistoricalPolygonData.fromJSON(currentData);
                                        newData.edgeLengths = newEdges;
                                        return newData;
                                    });
                                }}
                            />
                        </Grid>
                    ))}
                    <Grid item xs={3}>
                        <TextField
                            className="w-full"
                            type="number"
                            label="下连杆与前连杆初始角度"
                            value={props.data.angleBetweenFirstAndLastEdge}
                            onChange={(e) => props.setData(currentData => {
                                console.debug('updating angleBetweenFirstAndLastEdge');
                                let newData = HistoricalPolygonData.fromJSON(currentData);
                                newData.angleBetweenFirstAndLastEdge = parseFloat(e.target.value);
                                return newData;
                            })} />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            className="w-full"
                            type="number"
                            label="下连杆水平夹角"
                            value={props.data.edge0Angle}
                            onChange={(e) => props.setData(currentData => {
                                console.debug('updating edge0Angle');
                                let newData = HistoricalPolygonData.fromJSON(currentData);
                                newData.edge0Angle = parseFloat(e.target.value);
                                return newData;
                            })} />
                    </Grid>
                    <Grid item xs={6}>
                        <Button className="w-full" onClick={onSaveButtonPressed}>保存</Button>
                    </Grid>
                    <FormHelperText>{errorDialogMessage}</FormHelperText>
                </Grid>
            </FormControl >
            <Modal
                open={showRename}
                onClose={() => setShowRename(false)}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >
                <Box sx={{ ...style, width: 400 }} >
                    <TextField className='w-full' value={name} onChange={onNameChange} />
                    <Grid container>
                        <Grid item xs={6}>
                            <Button className='w-full' variant="outlined" color="error" onClick={() => setShowRename(false)}>取消</Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button className='w-full' variant="outlined" color="success" onClick={onSaveData}>确认</Button>
                        </Grid>
                    </Grid>
                </Box>
            </Modal>
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