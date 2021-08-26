import React, { Component } from 'react'
import { Card, Nav, Tab, Dropdown, Col, Row, OverlayTrigger, Tooltip } from 'react-bootstrap'
import ItemSlider from '../../../singles/ItemSlider'
import { PresupuestoForm, ActualizarPresupuestoForm, SolicitudTabla, SolicitudVentaForm, PresupuestoGeneradoCalidad, AgregarConcepto } from '../../../../components/forms'
import { Button, SelectSearchGray,InputGray } from '../../../form-components'
import 'moment/locale/es'
import imageCompression from 'browser-image-compression';
import { questionAlert, waitAlert } from '../../../../functions/alert'
import { dayDMY, setOptions } from '../../../../functions/setters'
import { Modal } from '../../../../components/singles'
import { ProcesoTicketForm } from '../../../../components/forms'
import Scrollbar from 'perfect-scrollbar-react'
import { SolicitudFacturacionTabla } from '../../../tables'
import FloatButtons from '../../../../components/singles/FloatButtons'
import 'perfect-scrollbar-react/dist/style.min.css'
class TicketView extends Component {

    state = { checked: true }

    componentDidUpdate(prevProps, old){
        if(prevProps.modalSol === false && this.props.modalSol === true){
            this.setState({...this.state, checked: true })
        }
    }

    getIniciales = nombre => {
        let aux = nombre.split(' ');
        let iniciales = ''
        aux.map((element) => {
            if (element !== '-')
                iniciales = iniciales + element.charAt(0) + ' '
            return false
        })
        return iniciales
    }

    onChange = (files) => {
        const { addingFotos, data } = this.props
        questionAlert('ENVIARÁS NUEVAS FOTOS', '¿QUIERES CONTINUAR?', () => { 
            waitAlert()
            let compressed = files.map((file) => {
                let options = {
                    maxSizeMB: parseInt(file.size/1024/1024) <= 2 ? 1 : parseInt(file.size/1024/1024) - 1,
                    useWebWorker: true
                }
                return new Promise((resolve, reject) => {
                    imageCompression(file, options).then(function (compressedFile) {
                        compressedFile.lastModifiedDate = new Date()
                        compressedFile.path = compressedFile.name
                        resolve(compressedFile)
                    }).catch(function (error) {
                        console.error(reject(error));
                    });
                })
            })
            Promise.all(compressed).then( values => { addingFotos(values, data.id, data.proyecto_id) } ).catch(err => console.error(err))
        })
    }

    checkButton = e => {
        const { name, checked } = e.target
        const { onChange, formulario } = this.props
        let value = formulario.presupuesto.conceptos
        value[name] = checked
        onChange(value, 'conceptos', 'presupuesto')
    }

    checkButtonPreeliminar = (key, e) => {
        const { name, checked } = e.target
        const { formulario, onChange } = this.props
        let valor = formulario.preeliminar.conceptos
        valor[key][name] = checked ? 1 : 0
        if(name === 'vicio_oculto'){
            if(valor[key].vicio_oculto){
                valor[key].importe = (0).toFixed(2)
            }else{
                valor[key].importe = this.getImporte(key, valor)
            }
        }
        onChange(valor, 'conceptos', 'preeliminar')
    }

    onChangePresupuesto = (e) => {
        const { name, value } = e.target;
        const { datos, onChange, setData } = this.props
        onChange(value, name, 'presupuesto')
        switch (name) {
            case 'partida':
                datos.partidas.map((partida) => {
                    datos.conceptos = []
                    if (partida.id.toString() === value) {
                        datos.subpartidas = partida.subpartidas
                    }
                    return false
                })
                break;
            case 'subpartida':
                datos.subpartidas.map((subpartida) => {
                    if (subpartida.id.toString() === value) {
                        datos.conceptos = subpartida.conceptos
                    }
                    return false
                })
                break;
            default:
                break;
        }
        setData(datos)
    };

    onChangePreeliminar = (key, e, name) => {
        let { value } = e.target
        const { formulario, onChange, presupuesto } = this.props
        let valor = formulario.preeliminar.conceptos
        if (name === 'desperdicio') {
            value = value.replace('%', '')
        }
        if (name === 'cantidad_preliminar'){
            if (presupuesto.conceptos[key][name].toString() !== value) {
                valor[key]['bg_cantidad'] = false
            }else{
                valor[key]['bg_cantidad'] = true
            }
        }
        valor[key][name] = value
        valor[key].cantidad = this.getCantidad(key, valor)

        if(valor[key].vicio_oculto){
            valor[key].importe = (0).toFixed(2)
        }else{
            valor[key].importe = this.getImporte(key, valor)
        }
        if (name !== 'mensajes' && name !== 'desperdicio')
            if (presupuesto.conceptos[key][name] !== valor[key][name]) {
                valor[key].mensajes.active = true
            } else {
                valor[key].mensajes.active = false
            }
        if (name === 'desperdicio')
            if (presupuesto.conceptos[key][name].toString() !== valor[key][name].toString()) {
                valor[key].mensajes.active = true
                valor[key].mensajes.mensaje = ('Actualización del desperdicio a un ' + value + '%').toUpperCase()
            } else {
                valor[key].mensajes.active = false
                valor[key].mensajes.mensaje = ''
            }
        onChange(valor, 'conceptos', 'preeliminar')
    }

    getCantidad(key, valor){
        let cantidad = (valor[key].cantidad_preliminar * (1 + (valor[key].desperdicio / 100))).toFixed(2)
        return cantidad
    }
    getImporte(key, valor){
        let importe = (this.getCantidad(key, valor) * valor[key].costo).toFixed(2)
        return importe
    }
    calcularCantidades = () => {
        const { presupuesto } = this.props
        let suma = 0
        presupuesto.conceptos.forEach((con) => {
            if(con.active)
                suma += con.cantidad
        })
        if(suma)
            return true
        return false
    }

