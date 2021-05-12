import React, { Component } from 'react'
import { CalendarDay, Button, InputGray, TagInputGray } from '../../form-components'
import { Col, Form } from 'react-bootstrap'
import SelectHorario from '../../form-components/SelectHorario'
class AgendaLlamadaUbicacion extends Component {
    render() {
        const { form, onChange, onSubmit, lead, cierre_cita, cita_contrato, tagInputChange } = this.props
        let fecha = new Date(form["fecha"])
        let dia = fecha.getDate()
        let numMes = fecha.getMonth()+1
        let mes= ""
        switch(numMes)
        {
            case 1:
                mes= "Enero";
                break;
            case 2:
                mes= "Febrero";
                break;
            case 3:
                mes= "Marzo";
                break;
            case 4:
                mes= "Abril";
                break;
            case 5:
                mes= "Mayo";
                break;
            case 6:
                mes= "Junio";
                break;
            case 7:
                mes= "Julio";
                break;
            case 8:
                mes= "Agosto";
                break;
            case 9:
                mes= "Septiembre";
                break;
            case 10:
                mes= "Octubre";
                break;
            case 11:
                mes= "Noviembre";
                break;
            case 12:
                mes= "Diciembre";
                break;
            default:
                return ''
        }
        return (
            <>
                {
                    cierre_cita?
                        lead.empresa.name === 'INFRAESTRUCTURA MÉDICA'?
                            <div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg mb-3 text-justify my-4">¡Excelente!<span className="font-weight-boldest"> ¿Podemos programar la firma el día de mañana en el horario que mejor se acomode a tu agenda?</span></div>
                        :
                        lead.empresa.name === 'INEIN'?
                            <div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg mb-3 text-justify my-4">¡Excelente!<span className="font-weight-boldest"> ¿Podemos programar la firma el día de mañana en el horario que mejor se acomode a su agenda?</span></div>
                        :''
                    :
                    cita_contrato?
                        lead.empresa.name === 'INFRAESTRUCTURA MÉDICA'?
                            <div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg text-justify my-4">De acuerdo, lo programaremos para <span className="font-weight-boldest">{" el día "+dia+" de "+mes+" a las "+ form["hora"]+":"+form["minuto"]}</span>. Para ir adelantado el tema del contrato le hare llegar un correo con un listado de los datos que requerimos para incluirlos en este, también le enviare un machote del contrato para que usted pueda leerlo y en caso de tener dudas o comentarios pueda asesorarlo.</div>
                        :
                        lead.empresa.name === 'INEIN'?
                            <div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg text-justify my-4">De acuerdo, lo programaremos para <span className="font-weight-boldest">{" el día "+dia+" de "+mes+" a las "+ form["hora"]+":"+form["minuto"]}</span>. Para ir adelantado el tema del contrato te hare llegar un correo con un listado de los datos que requerimos para incluirlos en este, también le enviare un machote del contrato para que puedas leerlo y en caso de tener dudas o comentarios pueda asesorarte.</div>
                        :''
                    :''
                }
            <Form>
                <div className="row">
                    <Col md="12" className="text-center">
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
                        <div className="d-flex justify-content-center" style={{ height: '1px' }}>
                            <label className="text-center font-weight-bolder">Fecha</label>
                        </div>
                        <CalendarDay date = { form.fecha } value = { form.fecha } name = 'fecha' onChange = { onChange } withformgroup={1} requirevalidation={1}/>
                    </Col>
                    <Col md="12" className="text-center align-self-center">
                        <div className="form-group row form-group-marginless pb-0 mb-0">
                            <div className='col-md-12 text-left'>
                                <InputGray
                                    withtaglabel = { 1 }
                                    withtextlabel = { 1 }
                                    withplaceholder = { 1 }
                                    withicon = { 1 }
                                    withformgroup={1}
                                    placeholder = 'UBICACIÓN'
                                    iconclass = 'fas fa-map-marker-alt'
                                    name = 'ubicacion'
                                    value = { form.ubicacion }
                                    onChange = { onChange }
                                />
                            </div>
                            <div className="col-md-12 text-left">
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
                </div>
                <div className="card-footer pt-3 pr-1 pb-0">
                    <div className="row">
                        <div className="col-lg-12 text-right pr-0 pb-0">
                            <Button icon='' className="btn btn-primary mr-2"
                                onClick={
                                    (e) => {
                                        e.preventDefault();
                                        onSubmit()
                                    }
                                }
                                text="ENVIAR"
                            />
                        </div>
                    </div>
                </div>
            </Form>
            </>
        )
    }
}

export default AgendaLlamadaUbicacion