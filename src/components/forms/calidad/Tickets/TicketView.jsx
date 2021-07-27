import React, { Component } from 'react'
import { Card, Nav, Tab, Dropdown, Col, Row } from 'react-bootstrap'
import ItemSlider from '../../../singles/ItemSlider';
import { PresupuestoForm, ActualizarPresupuestoForm, SolicitudTabla, SolicitudCompraForm, SolicitudVentaForm, PresupuestoGeneradoCalidad, MantenimientoCorrectivo } from '../../../../components/forms';
import { Button } from '../../../form-components'
import moment from 'moment'
import 'moment/locale/es'
import imageCompression from 'browser-image-compression';
import { questionAlert, waitAlert } from '../../../../functions/alert';
import { dayDMY } from '../../../../functions/setters'
import { Modal } from '../../../../components/singles'
import { ProcesoTicketForm } from '../../../../components/forms';
class TicketView extends Component {
    state ={
        activeKeyNav:'adjuntos'
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
    formatDay (fecha){
        let fecha_instalacion = moment(fecha);
        let format = fecha_instalacion.locale('es').format("DD MMM YYYY");
        return format.replace('.', '');
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
                        console.log(reject(error));
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
        if (name === 'desperdicio') {
            value = value.replace('%', '')
        }
        let valor = formulario.preeliminar.conceptos
        valor[key][name] = value
        let cantidad = valor[key].cantidad_preliminar * (1 + (valor[key].desperdicio / 100))
        cantidad = cantidad.toFixed(2)
        let importe = cantidad * valor[key].costo
        importe = importe.toFixed(2)
        valor[key].cantidad = cantidad
        valor[key].importe = importe
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
                        return <span className="nav-text font-weight-bolder font-size-14px">Conceptos y volumetrías</span>
                    case 'Costos':
                        return <span className="nav-text font-weight-bolder font-size-14px">Estimación de costos</span>
                    case 'Utilidad':
                        return <span className="nav-text font-weight-bolder font-size-14px">Calculando utilidad</span>
                    case 'En revisión':
                        return <span className="nav-text font-weight-bolder font-size-14px">En revisión</span>
                    case 'En espera':
                        return <span className="nav-text font-weight-bolder font-size-14px">En espera del cliente</span>
                    default:
                        break;
                }
            return <span className="nav-text font-weight-bolder font-size-14px">No</span>
        }
        return <span className="nav-text font-weight-bolder font-size-14px">Conceptos y volumetrías</span>
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

