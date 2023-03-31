import React, { Component } from 'react'
import $ from 'jquery'
import { connect } from 'react-redux'
import { Modal } from '../../../components/singles'
import Layout from '../../../components/layout/layout'
import { NewTable } from '../../../components/NewTables'
import { setTextTableCenter,setNaviIcon } from '../../../functions/setters'
import {  Tabs, Tab } from 'react-bootstrap'
import { FiltersLicencias, FiltersEquipos } from '../../../components/filters'
import { URL_DEV, LICENCIAS, EQUIPOS_ADMINISTRACION } from '../../../constants'
import { apiDelete, apiPostFormResponseBlob, catchErrors } from '../../../functions/api'
import { deleteAlert, doneAlert, printResponseErrorAlert, waitAlert } from '../../../functions/alert'
import RHEquiposForm from '../../../components/forms/recursoshumanos/RHEquiposForm'
import AddLicenciaForm from '../../../components/forms/administracion/Licencias/AddLicenciaForm'
import EdithLicenciaForm from '../../../components/forms/administracion/Licencias/EdithLicenciaForm'
import EdithEquipoForm from '../../../components/forms/administracion/Licencias/EdithEquipoForm'
import LicenciasForm from '../../../components/forms/administracion/Licencias/LicenciasForm'
import { DropdownButton, Dropdown } from 'react-bootstrap'
import { getWeekYearWithOptions } from 'date-fns/fp'

import Mantenimiento from './../../Ti/Soporte/SoporteTecnicoTable'

class Licencias extends Component {

    state = {
        modal: { filtros: false, form: false },
        filtersLicencia: {},
        filtersEquipos: {},
        title: 'Nueva licencia',
        licencia: false,
        equipo: false,
        edithLicencia: false,
        edithEquipo: false,
        selectLicencia: {},
        selectEquipo: {},
        key:'licencias'
    }

