import React, { Component } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { validateAlert } from '../../../functions/alert';
import { Input, CalendarDay, Button, InputNumber, SelectSearch } from '../../form-components'
class FormPrestamos extends Component {
    updateProyecto = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'proyecto' } })
    }
    render() {
        const { form, onSubmit, onChange, formeditado, options, ...props } = this.props
        return (
            <>
                <Form
                    onSubmit={
                        (e) => {
                            e.preventDefault();
                            validateAlert(onSubmit, e, 'wizard-3-content')
                        }
                    }
                    {...props} >
                    <Row className="mx-0 my-3">
                        <Col md="4" className="text-center align-self-center">
                            <div className="d-flex justify-content-center" style={{ height: '1px' }}>
                                <label className="text-center font-weight-bolder">Fecha del préstamo</label>
                            </div>
                            <CalendarDay value={form.fecha} name='fecha' onChange={onChange} date={form.fecha} withformgroup={0} requirevalidation={1} />
                        </Col>
                        <Col md="8">
                            
                            <div className="form-group row form-group-marginless mt-4">
                                <div className="col-md-12">
                                    <SelectSearch
                                        options={options.proyectos}
                                        placeholder="SELECCIONA EL PROYECTO"
                                        name="proyecto"
                                        value={form.proyecto}
                                        onChange={this.updateProyecto}
                                        iconclass="far fa-folder-open"
                                        formeditado={formeditado}
                                        messageinc="Selecciona el proyecto."
                                    />
                                </div>
                            </div>
                            <div className="separator separator-dashed mt-1 mb-2"></div>
                            <div className="form-group row form-group-marginless ">
                                <div className="col-md-6">
                                    <Input
                                        requirevalidation={1}
                                        formeditado={formeditado}
                                        name="responsable"
                                        value={form.responsable}
                                        onChange={onChange}
                                        type="text"
                                        placeholder='NOMBRE DEL RESPONSABLE'
                                        iconclass="fas fa-user"
                                        messageinc="Ingresa el nombre del responsable."
                                    />
                                </div>
                                
                                <div className="col-md-6">
                                    <InputNumber
                                        requirevalidation={1}
                                        formeditado={formeditado}
                                        name="cantidad"
                                        onChange={onChange}
                                        value={form.cantidad}
                                        type="text"
                                        placeholder="CANTIDAD"
                                        iconclass={"flaticon2-add-square"}
                                        thousandseparator={true}
                                        messageinc="Ingresa la cantidad."
                                    />
                                </div>
                            </div>
                            <div className="separator separator-dashed mt-1 mb-2"></div>
                            <div className="form-group row form-group-marginless">
                                <div className="col-md-12">
                                    <Input
                                        requirevalidation={1}
                                        formeditado={0}
                                        rows="2"
                                        as="textarea"
                                        placeholder="COMENTARIO"
                                        name="comentario"
                                        value={form.comentario}
                                        onChange={onChange}
                                        style={{ paddingLeft: "10px" }}
                                        messageinc="Incorrecto. Ingresa tu comentario."
                                    />
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <div className="card-footer py-3 pr-1">
                        <div className="row mx-0">
                            <div className="col-lg-12 text-right pr-0 pb-0">
                                <Button icon='' text='ENVIAR'
                                    onClick={(e) => { e.preventDefault(); onSubmit(e) }} />
                            </div>
                        </div>
                    </div>
                </Form>
            </>
        );
    }
}

export default FormPrestamos;