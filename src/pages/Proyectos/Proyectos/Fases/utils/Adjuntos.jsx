import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import Swal from 'sweetalert2'

import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import { apiGet, apiPostForm } from './../../../../../functions/api'

import CarruselAdjuntos from './CarruselAdjuntos'

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

    const { proyecto} = props
    const authUser = useSelector(state => state.authUser.access_token)
    const classes = useStyles();
    const [value, setValue] = useState(0);
    const [form, setForm] = useState({
        fotografias_levantamiento: '',
        manuales_de_adaptacion: '',
        minutas: '',
        planos_entregados_por_cliente: '',
        propuestas_arquitectonicas_preliminares: '',
        referencias_del_diseño_del_proyecto: '',
        renders: '',
        sketch_up: '',
        presupuestos_preliminares: '',
        recibos_pago: '',
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
            apiGet(`v2/proyectos/proyectos/proyecto/${proyecto.id}/adjuntos`, authUser)
                .then(res => {
                    console.log('adjuntos', res)
                    Swal.close()
                   /*  let aux = {
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
                    setAdjuntos(aux) */
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
            /* let data = new FormData();
            let aux = Object.keys(form) */

            /* aux.forEach((element) => {
                switch (element) {
                    case 'adjuntos':
                        break;
                    default:
                        data.append(element, form[element])
                        break
                }
            }) */

            /* data.append(`files_name_requisicion[]`, form[activeTab][0].name)
            data.append(`files_requisicion[]`, form[activeTab][0])
            data.append('adjuntos[]', "requisicion")
            data.append('tipo', activeTab) */


            try {
                /* apiPostForm(`requisicion/${props.data.id}/archivos/s3`, data, authUser)
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
                    }) */
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
                    <Tab label="Fotografías levantamiento" {...a11yProps(0)} name="fotografias_levantamiento" onClick={() => handleTab('fotografias_levantamiento')} />
                    <Tab label="Manuales de adaptación" {...a11yProps(1)} name="manuales_de_adaptacion" onClick={() => handleTab('manuales_de_adaptacion')} />
                    <Tab label="Minutas" {...a11yProps(2)} name="minutas" onClick={() => handleTab('minutas')} />
                    <Tab label="Planos entregados por cliente" {...a11yProps(3)} name="planos_entregados_por_cliente" onClick={() => handleTab('planos_entregados_por_cliente')} />
                    <Tab label="Propuestas arquitectónicas preliminares" {...a11yProps(4)} name="propuestas_arquitectonicas_preliminares" onClick={() => handleTab('propuestas_arquitectonicas_preliminares')} />
                    <Tab label="Referencias del diseño del proyecto" {...a11yProps(5)} name="referencias_del_diseño_del_proyecto" onClick={() => handleTab('referencias_del_diseño_del_proyecto')} />
                    <Tab label="Renders" {...a11yProps(6)} name="renders" onClick={() => handleTab('renders')} />
                    <Tab label="Sketch Up" {...a11yProps(7)} name="sketch_up" onClick={() => handleTab('sketch_up')} />
                    <Tab label="Presupuestos preliminares" {...a11yProps(8)} name="presupuestos_preliminares" onClick={() => handleTab('presupuestos_preliminares')} />
                    <Tab label="Recibos de pago" {...a11yProps(9)} name="recibos_pago" onClick={() => handleTab('recibos_pago')} />
                </Tabs>

                <TabPanel value={value} index={0}>
                    <div>
                        <div>
                            <div className="file">

                                <label htmlFor="file">Seleccionar archivo(s)</label>
                                <input type="file" id="file" name="file" onChange={handleFile} arial-label="Seleccionar Comunicado" />
                                <div>
                                    {form.fotografias_levantamiento && form.fotografias_levantamiento.length > 0 ? <p>{form.fotografias_levantamiento[0].name}</p> : <p>No hay archivo seleccionado</p>}
                                </div>

                            </div>
                            <div className="btn-subir">
                                <button onClick={handleSubmit}>Subir</button>
                            </div>
                        </div>
                        {
                            adjuntos && adjuntos.fotografias_levantamiento && adjuntos.fotografias_levantamiento.length > 0 ?
                                <CarruselAdjuntos data={adjuntos.fotografias_levantamiento} id={data.id} getAdjuntos={getAdjuntos} />
                                :
                                <div className="">
                                    <p>No hay archivos adjuntos</p>
                                </div>
                        }
                    </div>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <div>
                        <div>
                            <div className="file">

                                <label htmlFor="file">Seleccionar archivo(s)</label>
                                <input type="file" id="file" name="file" onChange={handleFile} arial-label="Seleccionar Comunicado" />
                                <div>
                                    {form.manuales_de_adaptacion && form.manuales_de_adaptacion.length > 0 ? <p>{form.manuales_de_adaptacion[0].name}</p> : <p>No hay archivo seleccionado</p>}
                                </div>

                            </div>
                            <div className="btn-subir">
                                <button onClick={handleSubmit}>Subir</button>
                            </div>
                        </div>
                        {
                            adjuntos && adjuntos.manuales_de_adaptacion && adjuntos.manuales_de_adaptacion.length > 0 ?
                                <CarruselAdjuntos data={adjuntos.manuales_de_adaptacion} id={data.id} getAdjuntos={getAdjuntos} />
                                :
                                <div className="">
                                    <p>No hay archivos adjuntos</p>
                                </div>
                        }
                    </div>
                </TabPanel>
                <TabPanel value={value} index={2}>
                    <div>
                        <div>
                            <div className="file">

                                <label htmlFor="file">Seleccionar archivo(s)</label>
                                <input type="file" id="file" name="file" onChange={handleFile} arial-label="Seleccionar Comunicado" />
                                <div>
                                    {form.minutas && form.minutas.length > 0 ? <p>{form.minutas[0].name}</p> : <p>No hay archivo seleccionado</p>}
                                </div>

                            </div>
                            <div className="btn-subir">
                                <button onClick={handleSubmit}>Subir</button>
                            </div>
                        </div>
                        {
                            adjuntos && adjuntos.minutas && adjuntos.minutas.length > 0 ?
                                <CarruselAdjuntos data={adjuntos.minutas} id={data.id} getAdjuntos={getAdjuntos} />
                                :
                                <div className="">
                                    <p>No hay archivos adjuntos</p>
                                </div>
                        }
                    </div>
                </TabPanel>
                <TabPanel value={value} index={3}>
                    <div>
                        <div>
                            <div className="file">

                                <label htmlFor="file">Seleccionar archivo(s)</label>
                                <input type="file" id="file" name="file" onChange={handleFile} arial-label="Seleccionar Comunicado" />
                                <div>
                                    {form.planos_entregados_por_cliente && form.planos_entregados_por_cliente.length > 0 ? <p>{form.planos_entregados_por_cliente[0].name}</p> : <p>No hay archivo seleccionado</p>}
                                </div>

                            </div>
                            <div className="btn-subir">
                                <button onClick={handleSubmit}>Subir</button>
                            </div>
                        </div>
                        {
                            adjuntos && adjuntos.planos_entregados_por_cliente && adjuntos.planos_entregados_por_cliente.length > 0 ?
                                <CarruselAdjuntos data={adjuntos.planos_entregados_por_cliente} id={data.id} getAdjuntos={getAdjuntos} />
                                :
                                <div className="">
                                    <p>No hay archivos adjuntos</p>
                                </div>
                        }
                    </div>
                </TabPanel>
                <TabPanel value={value} index={4}>
                    <div>
                        <div>
                            <div className="file">

                                <label htmlFor="file">Seleccionar archivo(s)</label>
                                <input type="file" id="file" name="file" onChange={handleFile} arial-label="Seleccionar Comunicado" />
                                <div>
                                    {form.propuestas_arquitectonicas_preliminares && form.propuestas_arquitectonicas_preliminares.length > 0 ? <p>{form.propuestas_arquitectonicas_preliminares[0].name}</p> : <p>No hay archivo seleccionado</p>}
                                </div>

                            </div>
                            <div className="btn-subir">
                                <button onClick={handleSubmit}>Subir</button>
                            </div>
                        </div>
                        {
                            adjuntos && adjuntos.propuestas_arquitectonicas_preliminares && adjuntos.propuestas_arquitectonicas_preliminares.length > 0 ?
                                <CarruselAdjuntos data={adjuntos.propuestas_arquitectonicas_preliminares} id={data.id} getAdjuntos={getAdjuntos} />
                                :
                                <div className="">
                                    <p>No hay archivos adjuntos</p>
                                </div>
                        }
                    </div>
                </TabPanel>
                <TabPanel value={value} index={5}>
                    <div>
                        <div>
                            <div className="file">

                                <label htmlFor="file">Seleccionar archivo(s)</label>
                                <input type="file" id="file" name="file" onChange={handleFile} arial-label="Seleccionar Comunicado" />
                                <div>
                                    {form.referencias_del_diseño_del_proyecto && form.referencias_del_diseño_del_proyecto.length > 0 ? <p>{form.referencias_del_diseño_del_proyecto[0].name}</p> : <p>No hay archivo seleccionado</p>}
                                </div>

                            </div>
                            <div className="btn-subir">
                                <button onClick={handleSubmit}>Subir</button>
                            </div>
                        </div>
                        {
                            adjuntos && adjuntos.referencias_del_diseño_del_proyecto && adjuntos.referencias_del_diseño_del_proyecto.length > 0 ?
                                <CarruselAdjuntos data={adjuntos.referencias_del_diseño_del_proyecto} id={data.id} getAdjuntos={getAdjuntos} />
                                :
                                <div className="">
                                    <p>No hay archivos adjuntos</p>
                                </div>
                        }
                    </div>
                </TabPanel>
                <TabPanel value={value} index={6}>
                    <div>
                        <div>
                            <div className="file">

                                <label htmlFor="file">Seleccionar archivo(s)</label>
                                <input type="file" id="file" name="file" onChange={handleFile} arial-label="Seleccionar Comunicado" />
                                <div>
                                    {form.renders && form.renders.length > 0 ? <p>{form.renders[0].name}</p> : <p>No hay archivo seleccionado</p>}
                                </div>

                            </div>
                            <div className="btn-subir">
                                <button onClick={handleSubmit}>Subir</button>
                            </div>
                        </div>
                        {
                            adjuntos && adjuntos.renders && adjuntos.renders.length > 0 ?
                                <CarruselAdjuntos data={adjuntos.renders} id={data.id} getAdjuntos={getAdjuntos} />
                                :
                                <div className="">
                                    <p>No hay archivos adjuntos</p>
                                </div>
                        }
                    </div>
                </TabPanel>
                <TabPanel value={value} index={7}>
                    <div>
                        <div>
                            <div className="file">

                                <label htmlFor="file">Seleccionar archivo(s)</label>
                                <input type="file" id="file" name="file" onChange={handleFile} arial-label="Seleccionar Comunicado" />
                                <div>
                                    {form.sketch_up && form.sketch_up.length > 0 ? <p>{form.sketch_up[0].name}</p> : <p>No hay archivo seleccionado</p>}
                                </div>

                            </div>
                            <div className="btn-subir">
                                <button onClick={handleSubmit}>Subir</button>
                            </div>
                        </div>
                        {
                            adjuntos && adjuntos.sketch_up && adjuntos.sketch_up.length > 0 ?
                                <CarruselAdjuntos data={adjuntos.sketch_up} id={data.id} getAdjuntos={getAdjuntos} />
                                :
                                <div className="">
                                    <p>No hay archivos adjuntos</p>
                                </div>
                        }
                    </div>
                </TabPanel>
                <TabPanel value={value} index={8}>
                    <div>
                        <div>
                            <div className="file">

                                <label htmlFor="file">Seleccionar archivo(s)</label>
                                <input type="file" id="file" name="file" onChange={handleFile} arial-label="Seleccionar Comunicado" />
                                <div>
                                    {form.presupuestos_preliminares && form.presupuestos_preliminares.length > 0 ? <p>{form.presupuestos_preliminares[0].name}</p> : <p>No hay archivo seleccionado</p>}
                                </div>

                            </div>
                            <div className="btn-subir">
                                <button onClick={handleSubmit}>Subir</button>
                            </div>
                        </div>
                        {
                            adjuntos && adjuntos.presupuestos_preliminares && adjuntos.presupuestos_preliminares.length > 0 ?
                                <CarruselAdjuntos data={adjuntos.presupuestos_preliminares} id={data.id} getAdjuntos={getAdjuntos} />
                                :
                                <div className="">
                                    <p>No hay archivos adjuntos</p>
                                </div>
                        }
                    </div>
                </TabPanel>
                <TabPanel value={value} index={9}>
                    <div>
                        <div>
                            <div className="file">

                                <label htmlFor="file">Seleccionar archivo(s)</label>
                                <input type="file" id="file" name="file" onChange={handleFile} arial-label="Seleccionar Comunicado" />
                                <div>
                                    {form.recibos_pago && form.recibos_pago.length > 0 ? <p>{form.recibos_pago[0].name}</p> : <p>No hay archivo seleccionado</p>}
                                </div>

                            </div>
                            <div className="btn-subir">
                                <button onClick={handleSubmit}>Subir</button>
                            </div>
                        </div>
                        {
                            adjuntos && adjuntos.recibos_pago && adjuntos.recibos_pago.length > 0 ?
                                <CarruselAdjuntos data={adjuntos.recibos_pago} id={data.id} getAdjuntos={getAdjuntos} />
                                :
                                <div className="">
                                    <p>No hay archivos adjuntos</p>
                                </div>
                        }
                    </div>
                </TabPanel>


            </div>
        </>
    )
}