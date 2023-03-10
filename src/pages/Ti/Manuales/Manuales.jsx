import React, { useState, useEffect } from 'react';
import {useSelector} from 'react-redux'
import PropTypes from 'prop-types';
import Swal from 'sweetalert2'
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';

import { apiGet, apiPutForm, apiPostForm } from './../../../functions/api'

import CarruselAdjuntos from './CarruselAdjuntos'

import Layout from '../../../components/layout/layout'
import Style from './Manuales.module.css'

import './../../../styles/_adjuntosVehiculos.scss'
import { setCustomeDescripcionReactDom } from '../../../functions/setters';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-force-tabpanel-${index}`}
            aria-labelledby={`scrollable-force-tab-${index}`}
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
        height: '80vh',
    },
    tabs: {
        borderRight: `1px solid ${theme.palette.divider}`,
    },
}));

export default function Manuales(props) {
    const { data } = props
    const authUser = useSelector(state => state.authUser.access_token)
    const classes = useStyles();
    const [value, setValue] = React.useState(0);
    const [form, setForm] = useState({
        MiProyecto: [],
        Usuarios: [],
        Presupuesto: [],
        Proyectos: [],
        Administracion: [],
        Ti: [],
        Bancos: [],
        RecursosHumanos: [],
        TeEscuchamos: [],
        Leads: [],
        Mercadotecnia: [],
        Reportes: [],
        Calidad: [],
        Catalogos: [],
        Plataforma: [],
        file: [],
    })
    const [descripcion, setDescripcion] = useState('')
    const [activeTab, setActiveTab] = useState('MiProyecto')
    const [adjuntos, setAdjuntos] = useState(false)

    useEffect(() => {
        getAdjuntos()
    }, [])
   
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    let prop = {
        pathname: '/ti/soporte',
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
        setDescripcion('')
    }

    const handleTab = (e) => {
        setActiveTab(e)
        resetForm()
    }

    const handleChangeComentarios = (e) => {
        setDescripcion(e.target.value)
    }

    const getAdjuntos = () => {
        try {

            apiGet(`manuales`, authUser)
                .then(res => {

                    let adjunAux = res.data.manual
                    Swal.close()
                    let aux = {
                        MiProyecto: [],
                        Usuarios: [],
                        Presupuesto: [],
                        Proyectos: [],
                        Administracion: [],
                        Ti: [],
                        Bancos: [],
                        RecursosHumanos: [],
                        TeEscuchamos: [],
                        Leads: [],
                        Mercadotecnia: [],
                        Reportes: [],
                        Calidad: [],
                        Catalogos: [],
                        Plataforma: [],
                    }
                    if (adjunAux.length > 0) {
                        adjunAux.forEach((element) => {
                            if (element.adjuntos.length > 0) {
                                switch (element.nombre) {
                                    case 'MiProyecto':
                                        element.adjuntos[0].descripcion = element.descripcion
                                        aux.MiProyecto = [...aux.MiProyecto, element.adjuntos[0]]
                                        break;
                                    case 'Usuarios':
                                        element.adjuntos[0].descripcion = element.descripcion
                                        aux.Usuarios = [...aux.Usuarios, element.adjuntos[0]]
                                        break;
                                    case 'Presupuesto':
                                        element.adjuntos[0].descripcion = element.descripcion
                                        aux.Presupuesto = [...aux.Presupuesto, element.adjuntos[0]]
                                        break;
                                    case 'Proyectos':
                                        element.adjuntos[0].descripcion = element.descripcion
                                        aux.Proyectos = [...aux.Proyectos, element.adjuntos[0]]
                                        break;
                                    case 'Administracion':
                                        element.adjuntos[0].descripcion = element.descripcion
                                        aux.Administracion = [...aux.Administracion, element.adjuntos[0]]
                                        break;
                                    case 'Ti':
                                        element.adjuntos[0].descripcion = element.descripcion
                                        aux.Ti = [...aux.Ti, element.adjuntos[0]]
                                        break;
                                    case 'Bancos':
                                        element.adjuntos[0].descripcion = element.descripcion
                                        aux.Bancos = [...aux.Bancos, element.adjuntos[0]]
                                        break;
                                    case 'RecursosHumanos':
                                        element.adjuntos[0].descripcion = element.descripcion
                                        aux.RecursosHumanos = [...aux.RecursosHumanos, element.adjuntos[0]]
                                        break;
                                    case 'TeEscuchamos':
                                        element.adjuntos[0].descripcion = element.descripcion
                                        aux.TeEscuchamos = [...aux.TeEscuchamos, element.adjuntos[0]]
                                        break;
                                    case 'Leads':
                                        element.adjuntos[0].descripcion = element.descripcion
                                        aux.Leads = [...aux.Leads, element.adjuntos[0]]
                                        break;
                                    case 'Mercadotecnia':
                                        element.adjuntos[0].descripcion = element.descripcion
                                        aux.Mercadotecnia = [...aux.Mercadotecnia, element.adjuntos[0]]
                                        break;
                                    case 'Reportes':
                                        element.adjuntos[0].descripcion = element.descripcion
                                        aux.Reportes = [...aux.Reportes, element.adjuntos[0]]
                                        break;
                                    case 'Calidad':
                                        element.adjuntos[0].descripcion = element.descripcion
                                        aux.Calidad = [...aux.Calidad, element.adjuntos[0]]
                                        break;
                                    case 'Catalogos':
                                        element.adjuntos[0].descripcion = element.descripcion
                                        aux.Catalogos = [...aux.Catalogos, element.adjuntos[0]]
                                        break;
                                    case 'Plataforma':
                                        element.adjuntos[0].descripcion = element.descripcion
                                        aux.Plataforma = [...aux.Plataforma, element.adjuntos[0]]
                                        break;
                                    default:
                                        break;
                                }    
                            }
                            
                        });
                    }
                    setAdjuntos(aux)
                })
                .catch(err => {
                    Swal.close()
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Algo salio mal al cargar los adjuntos!',
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
    }

    const uploadButtons = () => {
        return (
            <div>
                <div className='adjust_buttons'>
                    <div className="file_buttons file">

                        <label htmlFor="file">Seleccionar archivo(s)</label>
                        <input type="file" id="file" name="file" onChange={handleFile} />
                        {/* <div>
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
                                        <div className="comentarios">
                                            <label htmlFor="comentarios">Comentarios</label>
                                            <input type="text" placeholder="Comentarios" name="comentarios" onChange={handleChangeComentarios} />
                                        </div>
                                    </>
                                    
                                    :
                                    <div className="selected_file">
                                        <span>{`${form.file.length} archivos seleccionados`}</span>
                                        
                                    </div>
                                : <span className="not_file">No hay archivo seleccionado</span>}
                        </div>  */}

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
                        {form.file.length > 0 ?
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
                                            valuealue={descripcion}
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

            let datas = new FormData()

            datas.append(`files_manuales[]`, form.file[0])
            datas.append('nombre', activeTab)
            datas.append('descripcion', descripcion)

            try {
                apiPostForm(`manuales`, datas, authUser)
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

    const viewAdjuntos = (tab) => {
        return (
            <>
                {
                    adjuntos && adjuntos[tab] && adjuntos[tab].length > 0 ?
                        <>
                            <CarruselAdjuntos data={adjuntos[tab]} getAdjuntos={getAdjuntos} />
                            <div className='adjuntos-comentarios'>
                                {/* <span>{data.descripcion}</span> */}
                            </div>
                        </>
                        :
                        <div className="not_adjuntos">
                            <span>No hay archivos adjuntos</span>
                        </div>
                }
            </>
        )
    }
    console.log(adjuntos)

    return (
        <>
            <Layout authUser={authUser} location={prop} history={{ location: prop }} active='ti'>
                <div className={classes.root}>
                    
                    <Tabs
                        orientation="vertical"
                        variant="scrollable"
                        value={value}
                        onChange={handleChange}
                        aria-label="Vertical tabs example"
                        className={classes.tabs}
                        
                    >
                        <Tab label="MI PROYECTO"  {...a11yProps(0)} className={Style.icon} onClick={() => handleTab('MiProyecto')} />
                        <Tab label="USUARIOS"  {...a11yProps(1)} className={Style.icon} onClick={() => handleTab('Usuarios')} />
                        <Tab label="PRESUPUESTO"  {...a11yProps(2)} className={Style.icon} onClick={() => handleTab('Presupuesto')} />
                        <Tab label="PROYECTOS"  {...a11yProps(3)} className={Style.icon} onClick={() => handleTab('Proyectos')} />
                        <Tab label="ADMINISTRACION"  {...a11yProps(4)} className={Style.icon} onClick={() => handleTab('Administracion')} />
                        <Tab label="TI"  {...a11yProps(5)} className={Style.icon} onClick={() => handleTab('Ti')} />
                        <Tab label="BANCOS"  {...a11yProps(6)} className={Style.icon} onClick={() => handleTab('Bancos')} />
                        <Tab label="RECURSOS HUMANOS"  {...a11yProps(7)} className={Style.icon} onClick={() => handleTab('RecursosHumanos')} />
                        <Tab label="TE ESCUCHAMOS"  {...a11yProps(8)} className={Style.icon} onClick={() => handleTab('TeEscuchamos')} />
                        <Tab label="LEADS"  {...a11yProps(9)} className={Style.icon} onClick={() => handleTab('Leads')} />
                        <Tab label="MERCADOTECNIA"  {...a11yProps(10)} className={Style.icon} onClick={() => handleTab('Mercadotecnia')} />
                        <Tab label="REPORTES"  {...a11yProps(11)} className={Style.icon} onClick={() => handleTab('Reportes')} />
                        <Tab label="CALIDAD"  {...a11yProps(12)} className={Style.icon} onClick={() => handleTab('Calidad')} />
                        <Tab label="CATALOGOS"  {...a11yProps(13)} className={Style.icon} onClick={() => handleTab('Catalogos')} />
                        <Tab label="PLATAFORMA"  {...a11yProps(14)} className={Style.icon} onClick={() => handleTab('Plataforma')} />
                    </Tabs>
                    
                    <TabPanel value={value} index={0}>
                        {uploadButtons('MiProyecto')}
                    </TabPanel>

                    <TabPanel value={value} index={1}>
                        {uploadButtons('Usuarios')}
                    </TabPanel>

                    <TabPanel value={value} index={2}>
                        {uploadButtons('Presupuesto')}
                    </TabPanel>

                    <TabPanel value={value} index={3}>
                        {uploadButtons('Proyectos')}
                    </TabPanel>

                    <TabPanel value={value} index={4}>
                        {uploadButtons('Administracion')}
                    </TabPanel>

                    <TabPanel value={value} index={5}>
                        {uploadButtons('Ti')}
                        {viewAdjuntos('Ti')}
                    </TabPanel>

                    <TabPanel value={value} index={6}>
                        {uploadButtons('Bancos')}
                    </TabPanel>

                    <TabPanel value={value} index={7}>
                        {uploadButtons('RecursosHumanos')}
                    </TabPanel>

                    <TabPanel value={value} index={8}>
                        {uploadButtons('TeEscuchamos')}
                    </TabPanel>

                    <TabPanel value={value} index={9}>
                        {uploadButtons('Leads')}
                    </TabPanel>

                    <TabPanel value={value} index={10}>
                        {uploadButtons('Mercadotecnia')}
                    </TabPanel>

                    <TabPanel value={value} index={11}>
                        {uploadButtons('Reportes')}
                    </TabPanel>

                    <TabPanel value={value} index={12}>
                        {uploadButtons('Calidad')}
                    </TabPanel>

                    <TabPanel value={value} index={13}>
                        {uploadButtons('Catalogos')}
                    </TabPanel>

                    <TabPanel value={value} index={14}>
                        {uploadButtons('Plataforma')}
                    </TabPanel>
                    
                </div>
            </Layout>
            
        </>
    )
}