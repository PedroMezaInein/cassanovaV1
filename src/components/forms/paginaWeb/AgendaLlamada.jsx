import React, { Component } from 'react'
import { CalendarDay, Button } from '../../form-components'
import { Col, Form } from 'react-bootstrap'
import SelectHorario from '../../form-components/SelectHorario'
import { confirmarCita } from './../../../functions/alert'
class AgendaLlamada extends Component {
    render() {
        const { form, onChange, onSubmit, lead, cierre_reviso, cita_reviso } = this.props
        let fecha = new Date(form["fecha"])
        let dia = fecha.getDate()
        let numMes = fecha.getMonth() + 1
        let mes = ""
        switch (numMes) {
            case 1:
                mes = "Enero";
                break;
            case 2:
                mes = "Febrero";
                break;
            case 3:
                mes = "Marzo";
                break;
            case 4:
                mes = "Abril";
                break;
            case 5:
                mes = "Mayo";
                break;
            case 6:
                mes = "Junio";
                break;
            case 7:
                mes = "Julio";
                break;
            case 8:
                mes = "Agosto";
                break;
            case 9:
                mes = "Septiembre";
                break;
            case 10:
                mes = "Octubre";
                break;
            case 11:
                mes = "Noviembre";
                break;
            case 12:
                mes = "Diciembre";
                break;
            default:
                return ''
        }
        return (
            <>
                {
                    cierre_reviso ?
                        lead.empresa.name === 'INFRAESTRUCTURA MÉDICA' ?
                            <div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg text-justify my-4"><span className="font-weight-boldest">¿Qué dia se le acomoda mejor a su agenda?</span></div>
                            :
                            lead.empresa.name === 'INEIN' ?
                                <div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg text-justify my-4"><span className="font-weight-boldest">¿Qué dia se te acomoda mejor a tu agenda?</span></div>
                                : ''
                        :
                        cita_reviso ?
                            lead.empresa.name === 'INFRAESTRUCTURA MÉDICA' ?
                                <div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg text-justify my-4">Perfecto mañana me estaré comunicando con usted <span className="font-weight-boldest">{" el día " + dia + " de " + mes + " a las " + form["hora"] + ":" + form["minuto"]}</span>, que tengas excelente día.</div>
                                :
                                lead.empresa.name === 'INEIN' ?
                                    <div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg text-justify my-4">Perfecto me estaré comunicando contigo <span className="font-weight-boldest">{" el día " + dia + " de " + mes + " a las " + form["hora"] + ":" + form["minuto"]}</span>, que tengas excelente día.</div>
                                    : ''
                            : ''
                }
                <Form id="form-agendar">
                    <div className="row my-5">
                        <Col md="12" className="text-center">
                            <div className="d-flex justify-content-center">
                                <div className="col-md-5">
                                    <label className="col-form-label text-center font-weight-bolder pt-0">Hora de la llamada</label>
                                    <div className="form-group row d-flex justify-content-center mx-0">
                                        <SelectHorario onChange={onChange} minuto={{ value: form.minuto, name: 'minuto' }}
                                            hora={{ value: form.hora, name: 'hora' }} requirevalidation={1} />
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-9 mx-auto">
                                <CalendarDay value={form.fecha} name='fecha' onChange={onChange} date={form.fecha} withformgroup={1} requirevalidation={1} title='Fecha' messageinc='Selecciona la fecha'/>
                            </div>
                        </Col>
                    </div>
                    {
                        form.fecha !== null && form.hora !== 0 && form.minuto !== 0 ?
                        <div className="card-footer pt-3 px-0 pb-0 text-right">
                            <Button icon=''
                                onClick={
                                    (e) => { e.preventDefault(); this.confirmarCita('¿ESTÁS SEGURO DE ENVIAR LOS SIGUIENTES DATOS?', form, lead, () => onSubmit(), e, 'form-agendar') }
                                }
                                text="ENVIAR"
                            />
                        </div>
                        :<></>
                    }
                </Form>
            </>
        )
    }
}

export default AgendaLlamada