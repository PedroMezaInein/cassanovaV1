import React, { Component } from 'react'
import { Form, Row, Col } from 'react-bootstrap'
import { Button } from '../../form-components'
import { validateAlert,questionAlert } from '../../../functions/alert'
import ItemSlider from '../../singles/ItemSlider'

class SolicitudServicio extends Component {
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
        const { form, onSubmit, formeditado, onChange, options, handleChange, deleteFile, generateSolicitud, estatus, ticket, at, ...props } = this.props
        return (
            <div>
                {
                    <div className="row justify-content-center">  
                     <div className="text-center mb-5">
                            <span className={`font-size-h4 font-weight-bolder text-gray-700 letter-spacing-4px `}>
                               SOLICITUD DE SERVICIO
                            </span>
                        </div>
                        <div  className="col-md-12 ustify-content-left" >
                        <Button icon='' className="btn btn-light-success font-weight-bold text-uppercase" text="Descargar solicitud"
                           onClick = { (e) => { questionAlert('¿DESEAS DESCARGAR ARICHIVO?', 'DESCARGAR ARACHIVO DE SERVICIO PARA FIRMA', () => generateSolicitud(true)) } } />
                        </div>  
                        <div className="col-md-12">
                        <Form id= 'fechas' onSubmit = { (e) => { e.preventDefault(); validateAlert(onSubmit, e, 'fechas') } }{...props} >
                            <Row className="mx-0">
                                <Col md="12" className="align-self-center px-0 d-flex justify-content-center">
                                    
                                    <div>
                                      
                                        <div className="form-group row form-group-marginless mx-0">
                                            <div className="col-md-12 align-self-center">
                                                <div>
                                                    <div className="text-center mt-4 font-weight-bold text-dark-60 mb-4">
                                                        {form.adjuntos.solicitud_servicio.placeholder}
                                                    </div>
                                                    <ItemSlider items={form.adjuntos.solicitud_servicio.files} multiple = { true } item='solicitud_servicio' handleChange={handleChange} deleteFile={deleteFile} />
                                                </div>
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

export default SolicitudServicio
