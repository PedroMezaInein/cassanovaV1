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

import { apiGet, apiPostForm } from '../../../../../functions/api'
import { URL_DEV } from '../../../../../constants'
import { setSingleHeader } from '../../../../../functions/routers'

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

    const { proyecto } = props
    console.log(proyecto)
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
        file: [],
    })
    const [activeTab, setActiveTab] = useState('fotografias_levantamiento')
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

    const getAdjuntos = () => {
        try {
            apiGet(`v2/proyectos/proyectos/proyecto/${proyecto.id}/adjuntos`, authUser)
                .then(res => {
                    let adjunAux = res.data.proyecto
                    Swal.close()
                    let aux = {
                        fotografias_levantamiento: [],
                        manuales_de_adaptacion: [],
                        minutas: [],
                        planos_entregados_por_cliente: [],
                        propuestas_arquitectonicas_preliminares: [],
                        referencias_del_diseño_del_proyecto: [],
                        renders: [],
                        sketch_up: [],
                        presupuestos_preliminares: [],
                        recibos_pago: [],
                    }
                    //obtener la key del objeto y recorrelo
                    Object.keys(adjunAux).forEach((element) => {
                        switch (element) {
                            case 'fotografias_levantamiento':
                                aux.fotografias_levantamiento.push(...adjunAux[element])
                                break;
                            case 'manuales_de_adaptacion':
                                aux.manuales_de_adaptacion.push(...adjunAux[element])
                                break;
                            case 'minutas':
                                aux.minutas.push(...adjunAux[element])
                                break;
                            case 'planos_entregados_por_cliente':
                                aux.planos_entregados_por_cliente.push(...adjunAux[element])
                                break;
                            case 'propuestas_arquitectonicas_preliminares':
                                aux.propuestas_arquitectonicas_preliminares.push(...adjunAux[element])
                                break;
                            case 'referencias_del_diseño_del_proyecto':
                                aux.referencias_del_diseño_del_proyecto.push(...adjunAux[element])
                                break;
                            case 'renders':
                                aux.renders.push(...adjunAux[element])
                                break;
                            case 'sketch_up':
                                aux.sketch_up.push(...adjunAux[element])
                                break;
                            case 'presupuestos_preliminares':
                                aux.presupuestos_preliminares.push(...adjunAux[element])
                                break;
                            case 'recibos_pago':
                                aux.recibos_pago.push(...adjunAux[element])
                                break;
                            default:
                                break;
                        }
                    });
                    console.log('aux', aux)
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
            let filePath = `proyecto/${proyecto.id}/${activeTab}/${Math.floor(Date.now() / 1000)}-`
            console.log('filePath', filePath)
            let aux = []
            form.file.forEach((file) => {
                console.log(file)
                aux.push(file)
            })

            try {
                apiGet('v1/constant/admin-proyectos', authUser)
                    .then(res => {
                        let auxPromises = aux.map((file) => {
                            return new Promise((resolve, reject) => {
                                new S3(res.data.alma).uploadFile(file, `${filePath}${file.name}`)
                                    .then((data) => {
                                        const { location, status } = data
                                        if (status === 204)
                                            resolve({ name: file.name, url: location })
                                        else
                                            reject(data)
                                    }).catch(err => reject(err))
                            })
                        })
                        Promise.all(auxPromises).then(values => { addS3FilesAxios(values) }).catch(err => console.error(err))
                    })
                    .catch(err => {
                        Swal.close()
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Algo salio mal!',
                        })
                        console.log('error', err)
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

    const addS3FilesAxios = (files) => {
        try {
            axios.post(`${URL_DEV}v2/proyectos/proyectos/adjuntos/${proyecto.id}/s3`, { archivos: files }, {
                params: { tipo: activeTab },
                headers: setSingleHeader(authUser)
            })
                .then(res => {
                    Swal.close()
                    Swal.fire({
                        icon: 'success',
                        title: 'Archivo subido correctamente',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    getAdjuntos()
                    setForm({
                        file: []
                    })
                })
                .catch(err => {
                    Swal.close()
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Algo salio mal!',
                    })
                    console.log('error', err)
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
                                <input type="file" id="file" name="file" onChange={handleFile} multiple />
                                <div>
                                    {form.file.length > 0 ?
                                        <>
                                            {
                                                form.file.map((file, index) => {
                                                    return <p key={index}>{file.name}</p>
                                                })
                                            }
                                        </>
                                        : <p>No hay archivo seleccionado</p>}
                                </div>

                            </div>
                            <div className="btn-subir">
                                <button onClick={handleSubmit}>Subir</button>
                            </div>
                        </div>
                        {
                            adjuntos && adjuntos.fotografias_levantamiento && adjuntos.fotografias_levantamiento.length > 0 ?
                                <CarruselAdjuntos data={adjuntos.fotografias_levantamiento} id={proyecto.id} getAdjuntos={getAdjuntos} />
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
                                <input type="file" id="file" name="file" onChange={handleFile} multiple />
                                <div>
                                    {form.file.length > 0 ?
                                        <>
                                            {
                                                form.file.map((file, index) => {
                                                    return <p key={index}>{file.name}</p>
                                                })
                                            }
                                        </>
                                        : <p>No hay archivo seleccionado</p>}
                                </div>

                            </div>
                            <div className="btn-subir">
                                <button onClick={handleSubmit}>Subir</button>
                            </div>
                        </div>
                        {
                            adjuntos && adjuntos.manuales_de_adaptacion && adjuntos.manuales_de_adaptacion.length > 0 ?
                                <CarruselAdjuntos data={adjuntos.manuales_de_adaptacion} id={proyecto.id} getAdjuntos={getAdjuntos} />
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
                                <input type="file" id="file" name="file" onChange={handleFile} multiple />
                                <div>
                                    {form.file.length > 0 ?
                                        <>
                                            {
                                                form.file.map((file, index) => {
                                                    return <p key={index}>{file.name}</p>
                                                })
                                            }
                                        </>
                                        : <p>No hay archivo seleccionado</p>}
                                </div>

                            </div>
                            <div className="btn-subir">
                                <button onClick={handleSubmit}>Subir</button>
                            </div>
                        </div>
                        {
                            adjuntos && adjuntos.minutas && adjuntos.minutas.length > 0 ?
                                <CarruselAdjuntos data={adjuntos.minutas} id={proyecto.id} getAdjuntos={getAdjuntos} />
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
                                <input type="file" id="file" name="file" onChange={handleFile} multiple />
                                <div>
                                    {form.file.length > 0 ?
                                        <>
                                            {
                                                form.file.map((file, index) => {
                                                    return <p key={index}>{file.name}</p>
                                                })
                                            }
                                        </>
                                        : <p>No hay archivo seleccionado</p>}
                                </div>

                            </div>
                            <div className="btn-subir">
                                <button onClick={handleSubmit}>Subir</button>
                            </div>
                        </div>
                        {
                            adjuntos && adjuntos.planos_entregados_por_cliente && adjuntos.planos_entregados_por_cliente.length > 0 ?
                                <CarruselAdjuntos data={adjuntos.planos_entregados_por_cliente} id={proyecto.id} getAdjuntos={getAdjuntos} />
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
                                <input type="file" id="file" name="file" onChange={handleFile} multiple />
                                <div>
                                    {form.file.length > 0 ?
                                        <>
                                            {
                                                form.file.map((file, index) => {
                                                    return <p key={index}>{file.name}</p>
                                                })
                                            }
                                        </>
                                        : <p>No hay archivo seleccionado</p>}
                                </div>

                            </div>
                            <div className="btn-subir">
                                <button onClick={handleSubmit}>Subir</button>
                            </div>
                        </div>
                        {
                            adjuntos && adjuntos.propuestas_arquitectonicas_preliminares && adjuntos.propuestas_arquitectonicas_preliminares.length > 0 ?
                                <CarruselAdjuntos data={adjuntos.propuestas_arquitectonicas_preliminares} id={proyecto.id} getAdjuntos={getAdjuntos} />
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
                                <input type="file" id="file" name="file" onChange={handleFile} multiple />
                                <div>
                                    {form.file.length > 0 ?
                                        <>
                                            {
                                                form.file.map((file, index) => {
                                                    return <p key={index}>{file.name}</p>
                                                })
                                            }
                                        </>
                                        : <p>No hay archivo seleccionado</p>}
                                </div>

                            </div>
                            <div className="btn-subir">
                                <button onClick={handleSubmit}>Subir</button>
                            </div>
                        </div>
                        {
                            adjuntos && adjuntos.referencias_del_diseño_del_proyecto && adjuntos.referencias_del_diseño_del_proyecto.length > 0 ?
                                <CarruselAdjuntos data={adjuntos.referencias_del_diseño_del_proyecto} id={proyecto.id} getAdjuntos={getAdjuntos} />
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
                                <input type="file" id="file" name="file" onChange={handleFile} multiple />
                                <div>
                                    {form.file.length > 0 ?
                                        <>
                                            {
                                                form.file.map((file, index) => {
                                                    return <p key={index}>{file.name}</p>
                                                })
                                            }
                                        </>
                                        : <p>No hay archivo seleccionado</p>}
                                </div>

                            </div>
                            <div className="btn-subir">
                                <button onClick={handleSubmit}>Subir</button>
                            </div>
                        </div>
                        {
                            adjuntos && adjuntos.renders && adjuntos.renders.length > 0 ?
                                <CarruselAdjuntos data={adjuntos.renders} id={proyecto.id} getAdjuntos={getAdjuntos} />
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
                                <input type="file" id="file" name="file" onChange={handleFile} multiple />
                                <div>
                                    {form.file.length > 0 ?
                                        <>
                                            {
                                                form.file.map((file, index) => {
                                                    return <p key={index}>{file.name}</p>
                                                })
                                            }
                                        </>
                                        : <p>No hay archivo seleccionado</p>}
                                </div>

                            </div>
                            <div className="btn-subir">
                                <button onClick={handleSubmit}>Subir</button>
                            </div>
                        </div>
                        {
                            adjuntos && adjuntos.sketch_up && adjuntos.sketch_up.length > 0 ?
                                <CarruselAdjuntos data={adjuntos.sketch_up} id={proyecto.id} getAdjuntos={getAdjuntos} />
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
                                <input type="file" id="file" name="file" onChange={handleFile} multiple />
                                <div>
                                    {form.file.length > 0 ?
                                        <>
                                            {
                                                form.file.map((file, index) => {
                                                    return <p key={index}>{file.name}</p>
                                                })
                                            }
                                        </>
                                        : <p>No hay archivo seleccionado</p>}
                                </div>

                            </div>
                            <div className="btn-subir">
                                <button onClick={handleSubmit}>Subir</button>
                            </div>
                        </div>
                        {
                            adjuntos && adjuntos.presupuestos_preliminares && adjuntos.presupuestos_preliminares.length > 0 ?
                                <CarruselAdjuntos data={adjuntos.presupuestos_preliminares} id={proyecto.id} getAdjuntos={getAdjuntos} />
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
                                <input type="file" id="file" name="file" onChange={handleFile} multiple />
                                <div>
                                    {form.file.length > 0 ?
                                        <>
                                            {
                                                form.file.map((file, index) => {
                                                    return <p key={index}>{file.name}</p>
                                                })
                                            }
                                        </>
                                        : <p>No hay archivo seleccionado</p>}
                                </div>

                            </div>
                            <div className="btn-subir">
                                <button onClick={handleSubmit}>Subir</button>
                            </div>
                        </div>
                        {
                            adjuntos && adjuntos.recibos_pago && adjuntos.recibos_pago.length > 0 ?
                                <CarruselAdjuntos data={adjuntos.recibos_pago} id={proyecto.id} getAdjuntos={getAdjuntos} />
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