    showStepOfPresupuesto = () => {
        const { presupuesto } = this.props
        if( presupuesto ){
            if(presupuesto.estatus)
                switch(presupuesto.estatus.estatus){
                    case 'Conceptos':
                    case 'Volumetrías':
                        return <span className="nav-text font-weight-bolder white-space-nowrap">Conceptos y volumetrías</span>
                    case 'Costos':
                        return <span className="nav-text font-weight-bolder white-space-nowrap">Estimación de costos</span>
                    case 'Utilidad':
                        return <span className="nav-text font-weight-bolder white-space-nowrap">Calculando utilidad</span>
                    case 'En revisión':
                        return <span className="nav-text font-weight-bolder white-space-nowrap">En revisión</span>
                    case 'En espera':
                        return <span className="nav-text font-weight-bolder white-space-nowrap">En espera del cliente</span>
                    case 'Aceptado':
                        return <span className="nav-text font-weight-bolder white-space-nowrap">Presupuesto Aceptado</span>
                    case 'Rechazado':
                        return <span className="nav-text font-weight-bolder white-space-nowrap">Presupuesto Rechazado</span>
                    default:
                        break;
                }
            return <span className="nav-text font-weight-bolder">No</span>
        }
        return <span className="nav-text font-weight-bolder white-space-nowrap">Conceptos y volumetrías</span>
    }

    isButtonEnabled = () => {
        const { presupuesto } = this.props
        if( presupuesto ){
            if(presupuesto.estatus)
                switch(presupuesto.estatus.estatus){
                    case 'Conceptos':
                    case 'Volumetrías':
                    case 'En revisión':
                        return true
                    default:
                        return false
                }
            return true
        }
        return true
    }

    showTabTicketProceso = () => {
        const { data } = this.props
        if( data ){
            if(data.estatus_ticket){
                switch(data.estatus_ticket.estatus){
                    case 'En proceso':
                        return <span>Ticket en proceso</span>
                    case 'Terminado':
                        return <span>Ticket terminado</span>
                    default:
                        break;
                }
            }
        }
    }

    setConceptosOptions = concepto => {
        let aux = []
        if(concepto.concepto)
            if(concepto.concepto.subpartida)
                if(concepto.concepto.subpartida.partida)
                    if(concepto.concepto.subpartida.partida.areas)
                        if(concepto.concepto.subpartida.partida.areas.length)
                            aux = setOptions(concepto.concepto.subpartida.partida.areas, 'nombre', 'id')
        return aux
    }

    setConceptosSubareasOptions = (concepto, index) => {
        if(concepto.area !== ''){
            let objeto = concepto.concepto.concepto.subpartida.partida.areas.find((area) => {
                return area.id.toString() === concepto.area;
            })
            if(objeto)
                return setOptions(objeto.subareas, 'nombre', 'id')
        }
        return []
    }

    onChangeSolicitudCompra = (e, index) => {
        let { onChangeSolicitudCompra } = this.props
        const { name, value } = e.target
        onChangeSolicitudCompra(value, name, index)
    }

    selectCheck = e => {
        const { checked } = e.target
        const { changeTypeSolicitudes } = this.props
        changeTypeSolicitudes(checked)
        this.setState({...this.state, checked: checked})
    }

    selectCheckInner = (e, index) => {
        const { checked } = e.target
        let { onChangeSolicitudCompra } = this.props
        onChangeSolicitudCompra(checked, 'join', index)
    }

    update = ( value, index, name ) => {
        let { onChangeSolicitudCompra } = this.props
        onChangeSolicitudCompra(value, name, index)
        if(name === 'area')
            onChangeSolicitudCompra('', 'subarea', index)
    }

    getSubareas = ( concepto ) => {
        const { options } = this.props
        if(concepto.area !== ''){
            let objeto = options.areas.find((area) => {
                return area.value.toString() === concepto.area.toString()
            })
            if(objeto)
                return setOptions(objeto.subareas, 'nombre', 'id')
        }
        return []
    }

    onChangeValueSolicitudCompraInner = ( value, name, index, key ) => {
        const { formulario, onChangeSolicitudCompra } = this.props
        let valor = formulario.conceptos[index].form
        valor[key][name] = value
        onChangeSolicitudCompra(valor, 'form', index)
    }

    onChangeSolicitudCompraInner = ( e, index, key ) => {
        const { formulario, onChangeSolicitudCompra } = this.props
        const { value, name } = e.target
        let valor = formulario.conceptos[index].form
        valor[key][name] = value
        onChangeSolicitudCompra(valor, 'form', index)
    }

