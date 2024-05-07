import { Polygon } from "@/app/logics/polygon";
import TextField from "@mui/material/TextField";
import { SetStateAction, useEffect, useState, useContext } from "react";

import { Dispatch } from "react";
import { RotationalCentersAnalyzer } from "../logics/rotation-center-arc";
import { PolygonConstructionData, PolygonConstructor } from "../logics/polygon-constructor";
import { Box, Button } from "@mui/material";
import { PolygonDatasDispatchContext } from "@/context/polygondatas";


export default function PolygonInfoPanel(props: {
    data: PolygonConstructionData,
    setData: Dispatch<SetStateAction<PolygonConstructionData>>,
}) {
    const setPolygonDatas = useContext(PolygonDatasDispatchContext);
    const [polygon, setPolygon] = useState<Polygon>(new Polygon([]));
    useEffect(() => {
        if (props.data.edgeLengths.length !== 4) return;
        const polygon = new PolygonConstructor(props.data)
            .constructPolygon();
        setPolygon(polygon);
    }, [props.data]);

    function onSaveData() {
        const polygonData = props.data;
        setPolygonDatas({ type: 'add', payload: polygonData });
    }

    return (
        <Box>
            <Box>
                {props.data.edgeLengths.map((edge, index) => (
                    <TextField
                        type="number"
                        key={index}
                        label={`边 ${index}`}
                        value={edge}
                        onChange={(e) => {
                            props.setData(currentData => {
                                let newEdges = currentData.edgeLengths.map((value, i) => i === index ? parseInt(e.target.value) : value);
                                let newData = currentData.copy().withEdgeLengths(newEdges);
                                return newData;
                            });
                        }}
                    />
                ))}</Box>
            <Box>
                <TextField
                    type="number"
                    label="角度 ∠0,3"
                    value={props.data.angleBetweenFirstAndLastEdge}
                    onChange={(e) => props.setData(currentData => {
                        return currentData.copy()
                            .withAngleBetweenFirstAndLastEdgeInDegree(parseInt(e.target.value));
                    })} />

                <TextField
                    type="number"
                    label="边1角度"
                    value={props.data.edge0Angle}
                    onChange={(e) => props.setData(currentData => {
                        return currentData.copy()
                            .withEdge0AngleDegree(parseInt(e.target.value));
                    })} />
                <TextField
                    label="转动中心"
                    value={JSON.stringify(new RotationalCentersAnalyzer(props.data).findRotationalCenters())
                    }
                    multiline
                    rows={4}
                    hidden={polygon.vertices.length !== 4}
                    InputProps={{
                        readOnly: true,
                    }} />
                <Button onClick={() => { onSaveData(); }}>保存</Button>
            </Box>

        </Box>
    );
}

