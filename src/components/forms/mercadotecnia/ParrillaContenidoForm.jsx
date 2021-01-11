import React, { Component } from 'react'
import { SelectSearch, Button, Input, CalendarDay, SelectHorario } from '../../form-components'
import { Form, Col, Row } from 'react-bootstrap'
import { validateAlert } from '../../../functions/alert'

class ParrillaContenidoForm extends Component {

    updateSocialNetworks = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'socialNetwork' } })
    }
    
    updateTypeContent = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'typeContent' } })
    }

    updateEmpresa = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'empresa' } })
    }

    render() {
        const { options, form, onChange, onSubmit, formeditado, ...props } = this.props
        return (
            <Form id="form-contenido"
                onSubmit={
                    (e) => {
                        e.preventDefault();
                        validateAlert(onSubmit, e, 'form-contenido')
                    }
                }
                {...props}
            >
                <Row>
                    <Col md={4} className="d-flex justify-content-center">
                        <div className="col-md-12 text-center align-self-center mt-4">
                            <div className="d-flex justify-content-center" style={{ height: '1px' }}>
                                <label className="text-center font-weight-bolder">Fecha de publicación</label>
                            </div>
                            <CalendarDay
                                value={form.fecha}
                                date={form.fecha}
                                onChange={onChange}
                                name='fecha'
                                withformgroup={1}
                            />
                            <div className="d-flex justify-content-center">
                                    <div className="col-md-12">
                                        <label className="col-form-label text-center font-weight-bolder">Hora de publicación</label>
                                        <div className="form-group row d-flex justify-content-center">
                                            <SelectHorario 
                                                onChange = { onChange }
                                                hora = {{ value: form.hora, name: 'hora'}}
                                                minuto = {{ value: form.minuto, name: 'minuto'}}
                                            />
                                        </div>
                                    </div>
                                </div>
                        </div>
                    </Col>
                    <Col md={8}>
                        <div className="form-group row form-group-marginless mt-4">
                            <div className="col-md-4">
                                <SelectSearch
                                    formeditado={formeditado}
                                    options={options.empresas}
                                    placeholder="SELECCIONA LA EMPRESA"
                                    name="empresa"
                                    value={form.empresa}
                                    onChange={this.updateEmpresa}
                                    iconclass={"far fa-building"}
                                    messageinc="Incorrecto. Selecciona la empresa"
                                />
                            </div>
                            <div className="col-md-4">
                                <SelectSearch
                                    formeditado={formeditado}
                                    options={options.socialNetworks}
                                    placeholder="SELECCIONA LA RED SOCIAL"
                                    name="socialNetwork"
                                    value={form.redSocial}
                                    onChange={this.updateSocialNetworks}
                                    iconclass={"far fa-building"}
                                    messageinc="Incorrecto. Selecciona la red social"
                                />
                            </div>
                            <div className="col-md-4">
                                <SelectSearch
                                    formeditado={formeditado}
                                    options={options.typeContents}
                                    placeholder="SELECCIONA EL CONTENIDO"
                                    name="typeContent"
                                    value={form.typeContent}
                                    onChange={this.updateTypeContent}
                                    iconclass={"fas fa-pen-fancy"}
                                    messageinc="Incorrecto. Selecciona el contenido"
                                />
                            </div>
                        </div>
                        <div className="separator separator-dashed mt-1 mb-2"></div>
                        <div className="form-group row form-group-marginless justify-content-center">
                            <div className="col-md-4">
                                <Input
                                    requirevalidation={1}
                                    formeditado={formeditado}
                                    name="title"
                                    value={form.title}
                                    onChange={onChange}
                                    type="text"
                                    placeholder="TÍTULO"
                                    iconclass={"flaticon2-crisp-icons"}
                                    messageinc="Incorrecto. Ingresa el título."
                                />
                            </div>
                            <div className="col-md-4">
                                <Input
                                    requirevalidation={1}
                                    formeditado={formeditado}
                                    name="cta"
                                    value={form.cta}
                                    onChange={onChange}
                                    type="text"
                                    placeholder="CTA"
                                    iconclass={"fas fa-share-square"}
                                    messageinc="Incorrecto. Ingresa la cta."
                                />
                            </div>
                            <div className="col-md-4">
                                <Input
                                    requirevalidation={0}
                                    formeditado={formeditado}
                                    name="comments"
                                    value={form.comments}
                                    onChange={onChange}
                                    type="text"
                                    placeholder="COMENTARIOS (IMAGEN)"
                                    iconclass={"far fa-file-alt"}
                                    messageinc="Incorrecto. Ingresa los comentarios."
                                />
                            </div>
                        </div>
                        <div className="separator separator-dashed mt-1 mb-2"></div>
                        <div className="form-group row form-group-marginless justify-content-center">
                            <div className="col-md-12">
                                <Input
                                    requirevalidation={1}
                                    formeditado={formeditado}
                                    name="copy"
                                    value={form.copy}
                                    onChange={onChange}
                                    type="text"
                                    placeholder="COPY"
                                    messageinc="Incorrecto. Ingresa el copy."
                                    spellCheck={true}
                                    letterCase={false}
                                    as="textarea"
                                    rows="5"
                                    style={{ paddingLeft: "10px" }}
                                    customicon="d-none"
                                />
                            </div>
                        </div>
                    </Col>
                </Row>
                <div className="card-footer py-3 pr-1">
                    <div className="row">
                        <div className="col-lg-12 text-right pr-0 pb-0">
                            <Button icon='' className="mx-auto"
                                onClick={
                                    (e) => {
                                        e.preventDefault();
                                        validateAlert(onSubmit, e, 'form-contenido')
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

export default ParrillaContenidoForm