    tooltip(estatus, details, dotHover, colorText ){
        const { aux_estatus } = this.props
        let activeHoverT=false;
        switch (estatus) {
            case 'En espera':
                if(aux_estatus.espera){ activeHoverT= true }
                break;
            case 'En revisión':
                if(aux_estatus.revision){ activeHoverT= true }
                break;
            case 'Rechazado':
                if(aux_estatus.rechazado){ activeHoverT= true }
                break;
            case 'Aceptado':
                if(aux_estatus.aceptado){ activeHoverT= true }
                break;
            case 'Aprobación pendiente':
                if(aux_estatus.aprobacion){ activeHoverT= true }
                break;
            case 'En proceso':
                if(aux_estatus.proceso){ activeHoverT= true }
                break;
            case 'Pendiente de pago':
                if(aux_estatus.pendiente){ activeHoverT= true }
                break;
            case 'Terminado':
                if(aux_estatus.terminado){ activeHoverT= true }
                break;
            default:
                break;
        }
        return(
            <OverlayTrigger overlay={
                <Tooltip className="mb-4 tool-time-line">
                    <div className={`tool-titulo ${colorText} font-weight-bolder letter-spacing-0-4 py-1`}> {estatus === 'Aceptado/Rechazado' ?<span><span className="color-aceptado-presupuesto">Aceptado</span> <span className="font-weight-light">/</span> <span className="color-rechazado-presupuesto">Rechazado</span></span> : estatus} </div>
                    <div className="text-justify px-5 pb-3 mt-1">{details}</div>
                </Tooltip>
            }>
                <div className={`status ${activeHoverT?dotHover:''}`}>
                    <h4>{estatus}</h4>
                </div>
            </OverlayTrigger>
        )
    }
    setNavTabs = () => {
        const { data } = this.props
        if( data ){
            if(data.estatus_ticket){
                switch(data.estatus_ticket.estatus){
                    case 'En espera':
                    case 'En revisión':
                    case 'Rechazado':
                        return 'adjuntos'
                    case 'Aceptado':
                    case 'Aprobación pendiente':
                        return 'presupuesto'
                    case 'En proceso':
                    case 'Terminado':
                    case 'Pendiente de pago':
                        return 'solicitud-compra'
                    default:
                        break;
                }
            }
        }
        return ''
    }
    render() {
        /* ------------------------------- DATOS PROPS ------------------------------ */
        const { data, options, formulario, presupuesto, datos, title, modal, formeditado, solicitudes, aux_estatus, aux_presupuestos, key, activeKeyNav, formularioGuardado } = this.props
        /* ----------------------------- FUNCIONES PROPS ---------------------------- */
        const { openModalWithInput, changeEstatus, onClick, setOptions, onSubmit, deleteFile, openModalConceptos, openModalSolicitud, handleCloseSolicitud, 
            onChangeSolicitud, clearFiles, openModalEditarSolicitud, deleteSolicitud, onSubmitSVenta, onChangeTicketProceso, onSubmitTicketProceso, 
            handleChangeTicketProceso, generateEmailTicketProceso, controlledNav, openAlertChangeStatusP, onChangeConceptos, checkButtonConceptos, 
            controlledTab, onSubmitConcept, handleCloseConceptos, openModalReporte, onChangeSolicitudCompra, submitSolicitudesCompras, addRows, save, recover
        } = this.props

        const { checked } = this.state
        return (
            <div className="p-0">
                {/* ------------------------ { ANCHOR TAB CONTAINER } ------------------------ */}
                {
                    data ? 
                        data.proyecto ?
                            <Tab.Container defaultActiveKey={this.setNavTabs()}>
                                <Card className = 'card card-custom gutter-b'>
                                    <Card.Body className="pb-0">
                                        <div className="d-flex">
                                            <div className="mr-4 align-self-center d-none d-sm-none d-md-none d-lg-block">
                                                <div className="symbol symbol-50 symbol-lg-120 symbol-light-info">
                                                    <span className="font-size-h6 symbol-label font-weight-boldest ">
                                                        {data.identificador}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex-grow-1 align-self-center">
                                                <div className="d-flex align-items-start justify-content-between flex-wrap mt-2">
                                                    <div className="mr-3">
                                                        <div className="d-flex align-items-center text-dark font-size-h5 font-weight-bold mr-3">
                                                            {data.proyecto.nombre}
                                                        </div>
                                                        <div className="d-flex flex-wrap mt-2">
                                                            {
                                                                data.solicito &&
                                                                    <div className="font-weight-bold my-2 text-dark-65 font-size-lg mr-3 d-flex align-items-center">
                                                                        <i className="la la-user-tie icon-lg text-info mr-1" />
                                                                        {data.solicito}
                                                                    </div>
                                                            }
                                                            {
                                                                data.created_at &&
                                                                    <div className="font-weight-bold my-2 text-dark-65 font-size-lg d-flex align-items-center mr-3">
                                                                        <i className="la la-calendar-check icon-lg text-info mr-1" />
                                                                        {dayDMY(data.created_at)}
                                                                    </div>
                                                            }
                                                            {
                                                                data.subarea ?
                                                                    <div className="font-weight-bold my-2 text-dark-65 font-size-lg d-flex align-items-center">
                                                                        <i className="las la-tools icon-lg text-info mr-1" />
                                                                        {data.subarea.nombre}
                                                                    </div>
                                                                :<></>
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="mb-2">
                                                        {
                                                            data.estatus_ticket ?
                                                                <Dropdown>
                                                                    <Dropdown.Toggle
                                                                        style = { { backgroundColor: data.estatus_ticket.fondo, color: data.estatus_ticket.letra,
                                                                            border: 'transparent', padding: '2.8px 5.6px', width: 'auto', margin: 0, 
                                                                            display: 'inline-flex', justifyContent: 'center', alignItems: 'center', fontSize: '10.7px',
                                                                            fontWeight: 500, paddingTop: '3px' } } >
                                                                        {data.estatus_ticket.estatus.toUpperCase()}
                                                                    </Dropdown.Toggle>
                                                                    <Dropdown.Menu className="p-0">
                                                                        <Dropdown.Header> <span className="font-size-sm">Elige una opción</span> </Dropdown.Header>
                                                                        {
                                                                            options.estatus ?
                                                                                options.estatus.map((estatus, key) => {
                                                                                    if ( estatus.name === 'Rechazado' || estatus.name === 'En revisión' || estatus.name === 'En espera')
                                                                                        return (
                                                                                            <div key = { key } >
                                                                                                <Dropdown.Item className="p-0" key={key} onClick={() => { changeEstatus(estatus.name) }} >
                                                                                                    <span className="navi-link w-100">
                                                                                                        <span className="navi-text">
                                                                                                            <span className="label label-xl label-inline rounded-0 w-100 font-weight-bolder"
                                                                                                                style={{ color: estatus.letra, backgroundColor: estatus.fondo }}>
                                                                                                                {estatus.name}
                                                                                                            </span>
                                                                                                        </span>
                                                                                                    </span>
                                                                                                </Dropdown.Item>
                                                                                                <Dropdown.Divider className="m-0" style={{ borderTop: '1px solid #fff' }} />
                                                                                            </div>
                                                                                        )
                                                                                    else return <div key = {key}></div>
                                                                                })
                                                                            : ''
                                                                        }
                                                                    </Dropdown.Menu>
                                                                </Dropdown>
                                                            : ''
                                                        }
                                                    </div>
                                                </div>
                                                {
                                                    data.estatus_ticket ?
                                                        <div className="d-flex align-items-start flex-wrap justify-content-between">
                                                            {
                                                                data.descripcion ?
                                                                    <div className={`font-weight-light text-dark-50 py-lg-2 text-justify pl-0 ${data.estatus_ticket.estatus === 'En revisión' || data.estatus_ticket.estatus === 'Rechazado' ?'col-md-10':'col-md-12'}`}>
                                                                        {data.descripcion}
                                                                    </div>
                                                                : ''
                                                            }
                                                            {
                                                                data.estatus_ticket.estatus === 'En revisión' ?
                                                                    <>
                                                                        <Button icon='' onClick={() => { changeEstatus('Aceptado') }}
                                                                            className={"btn btn-icon btn-light-success btn-sm mr-2 ml-auto"}
                                                                            only_icon={"flaticon2-check-mark icon-sm"} tooltip={{ text: 'ACEPTAR' }} />
                                                                        <Button icon='' onClick={() => { openModalWithInput('Rechazado') }}
                                                                            className={"btn btn-icon btn-light-danger btn-sm pulse pulse-danger"}
                                                                            only_icon={"flaticon2-cross icon-sm"} tooltip={{ text: 'RECHAZAR' }} />
                                                                    </>
                                                                    : data.estatus_ticket.estatus === 'Rechazado' ?
                                                                        <div className="d-flex flex-wrap">
                                                                            <div>
                                                                                <div className="text-muted font-weight-bold">
                                                                                    {data.motivo_cancelacion}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        : ''
                                                            }
                                                        </div>
                                                    :<></>
                                                }
                                            </div>
                                        </div>
                                        <div className="row mx-0 my-5">
                                            <div className="col-sm-11 col-md-9 col-xl-10 col-xxl-7 mx-auto box-shadow-53">
                                                <div className="ribbon-estatus col-md-3 px-5 mx-auto mb-5">
                                                    <span className="ribbon-tickets">
                                                        TICKETS
                                                    </span>
                                                </div>
                                                {
                                                    data.estatus_ticket &&
                                                    <div className="table-responsive">
                                                        <div className="list min-w-fit-content" data-inbox="list">
                                                            <ul className="timeline-estatus p-0">
                                                                <li className={`li ${aux_estatus.espera ? 'complete_espera' : ''}`}>
                                                                    {this.tooltip('En espera', 'El cliente o el departamento de calidad hacen el levantamiento del ticket.', 'dot-espera-ticket', 'header-ticket-espera')}
                                                                </li>
                                                                <li className={`li ${aux_estatus.revision ? 'complete_revision' : ''}`}>
                                                                    {this.tooltip('En revisión', 'El departamento de calidad verifica si la petición es considerado un ticket.', 'dot-revision-ticket', 'header-ticket-revision')}
                                                                </li>
                                                                <li className={`li ${aux_estatus.aceptado ? 'complete_aceptado' : aux_estatus.rechazado ? 'complete_rechazado' : ''}`}>
                                                                    {this.tooltip(aux_estatus.aceptado ? 'Aceptado' : aux_estatus.rechazado ? 'Rechazado' : 'Aceptado/Rechazado',
                                                                        aux_estatus.aceptado ? 'El departamento de calidad aprueba el ticket.' : aux_estatus.rechazado ? 'El departamento de calidad rechaza el ticket.' : 'El departamento de calidad aprueba o declina el ticket.',
                                                                        aux_estatus.aceptado ? 'dot-aceptado-ticket' : 'dot-rechazado-ticket',
                                                                        aux_estatus.aceptado ? 'header-ticket-aceptado' : aux_estatus.rechazado ? 'header-ticket-rechazado' : 'bg-aceptado-rechazado')}
                                                                </li>
                                                                {
                                                                    data.estatus_ticket.estatus !== 'Rechazado' &&
                                                                    <>
                                                                        <li className={`li ${aux_estatus.aprobacion ? 'complete_pendiente' : ''}`}>
                                                                            {this.tooltip('Aprobación pendiente', 'El cliente recibió un presupuesto generado y se espera su aprobación.', 'dot-aprobacion-ticket', 'header-ticket-aprobacion')}
                                                                        </li>
                                                                        <li className={`li ${aux_estatus.proceso ? 'complete_proceso' : ''}`}>
                                                                            {this.tooltip('En proceso', 'El departamento de calidad inicia con los trabajos.', 'dot-proceso-ticket', 'header-ticket-proceso')}
                                                                        </li>
                                                                        <li className={`li ${aux_estatus.pendiente ? 'complete_pendiente_pago' : ''}`}>
                                                                            {this.tooltip('Pendiente de pago', 'El departamento de calidad espera el pago del presupuesto.', 'dot-pendiente-pago-ticket', 'header-ticket-pendiente-pago')}
                                                                        </li>
                                                                        <li className={`li ${aux_estatus.terminado ? 'complete_terminado' : ''}`}>
                                                                            {this.tooltip('Terminado', 'El departamento de calidad finaliza las peticiones solicitadas.', 'dot-terminado-ticket', 'header-ticket-terminado')}
                                                                        </li>
                                                                    </>
                                                                }
                                                            </ul>
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                        <div className="d-flex overflow-auto">
                                            <Nav className="nav nav-tabs nav-tabs-line-info nav-tabs-line nav-tabs-line-2x font-size-h6 flex-nowrap align-items-center border-transparent align-self-end ">
                                                <Nav.Item onClick={(e) => { e.preventDefault(); controlledNav("adjuntos") }}>
                                                    <Nav.Link eventKey="adjuntos">
                                                        <span className="nav-icon">
                                                            <i className="las la-photo-video icon-lg mr-2"></i>
                                                        </span>
                                                        <span className="nav-text font-weight-bolder">FOTOS</span>
                                                    </Nav.Link>
                                                </Nav.Item>
                                                {
                                                    data.estatus_ticket.estatus !== 'Rechazado' && data.estatus_ticket.estatus !== 'En espera' && data.estatus_ticket.estatus !== 'En revisión' ?
                                                        <Nav.Item onClick = { (e) => { e.preventDefault(); onClick('volumetrias'); controlledNav("presupuesto") } } >
                                                            <Nav.Link eventKey="presupuesto">
                                                                <span className="nav-icon"> <i className="las la-file-invoice-dollar icon-lg mr-2" /> </span>
                                                                { this.showStepOfPresupuesto() }
                                                            </Nav.Link>
                                                        </Nav.Item>
                                                    : <></>
                                                }
                                                {
                                                    presupuesto?
                                                        presupuesto.estatus.estatus === "Aceptado" ?
                                                        <>
                                                            <Nav.Item onClick={(e) => { e.preventDefault(); onClick('solicitud-compra'); controlledNav("solicitud-compra") }}>
                                                                <Nav.Link eventKey="solicitud-compra">
                                                                    <span className="nav-icon">
                                                                        <i className="las la-file-invoice-dollar icon-lg mr-2"></i>
                                                                    </span>
                                                                    <span className="nav-text font-weight-bolder white-space-nowrap">Solicitud de compra</span>
                                                                </Nav.Link>
                                                            </Nav.Item>
                                                            <Nav.Item onClick={(e) => { e.preventDefault(); onClick('facturacion'); controlledNav("facturacion") }}>
                                                                <Nav.Link eventKey="facturacion">
                                                                    <span className="nav-icon">
                                                                        <i className="las la-clipboard-list icon-lg mr-2"></i>
                                                                    </span>
                                                                    <span className="nav-text font-weight-bolder white-space-nowrap">Facturación</span>
                                                                </Nav.Link>
                                                            </Nav.Item>
                                                            <Nav.Item onClick={(e) => { e.preventDefault(); onClick('ticket-proceso'); controlledNav("ticket-proceso") }}>
                                                                <Nav.Link eventKey="ticket-proceso">
                                                                    <span className="nav-icon">
                                                                        <i className="las la-ticket-alt icon-lg mr-2"></i>
                                                                    </span>
                                                                    <span className="nav-text font-weight-bolder white-space-nowrap">{this.showTabTicketProceso()}</span>
                                                                </Nav.Link>
                                                            </Nav.Item>
                                                            </>
                                                        :<></>
                                                    :<></>
                                                }
                                            </Nav>
                                        </div>
                                    </Card.Body>
                                </Card>
                                <Tab.Content>
                                    <Tab.Pane eventKey="adjuntos">
                                        <Row className="mx-0">
                                            <Col lg="12" className="px-0">
                                                <Card className="card-custom gutter-b card-stretch">
                                                    <Card.Header className="border-0 pt-8 pt-md-0">
                                                        <Card.Title className="m-0">
                                                            <div className="font-weight-bold font-size-h5">FOTOS DEL INCIDENTE</div>
                                                        </Card.Title>
                                                    </Card.Header>
                                                    <Card.Body className="p-9 pt-3">
                                                        <ItemSlider items={data.fotos} item = 'fotos' handleChange = { this.onChange } accept = 'image/*' 
                                                            deleteFile = { deleteFile } />
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        </Row>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="presupuesto">
                                        {
                                            presupuesto === '' ?
                                                <PresupuestoForm form = { formulario.presupuesto } options = { options } showFormCalidad = { true } 
                                                    data = { datos } checkButton = { this.checkButton } onChange = { this.onChangePresupuesto } 
                                                    setOptions = { setOptions } onSubmit = { (e) => { onSubmit('presupuesto') } }  />
                                            : presupuesto.estatus.estatus !== 'En espera' && presupuesto.estatus.estatus !== 'Aceptado' && presupuesto.estatus.estatus !== 'Rechazado'?
                                                <ActualizarPresupuestoForm showInputsCalidad = { true } form = { formulario.preeliminar } options = { options }
                                                    presupuesto = { presupuesto } onChange = { this.onChangePreeliminar } formeditado = { 1 }
                                                    checkButton = { this.checkButtonPreeliminar } onSubmit = { (e) => { onSubmit('preeliminar') } } 
                                                    openModal={openModalConceptos} isButtonEnabled = { this.isButtonEnabled() } modulo_calidad={true} aux_presupuestos={aux_presupuestos}>
                                                    {
                                                        presupuesto.pdfs.length ?
                                                            <button type="button" className="btn btn-sm btn-light-warning font-weight-bolder font-size-13px mr-2" 
                                                                onClick = { (e) => { e.preventDefault(); onClick('historial'); } } >
                                                                <i class="far fa-file-pdf mr-2" />HISTORIAL
                                                            </button>
                                                        :<></>
                                                    }
                                                    { 
                                                        presupuesto.estatus.estatus === 'En revisión'?
                                                            this.calcularCantidades() ?
                                                                <button type="button" className="btn btn-sm btn-light-primary font-weight-bolder font-size-13px mr-2" 
                                                                    onClick = { (e) => { e.preventDefault(); onClick('enviar_finanzas'); } } >
                                                                    GUARDAR Y ENVIAR A FINANZAS
                                                                </button>    
                                                            : <></>
                                                        : <></>
                                                    }
                                                    { 
                                                        presupuesto.estatus.estatus === 'Conceptos' || presupuesto.estatus.estatus === 'Volumetrías' ?
                                                            this.calcularCantidades() ?
                                                                <button type="button" className="btn btn-sm btn-light-success font-weight-bolder font-size-13px mr-2" 
                                                                    onClick = { (e) => { e.preventDefault(); onClick('enviar_compras'); } } >
                                                                    ENVIAR A COTIZAR
                                                                </button>    
                                                            : <></>
                                                        : <></>
                                                    }
                                                </ActualizarPresupuestoForm>
                                            
                                            : presupuesto.estatus.estatus === 'En espera' || presupuesto.estatus.estatus === 'Aceptado' || presupuesto.estatus.estatus === 'Rechazado'?
                                                <PresupuestoGeneradoCalidad presupuesto={presupuesto} ticket = {data} openAlertChangeStatusP={openAlertChangeStatusP} form={formulario.presupuesto_generado}/>
                                            :<></>
                                                
                                        }
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="solicitud-compra">
                                        <SolicitudTabla type = "compra" title = "Historial de solicitud de compras" btn_title = "SOLICITUD DE COMPRA" 
                                            openModalAdd = { openModalSolicitud } openModalEditar = { openModalEditarSolicitud } 
                                            deleteSolicitud = { deleteSolicitud } solicitudes = { solicitudes } />
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="facturacion">
                                        <SolicitudFacturacionTabla options={options} />
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="ticket-proceso">
                                        <Row>
                                            <Col md={`${data.reporte_url === null ? 12 : 7 }`}>
                                                <Card className="card-custom gutter-b mb-8">
                                                    <Card.Header className="border-0 pt-8 pt-md-0">
                                                        <Card.Title className="mb-0">
                                                            <div className="font-weight-bold font-size-h5">{this.showTabTicketProceso()}</div>
                                                        </Card.Title>
                                                    </Card.Header>
                                                    <Card.Body className={`pt-3 ${data.estatus_ticket.estatus === 'Terminado' ? 'd-flex align-items-center justify-content-center' : '' }`}>
                                                        <ProcesoTicketForm form={formulario.ticket} options={options} onChange={onChangeTicketProceso}
                                                            formeditado={1} handleChange={handleChangeTicketProceso} onSubmit={onSubmitTicketProceso}
                                                            generateEmail={generateEmailTicketProceso} estatus={data.estatus_ticket.estatus}
                                                            deleteFile={deleteFile} ticket={data}
                                                        />
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                            {
                                                data.reporte_url !== null &&
                                                <Col md="5">
                                                    <Card className="card-custom gutter-b card-stretch mb-8">
                                                        <Card.Header className="border-0 pt-8 pt-md-0">
                                                            <Card.Title className="mb-0">
                                                                <div className="font-weight-bold font-size-h5">REPORTE FOTOGRÁFICO</div>
                                                            </Card.Title>
                                                        </Card.Header>
                                                        <Card.Body className="pt-3 d-flex align-items-center justify-content-center flex-column">
                                                            {
                                                                data.reporte_url !== null ?
                                                                    <>  
                                                                        <div className="w-100">
                                                                            <ItemSlider items={[{ url: data.reporte_url, name: 'reporte.pdf' }]} item='' />
                                                                        </div>
                                                                        {
                                                                            data.estatus_ticket.estatus !== 'Terminado' ?
                                                                                <div className="text-center mt-5">
                                                                                    <Button icon='' className = "btn btn-sm btn-bg-light btn-icon-success btn-hover-light-success text-success font-weight-bolder font-size-13px"  
                                                                                        onClick={(e) => { e.preventDefault(); openModalReporte() }} text = 'ENVIAR AL CLIENTE' 
                                                                                        only_icon = "flaticon-mail icon-xl mr-2 px-0 text-success" />
                                                                                </div>
                                                                            : <></>
                                                                        }
                                                                    </>
                                                                : ''
                                                            }
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                            }
                                        </Row>
                                    </Tab.Pane>
                                </Tab.Content>
                            </Tab.Container>
                        : <> </>
                    : <> </>
                }
                <Modal size = { activeKeyNav === 'solicitud-compra' ? 'lg' : 'xl'} title={title} show={modal.solicitud} handleClose={handleCloseSolicitud} >
                    {
                        activeKeyNav === 'solicitud-compra'?
                            <div className="containter">
                                {
                                    presupuesto.conceptos.length > 0 ?
                                        <div>
                                            <div className="row col-md-12 mx-0 my-5 py-3 px-3 place-content-center">
                                                <label key={key} className="checkbox checkbox-outline checkbox-outline-2x checkbox-primary font-weight-light mb-0">
                                                    <input type="checkbox" name = 'selector' value = { checked } checked = { checked } onChange = { this.selectCheck } />
                                                    Marca para cargar las partidas del presupuesto
                                                    <span></span>
                                                </label>
                                            </div>
                                            {
                                                checked ?
                                                    <div className="container px-0">
                                                        <div style={{ display: 'flex', maxHeight: '60vh'}} >
                                                            <Scrollbar>
                                                                {
                                                                    formulario.conceptos.map((concepto, index) => {
                                                                        return(
                                                                            <div className="container px-3" key={index} >
                                                                                <hr className="hr-text" data-content={`${concepto.partida}`}/>
                                                                                <div className="d-flex justify-content-center">
                                                                                    <label className="checkbox checkbox-outline checkbox-outline-2x checkbox-warning font-weight-light mb-0 text-center">
                                                                                        <input type="checkbox" name = 'selector' value = { concepto.join } checked = { concepto.join } 
                                                                                            onChange = { (e) => {this.selectCheckInner(e, index)} } />
                                                                                        Marca para generar solo una solicitud de compra
                                                                                        <span></span>
                                                                                    </label>
                                                                                </div>
                                                                                {
                                                                                    concepto.join ?
                                                                                        <div className="row mx-0 pb-3">
                                                                                            <div className="col-md-6">
                                                                                                <SelectSearchGray value = { concepto.area } withtextlabel = { 1 }
                                                                                                    placeholder = 'Seleccionar un área' withtaglabel = { 1 } 
                                                                                                    withplaceholder = { 1 } options = { this.setConceptosOptions(concepto.concepto)} 
                                                                                                    requirevalidation = { 1 } messageinc='Incorrecto. Selecciona el área' customdiv='mb-0' />
                                                                                            </div>
                                                                                            <div className="col-md-6">
                                                                                                <SelectSearchGray value = { concepto.subarea } withtaglabel = { 1 }
                                                                                                    placeholder = 'Seleccionar un subárea' withtextlabel = { 1 } 
                                                                                                    withplaceholder = { 1 } requirevalidation = { 1 }
                                                                                                    onChange = { (value) => onChangeSolicitudCompra(value, 'subarea', index)}
                                                                                                    options = { this.setConceptosSubareasOptions(concepto, index)} 
                                                                                                    messageinc='Incorrecto. Selecciona la subárea' customdiv='mb-0' />
                                                                                            </div>
                                                                                            <div className="col-md-12">
                                                                                                <InputGray as='textarea' name='descripcion' placeholder='Descripción'
                                                                                                    value={concepto.descripcion} withtaglabel={1}
                                                                                                    withtextlabel={1} onChange={(e) => { this.onChangeSolicitudCompra(e, index) }}
                                                                                                    requirevalidation={1} messageinc='Incorrecto. Escribe una descripción' customclass="px-2 textarea-input"/>
                                                                                            </div>
                                                                                            <div className="col-md-12">
                                                                                                <InputGray as = "textarea" name = "notas" placeholder = "NOTAS" 
                                                                                                    value = { concepto.notas } withtaglabel = { 1 } rows = { 2 }
                                                                                                    withtextlabel = { 1 } requirevalidation = { 0 }
                                                                                                    onChange = { (e) => { this.onChangeSolicitudCompra(e, index) } }
                                                                                                    messageinc = 'Incorrecto. Escribe la nota' customclass = "px-2"/>
                                                                                            </div>
                                                                                        </div>
                                                                                    : 
                                                                                        concepto ?
                                                                                            concepto.conceptos ? 
                                                                                                concepto.form.map((concept, key) => {
                                                                                                    return(
                                                                                                        <div className="containter p-2" key = { key }>
                                                                                                            <hr 
                                                                                                                className="hr-text hr-text__warning" 
                                                                                                                key = { key }
                                                                                                                data-content={`${concept.concepto.concepto.clave}`}/>
                                                                                                            <div className="row mx-0 pb-3">
                                                                                                                <div className="col-md-6">
                                                                                                                    <SelectSearchGray 
                                                                                                                        value = { concept.area } 
                                                                                                                        withtextlabel = { 1 }
                                                                                                                        placeholder = 'Seleccionar un área' 
                                                                                                                        withtaglabel = { 1 } 
                                                                                                                        withplaceholder = { 1 } 
                                                                                                                        options = { this.setConceptosOptions(concept.concepto)} 
                                                                                                                        requirevalidation = { 1 } 
                                                                                                                        messageinc='Incorrecto. Selecciona el área' 
                                                                                                                        customdiv='mb-0' />
                                                                                                                </div>
                                                                                                                <div className="col-md-6">
                                                                                                                    <SelectSearchGray 
                                                                                                                        value = { concept.subarea } 
                                                                                                                        withtaglabel = { 1 }
                                                                                                                        placeholder = 'Seleccionar un subárea' 
                                                                                                                        withtextlabel = { 1 } 
                                                                                                                        withplaceholder = { 1 } 
                                                                                                                        requirevalidation = { 1 }
                                                                                                                        onChange = { (value) => this.onChangeValueSolicitudCompraInner(value, 'subarea', index, key)}
                                                                                                                        options = { this.setConceptosSubareasOptions(concept, index)} 
                                                                                                                        messageinc='Incorrecto. Selecciona la subárea' customdiv='mb-0' />
                                                                                                                </div>
                                                                                                                <div className="col-md-12">
                                                                                                                    <InputGray 
                                                                                                                        as = 'textarea' 
                                                                                                                        name = 'descripcion' 
                                                                                                                        placeholder = 'Descripción'
                                                                                                                        value = { concept.descripcion } 
                                                                                                                        withtaglabel = { 1 }
                                                                                                                        withtextlabel = { 1 } 
                                                                                                                        onChange = { (e) => { this.onChangeSolicitudCompraInner(e, index, key) }}
                                                                                                                        requirevalidation = { 1 } 
                                                                                                                        messageinc = 'Incorrecto. Escribe una descripción' 
                                                                                                                        customclass="px-2 textarea-input"/>
                                                                                                                </div>
                                                                                                                <div className="col-md-12">
                                                                                                                    <InputGray as = "textarea" name = "notas" 
                                                                                                                        placeholder = "NOTAS" value = { concept.notas } 
                                                                                                                        withtaglabel={1} rows = { 2 } withtextlabel = { 1 } 
                                                                                                                        onChange={(e) => { this.onChangeSolicitudCompraInner(e, index, key) }}
                                                                                                                        requirevalidation = { 0 } messageinc='Incorrecto. Escribe la nota' 
                                                                                                                        customclass="px-2 " />
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>            
                                                                                                    )            
                                                                                                })
                                                                                            : <></>
                                                                                        : <></>
                                                                                }
                                                                            </div>
                                                                        )
                                                                    })
                                                                }
                                                        </Scrollbar>
                                                        </div>
                                                    </div>
                                                :
                                                    <div className="containter px-0">
                                                        <div className="d-flex justify-content-end px-7 mb-3">
                                                            {
                                                                formulario.conceptos.length > 1 &&
                                                                <Button onClick = { () => { addRows('delete') } } className = "btn btn-sm btn-bg-light btn-icon-danger btn-hover-light-danger text-danger font-weight-bolder mr-2"
                                                                    only_icon = "fas fa-minus icon-sm text-danger p-0 mr-2" text = 'Eliminar fila' icon = '' />
                                                            }
                                                            <Button onClick = { () => { addRows('add') } } className = "btn btn-sm btn-bg-light btn-icon-success btn-hover-light-success text-success font-weight-bolder"
                                                                only_icon = "fas fa-plus icon-sm text-success p-0 mr-2" text = 'Agregar más' icon = '' />
                                                        </div>
                                                        <div style={{ display: 'flex', maxHeight: '60vh' }} >
                                                            <Scrollbar>
                                                                {
                                                                    formulario.conceptos.map((concepto, index) => {
                                                                        return (
                                                                            <div className="container px-3" key={index} >
                                                                                <hr className="hr-text" data-content={`${index+1}`}/>
                                                                                <div className="row mx-0 pb-3" key={index} >
                                                                                    <div className="col-md-6">
                                                                                        <SelectSearchGray value={concepto.area} withtextlabel={1}
                                                                                            placeholder='Seleccionar un área' withtaglabel={1} withplaceholder={1}
                                                                                            options={options.areas} requirevalidation={1}
                                                                                            onChange={(value) => this.update(value, index, 'area')}
                                                                                            messageinc='Incorrecto. Selecciona el área' customdiv='mb-0' />
                                                                                    </div>
                                                                                    <div className="col-md-6">
                                                                                        <SelectSearchGray value={concepto.subarea} withtaglabel={1}
                                                                                            placeholder='Seleccionar un subárea' withtextlabel={1} withplaceholder={1}
                                                                                            options={this.getSubareas(concepto)} requirevalidation={1}
                                                                                            onChange={(value) => this.update(value, index, 'subarea')}
                                                                                            messageinc='Incorrecto. Selecciona la subárea' customdiv='mb-0' />
                                                                                    </div>
                                                                                    <div className="col-md-12">
                                                                                        <InputGray as='textarea' name='descripcion' placeholder='Descripción'
                                                                                            value={concepto.descripcion} withtaglabel={1} withtextlabel={1}
                                                                                            requirevalidation={1} messageinc='Incorrecto. Escribe una descripción'
                                                                                            onChange={(e) => { this.onChangeSolicitudCompra(e, index) }} customclass="px-2 textarea-input"/>
                                                                                    </div>
                                                                                    <div className="col-md-12">
                                                                                        <InputGray as="textarea" name="notas" placeholder="NOTAS"
                                                                                            value={concepto.notas} withtaglabel={1}
                                                                                            withtextlabel={1} onChange={(e) => { this.onChangeSolicitudCompra(e, index) }}
                                                                                            requirevalidation={0} messageinc='Incorrecto. Escribe la nota' customclass="px-2 textarea-input"
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        )
                                                                    })
                                                                }
                                                            </Scrollbar>
                                                        </div>
                                                    </div>
                                            }
                                            <div className="text-center mt-5">
                                                <div className="separator separator-solid"></div>
                                                <Button icon = '' className = "mt-4" onClick = { (e) => { e.preventDefault(); submitSolicitudesCompras(); } } text="Enviar" />
                                            </div>
                                        </div>
                                    : <></>
                                }
                            </div>
                        : activeKeyNav === 'solicitud-venta' ?
                            <SolicitudVentaForm title = { title } form = { formulario.solicitud } options = { options } setOptions = { setOptions }
                                onChange = { onChangeSolicitud } clearFiles = { clearFiles } onSubmit = { onSubmitSVenta } formeditado = { formeditado }
                                className = "px-3" />
                        :<></>
                    }
                </Modal>
                <Modal size = "xl" title = 'Agregar concepto' show = { modal.conceptos } handleClose = { handleCloseConceptos } >
                    <AgregarConcepto 
                        options = { options }
                        formeditado = { formeditado }
                        form = { formulario.preeliminar }
                        onChange = { onChangeConceptos }
                        setOptions = { setOptions }
                        checkButtonConceptos = { checkButtonConceptos }
                        data = { data }
                        onSelect = { controlledTab }
                        activeKey = { key }
                        onSubmit = { onSubmitConcept }
                    />
                </Modal>
                {
                    this.isButtonEnabled() !== false && activeKeyNav === 'presupuesto'?
                        <FloatButtons
                            save={save}
                            recover={recover}
                            formulario={formularioGuardado}
                            url='calidad/tickets/detalles-ticket'
                            title='del presupuesto'
                        />
                    : <></>
                }
            </div>
        )
    }
}

export default TicketView