    deleteLicencia = async(id) => {
        waitAlert()
        const { access_token } = this.props.authUser
        apiDelete(`v1/administracion/licencias/${id}`, access_token).then(
            (response) => {
                const { filtersLicencia } = this.state
                doneAlert(`Licencia eliminada con éxito`, () => { this.reloadTableLicencias(filtersLicencia) })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }

    deleteEquipo = async(id) => {
        waitAlert()
        const { access_token } = this.props.authUser
        apiDelete(`v1/administracion/equipos/${id}`, access_token).then(
            (response) => {
                const { filtersEquipos } = this.state
                doneAlert(`Equipo eliminado con éxito`, () => { this.reloadTableEquipos(filtersEquipos) })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }

    setTableLicencias = (datos) => {
        let aux = []
        datos.forEach((dato) => {
            
            let codigos = JSON.parse(dato.codigos)
            aux.push({
                actions: this.setActions(dato),
                tipo: setTextTableCenter(dato.tipo),
                nombre:setTextTableCenter(dato.nombre),
                duracion: setTextTableCenter(`${dato.duracion} ${dato.duracion===1?'MES':'MESES'}`),
                cantidad: setTextTableCenter(`${dato.cantidad} LICENCIAS`),
                codigos: <div className="w-max-content mx-auto">
                    <ul>
                        {
                            codigos.map((codigo, index) => {
                                return(
                                    <li className = { `text-${codigo.flag ? 'danger text-decoration-line-through' : 'primary'}` } key = { index } >
                                        { codigo.token }
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
            })
        })
        return aux
    }

    setActions = (element) => {

        return(
            <div className="w-100 d-flex justify-content-center">
                <DropdownButton menualign="right" title={<i className="fas fa-chevron-circle-down icon-md p-0 "></i>} id='dropdown-button-newtable' >

                    <Dropdown.Item className="text-hover-success dropdown-success" 
                        onClick={(e) => {
                            const {modal} = this.state
                            e.preventDefault();
                            modal.selectLicencia = element
                            this.setState({ ...this.state, modal })
                            this.openModalEdithLicencia(element) 
                        }}  
                    >
                        {setNaviIcon('las la-pen icon-lg', 'editar')}
                    </Dropdown.Item> 

                    <Dropdown.Item className="text-hover-danger dropdown-danger" 
                        onClick = { (e) => { 
                        e.preventDefault(); 
                        deleteAlert(
                            `Eliminarás la licencia`,
                            `¿Deseas continuar?`,
                            () => { this.deleteLicencia(element.id) }
                        )
                    } }>
                        {setNaviIcon('flaticon2-rubbish-bin', 'eliminar')}
                    </Dropdown.Item>

                </DropdownButton>
            </div>
        )
    }

    setActionsEquipos = (element) => {

        return(
            <div className="w-100 d-flex justify-content-center">
                <DropdownButton menualign="right" title={<i className="fas fa-chevron-circle-down icon-md p-0 "></i>} id='dropdown-button-newtable' >

                    <Dropdown.Item className="text-hover-success dropdown-success" 
                        onClick={(e) => {
                            e.preventDefault();
                            const {modal} = this.state 
                            modal.selectEquipo = element
                            this.setState({ ...this.state, modal })
                            this.openModalEdithEquipo(element)
                        }}  
                    >
                        {setNaviIcon('las la-pen icon-lg', 'editar')}
                    </Dropdown.Item> 

                    <Dropdown.Item className="text-hover-danger dropdown-danger" 
                        onClick = { (e) => { 
                        e.preventDefault();
                        deleteAlert(
                            `Eliminarás El equipo`,
                            `¿Deseas continuar?`,
                            () => { this.deleteEquipo(element.id) }
                        )
                    } }>
                        {setNaviIcon('flaticon2-rubbish-bin', 'eliminar')}
                    </Dropdown.Item>

                </DropdownButton>
            </div>
        )
    }

    openModal = (element, type) => {
        const { modal } = this.state
        let { title } = this.state
        modal.form = true
        if(type==='edit'){
            title= 'Editar licencia'
        }else{
            title= 'Nueva licencia'
        }
        this.setState({ ...this.state, modal, title, licencia:element})
    }

    openModalFiltros = () => {
        const { modal } = this.state
        modal.filtros = true
        this.setState({ ...this.state, modal })
    }

    openModalLicencia = () => {
        const {modal} = this.state
        modal.licencia = true
        this.setState({...this.state, modal})
    }

    openModalEdithLicencia = () => {
        const {modal} = this.state
        modal.edithLicencia = true
        this.setState({...this.state, modal})
    }

    openModalEdithEquipo = () => {
        const {modal} = this.state
        modal.edithEquipo = true
        this.setState({...this.state, modal})
    }

    openModalEquipo = () => {
        const {modal} = this.state
        modal.equipo = true
        this.setState({...this.state, modal})
    }

    handleCloseLicencias = () => {
        const {modal} = this.state
        modal.licencia = false
        this.setState({...this.state, modal})
    }

    handleCloseEquipos = () => {
        const {modal} = this.state
        modal.equipo = false
        this.setState({...this.state, modal})
    }

    handleCloseEdithLicencias = () => {
        const {modal} = this.state
        modal.edithLicencia = false
        this.setState({...this.state, modal})
    }
    handleCloseEdithEquipo= () => {
        const {modal} = this.state
        modal.edithEquipo = false
        this.setState({...this.state, modal})
    }

    handleClose = () => {
        const { modal } = this.state
        modal.filtros = false
        modal.form = false
        this.setState({ ...this.state, modal })
    }

    sendFiltersLicencia = filtro => {
        const { modal } = this.state
        modal.filtros = false
        this.setState({
            ...this.state,
            filtersLicencia: filtro,
            modal
        })
        this.reloadTableLicencias(filtro)
    }

    refresh = () => {
        const { filtersLicencia, modal } = this.state
        modal.form = false
        this.setState({ ...this.state, modal })
        this.reloadTableLicencias(filtersLicencia)
    }
    
    exportLicenciasAxios = async () => {
        waitAlert()
        const { filtersLicencia } = this.state
        const { access_token } = this.props.authUser
        apiPostFormResponseBlob(`v1/administracion/licencias/exportar`, { columnas: filtersLicencia }, access_token).then(
            (response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'licencias.xlsx');
                document.body.appendChild(link);
                link.click();
                doneAlert(
                    response.data.message !== undefined ? 
                        response.data.message 
                    : 'Licencias exportadas con éxito.'
                )
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }

    reloadTableLicencias = (filter) => {
        $(`#licencias`).DataTable().search(JSON.stringify(filter)).draw();
    }

    // EQUIPOS

    setTableEquipos = (equipos) => {
        let aux = []
        equipos.forEach((equipo) => {
            aux.push({
                actions: this.setActionsEquipos(equipo),
                colaborador: setTextTableCenter(equipo.colaborador?equipo.colaborador.nombre:'Sin colaborador'),
                equipo:setTextTableCenter(equipo.equipo),
                modelo: setTextTableCenter(equipo.modelo),
                marca: setTextTableCenter(equipo.marca),
                serie: setTextTableCenter(equipo.serie),
                descripcion: setTextTableCenter(equipo.descripcion?equipo.descripcion:'Sin descripción'),
            })
        })
        return aux
    }
    
    exportEquiposAxios = async () => {
        waitAlert()
        const { filtersEquipos } = this.state
        const { access_token } = this.props.authUser
        apiPostFormResponseBlob(`v1/administracion/equipos/exportar`, { columnas: filtersEquipos }, access_token).then(
            (response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'equipos.xlsx');
                document.body.appendChild(link);
                link.click();
                doneAlert(
                    response.data.message !== undefined ? 
                        response.data.message 
                    : 'Equipos exportados con éxito.'
                )
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }

    sendFiltersEquipos = filtro => {
        const { modal } = this.state
        modal.filtros = false
        this.setState({
            ...this.state,
            filtersEquipos: filtro,
            modal
        })
        this.reloadTableEquipos(filtro)
    }

    reloadTableEquipos = (filter) => {
        $(`#equipos`).DataTable().search(JSON.stringify(filter)).draw();
    }

    // ControlledTab
    
    controlledTab = value => {
        const { filtersLicencia, filtersEquipos } = this.state
        if (value === 'licencias') {
            this.reloadTableLicencias(filtersLicencia)
        }
        if (value === 'equipos') {
            this.reloadTableEquipos(filtersEquipos)
        }
        this.setState({
            ...this.state,
            key: value
        })
    }

    render(){
        const { authUser: {access_token} } = this.props
        const { modal, filtersLicencia, filtersEquipos, title, licencia, key, authUser } = this.state
        return(
            <Layout active = 'administracion' { ...this.props } >
                <Tabs mountOnEnter = { true } unmountOnExit = { true } defaultActiveKey="licencias" activeKey={key} onSelect={(value) => { this.controlledTab(value) }}>
                    <Tab eventKey="licencias" title="Licencias">
                        <NewTable 
                            tableName = 'licencias' 
                            subtitle = 'Listado de licencias' 
                            title = 'Licencias' 
                            agregar_licencia = {true}
                            accessToken = { access_token } 
                            columns = { LICENCIAS } 
                            addClick={this.openModalLicencia}
                            hideNew={true}
                            setter = { this.setTableLicencias } 
                            onClick = { this.openModal }
                            urlRender = {`${URL_DEV}v1/administracion/licencias`}  
                            filterClick = { this.openModalFiltros } 
                            type='tab'
                            exportar_boton={true} 
                            onClickExport={() => this.exportLicenciasAxios()}
                        />
                    </Tab>
                    <Tab eventKey="equipos" title="Equipos">
                        <NewTable 
                            tableName = 'equipos' 
                            subtitle = 'Listado de equipos' 
                            title = 'Equipos' 
                            hideNew = { true }
                            accessToken = { access_token } 
                            columns = { EQUIPOS_ADMINISTRACION } 
                            setter = { this.setTableEquipos } 
                            urlRender = {`${URL_DEV}v1/administracion/equipos`}  
                            filterClick = { this.openModalFiltros } 
                            type='tab'
                            exportar_boton={true} 
                            onClickExport={() => this.exportEquiposAxios()} 
                            agregar_equipo = {true} 
                            addClick={this.openModalEquipo}
                        />
                    </Tab>
                    <Tab eventKey="mantenimiento" title="Mantenimiento">
                        <Mantenimiento />
                    </Tab>
                </Tabs>

                <Modal size = 'lg' show = { modal.filtros } handleClose = { this.handleClose } title = 'Filtros'>
                    {   
                        key === 'licencias' ? 
                            <FiltersLicencias at = { access_token } sendFilters = { this.sendFiltersLicencia } filters = { filtersLicencia } /> 
                        : <FiltersEquipos at = { access_token } sendFilters = { this.sendFiltersEquipos } filters = { filtersEquipos } /> 
                    }
                </Modal>
                <Modal size = 'xl' show = { modal.form } handleClose = { this.handleClose } title = { title }>
                    {
                        modal.form ? 
                            <LicenciasForm title = { title } at = { access_token } refresh = { this.refresh } licencia={licencia} 
                                letterCase = { false } /> 
                        : <></>
                    }
                </Modal>
                <Modal size= 'xl' show={modal.licencia} handleClose={this.handleCloseLicencias} title='Licencias'>
                    {
                        modal.licencia?
                        <AddLicenciaForm/>
                        :<></>
                    }
                </Modal>
                <Modal size= 'xl' show={modal.equipo} handleClose={this.handleCloseEquipos} title='Equipos'>
                    {
                        modal.equipo?
                        <RHEquiposForm adminView="admin" authUser={access_token}/>
                        :<></>
                    }
                </Modal>
                <Modal size= 'xl' show={modal.edithLicencia} handleClose={this.handleCloseEdithLicencias} title='Editar licencia'>
                    {
                        modal.edithLicencia?
                        <EdithLicenciaForm licencia={modal.selectLicencia}/>
                        :<></>
                    }
                </Modal>
                <Modal size= 'xl' show={modal.edithEquipo} handleClose={this.handleCloseEdithEquipo} title='Editar equipo'>
                    {
                        modal.edithEquipo?
                        <EdithEquipoForm props={modal.selectEquipo}/>
                        :<></>
                    }
                </Modal>
            </Layout>
        )
    }
}

const mapStateToProps = state => { return {authUser: state.authUser}}
const mapDispatchToProps = dispatch => ({})
export default connect(mapStateToProps, mapDispatchToProps)(Licencias);