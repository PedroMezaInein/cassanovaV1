import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { apiOptions, apiGet } from '../../../functions/api'
import axios from 'axios';
import Swal from 'sweetalert2'
import { Card, DropdownButton, Dropdown } from 'react-bootstrap'

import Layout from '../../../components/layout/layout'
import { Modal } from '../../../components/singles'
import { waitAlert } from '../../../functions/alert'
import { URL_DEV } from '../../../constants'
import { setSingleHeader } from '../../../functions/routers'
import { setFase, setLabelTable, ordenamiento, setOptions, setNaviIcon } from '../../../functions/setters'
import { EditProyectoForm, NotasObra, Avances, Adjuntos, ComentariosProyectos, PresupuestosProyecto } from '../../../components/forms'

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import SwipeableViews from 'react-swipeable-views';

import PropTypes from 'prop-types';

import HeaderDetailProyect from './HeaderDetailProyect'
import InfoGeneral from './Modales/InfoGeneral'

import EditProyect from './EditProyect'
import NuevaFase from './NuevaFase'

import Fase1 from './Fases/Fase1'
import Fase2 from './Fases/Fase2'
import Fase3 from './Fases/Fase3'

import '../../../styles/_detailProyect.scss'

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <div>{ children }</div>

                
            )}
        </div>
    );
}

