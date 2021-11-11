import React, { Component } from 'react'
import { connect } from 'react-redux'
import $ from 'jquery'
import { Modal } from '../../../components/singles'
import Layout from '../../../components/layout/layout'
import { URL_DEV, LICENCIAS } from '../../../constants'
import { NewTable } from '../../../components/NewTables'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { LicenciasForm } from '../../../components/forms'
import { FiltersLicencias } from '../../../components/filters'
import { apiDelete, catchErrors } from '../../../functions/api'
import { setTextTableCenter } from '../../../functions/setters'
import { deleteAlert, doneAlert, printResponseErrorAlert, waitAlert } from '../../../functions/alert'

class Licencias extends Component {

    state = {
        modal: { filtros: false, form: false },
        filters: {},
        title: 'Nueva licencia',
        licencia: ''
    }

    deleteLicencia = async(id) => {
        waitAlert()
        const { access_token } = this.props.authUser
        apiDelete(`v1/administracion/licencias/${id}`, access_token).then(
            (response) => {
                const { filters } = this.state
                doneAlert(`Licencia eliminada con éxito`, () => { this.reloadTable(filters) })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }

    setTable = (datos) => {
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

    reloadTable = (filter) => {
        $(`#licencias`).DataTable().search(JSON.stringify(filter)).draw();
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

    sendFilters = filtro => {
        const { modal } = this.state
        modal.filtros = false
        this.setState({
            ...this.state,
            filters: filtro,
            modal
        })
        this.reloadTable(filtro)
    }

    refresh = () => {
        const { filters, modal } = this.state
        modal.form = false
        this.setState({ ...this.state, modal })
        this.reloadTable(filters)
    }

    render(){
        const { authUser: {access_token} } = this.props
        const { modal, filters, title, licencia } = this.state
        return(
            <Layout active = 'administracion' { ...this.props } >
                <NewTable tableName = 'licencias' subtitle = 'Listado de licencias' title = 'Licencias' abrirModal = { true }
                    accessToken = { access_token } columns = { LICENCIAS } setter = { this.setTable } onClick = { this.openModal }
                    urlRender = {`${URL_DEV}v1/administracion/licencias`}  filterClick = { this.openModalFiltros }/>
                <Modal size = 'lg' show = { modal.filtros } handleClose = { this.handleClose } title = 'Filtros'>
                    {   
                        modal.filtros ? 
                            <FiltersLicencias at = { access_token } sendFilters = { this.sendFilters } filters = { filters } /> 
                        : <></> 
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