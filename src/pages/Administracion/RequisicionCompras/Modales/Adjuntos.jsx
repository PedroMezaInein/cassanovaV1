import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import Swal from 'sweetalert2'

import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';


import { apiPutForm, apiGet, apiPostForm } from '../../../../functions/api'
import CarruselAdjuntos from './CarruselAdjuntos'


import './../../../../styles/_adjuntosRequisicion.scss'

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
        height: 550,
        width: '100%',
    },
    tabs: {
        borderRight: `1px solid ${theme.palette.divider}`,
        
    },
}));

export default function Adjuntos(props) {
    const { data, nuevaRequisicion } = props
    console.log('data', data)
    const authUser = useSelector(state => state.authUser.access_token)
    const classes = useStyles();
    const [value, setValue] = useState(0);
    const [form, setForm] = useState({
        Ficha_tecnica: '',
        Solicitud: '',
        Cotizaciones: '',
        Orden_compra: '',
        Comprobante_pago: '',
        Factura: '',
    })
    const [activeTab, setActiveTab] = useState('Ficha_tecnica')
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
        console.log('newvalue', event) 
        setValue(newValue);
    };

    const getAdjuntos = () => {
        try {
            apiGet(`requisicion/adjuntos/${props.data.id}`, authUser)
                .then(res => {
                    let adjunAux = res.data.data.adjuntos
                    Swal.close()
                    let aux = {
                        Ficha_tecnica: [],
                        Solicitud: [],
                        Cotizaciones: [],
                        Orden_compra: [],
                        Comprobante_pago: [],
                        Factura: [],
                    }
                    adjunAux.forEach((element) => {
                        switch (element.pivot.nombre) {
                            case 'Ficha_tecnica':
                                aux.Ficha_tecnica.push(element)
                                break;
                            case 'Solicitud':
                                aux.Solicitud.push(element)
                                break;
                            case 'Cotizaciones':
                                aux.Cotizaciones.push(element)
                                break;
                            case 'Orden_compra':
                                aux.Orden_compra.push(element)
                                break;
                            case 'Comprobante_pago':
                                aux.Comprobante_pago.push(element)
                                break;
                            case 'Factura':
                                aux.Factura.push(element)
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

            console.log('error', error)
        }
    }

    const handleTab = (e) => {
        console.log('tab', e)
        setActiveTab(e)
    }

    const handleFile = (e) => {
        setForm({
            ...form,
            [activeTab]: [e.target.files[0]]
        })
    }

    const validate = () => {
        if (activeTab && form[activeTab] !== '') {
            return true
        } else {
            return false
        }
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
            let data = new FormData();
            let aux = Object.keys(form)

            /* aux.forEach((element) => {
                switch (element) {
                    case 'adjuntos':
                        break;
                    default:
                        data.append(element, form[element])
                        break
                }
            }) */

            data.append(`files_name_requisicion[]`, form[activeTab][0].name)
            data.append(`files_requisicion[]`, form[activeTab][0])
            data.append('adjuntos[]', "requisicion")
            data.append('tipo', activeTab)
            

            try {
                apiPostForm(`requisicion/${props.data.id}/archivos/s3`, data, authUser)
                    .then(res => {
                        Swal.close()
                        Swal.fire({
                            icon: 'success',
                            title: 'Adjunto guardado',
                            showConfirmButton: false,
                            timer: 1500
                        })
                        getAdjuntos()

                        console.log('res', res)
                        if (res.status === 200) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Adjunto guardado',
                                showConfirmButton: false,
                                timer: 1500
                            })
                        }
                    })
                    .catch(err => {
                        Swal.close()
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Algo salio mal!',
                        })
                        console.log('err', err)
                    })
            } catch (error) {
                Swal.close()
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Algo salio mal!',
                })
                console.log('error', error)
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

    console.log('adjuntos', adjuntos)

    return (
        <>
            <div className={classes.root}>
                <Tabs
                    orientation="vertical"
                    variant="fullWidth"

                    value={value}
                    onChange={handleChange}
                    aria-label="Vertical tabs example"
                    className={classes.tabs}
                >
                    <Tab label="Comunicado" {...a11yProps(0)} name="ficha_tecnica" onClick={() => handleTab('ficha_tecnica')} />
                    {nuevaRequisicion ? null : <Tab label="Solicitud" {...a11yProps(1)} name="solicitud" onClick={() => handleTab('Solicitud')} />}
                    {nuevaRequisicion ? null : <Tab label="Cotizaciones" {...a11yProps(2)} name="cotizaciones" onClick={() => handleTab('Cotizaciones')} />}
                    {nuevaRequisicion ? null : <Tab label="Orden de compra" {...a11yProps(3)} name="orden_compra" onClick={() => handleTab('Orden_compra')} />}
                    
                </Tabs>

                <TabPanel value={value} index={0}>
                    <div>
                        <div className='adjuntos_send'>
                            <div className="file">

                                <label htmlFor="file">Selecciona el Comunicado</label>
                                <input type="file" id="file" name="file" onChange={handleFile} arial-label="Seleccionar Comunicado" />
                                <div>
                                    {form.Ficha_tecnica && form.Ficha_tecnica.length > 0 ? <p>{form.Ficha_tecnica[0].name}</p> : <p>No hay archivo seleccionado</p>}
                                </div>

                            </div>
                            <div>
                                <button className='sendButton' onClick={handleSubmit}>Subir</button>
                            </div>
                        </div>
                        {
                            adjuntos  && adjuntos.Ficha_tecnica && adjuntos.Ficha_tecnica.length > 0 ?
                                <CarruselAdjuntos data={adjuntos.Ficha_tecnica} id={data.id} getAdjuntos={getAdjuntos} />
                                :
                                <div className="adjuntos_aviso">
                                    <p>No hay archivos adjuntos</p>
                                </div>
                        }
                        

                    </div>
                </TabPanel>

                <TabPanel value={value} index={1}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div>
                            <div className="send-comunicado file">

                                <label htmlFor="file">Selecciona la solicitud</label>
                                <input type="file" id="file" name="file" onChange={handleFile} arial-label="Seleccionar Comunicado" />
                                <div>
                                    {form.Solicitud && form.Solicitud.length > 0 ? <p>{form.Solicitud[0].name}</p> : <p>No hay archivo seleccionado</p>}
                                </div>

                            </div>
                            <div className="btn-subir">
                                <button onClick={handleSubmit}>Subir</button>
                            </div>
                        </div>
                        {
                            adjuntos && adjuntos.Solicitud && adjuntos.Solicitud.length > 0 ?
                                <CarruselAdjuntos data={adjuntos.Solicitud} id={data.id} getAdjuntos={getAdjuntos} />
                                :
                                <div className="no-adjuntos">
                                    <p>No hay archivos adjuntos</p>
                                </div>
                        }
                    </div>
                </TabPanel>

                <TabPanel value={value} index={2}>
                    <div>
                        <div>
                            <div className="send-comunicado file">

                                <label htmlFor="file">Selecciona la cotizacion</label>
                                <input type="file" id="file" name="file" onChange={handleFile} arial-label="Seleccionar Comunicado" />
                                <div>
                                    {form.Cotizaciones && form.Cotizaciones.length > 0 ? <p>{form.Cotizaciones[0].name}</p> : <p>No hay archivo seleccionado</p>}
                                </div>

                            </div>
                            <div className="btn-subir">
                                <button onClick={handleSubmit}>Subir</button>
                            </div>
                        </div>
                        {
                            adjuntos && adjuntos.Cotizaciones && adjuntos.Cotizaciones.length > 0 ?
                                <CarruselAdjuntos data={adjuntos.Cotizaciones} id={data.id} getAdjuntos={getAdjuntos} />
                                :
                                <div className="no-adjuntos">
                                    <p>No hay archivos adjuntos</p>
                                </div>
                        }
                    </div>
                </TabPanel>

                <TabPanel value={value} index={3}>
                    <div>
                        <div>
                            <div className="send-comunicado file">

                                <label htmlFor="file">Selecciona la Orden de Compra</label>
                                <input type="file" id="file" name="file" onChange={handleFile} arial-label="Seleccionar Comunicado" />
                                <div>
                                    {form.Orden_compra && form.Orden_compra.length > 0 ? <p>{form.Orden_compra[0].name}</p> : <p>No hay archivo seleccionado</p>}
                                </div>

                            </div>
                            <div className="btn-subir">
                                <button onClick={handleSubmit}>Subir</button>
                            </div>
                        </div>
                        {
                            adjuntos && adjuntos.Orden_compra && adjuntos.Orden_compra.length > 0 ?
                                <CarruselAdjuntos data={adjuntos.Orden_compra} id={data.id} getAdjuntos={getAdjuntos} />
                                :
                                <div className="no-adjuntos">
                                    <p>No hay archivos adjuntos</p>
                                </div>
                        }
                    </div>
                </TabPanel>

                <TabPanel value={value} index={4}>
                    <div>
                        <div>
                            <div className="send-comunicado file">

                                <label htmlFor="file">Selecciona el Comprobante de pago</label>
                                <input type="file" id="file" name="file" onChange={handleFile} arial-label="Seleccionar Comunicado" />
                                <div>
                                    {form.Comprobante_pago && form.Comprobante_pago.length > 0 ? <p>{form.Comprobante_pago[0].name}</p> : <p>No hay archivo seleccionado</p>}
                                </div>

                            </div>
                            <div className="btn-subir">
                                <butto onClick={handleSubmit}>Subir</butto>
                            </div>
                        </div>
                        {
                            adjuntos && adjuntos.Comprobante_pago && adjuntos.Comprobante_pago.length > 0 ?
                                <CarruselAdjuntos data={adjuntos.Comprobante_pago} id={data.id} getAdjuntos={getAdjuntos} />
                                :
                                <div className="no-adjuntos">
                                    <p>No hay archivos adjuntos</p>
                                </div>
                        }
                    </div>
                </TabPanel>

                <TabPanel value={value} index={5}>
                    <div>
                        <div>
                            <div className="send-comunicado file">

                                <label htmlFor="file">Selecciona la Factura</label>
                                <input type="file" id="file" name="file" onChange={handleFile} arial-label="Seleccionar Comunicado" />
                                <div>
                                    {form.Factura && form.Factura.length > 0 ? <p>{form.Factura[0].name}</p> : <p>No hay archivo seleccionado</p>}
                                </div>

                            </div>
                            <div className="btn-subir">
                                <button onClick={handleSubmit}>Subir</button>
                            </div>
                        </div>
                        {
                            adjuntos && adjuntos.Factura && adjuntos.Factura.length > 0 ?
                                <CarruselAdjuntos data={adjuntos.Factura} id={data.id} getAdjuntos={getAdjuntos} />
                                :
                                <div className="no-adjuntos">
                                    <p>No hay archivos adjuntos</p>
                                </div>
                        }
                    </div>
                </TabPanel>
            </div>
        </>
    )
}