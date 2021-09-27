import React, { Component } from "react"
import { renderToString } from "react-dom/server";
import { connect } from "react-redux"
import Layout from "../../../components/layout/layout"
import { NewTable } from '../../../components/NewTables';
import { PRESUPUESTO_UTILIDAD_COLUMNS, URL_DEV, ADJUNTOS_PRESUPUESTOS_COLUMNS } from "../../../constants";
import { setTextTable, setLabelTable, setTextTableCenter, setDateTable, setOptions, setAdjuntosList } from "../../../functions/setters";
import { deleteAlert, doneAlert, errorAlert, printResponseErrorAlert, waitAlert, pendingPaymentAlert } from "../../../functions/alert";
import { setSingleHeader } from "../../../functions/routers";
import axios from 'axios'
import $ from "jquery";
import { Modal } from '../../../components/singles'
import Swal from 'sweetalert2'
import { Dropdown, DropdownButton, OverlayTrigger, Tooltip } from 'react-bootstrap'
import TableForModals from '../../../components/tables/TableForModals'
import { PresupuestoFilter } from '../../../components/filters'

const DatatableName = 'presupuestos-utilidad'
class PresupuestosEnviados extends Component {

    state = { 
        modal: false,
        modal_adjuntos:false,
        filters: {
            proyecto: '',
            fecha: { start: null, end: null },
            empresa: '',
            area: '',
            tiempo_ejecucion: ''
        },
        options: { 
            empresas: [],
            areas: [],
            estatus:[ { value: 'Utilidad', name: 'Utilidad'}, { value: 'En espera', name: 'En espera'}, { value: 'Aceptado', name: 'Aceptado'}, { value: 'Rechazado', name: 'Rechazado'}]
        },
        data: {
            adjuntos: []
        },
        adjuntos: []
    }
    
    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const modulo = permisos.find(function (element, index) {
            const { modulo: { url } } = element;
            return pathname === url;
        });
        if (!modulo)
            history.push('/')
        this.getOptionsAxios()
        let queryString = this.props.history.location.search
        if (queryString) {
            let params = new URLSearchParams(queryString)
            let id = parseInt(params.get("id"))
            if (id) {
                const { history } = this.props
                history.push({ pathname: '/presupuesto/utilidad-presupuestos/finish', state: { presupuesto: {id: id} } });
            }
        }
    }

    /* -------------------------------------------------------------------------- */
    /*                             ANCHOR CALL TO BACK                            */
    /* -------------------------------------------------------------------------- */

    reloadTable = () => {
        const { filters } = this.state
        $(`#${DatatableName}`).DataTable().search(JSON.stringify(filters)).draw();
    }

    deletePresupuestoAxios = async (id) => {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.delete(`${URL_DEV}presupuestos/${id}`, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                this.reloadTable()
                doneAlert(response.data.message !== undefined ? response.data.message : 'El egreso fue eliminado con éxito.')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    getOptionsAxios = async() => {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'presupuestos/options', { responseType: 'json', headers: setSingleHeader(access_token) }).then(
            (response) => {
                Swal.close()
                const { empresas, areas } = response.data
                const { options } = this.state
                options['empresas'] = setOptions(empresas, 'name', 'id')
                options['areas'] = setOptions(areas, 'nombre', 'id')
                this.setState({ ...this.state, options })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    openModalFiltros = () => {
        this.setState({...this.state, modal: true})
    }
    handleCloseFiltros = () => {
        this.setState({...this.state, modal:false})
    }

    /* -------------------------------------------------------------------------- */
    /*                               ANCHOR SETTERS                               */
    /* -------------------------------------------------------------------------- */

    setPresupuestos = presupuestos => {
        let aux = []
        presupuestos.forEach((presupuesto) => {
            aux.push(
                {
                    actions: this.setActions(presupuesto),
                    estatus: renderToString( presupuesto.estatus ? setLabelTable(presupuesto.estatus) : ''),
                    tipo_presupuesto:renderToString(this.label(presupuesto)),
                    empresa: renderToString(setTextTableCenter(presupuesto.empresa ? presupuesto.empresa.name : '')),
                    proyecto: renderToString(setTextTableCenter(presupuesto.proyecto ? presupuesto.proyecto.nombre : '')),
                    area: renderToString(setTextTableCenter(presupuesto.area ? presupuesto.area.nombre : '')),
                    fecha: renderToString(setDateTable(presupuesto.fecha)),
                    tiempo_ejecucion: renderToString(setTextTableCenter(`${presupuesto.tiempo_ejecucion} ${presupuesto.tiempo_ejecucion === '1'?'día':'días'}`))
                }
            )
        })
        return aux
    }

    label(presupuesto){
        let tipo = presupuesto.hasTickets ? 'ticket' : 'presupuesto'
        let identificador = tipo === 'ticket' && (presupuesto.ticketIdentificador !== null || presupuesto.ticketIdentificador !== '')
        return(
            <div className='d-flex align-items-center justify-content-center white-space-nowrap'>
                <i style={{ color: `${tipo === 'ticket' ? "#9E9D24" : "#EF6C00"}` }} className={`las ${tipo === 'ticket' ? 'la-ticket-alt' : 'la-hard-hat'} icon-xl mr-2`}/>
                {setTextTable(tipo)}
                { identificador && <span className="font-size-11px">- {presupuesto.ticketIdentificador}</span> }
            </div>
        )
    }

    setNaviIcon(icon, text) {
        return (
            <span className="navi-icon">
                <i className={`${icon} mr-2`} />
                <span className="navi-text">
                    {text}
                </span>
            </span>
        )
    }
    setActions = (element) => {
        const { history } = this.props
        return (
            <div className="w-100 d-flex justify-content-center">
                <DropdownButton menualign="right" title={<i className="fas fa-chevron-circle-down icon-md p-0 "></i>} id='dropdown-button-newtable' >
                    <Dropdown.Item className="text-hover-success dropdown-success" onClick={(e) => { e.preventDefault(); history.push({ pathname: '/presupuesto/utilidad-presupuestos/finish', state: { presupuesto: element } }) }} >
                        {this.setNaviIcon('flaticon2-pen', 'editar')}
                    </Dropdown.Item>
                    <Dropdown.Item className="text-hover-danger dropdown-danger" onClick={(e) => { e.preventDefault(); deleteAlert('¿DESEAS CONTINUAR?', 'ELIMINARÁS EL PRESUPUESTO', () => this.deletePresupuestoAxios(element.id)) }}>
                        {this.setNaviIcon('flaticon2-rubbish-bin', 'eliminar')}
                    </Dropdown.Item>
                    {
                        element.pdfs.length > 0 &&
                        <Dropdown.Item className="text-hover-info dropdown-info" onClick={(e) => { e.preventDefault(); this.openModalDownloadPDF(element) }} >
                        {this.setNaviIcon('flaticon2-download-1', 'Historial de presupuestos')}
                        </Dropdown.Item>
                    }
                </DropdownButton>
            </div>
        )
    }

    /* -------------------------------------------------------------------------- */
    /*                             ANCHOR FORMULARIOS                             */
    /* -------------------------------------------------------------------------- */

    onChangeFilter = e => {
        const { name, value } = e.target
        const { filters } = this.state
        filters[name] = value
        this.setState({...this.state, filters})
    }

    clearFiltros = (e) => {
        e.preventDefault()
        const { filters } = this.state
        filters.proyecto = ''
        filters.area = ''
        filters.empresa = ''
        filters.fecha = { start: null, end: null }
        filters.tiempo_ejecucion = ''
        filters.estatus = ''
        this.setState({...this.state, modal:false, filters})
        this.reloadTable()
    }

    onSubmitFilter = (e) => {
        e.preventDefault()
        this.setState({...this.state, modal:false})
        this.reloadTable()
    }
    openModalDownloadPDF = presupuesto => {
        const { data } = this.state
        data.adjuntos = presupuesto.pdfs
        this.setState({
            ...this.state,
            modal_adjuntos:true,
            adjuntos: this.setAdjuntosTable(presupuesto.pdfs),
            data
        })
    }
    handleCloseModalDownloadPDF = () => {
        const { data } = this.state
        data.adjuntos = []
        this.setState({
            ...this.state,
            modal_adjuntos:false,
            adjuntos: [],
            data
        })
    }

    setAdjuntosTable = adjuntos => {
        let aux = []
        adjuntos.map((adjunto) => {
            aux.push({
                url: renderToString(
                    setAdjuntosList([{ name: adjunto.name, url: adjunto.url }])
                ),
                identificador: renderToString(setTextTableCenter(adjunto.pivot.identificador)),
                id: adjunto.id
            })
            return false
        })
        return aux
    }
    tooltip(estatus, details, dotHover, colorText ){
        return(
            <OverlayTrigger rootClose overlay={
                <Tooltip className="mb-4 tool-time-line">
                    <div className={`tool-titulo ${colorText} font-weight-bolder letter-spacing-0-4 py-1`}> {estatus === 'Aceptado/Rechazado' ?<span><span className="color-aceptado-presupuesto">Aceptado</span> <span className="font-weight-light">/</span> <span className="color-rechazado-presupuesto">Rechazado</span></span> : estatus}</div>
                    <div className="text-justify px-5 pb-3 mt-1">{details}</div>
                </Tooltip>
            }>
                <div className={`status ${dotHover}`}>
                    <h4>{estatus}</h4>
                </div>
            </OverlayTrigger>
        )
    }
    
    pendingPaymentClick = () => {
        let pendiente_pago = 1234
        pendingPaymentAlert('PENDIENTE DE PAGO', pendiente_pago)
    }

    render() {
        const { access_token } = this.props.authUser
        const { modal, filters, options, modal_adjuntos, data, adjuntos } = this.state
        return (
            <Layout active = "presupuesto" {...this.props}>
                <NewTable tableName = { DatatableName } subtitle = 'Listado de presupuestos' title = 'Utilidad en presupuestos' 
                    url = '/presupuesto/presupuesto/add' accessToken = { access_token } columns = { PRESUPUESTO_UTILIDAD_COLUMNS }  
                    setter = { this.setPresupuestos } urlRender = {`${URL_DEV}v2/presupuesto/presupuestos/utilidad`} 
                    filterClick = { this.openModalFiltros } pendingPaymentClick = { this.pendingPaymentClick}
                    >
                    <div className="row mx-0 mb-4 mt-7 mt-md-0">
                        <div className="col-md-10 px-0 mx-auto">
                            <div className="table-responsive mt-5">
                                <div className="list min-w-fit-content" data-inbox="list">
                                    <ul className="timeline-estatus p-0">
                                        <li className='li complete-conceptos'>
                                            {this.tooltip('Conceptos', 'Se asignan los conceptos al presupuesto.', 'dot-conceptos-presupuesto', 'header-presupuesto-conceptos')}
                                        </li>
                                        <li className='li complete-volumetrias'>
                                            {this.tooltip('Volumetrías', 'Se agregan las volumetrías al presupuesto.', 'dot-volumetrias-presupuesto', 'header-presupuesto-volumetrias')}
                                        </li>
                                        <li className='li complete-costos'>
                                            {this.tooltip('Costos', 'El departamento de compras estima los costos de los conceptos del presupuesto.', 'dot-costos-presupuesto', 'header-presupuesto-costos')}
                                        </li>
                                        <li className='li complete-revision'>
                                            {this.tooltip('En revisión', 'El departamento de calidad se encarga de verificar las medidas, volumetrias y conceptos del presupuesto.', 'dot-revision-presupuesto', 'header-presupuesto-revision')}
                                        </li>
                                        <li className='li complete-utilidad'>
                                            {this.tooltip('Utilidad', 'El departamento de finanzas añade la utilidad al presupuesto y es el encargado de enviar al cliente.', 'dot-utilidad-presupuesto', 'header-presupuesto-utilidad')}
                                        </li>
                                        <li className='li complete-espera'>
                                            {this.tooltip('En espera', 'El presupuesto es revisado por el cliente y se obtiene una respuesta del presupuesto.', 'dot-espera-presupuesto', 'header-presupuesto-espera')}
                                        </li>
                                        <li className='li complete-aceptado-rechazado'>
                                            {this.tooltip('Aceptado/Rechazado','El cliente aprueba o declina el presupuesto.','dot-aceptado-rechazado-presupuesto','bg-aceptado-rechazado')}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </NewTable>
                <Modal size = 'lg' title = 'Filtros' show = { modal } handleClose = { this.handleCloseFiltros }>
                    <PresupuestoFilter filters = { filters } clearFiltros = { this.clearFiltros } onSubmitFilters = { this.onSubmitFilter } onChangeFilter={ this.onChangeFilter } options={options}/>
                </Modal>
                <Modal show={modal_adjuntos} handleClose={this.handleCloseModalDownloadPDF} title="Listado de presupuestos" >
                    <TableForModals
                        columns={ADJUNTOS_PRESUPUESTOS_COLUMNS}
                        data={adjuntos}
                        hideSelector={true}
                        mostrar_acciones={false}
                        dataID='adjuntos'
                        elements={data.adjuntos}
                    />
                </Modal>
            </Layout>
        );
    }
}

const mapStateToProps = state => { return { authUser: state.authUser} }
const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(PresupuestosEnviados);