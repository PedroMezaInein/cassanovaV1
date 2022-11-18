import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Swal from 'sweetalert2'
import { Card, Tab, Nav, DropdownButton, Dropdown } from 'react-bootstrap'

import Layout from '../../../components/layout/layout'
import { Modal } from '../../../components/singles'
import { waitAlert } from '../../../functions/alert'
import { URL_DEV } from '../../../constants'
import { setSingleHeader } from '../../../functions/routers'
import { setFase, setLabelTable, ordenamiento, setOptions, setNaviIcon } from '../../../functions/setters'
import { EditProyectoForm, NotasObra, Avances, Adjuntos, ComentariosProyectos, PresupuestosProyecto } from '../../../components/forms'

import EditProyect from './EditProyect'

import '../../../styles/_detailProyect.scss'


export default function DetailProyect() {
    const userAuth = useSelector((state) => state.authUser);
    const [activeTab, setActiveTab] = useState('fase1');
    const [proyecto, setProyecto] = useState();
    const [modal, setModal] = useState({
        edit_proyect: false,
        hire_phase: false,
        info: false,
    });

    let navs = [
        { eventKey: 'fase1', name: 'Fase 1' },
        { eventKey: 'fase2', name: 'Fase 2' },
        { eventKey: 'fase3', name: 'Fase 3' },
    ]

    useEffect(() => { 
        let actualUrl = window.location.href
        actualUrl = actualUrl.split('/')
        getOneProyecto(actualUrl[actualUrl.length - 1])
    },[])

    let prop = {
        pathname: '/proyectos/proyectos/single/',
    }
    
    const handleTab = (e, eventKey) => { 
        e.preventDefault()
        setActiveTab(eventKey)
    }

    const getOneProyecto = (id) => {
        waitAlert()
        axios.get(`${URL_DEV}v3/proyectos/proyectos/${id}`, { headers: setSingleHeader(userAuth.access_token) })
        .then((response) => { 
            console.log(response.data)
            setProyecto(response.data.proyecto)
            Swal.close()
        })
        .catch((error) => {
            console.log(error)
            Swal.close()
        })
    }

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

                                        <div className="card-toolbar">
                                            <div className="card-toolbar toolbar-dropdown">
                                                <DropdownButton menualign="right"
                                                    title={<span className="d-flex">OPCIONES <i className="las la-angle-down icon-md p-0 ml-2"></i></span>} id='dropdown-proyectos' >
                                                    <Dropdown.Item className="text-hover-info dropdown-info" onClick={() => setModal({ ...modal, info: true })}>
                                                        {setNaviIcon('las la-clipboard-list icon-xl', 'INFORMACIÓN')}
                                                    </Dropdown.Item>
                                                    <Dropdown.Item className="text-hover-success dropdown-success" onClick={() => setModal({ ...modal, edit_proyect: true })}>
                                                        {setNaviIcon('las la-pencil-alt icon-xl', 'EDITAR PROYECTO')}
                                                    </Dropdown.Item>
                                                    <Dropdown.Item className="text-hover-primary dropdown-primary" onClick={() => setModal({ ...modal, hire_phase: true })}>
                                                        {setNaviIcon('las la-handshake icon-xl', 'CONTRATAR FASES')}
                                                    </Dropdown.Item>
                                                </DropdownButton>
                                            </div>
                                        </div>
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


                <Tab.Container activeKey={activeTab}>
                    <div className="d-flex col-12">
                        {
                            navs.map((nav, key) => {
                                return (
                                    <div className="col-2" key={key}>
                                        <Nav.Item>
                                            <Nav.Link eventKey={nav.eventKey} onClick={(e) => handleTab(e, nav.eventKey)}>
                                                
                                                <span className="">{nav.name}</span>
                                            </Nav.Link>
                                        </Nav.Item>    
                                    </div>
                                    
                                )
                            })
                        }    
                    </div>
                    
                    <Tab.Content>
                        <Tab.Pane eventKey="fase1">
                            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vitae amet praesentium quis, voluptatum ad error explicabo quia reprehenderit esse ducimus eveniet ipsa voluptatem libero! Unde esse eveniet dolorem animi sint!
                        </Tab.Pane>
                        <Tab.Pane eventKey="fase2">
                            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Consequatur fugiat harum, dolorum eveniet recusandae facilis possimus, ab, sit dolor unde numquam quasi. Aperiam possimus ipsum itaque rem nemo. Provident, laborum.
                        </Tab.Pane>
                        <Tab.Pane eventKey="fase3">
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ut non cumque debitis dolorum optio consequatur quam dolor. Minima, tempora nam reiciendis, cupiditate eligendi quasi sunt obcaecati, explicabo possimus corporis vitae!
                        </Tab.Pane>
                    </Tab.Content>
                    
                </Tab.Container>
                <Modal size="md" show={modal.info} title='Información del proyecto' handleClose={() => setModal({ ...modal, info: false })}>
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
                                    {proyecto.fecha_inicio.slice(0, 10)} - {proyecto.fecha_fin.slice(0, 10)}
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
                    <div>
                        Contratar fases
                    </div>
                </Modal>
            </Layout>
        </>
    )
}