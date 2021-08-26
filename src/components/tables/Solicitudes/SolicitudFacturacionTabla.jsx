import React, { Component } from 'react'
import { Card, Form } from 'react-bootstrap';
import { InputMoneyGray, InputGray, SelectSearchGray, Button } from '../../form-components';
import { Modal } from '../../singles';
import { RFC } from '../../../constants'

export default class SolicitudFacturacionTabla extends Component{

    state = {
        modal: false,
        form: {
            rfc_receptor: '',
            razon_social_receptor: '',
            concepto: '',
            monto: 0.0,
            forma_pago: '',
            metodo_pago: '',
            estatus_factura: '',
            tipo_pago: ''
        }
    }

    openModal = e => {
        const { form } = this.state
        form.estatus_factura = '1'
        this.setState({ ...this.state, modal: true })
    }

    handleClose = () => {
        this.setState({ ...this.state, modal: false })
    }

    onChange = e => {
        const { name, value } = e.target
        const { form } = this.state
        form[name] = value
        this.setState({...this.state, form})
    }
    updateConcepto = value => { this.onChange({ target: { value: value, name: 'concepto' } }) } 
    updateFormaPago= value => { this.onChange({ target: { value: value, name: 'forma_pago' } }) }
    updateTipoPago = value => { this.onChange({ target: { value: value, name: 'tipo_pago' } }) }
    updateMetodoPago = value => { this.onChange({ target: { value: value, name: 'metodo_pago' } }) }
    updateEstatusFactura = value => { this.onChange({ target: { value: value, name: 'estatus_factura' } }) }

