import { Polygon } from "@/app/logics/polygon";
import { Vector2 } from "@/app/logics/vector2";
import TextField from "@mui/material/TextField";
import { SetStateAction, useEffect, useState } from "react";

import { Dispatch } from "react";
import { RotationalCentersAnalyzer } from "../logics/rotation-center-arc";
import { PolygonConstructionData, PolygonConstructor } from "../logics/polygon-constructor";

export default function PolygonInfoPanel(props: {
    data: PolygonConstructionData,
    setData: Dispatch<SetStateAction<PolygonConstructionData>>,
}) {

    const [polygon, setPolygon] = useState<Polygon>(new Polygon([]));
    useEffect(() => {
        if (props.data.edgeLengths.length !== 4) return;
        const polygon = new PolygonConstructor(props.data)
            .constructPolygon();
        setPolygon(polygon);
    }, [props.data]);
    return (<div>
        <div>
            {props.data.edgeLengths.map((edge, index) => (
                <TextField
                    type="number"
                    key={index}
                    label={`边 ${index}`}
                    value={edge}
                    onChange={(e) => {
                        props.setData(currentData => {
                            let newEdges = currentData.edgeLengths.map((value, i) => i === index ? parseInt(e.target.value) : value);
                            let newData = structuredClone(currentData)
                                .withEdgeLengths(newEdges);
                            return newData
                        });
                    }}
                />
            ))}</div>
        <div>
            <TextField
                type="number"
                label="角度 ∠0,3"
                value={props.data.angleBetweenFirstAndLastEdge}
                onChange={(e) => props.setData(currentData => {
                    return structuredClone(currentData)
                        .withAngleBetweenFirstAndLastEdgeInDegree(parseInt(e.target.value))
                })} />

            <TextField
                type="number"
                label="边1角度"
                value={props.data.edge0Angle}
                onChange={(e) => props.setData(currentData => {
                    return structuredClone(currentData)
                        .withEdge0AngleDegree(parseInt(e.target.value))
                })} />
            <TextField
                label="转动中心"
                value={() => {
                    if (polygon.vertices.length !== 4) return "";
                    else
                        return JSON.stringify(new RotationalCentersAnalyzer(props.data).findRotationalCenters());
                }
                }
                multiline
                rows={4}
                hidden={polygon.vertices.length !== 4}
                InputProps={{
                    readOnly: true,
                }} />
        </div>

    </div>);
}

