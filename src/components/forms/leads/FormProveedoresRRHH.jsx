import React, { Component } from 'react'
import { InputGray, SelectSearchGray, RadioGroupGray, Button, CalendarDay } from '../../form-components'
import { Form, Row, Col } from 'react-bootstrap'
import { validateAlert } from '../../../functions/alert';

class FormProveedoresRRHH extends Component {
    updateEmpresa = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'empresa' } })
    }
    updateOrigen = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'origen' } })
    }
    render() {
        const { form, onChange, options, onSubmit, formeditado } = this.props
        return (
            <Form id="form-rrhh-p"
                onSubmit={
                    (e) => {
                        e.preventDefault();
                        validateAlert(onSubmit, e, 'form-rrhh-p')
                    }
                }
            >
                <Row className="mx-0 mt-5">
                    <Col md="4" className="text-center">
                        <div className="d-flex justify-content-center" style={{ height: '1px' }}>
                            <label className="text-center font-weight-bolder">Fecha</label>
                        </div>
                        <CalendarDay value={form.fecha} name='fecha' onChange={onChange} date={form.fecha} withformgroup={1} requirevalidation={1}/>
                    </Col>
                    <Col md="8" className="align-self-center">
                        <div className="form-group row form-group-marginless mt-4 mb-0">
                            <div className="col-md-4">
                                <InputGray
                                    formeditado={formeditado}
                                    withtaglabel={1}
                                    withtextlabel={1}
                                    withplaceholder={1}
                                    withicon={1}
                                    withformgroup={1}
                                    requirevalidation={1}
                                    placeholder='NOMBRE'
                                    iconclass="far fa-user"
                                    name='nombre'
                                    value={form.nombre}
                                    onChange={onChange}
                                    messageinc="Ingresa el nombre."
                                />
                            </div>
                            <div className="col-md-4">
                                <SelectSearchGray
                                    formeditado={formeditado}
                                    withtaglabel={1}
                                    withtextlabel={1}
                                    name='empresa'
                                    options={options.empresas}
                                    placeholder='SELECCIONA LA EMPRESA'
                                    value={form.empresa}
                                    onChange={this.updateEmpresa}
                                    iconclass="far fa-building"
                                    messageinc="Selecciona la empresa."
                                    withicon={1}
                                />
                            </div>
                            <div className="col-md-4">
                                <SelectSearchGray
                                    formeditado={formeditado}
                                    withtaglabel={1}
                                    withtextlabel={1}
                                    name='origen'
                                    options={options.origenes}
                                    placeholder="SELECCIONA EL ORIGEN"
                                    value={form.origen}
                                    onChange={this.updateOrigen}
                                    iconclass={" fas fa-mail-bulk"}
                                    messageinc="Selecciona el origen."
                                    withicon={1}
                                />
                            </div>
                        </div>
                        <div className="separator separator-dashed mt-1 mb-2"></div>
                        <div className="form-group row form-group-marginless">
                            <div className="col-md-4 align-self-center">
                                <RadioGroupGray
                                    formeditado={formeditado}
                                    placeholder="Selecciona el tipo"
                                    name={'opcionrhp'}
                                    onChange={onChange}
                                    options={
                                        [
                                            {
                                                label: 'Proveedor',
                                                value: 'Proveedor'
                                            },
                                            {
                                                label: 'RRHH',
                                                value: 'RRHH'
                                            }
                                        ]
                                    }
                                    value={form.opcionrhp}
                                />
                            </div>
                            <div className="col-md-8">
                                <InputGray
                                    formeditado={formeditado}
                                    withtaglabel={1}
                                    withtextlabel={1}
                                    withplaceholder={1}
                                    withicon={0}
                                    withformgroup={0}
                                    placeholder="COMENTARIO"
                                    name="comentario"
                                    value={form.comentario}
                                    onChange={onChange}
                                    rows={3}
                                    as='textarea'
                                />
                            </div>
                        </div>
                    </Col>
                </Row>
                <div className="card-footer pt-3 pr-1 pb-0">
                    <div className="row">
                        <div className="col-lg-12 text-right pr-0 pb-0">
                            <Button icon='' className="btn btn-primary mr-2"
                                onClick={
                                    (e) => {
                                        e.preventDefault();
                                        validateAlert(onSubmit, e, 'form-rrhh-p') 
                                    }
                                }
                                text="ENVIAR"
                            />
                        </div>
                    </div>
                </div>
            </Form>
        )
    }
}

export default FormProveedoresRRHH