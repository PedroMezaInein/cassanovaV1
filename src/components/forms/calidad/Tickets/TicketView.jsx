import React, { Component } from 'react'
import { Card, Nav, Tab, Dropdown, Row, Col} from 'react-bootstrap'
import ItemSlider from '../../../singles/ItemSlider';
import { ProcesoTicketForm, PresupuestoForm, ActualizarPresupuestoForm } from '../../../../components/forms';
import { Button } from '../../../form-components'
import moment from 'moment'
import 'moment/locale/es'
class TicketView extends Component {

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

    render() {

        const { data, changeEstatus, handleChange, form, options, onChange, onSubmit, generateEmail, deleteFile, openModalWithInput, openModalMantenimiento,
                formeditado, formPresupuesto, onChangePresupuesto, checkButton, setOptions, onSubmitPresupuesto, dataPresupuesto, onClickVolumetrias,
                presupuesto, formPPreeliminar, onChangePPreeliminar, checkButtonPPreeliminar, onSubmitPPreeliminar, openModalPPConcepto  } = this.props
        return (
            <>
                
                    {
                        data ?
                            data.proyecto ?
                                <Tab.Container defaultActiveKey="adjuntos">
                                    <div className="card card-custom gutter-b">
                                        <div className="card-body pb-0">
                                            <div className="d-flex">
                                                <div className="mr-4 align-self-center" id="symbol_calidad">
                                                    <div className="symbol symbol-50 symbol-lg-120 symbol-light-info">
                                                        <span className="font-size-h6 symbol-label font-weight-boldest ">
                                                            {this.getIniciales(data.proyecto.nombre)}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex-grow-1">
                                                    <div className="d-flex align-items-start justify-content-between flex-wrap mt-2">
                                                        <div className="mr-3">
                                                            <div className="d-flex align-items-center text-dark font-size-h5 font-weight-bold mr-3">
                                                                {data.proyecto.nombre}
                                                            </div>
                                                            <div className="d-flex flex-wrap mt-2">
                                                                {
                                                                    data.usuario &&
                                                                    <div className="font-weight-bold my-2 text-dark-65 font-size-lg">
                                                                        <i className="la la-user-tie icon-lg text-info mr-2"></i>
                                                                        {data.usuario.name}
                                                                    </div>
                                                                }
                                                            </div>
                                                        </div>
                                                        <div className="mb-2">
                                                            {
                                                                data ?
                                                                    data.estatus_ticket ?
                                                                        <Dropdown>
                                                                            <Dropdown.Toggle
                                                                                style={
                                                                                    {
                                                                                        backgroundColor: data.estatus_ticket.fondo,
                                                                                        color: data.estatus_ticket.letra,
                                                                                        border: 'transparent', padding: '2.8px 5.6px',
                                                                                        width: 'auto', margin: 0, display: 'inline-flex', justifyContent: 'center', alignItems: 'center', fontSize: '10.7px',
                                                                                        fontWeight: 500, paddingTop: '3px'
                                                                                    }
                                                                                }
                                                                            >
                                                                                {data.estatus_ticket.estatus.toUpperCase()}
                                                                            </Dropdown.Toggle>
                                                                            <Dropdown.Menu className="p-0">
                                                                                <Dropdown.Header>
                                                                                    <span className="font-size-sm">Elige una opción</span>
                                                                                </Dropdown.Header>
                                                                                {
                                                                                    options.estatus ?
                                                                                        options.estatus.map((estatus, key) => {
                                                                                            if (
                                                                                                estatus.name === 'Rechazado' || 
                                                                                                //estatus.name === 'Aceptado' || 
                                                                                                //estatus.name === 'Terminado' ||
                                                                                                //estatus.name === 'En proceso' || 
                                                                                                //estatus.name === 'Respuesta pendiente' || 
                                                                                                estatus.name === 'En revisión' || 
                                                                                                estatus.name === 'En espera')
                                                                                                return (
                                                                                                    <div key={key}>
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
                                                                    : ''
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="d-flex align-items-start flex-wrap justify-content-between">
                                                        {
                                                            data ?
                                                                data.descripcion ?
                                                                    <div className="font-weight-light text-dark-50 py-lg-2 col-md-10 text-justify pl-0">
                                                                        {data.descripcion}
                                                                    </div>
                                                                    : ''
                                                                : ''
                                                        }
                                                        {
                                                            data ?
                                                                data.estatus_ticket ?
                                                                    data.estatus_ticket.estatus === 'En revisión' ?
                                                                        <>
                                                                            <Button
                                                                                icon=''
                                                                                onClick={() => { changeEstatus('Aceptado') }}
                                                                                className={"btn btn-icon btn-light-success btn-sm mr-2 ml-auto"}
                                                                                only_icon={"flaticon2-check-mark icon-sm"}
                                                                                tooltip={{ text: 'ACEPTAR' }}
                                                                            />
                                                                            <Button
                                                                                icon=''
                                                                                onClick={() => { openModalWithInput('Rechazado') }}
                                                                                className={"btn btn-icon btn-light-danger btn-sm pulse pulse-danger"}
                                                                                only_icon={"flaticon2-cross icon-sm"}
                                                                                tooltip={{ text: 'RECHAZAR' }}
                                                                            />
                                                                        </>
                                                                        : data.estatus_ticket.estatus === 'Rechazado' ?
                                                                            <>
                                                                                <div className="d-flex flex-wrap">
                                                                                    <div>
                                                                                        <div className="text-muted font-weight-bold">
                                                                                            {
                                                                                                data ?
                                                                                                    data.motivo_cancelacion
                                                                                                    : ''
                                                                                            }
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </>
                                                                            : ''
                                                                    : ''
                                                                : ''
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="separator separator-solid mt-6"></div>
                                            <div className="d-flex overflow-auto h-55px">
                                                <Nav className="nav nav-tabs nav-tabs-line-info nav-tabs-line nav-tabs-line-2x font-size-h6 flex-nowrap align-items-center border-transparent align-self-end ">
                                                    {
                                                        data.fotos.length &&
                                                        <Nav.Item>
                                                            <Nav.Link eventKey="adjuntos">
                                                                <span className="nav-icon">
                                                                    <i className="las la-photo-video icon-lg mr-2"></i>
                                                                </span>
                                                                <span className="nav-text font-weight-bolder font-size-14px">FOTOS INCIDENTE</span>
                                                            </Nav.Link>
                                                        </Nav.Item>
                                                    }
                                                    {
                                                        data.estatus_ticket.estatus !== 'Rechazado' ?
                                                            <Nav.Item onClick = { onClickVolumetrias } >
                                                                <Nav.Link eventKey="presupuesto">
                                                                    <span className="nav-icon">
                                                                        <i className="las la-file-invoice-dollar icon-lg mr-2"></i>
                                                                    </span>
                                                                    <span className="nav-text font-weight-bolder font-size-14px">Conceptos y volumetrías</span>
                                                                </Nav.Link>
                                                            </Nav.Item>
                                                        :<></>
                                                    }
                                                </Nav>
                                            </div>
                                        </div>
                                    </div>
                                    <Tab.Content>
                                        <Tab.Pane eventKey="adjuntos">
                                            <Row>
                                                <Col lg="12">
                                                    <Card className="card-custom gutter-b card-stretch">
                                                        <Card.Header>
                                                            <Card.Title className="mb-0">
                                                                <div className="font-weight-bolder font-size-h5">FOTOS DEL INCIDENTE</div>
                                                            </Card.Title>
                                                        </Card.Header>
                                                        <Card.Body className="p-9 pt-3">
                                                            <ItemSlider items={data.fotos} item={'fotos'} />
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                            </Row>
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="presupuesto">
                                            {
                                                presupuesto === '' ?
                                                    <PresupuestoForm formeditado = { formeditado } form = { formPresupuesto } onChange = { onChangePresupuesto }
                                                        checkButton = { checkButton } options = { options } setOptions = { setOptions } 
                                                        onSubmit = { onSubmitPresupuesto } data = { dataPresupuesto } showFormCalidad = { true } />
                                                : 
                                                    <ActualizarPresupuestoForm
                                                        formeditado={formeditado}
                                                        form={formPPreeliminar}
                                                        onChange={onChangePPreeliminar}
                                                        checkButton={checkButtonPPreeliminar}
                                                        onSubmit={onSubmitPPreeliminar}
                                                        presupuesto={presupuesto}
                                                        openModal={openModalPPConcepto}
                                                        showInputsCalidad={true}
                                                    />
                                            }
                                        </Tab.Pane>
                                    </Tab.Content>
                                </Tab.Container>
                                : ''
                            : ''
                    }
                <div className="row gutter-b">
                    {/* {
                        data ?
                            data.estatus_ticket ?
                                (data.estatus_ticket.estatus !== 'En revisión' && data.estatus_ticket.estatus !== 'Rechazado') || (data.fotos.length) ?
                                    <div className={data.estatus_ticket.estatus === 'En proceso' || data.estatus_ticket.estatus === 'Terminado' ? 'col-lg-4' : 'col-lg-12'}>
                                        <Card className="card-custom card-stretch">
                                            <Tab.Container defaultActiveKey="first">
                                                <Card.Header className="border-0">
                                                    <span className="font-size-h5 font-weight-bold align-self-center text-dark">Adjuntos</span>
                                                    <div className="align-self-center">
                                                        <Nav className="nav nav-tabs nav-tabs-line font-weight-bolder justify-content-end border-0 nav-tabs-line-2x">
                                                            {
                                                                data.fotos.length ?
                                                                    <Nav.Item>
                                                                        <Nav.Link eventKey={data.fotos.length === 0 ? "second" : "first"}>FOTOS</Nav.Link>
                                                                    </Nav.Item>
                                                                    : ''
                                                            }
                                                            {
                                                                data.estatus_ticket.estatus === 'Rechazado' ?
                                                                    '' :
                                                                    <Nav.Item>
                                                                        <Nav.Link eventKey={data.fotos.length === 0 ? "first" : "second"}>PRESUPUESTO</Nav.Link>
                                                                    </Nav.Item>
                                                            }
                                                        </Nav>
                                                    </div>
                                                </Card.Header>
                                                <Card.Body className="d-flex align-items-center align-self-center">
                                                    <Tab.Content>
                                                        <Tab.Pane eventKey={data.fotos.length === 0 ? "second" : "first"}>
                                                            {
                                                                data.fotos.length ?
                                                                    <ItemSlider items={data.fotos} item={'fotos'} />
                                                                : ''
                                                            }
                                                        </Tab.Pane>
                                                        {
                                                            data.estatus_ticket.estatus === 'Rechazado' ?
                                                                '' 
                                                            :
                                                                <Tab.Pane eventKey={data.fotos.length === 0 ? "first" : "second"}>
                                                                    <ItemSlider multiple={false} items={form.adjuntos.presupuesto.files}
                                                                        item='presupuesto' handleChange={handleChange} />
                                                                </Tab.Pane>
                                                        }
                                                    </Tab.Content>
                                                </Card.Body>
                                            </Tab.Container>
                                        </Card>
                                    </div>
                                : ''
                            : ''
                        : ''
                    } */}
                    {
                        data ?
                            data.estatus_ticket ?
                                (data.estatus_ticket.estatus === 'En proceso' || data.estatus_ticket.estatus === 'Terminado') ?
                                    <div className="col-lg-8">
                                        <div className="card card-custom card-stretch">
                                            <div className="card-header">
                                                <div className="card-title">
                                                    <h3 className="card-label">TICKET EN PROCESO</h3>
                                                </div>
                                                <div className="card-toolbar" >
                                                    <button className="btn btn-sm btn-bg-light btn-icon-info btn-hover-light-info text-info font-weight-bolder font-size-13px" onClick = { openModalMantenimiento } >
                                                        <i className="las la-tools icon-lg mr-2 px-0 text-info"></i>
                                                        MANTENIMIENTO
                                                    </button>
                                                </div>   
                                            </div>
                                            <div className="card-body pt-0">
                                                <ProcesoTicketForm form = { form } options = { options } onChange = { onChange } formeditado = { 1 }
                                                    handleChange = { handleChange } onSubmit = { onSubmit } generateEmail = { generateEmail } 
                                                    estatus = { data.estatus_ticket.estatus } deleteFile = { deleteFile } />
                                            </div>
                                        </div>
                                    </div>
                                : ''
                            : ''
                        : ''
                    }
                </div>
            </>
        )
    }
}

export default TicketView