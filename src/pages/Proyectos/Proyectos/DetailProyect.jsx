import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
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
    const [fases, setFases] = useState({
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
    })

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

    console.log(dataFases)

    let prop = {
        pathname: '/proyectos/proyectos/single/',
    }


    const getOneProyecto = (id) => {
        waitAlert()
        axios.get(`${URL_DEV}proyectos/project/${id}`, { headers: setSingleHeader(userAuth.access_token) })
        .then((response) => { 
            console.log(response.data.data[0])
            setDataFases(response.data.data[0].proyectos)
            setProyecto(response.data.data[0].proyectos[response.data.data[0].proyectos.length - 1])
            Swal.close()
        })
        .catch((error) => {
            console.log(error)
            Swal.close()
        })
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <>
            <Layout authUser={userAuth.acces_token} location={prop} history={{ location: prop }} active='proyectos'>
                {proyecto &&
                    <div className="mt-n4 ml-n8 mr-n8">
                        <div className="col-12">
                            <Card>
                                <Card.Body>
                                    <div className="HeaderTitle mt-n4 mb-n3">
                                        <h3>
                                            {proyecto.simpleName}    
                                        </h3>
                                        <div>
                                            <span >Estado del proyecto: <span className="badge badge-pill" style={{ backgroundColor: proyecto.estatus.fondo, color: proyecto.estatus.letra }}>
                                                {proyecto.estatus.estatus}
                                            </span></span>
                                        </div>
                                        { fases &&
                                            <div className="card-toolbar">
                                                <div className="card-toolbar toolbar-dropdown">
                                                    <DropdownButton menualign="right"
                                                        title={<span className="d-flex">OPCIONES <i className="las la-angle-down icon-md p-0 ml-2"></i></span>} id='dropdown-proyectos' >
                                                        <Dropdown.Item className="text-hover-info dropdown-info" onClick={() => setModal({ ...modal, info: true })}>
                                                            {setNaviIcon('las la-clipboard-list icon-xl', 'INFORMACIÓN')}
                                                        </Dropdown.Item>
                                                        {/* <Dropdown.Item className="text-hover-success dropdown-success" onClick={() => setModal({ ...modal, edit_proyect: true })}>
                                                            {setNaviIcon('las la-pencil-alt icon-xl', 'EDITAR PROYECTO')}
                                                        </Dropdown.Item> */}
                                                        <Dropdown.Item className="text-hover-primary dropdown-primary" onClick={() => setModal({ ...modal, hire_phase: true })}>
                                                            {setNaviIcon('las la-handshake icon-xl', 'CONTRATAR FASES')}
                                                        </Dropdown.Item>
                                                    </DropdownButton>
                                                </div>
                                            </div>   
                                        }
                                        
                                    </div>
                                    <hr />
                                    <div className="row HeaderContainer">

                                        <div className="col-3">
                                            <div className="col-12">
                                                <span className="TagTitle">
                                                    Contacto
                                                </span>
                                                <span className="mt-2 alignContent">
                                                        {proyecto.contacto}
                                                </span>    
                                                {/* <span>
                                                    <i className="fas fa-phone mr-2"></i>
                                                    {proyecto.numero_contacto}
                                                </span> */}
                                            </div>
                                        </div>
                                            
                                        <div className="col-2">
                                            <div>
                                                <span className="TagTitle">
                                                    Empresa    
                                                </span>
                                                <span className="mt-2 alignContent">
                                                    {proyecto.empresa.name}
                                                </span>    
                                            </div>
                                        </div>

                                         <div className="col-2">
                                            <div>
                                                <span className="TagTitle">
                                                    Área
                                                </span>
                                                <span className="text-lowercase mt-2 alignContent">
                                                        {proyecto.m2}&nbsp; m²
                                                </span>
                                            </div>
                                        </div> 

                                        <div className="col-2">
                                            <div>
                                                <span className="TagTitle">
                                                    Tipo de Proyecto
                                                </span>
                                                <span className="mt-2 alignContent">
                                                    {proyecto.tipo_proyecto.tipo}
                                                </span>
                                            </div>
                                        </div> 
                                            
                                        {/* <div className="col-3">
                                            <div>
                                                    <span className="badge badge-pill badge-primary">
                                                    Descripción    
                                                </span>
                                                <span className="mt-2">
                                                    {proyecto.descripcion}
                                                </span>    
                                            </div>
                                        </div>  */}
                                            
                                        {/* <div className="col-2 mb-n4">
                                            <div>
                                                <span className="badge badge-pill badge-primary">
                                                    Ubicación
                                                </span>
                                                <span className="mt-2">
                                                    {proyecto.estado}, {proyecto.ciudad}, {proyecto.colonia},{proyecto.calle}, {proyecto.cp}
                                                </span>
                                            </div>
                                        </div>  */}
                                        <div className="col-3">
                                            <div>
                                                <span className="TagTitle">
                                                    Cliente
                                                </span>
                                                <span className="mt-2 alignContent">
                                                    {proyecto.clientes.map((cliente, index) => (
                                                        <span key={index}>
                                                            {cliente.empresa}
                                                        </span>
                                                    ))}
                                                </span>
                                            </div>
                                        </div> 
                                            
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>
                    </div>
                }   

                <div className=" ml-n4 mr-n4">
                    <Tabs
                        className='tabs-container'
                        color='secondary'
                        value={value}
                        onChange={handleChange}
                        indicatorColor="secondary"
                        variant="fullWidth"
                    >
                        {fases.fase1.activeTab && <Tab label="Fase 1" disabled={fases.fase1.activeTab ? false : true} />}
                        {fases.fase2.activeTab && <Tab label="Fase 2" disabled={fases.fase2.activeTab ? false : true} />}
                        {fases.fase3.activeTab && <Tab label="Fase 3" disabled={fases.fase3.activeTab ? false : true} />}
                    </Tabs>
                    <TabPanel value={value} index={0} >
                        <Fase1 fase={fases.fase1.data} />
                    </TabPanel>
                    <TabPanel value={value} index={1} >
                        <Fase2 fase={fases.fase2.data} />
                    </TabPanel>
                    <TabPanel value={value} index={2} >
                        <Fase3 fase={fases.fase3.data} />
                    </TabPanel>
                </div>
                
                <Modal size="lg" show={modal.info} title='Información del proyecto' handleClose={() => setModal({ ...modal, info: false })}>
                    {proyecto &&
                        <div className="parent mt-5">

                        <div className="div1">
                            <div>
                                <span className="headerSubTitle mb-5">
                                    Tipo de Proyecto
                                </span>
                                    <span className="alignContent">
                                    {proyecto.tipo_proyecto.tipo}
                                </span>
                            </div>
                        </div>
                            
                        <div className="div5">
                            <div>
                                <span className="">Estado del proyecto </span>
                                    <span className="badge badge-pill column" style={{ backgroundColor: proyecto.estatus.fondo, color: proyecto.estatus.letra }}>
                                    {proyecto.estatus.estatus}
                                </span>
                            </div>
                        </div>
                            
                        <div className="div2">
                            <div>
                                <span className="headerSubTitle mb-5">
                                    Empresa
                                </span>
                                    <span className="alignContent">
                                    {proyecto.empresa.name}
                                </span>
                            </div>
                        </div>
                        <div className="div4">
                            <div>
                                <span className="mb-5 alertColor">
                                    Área
                                </span>
                                    <span className="text-lowercase  alignContent">
                                    {proyecto.m2}&nbsp; m²
                                </span>
                            </div>
                        </div>
                        <div className="div3">
                            <div>
                                <span className="headerSubTitle mb-5">
                                    Sucursal
                                </span>
                                    <span className="alignContent">
                                    {proyecto.sucursa ? `${proyecto.sucursal}`: 'No hay sucursal'}
                                </span>
                            </div>
                        </div>     
                        <div className="div9">
                            <div className="">
                                <span className="infoColor mb-5">
                                    Contacto
                                </span>
                                    <div className="d-flex flex-column ">
                                        <span className="alignContent">
                                    {proyecto.contacto}
                                    </span>
                                        <span className='alignContent'>
                                        {proyecto.numero_contacto}
                                    </span>
                                        <span className='text-lowercase alignContent'>
                                        {proyecto.contactos[0] ? `${proyecto.contactos[0].correo}`:''}
                                    </span>    
                                </div>
                                
                            </div>
                        </div>
                        <div className="div6">
                            <div>
                                <span className="headerSubTitle mb-5">
                                    Periodo del proyecto
                                </span>
                                    <span className="alignContent">
                                        {proyecto.fecha_inicio ? proyecto.fecha_inicio.slice(0, 10) : 'Sin fecha de inicio'} - {proyecto.fecha_fin ? proyecto.fecha_fin.slice(0, 10) : 'Sin fecha de termino'}
                                </span>
                            </div>
                        </div> 
                            
                        <div className="div8">
                            <div>
                                    <span className="mb-5 costosColor">
                                    Costos
                                </span>
                                    <div className="d-flex flex-column">
                                        <span className="alignContent">
                                    Costo(con iva): &nbsp; ${proyecto.costo}
                                    </span>
                                        <span className="alignContent">
                                        Total pagado: &nbsp; ${proyecto.totalVentas}
                                    </span>    
                                </div>
                            </div>
                        </div>
                        <div className="div7">
                            <div>
                                <span className="headerSubTitle mb-5">
                                    Cliente
                                </span>
                                    <span className="alignContent">
                                    {proyecto.clientes.map((cliente, index) => (
                                        <span key={index}>
                                            ●{cliente.empresa}
                                        </span>
                                    ))}
                                </span>
                            </div>
                        </div> 
                        <div className="div10">
                            <div>
                                <span className="infoColor mb-5">
                                    Ubicación
                                </span>
                                    <span className="alignContent">
                                    {proyecto.estado}, {proyecto.ciudad}, {proyecto.colonia},{proyecto.calle}, {proyecto.cp}
                                </span>
                            </div>
                        </div>    
                        <div className="div11 d-flex justify-content-center mt-10">
                            <div>
                                <span className="infoColor mb-5">
                                    Descripción    
                                </span>
                                <span className="alignContent">
                                    {proyecto.descripcion !== null ? `${proyecto.descripcion}`: 'No hay descripción'}
                                </span>    
                            </div>
                        </div> 
                    </div>}
                </Modal>
                <Modal size="lg" show={modal.edit_proyect} title='Editar proyecto' handleClose={() => setModal({ ...modal, edit_proyect: false })}>
                    <div>
                        <EditProyect proyecto={proyecto} />
                    </div>
                </Modal>

                <Modal size="lg" show={modal.hire_phase} title='Contratar Fase' handleClose={() => setModal({ ...modal, hire_phase: false })}>
                    <NuevaFase proyecto={proyecto} fases={fases} />
                </Modal>
            </Layout>
        </>
    )
}