export default function DetailProyect() {
    const userAuth = useSelector((state) => state.authUser);
    const [proyecto, setProyecto] = useState();
    const [modal, setModal] = useState({
        edit_proyect: false,
        hire_phase: false,
        info: false,
    });
    const [value, setValue] = useState(false);
    const [dataFases, setDataFases] = useState(false)
    const [fases, setFases] = useState(false)
    const [opciones, setOpciones] = useState(false)

    let navs = [
        { eventKey: 'fase1', name: 'Fase 1' },
        { eventKey: 'fase2', name: 'Fase 2' },
        { eventKey: 'fase3', name: 'Fase 3' },
    ]

    useEffect(() => { 
        let actualUrl = window.location.href
        actualUrl = actualUrl.split('/')
        getOneProyecto(actualUrl[actualUrl.length - 1])
        
    }, [])
    
    useEffect(() => {
        if (dataFases) {
            
            let auxFases = {
                fase1: {
                    activeTab: false,
                    data: false,
                },
                fase2: {
                    activeTab: false,
                    data: false,
                },
                fase3: {
                    activeTab: false,
                    data: false,
                },
            }
            dataFases.map((fase) => {
                if (fase.fase1 === 1) {
                    auxFases.fase1.activeTab = true
                    auxFases.fase1.data = fase
                }
                if (fase.fase2 === 1) {
                    auxFases.fase2.activeTab = true
                    auxFases.fase2.data = fase
                }
                if (fase.fase3 === 1) {
                    auxFases.fase3.activeTab = true
                    auxFases.fase3.data = fase
                }

            })
            setFases(auxFases)
        }
    }, [dataFases])

    useEffect(() => { 
        if (opciones && !opciones.areasVentas) {
            getOpcionesVenta()
        }
    }, [opciones])

    const setSelectOptions = (arreglo, name) => {
        let aux = []
        arreglo.map((element) => {
            aux.push({
                value: element.id,
                text: element[name],
                label: element[name],
                name: element[name],
            })
            return false
        })
        return aux
    }

    console.log(opciones)

    const getOpciones = () => {
        Swal.fire({
            title: 'Cargando...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading()
            }
        })
        apiOptions('v2/proyectos/compras', userAuth.access_token)
        .then(response => {
        
            const { empresas, areas, tiposPagos, tiposImpuestos, estatusCompras, proyectos, proveedores, formasPago,
                metodosPago, estatusFacturas } = response.data
            let options = {}
            options.empresas = setOptions(empresas, 'name', 'id')
            options.proveedores = setOptions(proveedores, 'razon_social', 'id')
            options.areas = setOptions(areas, 'nombre', 'id')
            options.proyectos = setOptions(proyectos, 'nombre', 'id')
            options.tiposPagos = setOptions(tiposPagos, 'tipo', 'id')
            options.tiposImpuestos = setOptions(tiposImpuestos, 'tipo', 'id')
            options.estatusCompras = setOptions(estatusCompras, 'estatus', 'id')
            options.estatusFacturas = setOptions(estatusFacturas, 'estatus', 'id')
            options.formasPago = setOptions(formasPago, 'nombre', 'id')
            options.metodosPago = setOptions(metodosPago, 'nombre', 'id')
            setOpciones(options)
            Swal.close()
        })
        .catch(error => {
            Swal.close()
            console.log(error)
        })
    }

    const getOpcionesVenta = () => { 
        Swal.fire({
            title: 'Cargando...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading()
            }
        })
        apiGet('solicitud-venta/options', userAuth.access_token)
        .then(response => {
            const { areas } = response.data
            let areasVentas = setOptions(areas, 'nombre', 'id')
            setOpciones({
                ...opciones,
                areasVentas
            })
            Swal.close()
        })
        .catch(error => {
            Swal.close()
            console.log(error)
        })
    }

    let prop = {
        pathname: '/proyectos/proyectos/single/',
    }

    const reload = () => {
        let actualUrl = window.location.href
        actualUrl = actualUrl.split('/')
        getOneProyecto(actualUrl[actualUrl.length - 1])
        Swal.fire({
            icon: 'success',
            title: '¡Listo!',
            text: 'Se ha actualizado el proyecto',
            showConfirmButton: false,
            timer: 1500
        })

    }

    const getOneProyecto = (id) => {
        waitAlert()
        axios.get(`${URL_DEV}proyectos/project/${id}`, { headers: setSingleHeader(userAuth.access_token) })
        .then((response) => { 
            console.log(response.data)
            setDataFases(response.data.data[0].proyectos)
            setProyecto(response.data.data[0].proyectos[response.data.data[0].proyectos.length - 1])
            Swal.close()
            getOpciones()
            
        })
        .catch((error) => {
            console.log(error)
            Swal.close()
        })
    }

    const handleChange = (event, newValue) => {
        console.log(newValue)
        setValue(newValue);
    };

    return (
        <>
            <Layout authUser={userAuth.acces_token} location={prop} history={{ location: prop }} active='proyectos'>

                {proyecto && fases &&
                    <>
                    
                        <div className="mt-n4 ml-n8 mr-n8">
                            <div className="col-12">
                                <Card>
                                    <Card.Body>
                                        <HeaderDetailProyect proyecto={proyecto} fases={fases} modal={modal} setModal={setModal} />
                                    </Card.Body>
                                </Card>
                            </div>
                        </div>
                    
                        <div className=" ml-n4 mr-n4">
                            <Tabs
                                className='tabs-container'
                                color='secondary'
                                value={value}
                                onChange={handleChange}
                                indicatorColor="secondary"
                                variant="fullWidth"
                            >
                                {<Tab label="Fase 1" disabled={fases.fase1.activeTab ? false : true} />}
                                {<Tab label="Fase 2" disabled={fases.fase2.activeTab ? false : true} />}
                                {<Tab label="Fase 3" disabled={fases.fase3.activeTab ? false : true} />}
                            </Tabs>

                            <TabPanel value={value} index={0} >
                                <Fase1 fase={fases.fase1.data} reload={reload} opciones={opciones} />
                            </TabPanel>
                            <TabPanel value={value} index={1} >
                                <Fase2 fase={fases.fase2.data} reload={reload} opciones={opciones} />
                            </TabPanel>
                            <TabPanel value={value} index={2} >
                                <Fase3 fase={fases.fase3.data} reload={reload} opciones={opciones} />
                            </TabPanel>
                        </div>
                    
                        <Modal size="xl" show={modal.info} title='Información del proyecto' handleClose={() => setModal({ ...modal, info: false })}>
                            <InfoGeneral proyecto={proyecto} />
                        </Modal>
                            
                        <Modal size="lg" show={modal.edit_proyect} title='Editar proyecto' handleClose={() => setModal({ ...modal, edit_proyect: false })}>
                            <EditProyect proyecto={proyecto} reload={reload} />
                        </Modal>

                        <Modal size="lg" show={modal.hire_phase} title='Contratar Fase' handleClose={() => setModal({ ...modal, hire_phase: false })}>
                            <NuevaFase proyecto={proyecto} fases={fases} />
                        </Modal>
                    </>
                }
                   
            </Layout>
        </>
    )
}