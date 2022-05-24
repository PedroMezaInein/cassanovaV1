import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import Layout from '../../../components/layout/layout'
import {  DropdownButton, Dropdown, } from 'react-bootstrap';
import { connect } from 'react-redux'
import { URL_DEV, PROYECTOS_TICKETS } from '../../../constants'
import { setTextTable, setOptions, setLabelTable } from '../../../functions/setters'
import { deleteAlert, doneAlert, printResponseErrorAlert, errorAlert, /* waitAlert, */ pendingPaymentAlert } from '../../../functions/alert'
import { setSingleHeader } from '../../../functions/routers'
import axios from 'axios'
import $ from "jquery";
import { NewTable } from '../../../components/NewTables';
// import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { Modal } from '../../../components/singles'
import { TickesFilter } from '../../../components/filters'
import { setNaviIcon } from '../../../functions/setters'
import moment from 'moment'
// import { element } from 'prop-types';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faHashtag ,faUserAlt, faToolbox, faCalendarCheck, faPaperPlane, faSpellCheck, faPersonBooth, faMoneyBillWaveAlt , faFileInvoice } from '@fortawesome/free-solid-svg-icons'

class TicketTable extends Component {

    state = {
        calidad: '',
        form: { fecha: new Date() },
        modal: { filtros: false },
        restante: 0.0,
        filters: {
            id: '',
            proyecto: '',
            estatus: '',
            fecha_solicitud: { start: null, end: null },
            fecha_termino: { start: null, end: null },
            tipo_trabajo: '',
            descripcion: '',
            estatus_pago: '',
            filtrado_fecha: '',
            solicito: '',
            por_pagar: false,
            pagado: false,
            check_solicitud: false,
            check_termino: false
        },
        options: {
            estatus: [],
            tiposTrabajo: [],
        }
    }

    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const leads = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        if (!leads)
            history.push('/')
        this.getOptionsAxios()
        let queryString = this.props.history.location.search
        if (queryString) {
            let params = new URLSearchParams(queryString)
            let id = parseInt(params.get("id"))
            let estatus_ticket = params.get("estatus")
            if (id) {
                const { history } = this.props
                history.push({ pathname: '/calidad/tickets/detalles-ticket', state: { calidad: { id: id, estatus: { estatus: estatus_ticket ? estatus_ticket : 'En espera' } } } });
            }
        }
    }

    getOptionsAxios = async () => {
        /* waitAlert() */
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'calidad/options', { headers: setSingleHeader(access_token) }).then(
            (response) => {
                const { estatus, tiposTrabajo, restante } = response.data
                const { options, formularios, data, filters } = this.state
                options.estatus = setOptions(estatus, 'estatus', 'id')
                options.tiposTrabajo = setOptions(tiposTrabajo, 'nombre', 'id')
                this.setState({ ...this.state, options, data, formularios, restante: restante, filters: filters, })
                /* Swal.close() */
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    openModalDeleteTicket = calidad => {
        deleteAlert('¡BORRARÁS EL TICKET!', '¿DESEAS ELIMINARLO?', () => { this.deleteTicketAxios(calidad) })
    }

    doubleClick = (data, tipo) => {

    }



    setCalidad = calidad => {
        // const tr = $('tr.odd');
        let aux = []
        calidad.map((calidad) => {
            //     switch (calidad.estatus.estatus) {
            //     case 'Aceptado':
            //         console.log('verde')
            //     //    document.getElementsByClassName('odd').addClass('verde');
            //     //    element.classList.addClass('verde')
            //     // this.$('row').addClass('verde');
            //         break;
            //     case 'En proceso':
            //         console.log('rojo')
            //         document.getElementsByClassName('sorting_1 dtr-control')
            //         break;
            //     case 'Aprobación pendiente':
            //         // ('tbody').addClass('morado')
            //         document.getElementsByClassName('sorting_1 dtr-control');{
            //             console.log('morado');
            //         }
            //         break;
            //     default:
            //         break;
            //     }
            // console.log(calidad.estatus.estatus)

            aux.push(
                {
                    actions: this.setActionsMantenimientos(calidad),
                    identificador: this.label(calidad) ,
                    proyectos: this.proyectos(calidad) ,
                    fechas: this.fechas(calidad) ,
                    costo_presupuesto: this.presupuesto(calidad) ,
                    estatus: renderToString( calidad.estatus ? setLabelTable(calidad.estatus) : ''),
                    descripcion: renderToString(setTextTable(calidad.descripcion)),
                    id: calidad.id,
                    objeto: calidad
                }
            )
            return false

        })
        return aux
    }
    label(calidad){
                return(
                    <div>
                        <div className='d-flex align-items-center justify-content-center text-dark-75 white-space-nowrap'>
                            {/* <FontAwesomeIcon icon={faHashtag} className="icon-md mr-2" />                         */}
                            <span className="font-size-11px"> <strong>CLAVE -</strong> {`${calidad.no_clave}`} </span>                            
                           
                        </div>
                        <div className='d-flex align-items-center justify-content-center text-dark-75 white-space-nowrap'>
                            <i style={{ color: "#00565" }} className={`las la-ticket-alt icon-xl mr-2`} />                           
                            <span className="font-size-11px"> {`${calidad.identificador}`} </span>                            
                        </div>
                    </div>
                )
     
    }
    proyectos(calidad){
        return(
            <div>
                <div className='d-flex align-items-center  text-dark-75 white-space-nowrap'>
                {/* <i style={{ color: "#EF6C00" }} className={`las la-hard-hat icon-xl mr-2`} /> */}
                    <span className="font-size-11px"> <strong>PROYECTO -</strong> {`${calidad.proyecto ? calidad.proyecto.nombre : ''}`}</span>                            
                   
                </div>
                <div className='d-flex align-items-center  text-dark-75 white-space-nowrap'>
                    {/* <FontAwesomeIcon icon={faUserAlt} className="icon-md mr-2" />                                    */}
                    <span className="font-size-11px"> <strong>SOLICITANTE -</strong> {`${ calidad.solicito }`}</span>                            
                </div>
                <div className='d-flex align-items-center  text-dark-75 white-space-nowrap'>
                    {/* <FontAwesomeIcon icon={faToolbox} className="icon-md mr-2" />                                    */}
                    <span className="font-size-11px"> <strong>TIPO DE TRABAJO -</strong> {`${ calidad.tipo ? calidad.tipo.nombre : '' }`}</span>                            
                </div>
            </div>
        )

}

        fechas(calidad){
            return(
                <div>
                     <div className="toolbar-dropdown">
                     <span className="font-size-11px "style={{ color: "#3f4254" }} > <strong>Trabajo - </strong> {`${ calidad.reporte_url ? 'Terminado' : 'Pendiente' }`}</span>  

                        <DropdownButton menualign="center" title={<span className="d-flex">
                            {/* <FontAwesomeIcon icon={faCalendarCheck} className="icon-md mr-2 " style={{ color: "green" }}  />    */}
                                <span className="font-size-11px "style={{ color: "#3f4254" }} > <strong>SOLICITADA - </strong> {`${ calidad.created_at ? moment(calidad.created_at).format("DD/MM/YYYY") : 'Sin fecha' }`}</span>  

                                <i className="las la-angle-down icon-md p-0 ml-2"></i></span>}
                            id='dropdown-white' >
                            
                                    <Dropdown.Item className="text-hover-success dropdown-success" >
                                        <div className='d-flex align-items-center justify-content-center text-dark-75 white-space-nowrap'>
                                            {/* <FontAwesomeIcon icon={faPaperPlane} className="icon-md mr-2" />                                    */}
                                            <span className="font-size-11px">PPTO ENVIADO - {`${ calidad.fecha_ppto ? moment(calidad.fecha_ppto).format("DD/MM/YYYY") : 'PENDIENTE' }`}</span><br />                            
                                        </div>
                                    </Dropdown.Item>
                            
                                    <Dropdown.Item className="text-hover-primary dropdown-primary" >
                                        <div className='d-flex align-items-center justify-content-center text-dark-75 white-space-nowrap'>
                                            {/* <FontAwesomeIcon icon={faSpellCheck} className="icon-md mr-2" style={{ color: "green" }}/>                                    */}
                                            <span className="font-size-11px">Autorizado - {`${ calidad.fecha_autorizada ? moment(calidad.fecha_autorizada).format("DD/MM/YYYY") : 'PENDIENTE'  }`}</span>                            
                                        </div>
                                    </Dropdown.Item>
                            
                                    <Dropdown.Item className="text-hover-info dropdown-info" >
                                        <div className='d-flex align-items-center justify-content-center text-dark-75 white-space-nowrap'>
                                            {/* <FontAwesomeIcon icon={faPersonBooth} className="icon-md mr-3"  />                                    */}
                                            <span className="font-size-11px">INICIO DE TRABAJO - {`${ calidad.fecha_programada ? moment(calidad.fecha_programada).format("DD/MM/YYYY") : 'PENDIENTE'  }`}</span>                            
                                        </div>
                                    </Dropdown.Item>
                                    <Dropdown.Item className="text-hover-info dropdown-info" >
                                        <div className='d-flex align-items-center justify-content-center text-dark-75 white-space-nowrap'>
                                        {/* <FontAwesomeIcon icon={faCalendarCheck} className="icon-md mr-2"style={{ color: "red" }}  />                                    */}
                                        <span className="font-size-11px">TERMINO DE TRABAJO - {`${ calidad.fecha_termino ? moment(calidad.fecha_termino).format("DD/MM/YYYY") : 'PENDIENTE'  }`}</span>                            
                                        </div>
                                    </Dropdown.Item>
                            
                        </DropdownButton>
                    </div>
                    
                </div>
            )

        }

        presupuesto(calidad){
            const clave = calidad.identificador.substring(-1,2)

            return(
                <div>
                    
                    <div className='d-flex align-items-center  text-dark-75 white-space-nowrap'>
                        {/* <FontAwesomeIcon icon={faMoneyBillWaveAlt} className="icon-md mr-2 " style={{ color: "green" }}  />    */}
                        <span className="font-size-11px"> <strong>PRESUPUESTO -</strong> {`${ calidad.presupuesto_preeliminar ? calidad.presupuesto_preeliminar.totalPresupuesto : 'PENDIENTE' }`}</span>  
                    </div>
                    {
                         clave !== 'VO'  ?
                            calidad.estatus.estatus !== "Presupuesto no autorizado" ? 
                         <div className='d-flex align-items-center  text-dark-75 white-space-nowrap'>
                            {/* <FontAwesomeIcon icon={faFileInvoice} className="icon-md mr-2" style={{ color: "green" }} />                                    */}
                            <span className="font-size-11px"> <strong>FACTURA -</strong> {`${ calidad.factura_folio ? calidad.factura_folio : 'PENDIENTE' }`}</span>                            
                         </div>
                         : ''
                         : ''
                    }                   
                   {
                      clave !== 'VO' ? 
                        calidad.estatus.estatus !== "Presupuesto no autorizado" ? 
                    <div className='d-flex align-items-center  text-dark-75 white-space-nowrap'>
                        {/* <i style={{ color: "#EF6C00" }} className={`las la-cart-plus icon-xl mr-2`} />                                   */}
                        <span className="font-size-11px"> <strong>ORDEN DE COMPRA -</strong> {`${ calidad.numero_orden ? calidad.numero_orden : 'PENDIENTE'  }`}</span>                            
                    </div>  
                    : ''
                    : ''
                    }                  
                </div>
            )

        }

    setActionsMantenimientos = (calidad) => {
        return (
            <div className="w-100 d-flex justify-content-center">
                <DropdownButton menualign="right" title={<i className="las la-angle-down icon-md  icon-md p-0 "></i>} id='dropdown-button-newtable' >
                    <Dropdown.Item className="text-hover-primary dropdown-primary" onClick={(e) => { e.preventDefault(); this.changePageSee(calidad) }}>
                        {setNaviIcon('flaticon2-magnifier-tool', 'Ver ticket')}
                    </Dropdown.Item>
                    <Dropdown.Item className="text-hover-danger dropdown-danger"
                        onClick={(e) => { e.preventDefault(); this.openModalDeleteTicket(calidad) }}>
                        {setNaviIcon('flaticon2-rubbish-bin', 'eliminar')}
                    </Dropdown.Item>
                </DropdownButton>
            </div>
        )
    }

    async getCalidadAxios() {
        $('#tickets').DataTable().search({}).draw();
    }

    deleteTicketAxios = async (ticket) => {
        const { access_token } = this.props.authUser
        await axios.delete(`${URL_DEV}calidad/${ticket.id}`, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                this.getCalidadAxios();
                doneAlert('Ticket eliminado con éxito')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    changePageSee = calidad => {
        const { history } = this.props
        history.push({
            pathname: '/calidad/tickets/detalles-ticket',
            state: { calidad: calidad },
            formeditado: 1
        });
    }

    async exportTicketsAxios() {
        const { access_token } = this.props.authUser
        const { filters } = this.state
        let filtros = JSON.stringify(filters)
        await axios.post(`${URL_DEV}v2/exportar/calidad/calidad`, { 'search': filtros }, { responseType: 'blob', headers: setSingleHeader(access_token) }).then(
            (response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'tickets.xlsx');
                document.body.appendChild(link);
                link.click();
                doneAlert(response.data.message !== undefined ? response.data.message : 'Tickets exportados con éxito.')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    openModalFiltros = () => {
        const { modal } = this.state
        modal.filtros = true
        this.setState({ ...this.state, modal })
    }

    handleCloseFiltros = () => {
        const { modal } = this.state
        modal.filtros = false
        this.setState({ ...this.state, modal })
    }

    clearFiltros = (e) => {
        e.preventDefault()
        const { modal } = this.state
        modal.filtros = false
        this.setState({ ...this.state, modal, filters: this.clearFilters() })
        this.getCalidadAxios();
    }

    clearFilters = () => {
        const { filters } = this.state
        let aux = Object.keys(filters)
        aux.forEach((element) => {
            switch (element) {
                case 'fecha_solicitud':
                case 'fecha_termino':
                    filters[element] = { start: null, end: null }
                    break;
                case 'por_pagar':
                case 'pagado':
                case 'check_solicitud':
                case 'check_termino':
                    filters[element] = false
                    break;
                case 'estatus':
                case 'tipo_trabajo':
                    filters[element] = []
                    break;
                default:
                    filters[element] = ''
                    break;
            }
        })
        return filters;
    }

    onSubmitFilters = () => {
        const { filters, modal } = this.state
        modal.filtros = false
        this.setState({ ...this.state, modal })
        $('#tickets').DataTable().search(JSON.stringify(filters)).draw();
    }

    onChangeFilter = e => {
        const { name, value, type, checked } = e.target
        const { filters } = this.state
        filters[name] = value
        if (type === 'checkbox') {
            switch (name) {
                case 'pagado':
                    filters.pagado = checked
                    filters.por_pagar = false
                    filters.estatus_pago = 'Pagado'
                    break;
                case 'por_pagar':
                    filters.pagado = false
                    filters.por_pagar = checked
                    filters.estatus_pago = 'Por pagar'
                    break;
                case 'check_solicitud':
                    filters.check_solicitud = checked
                    filters.check_termino = false
                    filters.fecha_termino = { start: null, end: null }
                    break;
                case 'check_termino':
                    filters.check_termino = checked
                    filters.check_solicitud = false
                    filters.fecha_solicitud = { start: null, end: null }
                    break;
                default:
                    break;
            }
            if (filters.pagado === false && filters.por_pagar === false) {
                filters.estatus_pago = ''
            }
        }
        this.setState({ ...this.state, filters })
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

    pendingPaymentClick = () => {
        const { restante } = this.state
        pendingPaymentAlert('PENDIENTE DE PAGO', restante)
    }

    render() {
        const { modal, filters, options } = this.state
        return (
            <Layout active={'calidad'}  {...this.props}>
                {/* <Card id={`tickets-card-id`} className={`card-custom card-sticky tickets-card-class`}>
                    <Card.Header id={`tickets-card-header-id`} className={`tickets-card-header-class border-0`}>
                        <div className={`card-title Tickets`} >
                            <h3 className={`card-label font-weight-bolder Listado de tickets`}> Tickets
                                <span className={`d-block text-muted pt-2 font-size-sm Tickets`}>
                                    Listado de tickets
                                </span>
                            </h3>
                        </div>
                        <div className="card-toolbar toolbar-dropdown">
                            <DropdownButton menualign="right" title={<span>OPCIONES <i className="las la-angle-down icon-md p-0 ml-2"></i></span>} id='dropdown-newtable-options' >

                                <Dropdown.Item className="text-hover-success dropdown-success" onClick={this.clickHandler} >
                                    {this.setNaviIcon('flaticon-add', 'AGREGAR')}
                                </Dropdown.Item>
                                :
                                        <Dropdown.Item className="text-hover-success dropdown-success" href={url} >
                                            {this.setNaviIcon('flaticon-add', 'AGREGAR')}
                                        </Dropdown.Item>
                                <Dropdown.Item className="text-hover-info dropdown-info" onClick={this.openModalFiltros}>
                                    {this.setNaviIcon('fas fa-filter', 'FILTRAR')}
                                </Dropdown.Item>

                                <Dropdown.Item className="text-hover-primary dropdown-primary" onClick={() => this.clickHandlerExport()} >
                                    {this.setNaviIcon('far fa-file-excel', 'EXPORTAR')}
                                </Dropdown.Item>

                                <Dropdown.Item className="text-hover-warning dropdown-warning" onClick={this.pendingPaymentClick}>
                                    {this.setNaviIcon('flaticon-exclamation', 'PENDIENTE DE PAGO')}
                                </Dropdown.Item>
                            </DropdownButton>
                        </div>
                    </Card.Header>
                    <Card.Body id={`tickets-card-body-id`} className="pt-0">
                        {/* {children} 
                        <div className="table-responsive-xl">
                            <table  url='/calidad/tickets/nuevo-ticket' columns={PROYECTOS_TICKETS}  accessToken={this.props.authUser.access_token}
                    setter={this.setCalidad} urlRender={`${URL_DEV}v3/calidad/tickets`} filterClick={this.openModalFiltros} exportar_boton={true}
                    onClickExport={() => this.exportTicketsAxios()} pendingPaymentClick={this.pendingPaymentClick}  ref='main' className="table table-separate table-head-custom table-checkable display table-hover text-justify datatables-net" id={'tickets'} />
                        </div>
                    </Card.Body>
                </Card> */}


                <NewTable tableName='tickets' subtitle='Listado de tickets' title='Tickets' mostrar_boton={true}        abrir_modal={false}
                    url='/calidad/tickets/nuevo-ticket' columns={PROYECTOS_TICKETS} accessToken={this.props.authUser.access_token}
                    setter={this.setCalidad} urlRender={`${URL_DEV}v3/calidad/tickets`} filterClick={this.openModalFiltros} exportar_boton={true}
                    onClickExport={() => this.exportTicketsAxios()} pendingPaymentClick={this.pendingPaymentClick}  />
                <Modal size='lg' title='Filtros' show={modal.filtros} handleClose={this.handleCloseFiltros}>
                    <TickesFilter filters={filters} clearFiltros={this.clearFiltros} onSubmitFilters={this.onSubmitFilters}
                        onChangeFilter={this.onChangeFilter} options={options} />
                </Modal>
            </Layout>
        )
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(TicketTable);