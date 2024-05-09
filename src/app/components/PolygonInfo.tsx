import TextField from "@mui/material/TextField";
import { SetStateAction, useState, useContext } from "react";

import { Dispatch } from "react";
import { PolygonConstructionData } from "../logics/polygon-constructor";
import { Button } from "@mui/material";
import { PolygonDatasDispatchContext } from "@/context/polygondatas";
import { translateEdgeName } from "@/app/logics/helpers";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";


export default function PolygonInfoPanel(props: {
    data: PolygonConstructionData,
    setData: Dispatch<SetStateAction<PolygonConstructionData>>,
}) {
    const setPolygonDatas = useContext(PolygonDatasDispatchContext);
    const [error, setError] = useState(false);
    const [errorDialogMessage, setErrorDialogMessage] = useState('' as string);

    const errorSafeSetData = (newDataSupplier: () => any, fallback: any) => {
        try {
            const value = newDataSupplier();
            setError(false);
            setErrorDialogMessage('');
            return value;
        } catch (e: any) {
            setError(true);
            setErrorDialogMessage(e.message);
            return fallback;
        }
    };

    function onSaveData() {
        const polygonData = props.data;
        setPolygonDatas({ type: 'add', payload: polygonData });
        console.log(`save button clicked, data: ${JSON.stringify(polygonData)}`);
    }

    return (
        <FormControl sx={{ m: 3 }} error={error} variant="standard">
            {props.data.edgeLengths.map((edge, index) => (
                <TextField
                    type="number"
                    key={index}
                    label={`${translateEdgeName(index)}`}
                    value={edge}
                    onChange={(e) => {
                        props.setData(currentData => {
                            return errorSafeSetData(() => {
                                let newEdges = currentData.edgeLengths.map((value, i) => i === index ? parseInt(e.target.value) : value);
                                let newData = currentData.copy().withEdgeLengths(newEdges);
                                return newData;
                            }, currentData);
                        });
                    }}
                />
            ))}
            <TextField
                type="number"
                label="下连杆与前连杆角度"
                value={props.data.angleBetweenFirstAndLastEdge}
                onChange={(e) => props.setData(currentData => {
                    return errorSafeSetData(() => currentData.copy()
                        .withAngleBetweenFirstAndLastEdgeInDegree(parseInt(e.target.value)), currentData);
                })} />

            <Button onClick={() => { onSaveData(); }}>保存</Button>
            <FormHelperText>{errorDialogMessage}</FormHelperText>
        </FormControl >
    );
}

