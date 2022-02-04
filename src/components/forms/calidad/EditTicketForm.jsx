import React, { Component } from 'react'
import { Form, Row, Col } from 'react-bootstrap'
import { CalendarDay,  Button } from '../../form-components'
import { validateAlert } from '../../../functions/alert'
class ProcesoTicketForm extends Component {
    isMantenimiento = () => {
        const { ticket } = this.props
        if(ticket.subarea){
            switch(ticket.subarea.nombre){
                case 'MANTENIMIENTO':
                case 'MANTENIMIENTO CORRECTIVO':
                case 'MANTENIMIENTO PREVENTIVO':
                    return true;
                default: break;
            }
        }
        return false;
    }

    updateSelect = (value, type) => {
        const { onChange } = this.props
        onChange({ target: { name: type, value: value } })
    }
    render() {
        const { form, onSubmit, formeditado, onChange, options, handleChange, deleteFile, generateEmail, estatus, ticket, at, ...props } = this.props
        return (
            <div>
                {
                    <div className="row justify-content-center">    
                        <div className="col-md-12">
                            
                        <Form id= 'fechas' onSubmit = { (e) => { e.preventDefault(); validateAlert(onSubmit, e, 'fechas') } }{...props} >
                            <Row className="mx-0">
                                <Col md="6" className="align-self-center px-0 d-flex justify-content-center">
                                    <div>
                                        <div className="col-md-12 text-center px-0" style={{ height: '1px' }}>
                                            <label className="text-center font-weight-bold text-dark-60">Fecha Autorizada</label>
                                        </div>
                                        <div className="col-md-12 text-center px-0">
                                            <div className="calendar-tickets">
                                                <CalendarDay value = { form.fechaAutorizada } date = { form.fechaAutorizada }
                                                    onChange = { onChange } name = 'fechaAutorizada' withformgroup = { 0 }
                                                    requirevalidation = { 0 } />
                                            </div>
                                        </div>
                                    </div>
                                </Col>                                
                            </Row>
                            <div className="border-top mt-3 pt-3">
                                <div className="row">
                                    <div className="col-lg-6 text-left">
                                    </div>
                                    <div className="col-lg-6 text-right">
                                        <div className="">
                                            <Button icon='' className="btn btn-light-primary font-weight-bold text-uppercase mr-2" text="GUARDAR"
                                                onClick={
                                                    (e) => {
                                                        e.preventDefault();
                                                        validateAlert(onSubmit, e, 'fechas')
                                                    }
                                                } />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Form>
                        </div>
                    </div>

                }
            </div>
        );
    }
}

export default ProcesoTicketForm
