import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import Swal from 'sweetalert2'
import S3 from 'react-aws-s3';
import axios from 'axios'

import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';

import { apiGet, apiPutForm, apiPostForm } from '../../../../functions/api'
import { URL_DEV } from '../../../../constants'
import { setSingleHeader } from '../../../../functions/routers'

import CarruselAdjuntos from './CarruselAdjuntos'
import './../../../../styles/_adjuntosVehiculos.scss'

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
        height: 650,
        maxHeight: 800,
        width: '100%',
    },
    tabs: {
        borderRight: `1px solid ${theme.palette.divider}`,

    },
}));

export default function Adjuntos(props) {

    const { vehiculo, operador } = props
    const authUser = useSelector(state => state.authUser.access_token)
    const classes = useStyles();
    const [value, setValue] = useState(0);
    const [form, setForm] = useState({
        Licencia: [],
        Evidencia: [],
        descripcion: '',
        file: [],
    })
    const [activeTab, setActiveTab] = useState('Licencia')
    const [adjuntos, setAdjuntos] = useState(false)
    useEffect(() => {
        Swal.fire({
            title: 'Cargando...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading()
            }
        })
        getAdjuntos()
    }, [])

    const handleChange = (event, newValue) => {
        setValue(newValue);
        setForm({
            ...form,
            file: []
        })
    };

    const handleChangeComentarios = (e) => { 
        setForm({
            ...form,
            descripcion: e.target.value
        })
    }

    const getAdjuntos = () => {
        try {
            apiGet(`servicios/adjuntos/${operador.id}`, authUser)
                .then(res => {
                    let adjunAux = res.data.vehiculos.adjuntos
                    Swal.close()
                    let aux = {
                        Licencia: [],
                        Evidencia: [],
                        descripcion: adjunAux.descripcion
                    }
                    adjunAux.forEach((element) => {
                        switch (element.pivot.tipo) {
                            case 'Licencia':
                                aux.Licencia = [...aux.Licencia, element]
                                break;
                            case 'Evidencia':
                                aux.Evidencia = [...aux.Evidencia, element]
                                break;
                                case 'descripcion':
                                aux.descripcion = [...aux.descripcion, element]
                                break;
                            default:
                                break;
                        }
                    });
                    setAdjuntos(aux)
                })

        } catch (error) {
            Swal.close()
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Algo salio mal!',
            })
        }
    }

    const handleTab = (e) => {
        setActiveTab(e)
    }

    const handleFile = (e) => {
        setForm({
            ...form,
            file: [...e.target.files]
        })
    }

    const validate = () => {
        if (activeTab && form.file.length > 0) {
            return true
        } else {
            return false
        }
    }

    const resetForm = () => {
        setForm({
            ...form,
            file: []
        })
    }


    const handleSubmit = (e) => {
        e.preventDefault()

        if (validate()) {
            Swal.fire({
                title: 'Subiendo archivo...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading()
                }
            })
            let data = new FormData()

            data.append(`files_vehiculos[]`, form.file[0])
            data.append('tipo', activeTab)
            data.append('descripcion', activeTab)
            data.append('descripcion', form.descripcion)

            try {
                apiPostForm(`servicios/${operador.id}/adjuntos/s3`, data, authUser)
                    .then(res => {
                        Swal.close()
                        getAdjuntos()
                        Swal.fire({
                            icon: 'success',
                            title: 'Archivo subido correctamente',
                            showConfirmButton: false,
                            timer: 1500
                        })
                        resetForm()
                    })
                    .catch(err => {
                        Swal.close()
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Algo salio mal!',
                        })
                    })
            } catch (error) {
                Swal.close()
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Algo salio mal!',
                })
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Debe seleccionar un archivo',
                showConfirmButton: false,
                timer: 1500
            })
        }
    }



    const uploadButtons = () => {
        return (
            // <div>
            //     <div className='upload_buttons'>
            //         <div className="file">

            //             <label htmlFor="file">Seleccionar archivo(s)</label>
            //             <input type="file" id="file" name="file" onChange={handleFile} />
            //             <div>
            //                 {form.file.length > 0 ?
            //                     form.file.length < 3 ?
            //                         <div className="selected_file">
            //                             {
            //                                 form.file.map((file, index) => {
            //                                     return <div><span className="delete_file" onClick={e => resetForm()}>X</span><span key={index}>{file.name}</span></div>
            //                                 })
            //                             }
            //                         </div>
            //                         :
            //                         <div className="selected_file">
            //                             <span>{`${form.file.length} archivos seleccionados`}</span>
            //                         </div>
            //                     : <span className="not_file">No hay archivo seleccionado</span>}
            //             </div>

            //         </div>
            //         <div >
            //             <button className="btn-subir" onClick={handleSubmit} >Subir</button>
            //         </div>
            //     </div>
            // </div>

            <div>
                <div className='adjust_buttons'>
                    <div className="file_buttons file">

                        <label htmlFor="file">Seleccionar archivo(s)</label>
                        <input type="file" id="file" name="file" onChange={handleFile} />
                      
                        <div>
                            {form.file.length > 0 ?
                                form.file.length < 3 ?
                                    <>
                                        <div className="selected_file">
                                        {
                                            form.file.map((file, index) => {
                                                return <div><span className="delete_file" onClick={e => resetForm()}>X</span><span key={index}>{file.name}</span></div>
                                            })
                                        }
                                        
                                        </div>
                                    </>
                                    
                                    :
                                    <div className="selected_file">
                                        <span>{`${form.file.length} archivos seleccionados`}</span>
                                        
                                    </div>
                                : <span className="not_file">No hay archivo seleccionado</span>}
                        </div>
                    </div>

                    <div>
                        {activeTab === 'Evidencia' && form.file.length > 0 ?
                            form.file.length < 3 ?
                                <>
                                    <div className={classes.comentario}>
                                        <TextField
                                        id="standard-multiline-static"
                                        label="Comentarios"
                                        name="descripcion"
                                        multiline
                                        rows={4}
                                        onChange={handleChangeComentarios}
                                        defaultValue={form.descripcion}
                                    />
                                    </div>
                                </>
                                
                                :
                                <div className="selected_file">
                                    <span>{`${form.file.length} archivos seleccionados`}</span>
                                    
                                </div>
                            : null}
                    </div>
                </div>

                <div className='adjuntos-subir'>
                    <button className="btn-subir" onClick={handleSubmit} >Subir</button>
                </div>

            </div>
            
        )
    }

    const viewAdjuntos = (tab) => {
        return (
            <>
                {
                    adjuntos && adjuntos[tab] && adjuntos[tab].length > 0 ?
                        <CarruselAdjuntos data={adjuntos[tab]} id={operador.id} getAdjuntos={getAdjuntos} />
                        :
                        <div className="not_adjuntos">
                            <span>No hay archivos adjuntos</span>
                        </div>
                }
            </>
        )
    }

    return (
        <>
            <div className={classes.root}>
                <Tabs
                    orientation="vertical"
                    variant="scrollable"
                    value={value}
                    onChange={handleChange}
                    className={classes.tabs}
                >
                    <Tab label="Licencia " {...a11yProps(0)} name="licencia" onClick={() => handleTab('Licencia')} />
                    <Tab label="Evidencia" {...a11yProps(1)} name="evidencia" onClick={() => handleTab('Evidencia')} />
                </Tabs>

                <TabPanel value={value} index={0}>
                    <div>
                        {uploadButtons('Licencia')}
                        {viewAdjuntos('Licencia')}
                    </div>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <div>
                        {uploadButtons('Evidencia')}
                        {viewAdjuntos('Evidencia')}
                    </div>
                </TabPanel>
            </div>
        </>
    )
}