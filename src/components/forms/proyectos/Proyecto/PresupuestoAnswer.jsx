import React, { Component } from 'react'
import { HistorialPresupuestos } from '../../../forms'
import { Modal, Form } from "react-bootstrap"
import { validateAlert } from '../../../../functions/alert'
import { CalendarDaySwal, InputGray } from '../../../../components/form-components'

class PresupuestoAnswer extends Component {
    state = {
        modal: { orden_compra: false },
    }
    
    handleCloseOrden = () => {
        const { modal } = this.state
        modal.orden_compra = false
        this.setState({...this.state, modal })
    }
    render() {
        const { presupuestos, presupuesto } = this.props
        const { modal, form } = this.state
        return (
            <>
                <HistorialPresupuestos presupuesto={presupuesto} actionsEnable = { false } btnOrden = { true } />

                {/* <Modal show = { modal.reporte } onHide = { this.handleCloseModalReporte } centered contentClassName = 'swal2-popup d-flex' >
                    <Modal.Header className = 'border-0 justify-content-center swal2-title text-center font-size-h4'>¿DESEAS ENVIAR EL REPORTE?</Modal.Header>
                    <Modal.Body className = 'p-0 mt-3'>
                        <div className = 'row mx-0 justify-content-center'>
                            <div className="col-md-12 text-center py-2">
                                <div>
                                    {
                                        ticket.reporte_url !== undefined ?
                                            <u>
                                                <a className="font-weight-bold text-hover-success text-primary" target= '_blank' rel="noreferrer" href = {ticket.reporte_url}>
                                                    DA CLIC AQUÍ PARA VER <i className="las la-hand-point-right text-primary icon-md ml-1"></i> EL REPORTE
                                                </a>
                                            </u>
                                        : <></>
                                    }
                                </div>
                            </div>
                            <div className="col-md-11 font-weight-light mt-4 text-justify">
                                Si deseas enviar el reporte fotográfico agrega el o los correos del destinatario, de lo contario da clic en <span onClick = { this.handleCloseModalReporte } className="font-weight-bold">cancelar</span>.
                            </div>
                            <div className="col-md-11 mt-5">
                                <div>
                                    <CreatableMultiselectGray placeholder = "SELECCIONA/AGREGA EL O LOS CORREOS" iconclass = "flaticon-email" uppercase = { false }
                                        requirevalidation = { 1 } messageinc = "Selecciona el o los correos" onChange = { this.handleChangeCreateMSelect } 
                                        options = { options.correos_clientes } elementoactual = { formularios.presupuesto_generado.correos_reporte } />
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer className = 'border-0 justify-content-center'>
                        <button type="button" className="swal2-cancel btn-light-gray-sweetalert2 swal2-styled d-flex" onClick = { this.handleCloseModalReporte }>CANCELAR</button>
                        <button type="button" className="swal2-confirm btn-light-success-sweetalert2 swal2-styled d-flex" onClick = { this.sendMail } >SI, ENVIAR</button>
                    </Modal.Footer>
                </Modal> */}
                {/* <Modal show = { modal.orden_compra } onHide = { this.handleCloseOrden } centered contentClassName = 'swal2-popup d-flex' >
                    <Modal.Header className = 'border-0 justify-content-center swal2-title text-center font-size-h4'>AGREGAR ORDEN DE COMPRA</Modal.Header>
                    <Modal.Body className = 'p-0 mt-3'>
                        <Form id="form-orden" onSubmit = { (e) => { e.preventDefault(); validateAlert(this.onSubmitOrden, e, 'form-orden') } }>
                            <div className='row mx-0 justify-content-center'>
                                <div className="col-md-12">
                                    <div className="form-group row form-group-marginless mb-1">
                                        <div className="col-md-12 text-justify">
                                            <InputGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1} iconclass='las la-hashtag icon-xl'
                                                requirevalidation={0} value={form.orden_compra.numero_orden} name={'numero_orden'}
                                                onChange={(e) => { this.onChangeSwal(e.target.value, 'numero_orden', 'orden_compra') }}
                                                swal={true} placeholder='NÚMERO DE ORDEN DE COMPRA'
                                            />
                                        </div>
                                    </div>
                                    <div className="separator separator-dashed mt-5 mb-2"></div>
                                    <div className="form-group row form-group-marginless mt-5 mb-0">
                                        <div className="col-md-12">
                                            <label htmlFor="adjunto" className="drop-files">
                                                <i className="las la-file-pdf icon-xl text-primary"></i>
                                                <input
                                                    id="adjunto"
                                                    type="file"
                                                    onChange={(e) => { this.onChangeSwal(e.target.files[0], 'adjunto', 'orden_compra'); this.changeNameFile('adjunto') }}
                                                    name='adjunto'
                                                    accept="application/pdf"
                                                />
                                                <div className="font-weight-bolder font-size-md ml-2" id="info">Subir orden de compra (PDF)</div>
                                            </label>
                                            {
                                                form.orden_compra.adjunto === '' ?
                                                    <span className="form-text text-danger is-invalid font-size-xs text-center"> Adjunta la orden (PDF) </span>
                                                :<></>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer className = 'border-0 justify-content-center'>
                        <button type="button" className="swal2-cancel btn-light-gray-sweetalert2 swal2-styled d-flex" onClick = { this.handleCloseModalOrden }>CANCELAR</button>
                        <button type="button" className="swal2-confirm btn-light-success-sweetalert2 swal2-styled d-flex" onClick = { (e) => { e.preventDefault(); validateAlert(this.onSubmitOrden, e, 'form-orden') } } >AGREGAR</button>
                    </Modal.Footer>
                </Modal> */}
            </>
        )
    }
}

export default PresupuestoAnswer