import React, { Component } from 'react'
import { CalendarDay, Button, TagInputGray } from '../../form-components'
import { Col, Form, Row } from 'react-bootstrap'
import SelectHorario from '../../form-components/SelectHorario'
import { validateAlert, deleteAlert} from '../../../functions/alert'
class AgendarReunionGoogle extends Component {
    render() {
        const { form, onChange, onSubmit, tagInputChange, deleteEvent } = this.props
        return (
            <Form id="form-agendar">
                <Row>
                    <Col md="12" className="text-center">
                        <div className="d-flex justify-content-center mt-5" style={{ height: '1px' }}>
                            <label className="text-center font-weight-bolder">Fecha del evento</label>
                        </div>
                        <CalendarDay value = { form.fecha } name = 'fecha' onChange = { onChange } date = { form.fecha } withformgroup={0} />
                        <div className="d-flex justify-content-center">
                            <div className="col-md-4">
                                <label className="col-form-label text-center font-weight-bolder">Hora de inicio</label>
                                <div className="form-group row d-flex justify-content-center">
                                    <SelectHorario onChange = { onChange } minuto = {{ value: form.minuto, name: 'minuto'}}
                                        hora = {{ value: form.hora, name: 'hora'}} />
                                </div>
                            </div>
                            <div className="col-md-4">
                                <label className="col-form-label text-center font-weight-bolder">Hora final</label>
                                <div className="form-group row d-flex justify-content-center">
                                    <SelectHorario onChange = { onChange } minuto = {{ value: form.minuto_final, name: 'minuto_final'}}
                                        hora = {{ value: form.hora_final, name: 'hora_final'}} />
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col md="12">
                        <div className="form-group row form-group-marginless d-flex justify-content-center">
                            <div className="col-md-12">
                                <TagInputGray
                                    tags = { form.correos }
                                    onChange = { tagInputChange }
                                    placeholder = "CORREOS DE ASISTENTES"
                                    iconclass = "fas fa-envelope"
                                    letterCase = { false }
                                />
                            </div>
                        </div>
                    </Col>
                </Row>
                <div className="card-footer px-0 pt-4 pb-0">
                    <div className="row row-paddingless">
                        <div className="col-lg-12 text-right">
                            <Button icon = '' 
                                className = 'btn-light-danger font-weight-bold mr-3'
                                onClick={(e) => { deleteAlert('¿ESTÁS SEGURO QUE DESEAS ELIMINAR EL EVENTO ?', '¡NO PODRÁS REVERTIR ESTO!', () => deleteEvent()) }}
                                text = "ELIMINAR"
                            />
                            <Button icon='' className="btn btn-primary"
                                onClick={
                                    (e) => {
                                        e.preventDefault();
                                        validateAlert(onSubmit, e, 'form-agendar') 
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

export default AgendarReunionGoogle