    render(){
        const { modal, form } = this.state
        const { options, onSubmit } = this.props
        return(
            <div>
                <Card className="card-custom gutter-b card-stretch">
                    <Card.Header className = 'border-0 pt-8 pt-md-0'>
                        <Card.Title className = 'm-0'>
                            <div className="font-weight-bold font-size-h5">
                                Listado de solicitudes de facturación
                            </div>
                        </Card.Title>
                        <div className="card-toolbar">
                            <button type="button" className="btn btn-sm btn-bg-light btn-icon-info btn-hover-light-info text-info font-weight-bolder font-size-13px" 
                                onClick = { this.openModal }>
                                <i className="flaticon2-plus icon-nm mr-2 px-0 text-info" /> SOLICITAR FACTURA
                            </button>
                        </div>
                    </Card.Header>
                    <Card.Body className = 'p-9 pt-0'>
                        <div className="table-responsive rounded-top">
                            <table className="table table-vertical-center">
                                <thead>
                                    <tr className="font-weight-bolder text-info text-center white-space-nowrap bg-light-info">
                                        <th>Emisor</th>
                                        <th>Receptor</th>
                                        <th>Concepto</th>
                                        <th>Monto</th>
                                        <th>Forma de<br /> pago</th>
                                        <th>Método de<br /> pago</th>
                                        <th>Estatus de<br /> facturación</th>
                                    </tr>
                                </thead>
                                
                            </table>
                        </div>
                    </Card.Body>
                </Card>
                <Modal size = 'xl' show = { modal } title = 'Nueva solicitud de factura' handleClose = { this.handleClose } >
                <Form onSubmit={(e) => { e.preventDefault(); onSubmit(e) }} >  
                        <div className="form-group row form-group-marginless mt-5">
                            <div className="col-md-4">
                                <InputGray
                                    withtaglabel = { 1 }
                                    withtextlabel = { 1 }
                                    withplaceholder = { 1 }
                                    withicon = { 1 }
                                    withformgroup = { 0 }
                                    requirevalidation={1}
                                    formeditado={0}
                                    placeholder="RFC DEL CLIENTE"
                                    value={form.rfc_receptor}
                                    name="rfc_receptor"
                                    onChange={this.onChange}
                                    iconclass="far fa-file-alt"
                                    patterns={RFC}
                                    messageinc="Incorrecto. Ej. ABCD001122ABC"
                                    maxLength="13"
                                />
                            </div>
                            <div className="col-md-4">
                                <InputGray
                                    withtaglabel = { 1 }
                                    withtextlabel = { 1 }
                                    withplaceholder = { 1 }
                                    withicon = { 1 }
                                    withformgroup = { 0 }
                                    requirevalidation={1}
                                    formeditado={0}
                                    placeholder="RAZÓN SOCIAL DEL CLIENTE"
                                    value={form.razon_social_receptor}
                                    name="razon_social_receptor"
                                    onChange={this.onChange}
                                    iconclass="far fa-file-alt"
                                    messageinc="Incorrecto. Ingresa la razón social"
                                    maxLength="13"
                                />
                            </div>
                            <div className="col-md-4">
                                <SelectSearchGray
                                    withtaglabel={1}
                                    withtextlabel={1}
                                    withicon = { 1 }
                                    customdiv="mb-0"
                                    formeditado={0}
                                    options={options.conceptos}
                                    placeholder="CONCEPTO"
                                    name="concepto"
                                    value={form.concepto}
                                    onChange={this.updateConcepto}
                                    messageinc="Incorrecto. Selecciona el concepto"
                                />
                            </div>
                        </div>
                        <div className="separator separator-dashed mt-1 mb-2"></div>
                        <div className="form-group row form-group-marginless">
                            <div className="col-md-4">
                                <SelectSearchGray
                                    withtaglabel={1}
                                    withtextlabel={1}
                                    withicon = { 1 }
                                    customdiv="mb-0"
                                    formeditado={0}
                                    options={options.formasPago}
                                    placeholder="FORMA DE PAGO"
                                    name="forma_pago"
                                    value={form.forma_pago}
                                    onChange={this.updateFormaPago}
                                    messageinc="Incorrecto. Selecciona la forma de pago"
                                />
                            </div>
                            <div className="col-md-4">
                                <SelectSearchGray
                                    withtaglabel={1}
                                    withtextlabel={1}
                                    withicon = { 1 }
                                    customdiv="mb-0"
                                    formeditado={0}
                                    options={options.metodosPago}
                                    placeholder="MÉTODO DE PAGO"
                                    name="metodo_pago"
                                    value={form.metodo_pago}
                                    onChange={this.updateMetodoPago}
                                    messageinc="Incorrecto. Selecciona el método de pago"
                                />
                            </div>
                            <div className="col-md-4">
                                <SelectSearchGray
                                    withtaglabel={1}
                                    withtextlabel={1}
                                    withicon = { 1 }
                                    customdiv="mb-0"
                                    formeditado={0}
                                    options={options.tiposPagos}
                                    placeholder="TIPOS DE PAGO"
                                    name="tipo_pago"
                                    value={form.tipo_pago}
                                    onChange={this.updateTipoPago}
                                    messageinc="Incorrecto. Selecciona el tipo de pago"
                                />
                            </div>
                        </div>
                        <div className="separator separator-dashed mt-1 mb-2"></div>
                        <div className="form-group row form-group-marginless">
                            <div className="col-md-4">
                                <SelectSearchGray
                                    withtaglabel={1}
                                    withtextlabel={1}
                                    withicon = { 1 }
                                    customdiv="mb-0"
                                    formeditado={0}
                                    options={options.estatusFacturas}
                                    placeholder="ESTATUS DE FACTURA"
                                    name="estatus_factura"
                                    value={form.estatus_factura}
                                    onChange={this.updateEstatusFactura}
                                    messageinc="Incorrecto. Selecciona el estatus de la factura"
                                />
                            </div>
                            <div className="col-md-4">
                                <InputMoneyGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 } withicon = { 0 } 
                                    withformgroup = { 0 } requirevalidation = { 0 } formeditado = { 0 } thousandseparator = { true } 
                                    prefix = '$' name = "monto" value = { form.monto } onChange = { this.onChange } placeholder = "MONTO CON IVA"/>
                            </div>
                        </div>
                        <div className="card-footer pt-3 pb-0 px-0 text-right">
                            <Button icon='' className="btn btn-primary" text="ENVIAR" type='submit' />
                        </div>
                    </Form>
                </Modal>
            </div>
        );
    }
}