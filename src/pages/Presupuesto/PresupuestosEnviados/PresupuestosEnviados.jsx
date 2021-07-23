import React, { Component } from "react"
import { renderToString } from "react-dom/server";
import { connect } from "react-redux"
import Layout from "../../../components/layout/layout"
import { NewTable } from '../../../components/NewTables';
import { PRESUPUESTO_UTILIDAD_COLUMNS, URL_DEV } from "../../../constants";
import { setTextTable, setLabelTable, setTextTableCenter, setDateTable, setOptions } from "../../../functions/setters";
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { deleteAlert, doneAlert, errorAlert, printResponseErrorAlert, waitAlert } from "../../../functions/alert";
import { setSingleHeader } from "../../../functions/routers";
import axios from 'axios'
import $ from "jquery";
import { Modal } from '../../../components/singles'
import { InputGray, SelectSearchGray, RangeCalendar, Button } from "../../../components/form-components";
import Swal from 'sweetalert2'

const DatatableName = 'presupuestos'
class PresupuestosEnviados extends Component {

    state = { 
        modal: false,
        filters: {
            proyecto: '',
            fecha: { start: null, end: null },
            empresa: '',
            area: '',
            tiempo_ejecucion: ''
        },
        options: { empresas: [], areas: [] }
    }
    
    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props;
        const { history: { location: { pathname } } } = this.props;
        const { history, location: { state } } = this.props;
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

    setActions = (element) => {
        const { history } = this.props
        return(
            <div className="w-100 d-flex justify-content-center">
                <OverlayTrigger overlay = { <Tooltip>EDITAR</Tooltip> }  >
                    <button className = {`btn btn-icon btn-actions-table btn-xs ml-2 btn-text-success btn-hover-success`} 
                        onClick = { (e) => { e.preventDefault(); history.push({ pathname: '/presupuesto/presupuestos-enviados/finish', 
                            state: { presupuesto: element } }) } }>
                        <i className = 'fas flaticon2-pen' />
                    </button>
                </OverlayTrigger>
                <OverlayTrigger overlay = { <Tooltip>ELIMINAR</Tooltip> }  >
                    <button className = {`btn btn-icon btn-actions-table btn-xs ml-2 btn-text-danger btn-hover-danger`} 
                        onClick = { (e) => { e.preventDefault(); deleteAlert('¿Deseas continuar?', 'Eliminarás el presupuesto', 
                        () => this.deletePresupuestoAxios(element.id))} }>
                        <i className = 'flaticon2-rubbish-bin' />
                    </button>
                </OverlayTrigger>
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

    render() {
        const { access_token } = this.props.authUser
        const { modal, filters, options } = this.state
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
            </Layout>
        );
    }
}

const mapStateToProps = state => { return { authUser: state.authUser} }
const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(PresupuestosEnviados);