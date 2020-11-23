import React, { Component } from 'react'
import { CalendarDay, Button } from '../../form-components'
import { Col, Form } from 'react-bootstrap'
class AgendaLlamada extends Component {

    render() {
        const { form, onChange, onSubmit, lead, cierre_reviso, cita_reviso} = this.props
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
        }
        return (
            <>
                {
                    cierre_reviso?
                        lead.empresa.name === 'INFRAESTRUCTURA MÉDICA'?
                            <div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg text-justify my-4"><span className="font-weight-boldest">¿Qué dia se le acomoda mejor a su agenda?</span></div>
                        :
                        lead.empresa.name === 'INEIN'?
                            <div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg text-justify my-4"><span className="font-weight-boldest">¿Qué dia se te acomoda mejor a tu agenda?</span></div>
                        :''
                    :
                    cita_reviso?
                        lead.empresa.name === 'INFRAESTRUCTURA MÉDICA'?
                            <div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg text-justify my-4">Perfecto mañana me estaré comunicando con usted <span className="font-weight-boldest">{" el día "+dia+" de "+mes+" a las "+ form["hora"]+":"+form["minuto"]}</span>, que tengas excelente día.</div>
                        :
                        lead.empresa.name === 'INEIN'?
                        <div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg text-justify my-4">Perfecto me estaré comunicando contigo <span className="font-weight-boldest">{" el día "+dia+" de "+mes+" a las "+ form["hora"]+":"+form["minuto"]}</span>, que tengas excelente día.</div>
                        :''
                    :''
                }
            <Form>
                <div className="row">
                    <Col md="12" className="text-center">
                        <div className="d-flex justify-content-center">
                            <div className="col-md-5">
                                <label className="col-form-label text-center font-weight-bolder">Hora de la llamada</label>
                                <div className="form-group row d-flex justify-content-center">
                                    <div className="input-daterange input-group" style={{ width: "auto" }}>
                                        <Form.Control as="select" className="px-1 py-0" style={{ height: "27px" }} value={form.hora} onChange={onChange} name='hora'>
                                            <option disabled selected value={0}>HH</option>
                                            <option value={"08"}>08</option>
                                            <option value={"09"}>09</option>
                                            <option value={"10"}>10</option>
                                            <option value={"11"}>11</option>
                                            <option value={"12"}>12</option>
                                            <option value={"13"}>13</option>
                                            <option value={"14"}>14</option>
                                            <option value={"15"}>15</option>
                                            <option value={"16"}>16</option>
                                            <option value={"17"}>17</option>
                                            <option value={"18"}>18</option>
                                            <option value={"19"}>19</option>
                                            <option value={"20"}>20</option>
                                        </Form.Control>
                                        <div className="input-group-append">
                                            <span className="input-group-text py-0 px-2">
                                                :
                                        </span>
                                        </div>
                                        <Form.Control as="select" className="px-1 py-0" style={{ height: "27px" }} value={form.minuto} onChange={onChange} name='minuto'>
                                            <option disabled selected value={0}>MM</option>
                                            <option value={"00"}>00</option>
                                            <option value={"05"}>05</option>
                                            <option value={"10"}>10</option>
                                            <option value={"15"}>15</option>
                                            <option value={"20"}>20</option>
                                            <option value={"25"}>25</option>
                                            <option value={"30"}>30</option>
                                            <option value={"35"}>35</option>
                                            <option value={"40"}>40</option>
                                            <option value={"45"}>45</option>
                                            <option value={"50"}>50</option>
                                            <option value={"55"}>55</option>
                                        </Form.Control>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex justify-content-center" style={{ height: '1px' }}>
                            <label className="text-center font-weight-bolder">Fecha</label>
                        </div>
                        <CalendarDay value = { form.fecha } name = 'fecha' onChange = { onChange } />
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

export default AgendaLlamada