    controlledNav = value => {
        this.setState({
            ...this.state,
            activeKeyNav: value
        })
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
    render() {
        /* ------------------------------- DATOS PROPS ------------------------------ */
        const { data, options, formulario, presupuesto, datos, title, modal, formeditado, solicitudes } = this.props
        /* ----------------------------- FUNCIONES PROPS ---------------------------- */
        const { openModalWithInput, changeEstatus, onClick, setOptions, onSubmit, deleteFile, openModalConceptos, 
            openModalSolicitud, handleCloseSolicitud, onChangeSolicitud, clearFiles, handleChange, openModalEditarSolicitud, deleteSolicitud, onSubmitSCompra, onSubmitSVenta, onChangeAdjunto,
            onChangeTicketProceso, onSubmitTicketProceso, handleChangeTicketProceso, generateEmailTicketProceso, onChangeMantenimientos, onSubmitMantenimiento, openModalDeleteMantenimiento
        } = this.props
        const { activeKeyNav } = this.state
        return (
            <div className="p-0">
                {/* ------------------------ { ANCHOR TAB CONTAINER } ------------------------ */}
                {
                    data ? 
                        data.proyecto ?
                            <Tab.Container defaultActiveKey={activeKeyNav}>
                                <Card className = 'card card-custom gutter-b'>
                                    <Card.Body className="pb-0">
                                        <div className="d-flex">
                                            <div className="mr-4 align-self-center">
                                                <div className="symbol symbol-50 symbol-lg-120 symbol-light-info">
                                                    <span className="font-size-h6 symbol-label font-weight-boldest ">
                                                        {this.getIniciales(data.proyecto.nombre)}
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
                                                                data.usuario &&
                                                                    <div className="font-weight-bold my-2 text-dark-65 font-size-lg mr-3 d-flex align-items-center">
                                                                        <i className="la la-user-tie icon-lg text-info mr-1" />
                                                                        {data.usuario.name}
                                                                    </div>
                                                            }
                                                            {
                                                                data.created_at &&
                                                                    <div className="font-weight-bold my-2 text-dark-65 font-size-lg d-flex align-items-center">
                                                                        <i className="la la-calendar-check icon-lg text-info mr-1" />
                                                                        {dayDMY(data.created_at)}
                                                                    </div>
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
                                                                                    else return ''
                                                                                })
                                                                            : ''
                                                                        }
                                                                    </Dropdown.Menu>
                                                                </Dropdown>
                                                            : ''
                                                        }
                                                    </div>
                                                </div>
                                                <div className="d-flex align-items-start flex-wrap justify-content-between">
                                                    {
                                                        data.descripcion ?
                                                            <div className="font-weight-light text-dark-50 py-lg-2 col-md-10 text-justify pl-0">
                                                                {data.descripcion}
                                                            </div>
                                                        : ''
                                                    }
                                                    {
                                                        data.estatus_ticket ?
                                                            data.estatus_ticket.estatus === 'En revisión' ?
                                                                <>
                                                                    <Button icon='' onClick = { () => { changeEstatus('Aceptado') } }
                                                                        className={"btn btn-icon btn-light-success btn-sm mr-2 ml-auto"}
                                                                        only_icon={"flaticon2-check-mark icon-sm"} tooltip={{ text: 'ACEPTAR' }} />
                                                                    <Button icon='' onClick={() => { openModalWithInput('Rechazado') }}
                                                                        className={"btn btn-icon btn-light-danger btn-sm pulse pulse-danger"}
                                                                        only_icon={"flaticon2-cross icon-sm"} tooltip={{ text: 'RECHAZAR' }} />
                                                                </>
                                                                    : data.estatus_ticket.estatus === 'Rechazado' ?
                                                                        <>
                                                                            <div className="d-flex flex-wrap">
                                                                                <div>
                                                                                    <div className="text-muted font-weight-bold">
                                                                                        { data.motivo_cancelacion }
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </>
                                                            : ''
                                                        : ''
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div className="separator separator-solid mt-6" />
                                        <div className="d-flex overflow-auto h-55px">
                                            <Nav className="nav nav-tabs nav-tabs-line-info nav-tabs-line nav-tabs-line-2x font-size-h6 flex-nowrap align-items-center border-transparent align-self-end ">
                                                <Nav.Item onClick={(e) => { e.preventDefault(); this.controlledNav("adjuntos") }}>
                                                    <Nav.Link eventKey="adjuntos">
                                                        <span className="nav-icon">
                                                            <i className="las la-photo-video icon-lg mr-2"></i>
                                                        </span>
                                                        <span className="nav-text font-weight-bolder font-size-14px">FOTOS</span>
                                                    </Nav.Link>
                                                </Nav.Item>
                                                {
                                                    data.estatus_ticket.estatus !== 'Rechazado' && data.estatus_ticket.estatus !== 'En espera' && data.estatus_ticket.estatus !== 'En revisión' ?
                                                        <Nav.Item onClick = { (e) => { e.preventDefault(); onClick('volumetrias'); this.controlledNav("presupuesto") } } >
                                                            <Nav.Link eventKey="presupuesto">
                                                                <span className="nav-icon"> <i className="las la-file-invoice-dollar icon-lg mr-2" /> </span>
                                                                { this.showStepOfPresupuesto() }
                                                            </Nav.Link>
                                                        </Nav.Item>
                                                    : <></>
                                                }
                                                <Nav.Item onClick={(e) => { e.preventDefault(); onClick('solicitud-compra'); this.controlledNav("solicitud-compra") }}>
                                                    <Nav.Link eventKey="solicitud-compra">
                                                        <span className="nav-icon">
                                                            <i className="las la-file-invoice-dollar icon-lg mr-2"></i>
                                                        </span>
                                                        <span className="nav-text font-weight-bolder font-size-14px">Solicitud de compra</span>
                                                    </Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item onClick={(e) => { e.preventDefault(); onClick('solicitud-venta'); this.controlledNav("solicitud-venta") }}>
                                                    <Nav.Link eventKey="solicitud-venta">
                                                        <span className="nav-icon">
                                                            <i className="las la-clipboard-list icon-lg mr-2"></i>
                                                        </span>
                                                        <span className="nav-text font-weight-bolder font-size-14px">Solicitud de venta</span>
                                                    </Nav.Link>
                                                </Nav.Item>
                                                {
                                                    presupuesto?
                                                        presupuesto.estatus.estatus === "Aceptado" ?
                                                        <>
                                                            <Nav.Item onClick={(e) => { e.preventDefault(); onClick('ticket-proceso'); this.controlledNav("ticket-proceso") }}>
                                                                <Nav.Link eventKey="ticket-proceso">
                                                                    <span className="nav-icon">
                                                                        <i className="las la-tools icon-lg mr-2"></i>
                                                                    </span>
                                                                    <span className="nav-text font-weight-bolder font-size-14px">{this.showTabTicketProceso()}</span>
                                                                </Nav.Link>
                                                            </Nav.Item>
                                                            
                                                            <Nav.Item onClick={(e) => { e.preventDefault(); onClick('mantenimiento'); this.controlledNav("mantenimiento") }}>
                                                                <Nav.Link eventKey="mantenimiento">
                                                                    <span className="nav-icon">
                                                                        <i className="las la-tools icon-lg mr-2"></i>
                                                                    </span>
                                                                    <span className="nav-text font-weight-bolder font-size-14px">Mantenimiento</span>
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
                                                    <Card.Header className="border-0">
                                                        <Card.Title className="mb-0">
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
                                            : presupuesto.estatus.estatus !== 'En espera'?
                                                <ActualizarPresupuestoForm showInputsCalidad = { true } form = { formulario.preeliminar } options = { options }
                                                    presupuesto = { presupuesto } onChange = { this.onChangePreeliminar } formeditado = { 1 }
                                                    checkButton = { this.checkButtonPreeliminar } onSubmit = { (e) => { onSubmit('preeliminar') } } 
                                                    openModal={openModalConceptos} isButtonEnabled = { this.isButtonEnabled() } modulo_calidad={true}>
                                                    { 
                                                        presupuesto.estatus.estatus === 'En revisión'?
                                                            this.calcularCantidades() ?
                                                                <button type="button" className="btn btn-sm btn-light-primary font-weight-bolder font-size-13px mr-2" 
                                                                    onClick = { (e) => { e.preventDefault(); onClick('enviar_finanzas'); } } >
                                                                    ENVIAR A FINANZAS
                                                                </button>    
                                                            : <></>
                                                        : <></>
                                                    }
                                                    { 
                                                        presupuesto.estatus.estatus === 'Conceptos' || presupuesto.estatus.estatus === 'Volumetrías' ?
                                                            this.calcularCantidades() ?
                                                                <button type="button" className="btn btn-sm btn-light-success font-weight-bolder font-size-13px mr-2" 
                                                                    onClick = { (e) => { e.preventDefault(); onClick('enviar_compras'); } } >
                                                                    ENVIAR A COMPRAS
                                                                </button>    
                                                            : <></>
                                                        : <></>
                                                    }
                                                </ActualizarPresupuestoForm>
                                            
                                            : presupuesto.estatus.estatus === 'En espera'?
                                                <PresupuestoGeneradoCalidad presupuesto={presupuesto} ticket = {data} form={formulario.presupuesto_generado} onChangeAdjunto={onChangeAdjunto}/>
                                            :<></>
                                                
                                        }
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="solicitud-compra">
                                        <SolicitudTabla type = "compra" title = "Historial de solicitud de compras" btn_title = "SOLICITUD DE COMPRA" 
                                            openModalAdd = { openModalSolicitud } openModalEditar = { openModalEditarSolicitud } 
                                            deleteSolicitud = { deleteSolicitud } solicitudes = { solicitudes } />
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="solicitud-venta">
                                        <SolicitudTabla type = "venta" title = "Historial de solicitud de ventas" btn_title = "SOLICITUD DE VENTA" 
                                            openModalAdd = { openModalSolicitud } openModalEditar = { openModalEditarSolicitud } 
                                            deleteSolicitud = { deleteSolicitud } solicitudes = { solicitudes } />
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="ticket-proceso">
                                        <Card className="card-custom gutter-b card-stretch">
                                            <Card.Header className="border-0">
                                                <Card.Title className="mb-0">
                                                    <div className="font-weight-bold font-size-h5">{this.showTabTicketProceso()}</div>
                                                </Card.Title>
                                            </Card.Header>
                                            <Card.Body className="pt-0">
                                                <ProcesoTicketForm form = { formulario.ticket } options = { options } onChange = { onChangeTicketProceso } formeditado = { 1 }
                                                    handleChange = { handleChangeTicketProceso } onSubmit = { onSubmitTicketProceso } generateEmail = { generateEmailTicketProceso } 
                                                    estatus = { data.estatus_ticket.estatus } deleteFile = { deleteFile } />
                                            </Card.Body>
                                        </Card>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="mantenimiento">
                                    <Card className="card-custom gutter-b card-stretch">
                                            <Card.Header className="border-0">
                                                <Card.Title className="mb-0">
                                                    <div className="font-weight-bold font-size-h5">Mantenimiento correctivo</div>
                                                </Card.Title>
                                            </Card.Header>
                                            <Card.Body className="pt-0">
                                                <MantenimientoCorrectivo
                                                    form={formulario.mantenimientos}
                                                    options = { options }
                                                    onChangeMantenimientos={onChangeMantenimientos}
                                                    data={data}
                                                    onSubmitMantenimiento={onSubmitMantenimiento}
                                                    openModalDeleteMantenimiento={openModalDeleteMantenimiento}
                                                />
                                            </Card.Body>
                                        </Card>
                                    </Tab.Pane>
                                </Tab.Content>
                            </Tab.Container>
                        : <> </>
                    : <> </>
                }
                <Modal size="xl" title={title} show={modal.solicitud} handleClose={handleCloseSolicitud} >
                    {
                        activeKeyNav === 'solicitud-compra'?
                        <SolicitudCompraForm
                            form={formulario.solicitud}
                            onChange={onChangeSolicitud}
                            options={options}
                            setOptions={setOptions}
                            onSubmit={onSubmitSCompra}
                            clearFiles={clearFiles}
                            formeditado={formeditado}
                            className="px-3"
                            handleChange={handleChange}
                        />
                        : activeKeyNav === 'solicitud-venta' ?
                        <SolicitudVentaForm
                            title={title}
                            form={formulario.solicitud}
                            options={options}
                            setOptions={setOptions}
                            onChange={onChangeSolicitud}
                            clearFiles={clearFiles}
                            onSubmit={onSubmitSVenta}
                            formeditado={formeditado}
                            className="px-3"
                            handleChange={handleChange}
                        />
                        :<></>
                    }
                </Modal>
            </div>
        )
    }
}

export default TicketView