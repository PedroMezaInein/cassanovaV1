import React, { Component } from 'react'
import $ from 'jquery'
import { connect } from 'react-redux'
import { Modal } from '../../../components/singles'
import Layout from '../../../components/layout/layout'
import { NewTable } from '../../../components/NewTables'
import { LicenciasForm } from '../../../components/forms'
import { setTextTableCenter } from '../../../functions/setters'
import { OverlayTrigger, Tooltip, Tabs, Tab } from 'react-bootstrap'
import { FiltersLicencias, FiltersEquipos } from '../../../components/filters'
import { URL_DEV, LICENCIAS, EQUIPOS_ADMINISTRACION } from '../../../constants'
import { apiDelete, apiPostFormResponseBlob, catchErrors } from '../../../functions/api'
import { deleteAlert, doneAlert, printResponseErrorAlert, waitAlert } from '../../../functions/alert'

class Licencias extends Component {

    state = {
        modal: { filtros: false, form: false },
        filtersLicencia: {},
        filtersEquipos: {},
        title: 'Nueva licencia',
        licencia: '',
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
                codigos: <div>
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
                <OverlayTrigger rootClose overlay={<Tooltip><span className="font-weight-bold">Editar</span></Tooltip>} >
                    <button className='btn btn-icon btn-actions-table btn-sm ml-2 btn-text-success btn-hover-success'
                        onClick={(e) => { e.preventDefault(); this.openModal(element, 'edit') }}>
                        <i className='las la-pen icon-lg' />
                    </button>
                </OverlayTrigger>
                <OverlayTrigger rootClose overlay = { <Tooltip><span className="font-weight-bold">Eliminar</span></Tooltip> } >
                    <button className = 'btn btn-icon btn-actions-table btn-sm ml-2 btn-text-danger btn-hover-danger'
                        onClick = { (e) => { 
                            e.preventDefault(); 
                            deleteAlert(
                                `Eliminarás la licencia`,
                                `¿Deseas continuar?`,
                                () => { this.deleteLicencia(element.id) }
                            )
                        } }>
                        <i className = 'las la-trash icon-lg' />
                    </button>
                </OverlayTrigger>
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
                colaborador: setTextTableCenter('-'),
                equipo:setTextTableCenter(equipo.equipo),
                modelo: setTextTableCenter(equipo.modelo),
                marca: setTextTableCenter(equipo.marca),
                serie: setTextTableCenter(equipo.serie),
                descripcion: setTextTableCenter(equipo.descripcion),
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
        const { modal, filtersLicencia, filtersEquipos, title, licencia, key } = this.state
        return(
            <Layout active = 'administracion' { ...this.props } >
                <Tabs mountOnEnter = { true } unmountOnExit = { true } defaultActiveKey="licencias" activeKey={key} onSelect={(value) => { this.controlledTab(value) }}>
                    <Tab eventKey="licencias" title="Licencias">
                        <NewTable tableName = 'licencias' subtitle = 'Listado de licencias' title = 'Licencias' abrirModal = { true }
                            accessToken = { access_token } columns = { LICENCIAS } setter = { this.setTableLicencias } onClick = { this.openModal }
                            urlRender = {`${URL_DEV}v1/administracion/licencias`}  filterClick = { this.openModalFiltros } type='tab'
                            exportar_boton={true} onClickExport={() => this.exportLicenciasAxios()}
                        />
                    </Tab>
                    <Tab eventKey="equipos" title="Equipos">
                        <NewTable tableName = 'equipos' subtitle = 'Listado de equipos' title = 'Equipos' hideNew = { true }
                            accessToken = { access_token } columns = { EQUIPOS_ADMINISTRACION } setter = { this.setTableEquipos } 
                            urlRender = {`${URL_DEV}v1/administracion/equipos`}  filterClick = { this.openModalFiltros } type='tab'
                            exportar_boton={true} onClickExport={() => this.exportEquiposAxios()} 
                        />
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
            </Layout>
        )
    }
}

const mapStateToProps = state => { return {authUser: state.authUser}}
const mapDispatchToProps = dispatch => ({})
export default connect(mapStateToProps, mapDispatchToProps)(Licencias);