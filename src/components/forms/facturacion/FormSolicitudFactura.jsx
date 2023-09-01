import React, { Component } from 'react'
import { Form, Row, Col } from 'react-bootstrap'
import { ReactSelectSearchGray, InputMoneyGray, Button, InputGray } from '../../form-components'
import { transformOptions } from '../../../functions/options'
import { validateAlert, waitAlert, doneAlert, printResponseErrorAlert } from '../../../functions/alert'
import { apiPostForm, catchErrors } from '../../../functions/api'
class HistorialSolicitudes extends Component {
    state = {
        modal:{
            factura:false
        },
        form: {
            cliente:'',
            forma_pago: '',
            metodo_pago: '',
            tipo_pago: '',
            estatus_factura: '',
            monto: 0.0,
            orden: ''
        }
    }
    componentDidMount() {
        const { lead } = this.props
        const { form } = this.state
        form.estatus_factura = { "name": "POR PAGAR", "value": "1", "label": "POR PAGAR" }
        if (lead)
            if (lead.presupuesto_diseño.total)
                form.monto = lead.presupuesto_diseño.pdfs[0].pivot.costo
        this.setState({ ...this.state, form })
    }
    updateSelect = (value, name) => {
        this.onChange({ target: { value: value, name: name } })
    }
    onChange = e => {
        const { name, value } = e.target
        const { form } = this.state
        form[name] = value
        this.setState({ ...this.state, form })
    }
    onSubmit = async() => {
        waitAlert()
        const { at, lead, refresh } = this.props
        const { form } = this.state
        apiPostForm(`v3/leads/crm/${lead.id}/solicitud-factura`, form, at).then(
            (response) => {
                doneAlert(`Solicitud generada con éxito`, () => { refresh() } )
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }

    render() {
        const { form } = this.state
        const { options } = this.props
        return (
            <Form id="form-solicitud" onSubmit = { (e) => { e.preventDefault(); validateAlert(this.onSubmit, e, 'form-solicitud') } }>
                <Row className="form-group mx-0 form-group-marginless mt-5">
                    <Col md="4">
                        <ReactSelectSearchGray
                            requirevalidation={1}
                            placeholder='Cliente'
                            defaultvalue={form.cliente}
                            iconclass='las la-user icon-xl'
                            options={transformOptions(options.clientes)}
                            onChange={(value) => { this.updateSelect(value, 'cliente') }}
                            messageinc="Incorrecto. Selecciona el cliente."
                        />
                    </Col>
                    <Col md="4">
                        <ReactSelectSearchGray
                            requirevalidation={1}
                            placeholder='Forma de pago'
                            defaultvalue={form.forma_pago}
                            iconclass='las la-credit-card icon-xl'
                            options={transformOptions(options.formasPago)}
                            onChange={(value) => { this.updateSelect(value, 'forma_pago') }}
                            messageinc="Incorrecto. Selecciona la forma de pago."
                        />
                    </Col>
                    <Col md="4">
                        <ReactSelectSearchGray
                            requirevalidation={1}
                            placeholder='Método de pago'
                            defaultvalue={form.metodo_pago}
                            iconclass='las la-wallet icon-xl'
                            options={transformOptions(options.metodosPago)}
                            onChange={(value) => { this.updateSelect(value, 'metodo_pago') }}
                            messageinc="Incorrecto. Selecciona el método de pago."
                        />
                    </Col>
                </Row>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <Row className="form-group mx-0 form-group-marginless">
                    <Col md="4">
                        <ReactSelectSearchGray
                            requirevalidation={1}
                            placeholder='Tipos de pago'
                            defaultvalue={form.tipo_pago}
                            iconclass='las la-money-bill-alt icon-xl'
                            options={transformOptions(options.tiposPago)}
                            onChange={(value) => { this.updateSelect(value, 'tipo_pago') }}
                            messageinc="Incorrecto. Selecciona el tipo de pago."
                        />
                    </Col>
                    <Col md="4">
                        <ReactSelectSearchGray
                            requirevalidation={1}
                            placeholder='Estatus de factura'
                            defaultvalue={form.estatus_factura}
                            iconclass='las la-check-circle icon-xl'
                            options={transformOptions(options.estatusFactura)}
                            onChange={(value) => { this.updateSelect(value, 'estatus_factura') }}
                            messageinc="Incorrecto. Selecciona el estatus de la factura."
                        />
                    </Col>
                    <Col md="4">
                        <InputMoneyGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1}
                            withformgroup={0} requirevalidation={0} formeditado={0} thousandseparator={true} iconclass='las la-coins icon-xl'
                            prefix='$' name="monto" value={form.monto} onChange={this.onChange} placeholder="MONTO CON IVA" />
                    </Col>
                </Row>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <Row className="form-group mx-0 form-group-marginless">
                    <Col md="4">
                        <InputGray requirevalidation = { 0 } placeholder = 'ORDEN DE COMPRA' value = { form.orden } withtaglabel = { 1 } name = 'orden'
                            withtextlabel = { 1 } withplaceholder = { 1 } withicon = { 1 } iconclass='las la-clipboard-list' onChange = { this.onChange } />
                    </Col>
                </Row>
                <div className="card-footer pt-3 pb-0 px-0 text-right">
                    <Button icon='' className="btn btn-primary" text="ENVIAR"
                        onClick = { (e) => { e.preventDefault(); validateAlert(this.onSubmit, e, 'form-solicitud') } } />
                </div>
            </Form>
        )
    }
}

export default HistorialSolicitudes