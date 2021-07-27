import React, { Component } from "react"
import { renderToString } from "react-dom/server";
import { connect } from "react-redux"
import Layout from "../../../components/layout/layout"
import { NewTable } from '../../../components/NewTables';
import { PRESUPUESTO_UTILIDAD_COLUMNS, URL_DEV, ADJUNTOS_PRESUPUESTOS_COLUMNS } from "../../../constants";
import { setTextTable, setLabelTable, setTextTableCenter, setDateTable, setOptions, setAdjuntosList } from "../../../functions/setters";
import { deleteAlert, doneAlert, errorAlert, printResponseErrorAlert, waitAlert } from "../../../functions/alert";
import { setSingleHeader } from "../../../functions/routers";
import axios from 'axios'
import $ from "jquery";
import { Modal } from '../../../components/singles'
import { InputGray, SelectSearchGray, RangeCalendar, Button } from "../../../components/form-components";
import Swal from 'sweetalert2'
import { Dropdown, DropdownButton  } from 'react-bootstrap'
import TableForModals from '../../../components/tables/TableForModals'

const DatatableName = 'presupuestos'
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
        options: { empresas: [], areas: [] },
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
                history.push({ pathname: '/presupuesto/presupuestos-enviados/finish', state: { presupuesto: {id: id} } });
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
            console.log(error, 'error')
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
            console.log(error, 'error')
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
                    tipo_presupuesto:renderToString(this.label(presupuesto.hasTickets ? 'ticket' : 'presupuesto')),
                    empresa: renderToString(setTextTableCenter(presupuesto.empresa ? presupuesto.empresa.name : '')),
                    proyecto: renderToString(setTextTableCenter(presupuesto.proyecto ? presupuesto.proyecto.nombre : '')),
                    area: renderToString(setTextTableCenter(presupuesto.area ? presupuesto.area.nombre : '')),
                    fecha: renderToString(setDateTable(presupuesto.fecha)),
                    tiempo_ejecucion: renderToString(setTextTableCenter(presupuesto.tiempo_ejecucion))
                }
            )
        })
        return aux
    }

    label(text){
        return(
            <div className='d-flex align-items-center justify-content-center'>
                <i style={{ color: `${text === 'ticket' ? "#9E9D24" : "#EF6C00"}` }} className={`las ${text === 'ticket' ? 'la-ticket-alt' : 'la-hard-hat'} icon-xl mr-2`} /> {setTextTable(text)}
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
                    <Dropdown.Item className="text-hover-success dropdown-success" onClick={(e) => { e.preventDefault(); history.push({ pathname: '/presupuesto/presupuestos-enviados/finish', state: { presupuesto: element } }) }} >
                        {this.setNaviIcon('flaticon2-pen', 'editar')}
                    </Dropdown.Item>
                    <Dropdown.Item className="text-hover-danger dropdown-danger" onClick={(e) => { e.preventDefault(); deleteAlert('¿DESEAS CONTINUAR?', 'ELIMINARÁS EL PRESUPUESTO', () => this.deletePresupuestoAxios(element.id)) }}>
                        {this.setNaviIcon('flaticon2-rubbish-bin', 'eliminar')}
                    </Dropdown.Item>
                    <Dropdown.Item className="text-hover-info dropdown-info" onClick={(e) => { e.preventDefault(); this.openModalDownloadPDF(element) }} >
                        {this.setNaviIcon('flaticon2-download-1', 'descargar presupuesto')}
                    </Dropdown.Item>
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
    render() {
        const { access_token } = this.props.authUser
        const { modal, filters, options, modal_adjuntos, data, adjuntos } = this.state
        return (
            <Layout active = "presupuesto" {...this.props}>
                <NewTable tableName = { DatatableName } subtitle = 'Listado de Presupuestos a agregar utilidad' title = 'Presupuestos' 
                    url = '/presupuesto/presupuesto/add' accessToken = { access_token } columns = { PRESUPUESTO_UTILIDAD_COLUMNS }  
                    setter = { this.setPresupuestos } urlRender = {`${URL_DEV}v2/presupuesto/presupuestos/utilidad`} 
                    filterClick = { this.openModalFiltros } />
                <Modal size = 'lg' title = 'Filtros' show = { modal } handleClose = { this.handleCloseFiltros } customcontent = { true }
                    contentcss = "modal modal-sticky modal-sticky-bottom-right d-block modal-sticky-lg modal-dialog modal-dialog-scrollable">
                    <form onSubmit = { this.onSubmitFilter } >
                        <div className="row justify-content-center mx-0">
                            <div className="col-md-6">
                                <InputGray withtaglabel = { 1 } withtextlabel = { 0 } withplaceholder = { 1 } withicon = { 0 } requirevalidation = { 0 } 
                                    withformgroup = { 0 } name = 'proyecto' placeholder = 'PROYECTO' value = { filters.proyecto } 
                                    onChange = { this.onChangeFilter } />
                            </div>
                            <div className="col-md-6">
                                <SelectSearchGray options = { options.empresas } placeholder = 'EMPRESA' value = { filters.empresa } 
                                    withtaglabel = { 1 } withtextlabel = { 0 } withicon={0} customdiv = 'mb-0' 
                                    onChange = { (value) => { this.onChangeFilter({target:{name:'empresa',value:value}}) } } />
                            </div>
                            <div className="col-md-6">
                                <SelectSearchGray options = { options.areas } placeholder = 'ÁREA' value = { filters.area } 
                                    withtaglabel = { 1 } withtextlabel = { 0 } withicon={0} customdiv = 'mb-0' 
                                    onChange = { (value) => { this.onChangeFilter({target:{name:'area',value:value}}) } } />
                            </div>
                            <div className="col-md-6">
                                <InputGray withtaglabel = { 1 } withtextlabel = { 0 } withplaceholder = { 1 } withicon = { 0 } requirevalidation = { 0 } 
                                    withformgroup = { 0 } name = 'tiempo_ejecucion' placeholder = 'TIEMPO EJECUCIÓN' value = { filters.tiempo_ejecucion } 
                                    onChange = { this.onChangeFilter } />
                            </div>
                            <div className="col-md-6">
                                <SelectSearchGray withtaglabel = { 1 } withtextlabel = { 0 } withicon={0} customdiv = 'mb-0' placeholder = 'ESTATUS' value = { filters.estatus } 
                                    options = { [ { value: 'Utilidad', name: 'Utilidad'}, { value: 'En espera', name: 'En espera'}, { value: 'Aceptado', name: 'Aceptado'}, { value: 'Rechazado', name: 'Rechazado'} ] } 
                                    onChange = { (value) => { this.onChangeFilter({target:{name:'estatus',value:value}}) } } />
                            </div>
                            <div className="col-md-9 my-6 text-center">
                                <RangeCalendar start = { filters.fecha.start } end = { filters.fecha.end } 
                                    onChange = { (value) => { this.onChangeFilter({target:{name:'fecha',value:{start: value.startDate, end: value.endDate}}}) } } />
                            </div>
                        </div>
                        <div className="mx-0 row justify-content-between border-top pt-4">
                            <Button only_icon='las la-redo-alt icon-lg' className="btn btn-light-danger btn-sm font-weight-bold" type = 'button' text="LIMPIAR" onClick = { this.clearFiltros } />
                            <Button only_icon='las la-filter icon-xl' className="btn btn-light-info btn-sm font-weight-bold" type = 'submit' text="FILTRAR"  />
                        </div>
                    </form>
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