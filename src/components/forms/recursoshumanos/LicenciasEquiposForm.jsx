import React, { Component } from 'react'
import axios from 'axios'
import { URL_DEV } from '../../../constants'
import { Form, Row, Col } from 'react-bootstrap'
import { setSingleHeader } from '../../../functions/routers'
import { Button, InputGray } from '../../form-components'
import { validateAlert, waitAlert, doneAlert, printResponseErrorAlert, errorAlert } from '../../../functions/alert'
class LicenciasEquiposForm extends Component {
    state = {
        modal: {
            factura: false
        },
        form: {
            modelo: '',
            marca: '',
            serie: '',
            tipo: '',
            descripcion: '',
        }
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
    onSubmit = async () => {
        waitAlert()
        const { at, proyecto, presupuesto, refresh } = this.props
        const { form } = this.state
        await axios.post(`${URL_DEV}v3/proyectos/proyectos/${proyecto.id}/solicitud-factura/${presupuesto.id}`, form, { headers: setSingleHeader(at) }).then(
            (response) => {
                doneAlert(`Solicitud generada con éxito`, () => { refresh() } )
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }
    render() {
        const { form } = this.state
        return (
            <Form id="form-solicitud" onSubmit={(e) => { e.preventDefault(); validateAlert(this.onSubmit, e, 'form-solicitud') }}>
                <Row className="form-group mx-0 form-group-marginless">
                    <Col>
                        <InputGray
                            requirevalidation={0}
                            placeholder='TIPO'
                            value={form.tipo}
                            withtaglabel={0}
                            name='tipo'
                            withtextlabel={0}
                            withplaceholder={1}
                            withicon={0}
                            iconclass='las la-clipboard-list'
                            onChange={this.onChange}
                            customclass="px-2"
                        />
                    </Col>
                    <Col>
                        <InputGray
                            requirevalidation={0}
                            placeholder='MODELO'
                            value={form.modelo}
                            withtaglabel={0}
                            name='modelo'
                            withtextlabel={0}
                            withplaceholder={1}
                            withicon={0}
                            iconclass='las la-clipboard-list'
                            onChange={this.onChange}
                            customclass="px-2"
                        />
                    </Col>
                    <Col>
                        <InputGray
                            requirevalidation={0}
                            placeholder='MARCA'
                            value={form.marca}
                            withtaglabel={0}
                            name='marca'
                            withtextlabel={0}
                            withplaceholder={1}
                            withicon={0}
                            iconclass='las la-clipboard-list'
                            onChange={this.onChange}
                            customclass="px-2"
                        />
                    </Col>
                    <Col>
                        <InputGray
                            requirevalidation={0}
                            placeholder='SERIE'
                            value={form.serie}
                            withtaglabel={0}
                            name='serie'
                            withtextlabel={0}
                            withplaceholder={1}
                            withicon={0}
                            iconclass='las la-clipboard-list'
                            onChange={this.onChange}
                            customclass="px-2"
                        />
                    </Col>
                    <Col>
                        <InputGray
                            requirevalidation={0}
                            placeholder='DESCRIPCIÓN'
                            value={form.descripcion}
                            withtaglabel={0}
                            name='descripcion'
                            withtextlabel={0}
                            withplaceholder={1}
                            withicon={0}
                            iconclass='las la-clipboard-list'
                            onChange={this.onChange}
                            customclass="px-2"
                        />
                    </Col>
                </Row>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <Row className="form-group mx-0 form-group-marginless">
                    
                        {/* <ReactSelectSearchGray
                            requirevalidation={1}
                            placeholder='Cliente'
                            defaultvalue={form.cliente}
                            iconclass='las la-user icon-xl'
                            options={optionsFases()}
                            onChange={(value) => { this.updateSelect(value, 'cliente') }}
                            messageinc="Incorrecto. Selecciona el cliente."
                        /> */}
                </Row>
                <div className="card-footer pt-3 pb-0 px-0 text-right">
                    <Button icon='' className="btn btn-primary" text="ENVIAR"
                        onClick={(e) => { e.preventDefault(); validateAlert(this.onSubmit, e, 'form-solicitud') }} />
                </div>
            </Form>
        )
    }
}

export default LicenciasEquiposForm