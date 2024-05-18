import React, { useContext, Dispatch } from 'react';
import { Button, Card, CardHeader, CardActions, Switch, Modal, CardContent, Tooltip, TextField, Box, Grid, CardActionArea } from '@mui/material';
import { HistoricalPolygonData } from '@/context/polygondatas';
import { PolygonDatasDispatchContext } from '@/context/polygondatas';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { PolygonConstructionData } from '../logics/polygon-constructor';
import { PolygonComparator } from '../logics/similarity-calculator';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';

const COLORS = [{ name: "黑色", value: "black" }, { name: "红色", value: "red" }, { name: "绿色", value: "green" }, { name: "蓝色", value: "blue" }, { name: "黄色", value: "yellow" }];
export function HistoricalPolygonConstructionDataInfo(props: { polygonData: HistoricalPolygonData, currentPolygonData: HistoricalPolygonData, setCurrentPolygonData: Dispatch<HistoricalPolygonData>; }) {
    const [showRename, setShowRename] = React.useState(false);
    const onEdit = () => {
        props.setCurrentPolygonData(props.polygonData);
        props.polygonData.show = false;
        dispatchPolygonDatas({ type: 'update', payload: props.polygonData });

    };
    const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.polygonData.name = event.target.value;
        dispatchPolygonDatas({ type: 'update', payload: props.polygonData });
    };
    const dispatchPolygonDatas = useContext(PolygonDatasDispatchContext);
    return (
        <Box>
            <Card key={props.polygonData.uid} className='bg-gray-300'>
                <CardHeader title={`${props.polygonData.name}`} action={
                    <Grid>
                        <Tooltip title="修改" placement="top">
                            <IconButton onClick={onEdit}>
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="删除该记录" placement="top">
                            <IconButton onClick={() => dispatchPolygonDatas({ type: 'remove', payload: props.polygonData })}>
                                <CloseIcon />
                            </IconButton>
                        </Tooltip>
                    </Grid>
                }></CardHeader>
                <CardContent>
                    换手距离 {new PolygonComparator(props.currentPolygonData, props.polygonData).getHandsOffDistance().toFixed(2)}
                </CardContent>
                <CardActions>
                    <FormControl>
                        <InputLabel id="demo-simple-select-autowidth-label">颜色</InputLabel>
                        <Select
                            labelId="demo-simple-select-autowidth-label"
                            id="demo-simple-select-autowidth"
                            value={props.polygonData.color}
                            onChange={(event: SelectChangeEvent) => {
                                props.polygonData.color = event.target.value;
                                dispatchPolygonDatas({ type: 'update', payload: props.polygonData });
                            }}
                            autoWidth
                            label="颜色"
                        >
                            {
                                COLORS.map((color, index) => (
                                    <MenuItem key={index} value={color.value}>{color.name}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>

                    <Tooltip title="显示/隐藏" placement="top">
                        <Switch onChange={(show) => {
                            if (show.target.checked) {
                                dispatchPolygonDatas({ type: 'show', payload: props.polygonData });
                            } else {
                                dispatchPolygonDatas({ type: 'hide', payload: props.polygonData });
                            }
                        }}
                            checked={props.polygonData.show}
                        >
                        </Switch>
                    </Tooltip>
                </CardActions>

            </Card>
            <Modal
                open={showRename}
                onClose={() => setShowRename(false)}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >
                <Box sx={{ ...style, width: 400 }}>
                    <TextField className='w-full' value={props.polygonData.name} onChange={onNameChange} />
                    {/* <Grid container>
                        <Grid item xs={6}>
                            <Button className='w-full' variant="outlined" color="error" onClick={() => {
                                // Set the name of polygonData from the textfield
                            }}>取消</Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button className='w-full' variant="outlined" color="success" onClick={() => {
                                // Set the name of polygonData from the textfield
                            }}>确认</Button>
                        </Grid>
                    </Grid> */}
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