import React, { Component } from 'react'
import { CalendarDay, Button } from '../../form-components'
import { Col, Form } from 'react-bootstrap'
class AgendaLlamada extends Component {
    render() {
        const { form, onChange, onSubmit } = this.props
        return (
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
        )
    }
}

export default AgendaLlamada