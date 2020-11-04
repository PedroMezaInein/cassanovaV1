import React, { Component } from 'react'
import { CalendarDay, Button, InputGray } from '../../../form-components'
import { Col, Form } from 'react-bootstrap'
import { EMAIL } from '../../../../constants'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { messageAlert } from '../../../../functions/alert'

class AgendarCitaForm extends Component {
    addCorreo = () => {
        const { onChange, formAgenda } = this.props
        let aux = false
        let array = []
        if (/^(?:[^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*|"[^\n"]+")@(?:[^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,63}$/i.test(formAgenda.correo)) {
            if (formAgenda.correo) {
                formAgenda.correos.map((correo) => {
                    if (correo === formAgenda.correo) {
                        aux = true
                    }
                    return false
                })
                if (!aux) {
                    array = formAgenda.correos
                    array.push(formAgenda.correo)
                    onChange({ target: { name: 'correos', value: array } })
                    onChange({ target: { name: 'correo', value: '' } })
                }
            }
        } else {
            messageAlert("LA DIRECCIÓN DEL CORREO ELECTRÓNICO ES INCORRECTA");
        }
    }
    render() {
        const { formAgenda, onChange, onSubmit, removeCorreo, solicitarFechaCita } = this.props
        return (
            <Form>
                <div className="row">
                    <Col md="6" className="text-center align-self-center">
                        <div className="form-group row form-group-marginless d-flex justify-content-center mb-0 pb-0">
                            <div className="col-md-12 text-center" style={{ height: '14px' }}>
                                <label className="text-center font-weight-bolder">Fecha</label>
                            </div>
                            <div className="col-md-12 text-center">
                                <CalendarDay value={formAgenda.fecha} name='fecha' onChange={onChange} />
                                <div className="d-flex justify-content-center">
                                    <div className="col-md-4">
                                        <label className="col-form-label text-center font-weight-bolder">Hora de inicio</label>
                                        <div className="form-group row d-flex justify-content-center">
                                            <div className="input-daterange input-group" style={{ width: "auto" }}>
                                                <Form.Control as="select" className="px-1 py-0" style={{ height: "27px" }} value={formAgenda.hora_inicio} onChange={onChange} name='hora_inicio'>
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
                                                <Form.Control as="select" className="px-1 py-0" style={{ height: "27px" }} value={formAgenda.minuto_inicio} onChange={onChange} name='minuto_inicio'>
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
                                    <div className="col-md-4">
                                        <label className="col-form-label text-center font-weight-bolder">Hora final</label>
                                        <div className="form-group row d-flex justify-content-center">
                                            <div className="input-daterange input-group" style={{ width: "auto" }}>
                                                <Form.Control as="select" className="px-1 py-0" style={{ height: "27px" }} value={formAgenda.hora_final} onChange={onChange} name='hora_final'>
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
                                                <Form.Control as="select" className="px-1 py-0" style={{ height: "27px" }} value={formAgenda.minuto_final} onChange={onChange} name='minuto_final'>
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
                            </div>
                        </div>
                    </Col>
                    <Col md="6" className="text-center align-self-center">
                        <div className="d-flex justify-content-center align-items-end ">
                            <div className="btn btn-icon btn-light w-auto btn-clean d-inline-flex align-items-center btn-lg px-2 mr-5"
                                onClick={solicitarFechaCita} >
                                <span className="text-dark-50 font-weight-bolder font-size-base mr-3">Solicitar cita</span>
                                <span className="symbol symbol-35 bg-light-gray">
                                    <span className="symbol-label font-size-h5 font-weight-bold">
                                        <i className="far fa-calendar-check text-gray icon-md"></i>
                                    </span>
                                </span>
                            </div>
                        </div>
                        <div className="form-group row form-group-marginless mt-4 pb-0 mb-0">
                            <div className="col-md-12 text-left">
                                <InputGray
                                    withtaglabel={1}
                                    withtextlabel={1}
                                    withplaceholder={1}
                                    withicon={1}
                                    placeholder='Titulo'
                                    iconclass="fas fa-users"
                                    name='titulo'
                                    value={formAgenda.titulo}
                                    onChange={onChange}
                                />
                            </div>
                            <div className="col-md-10 text-left">
                                <InputGray
                                    withtaglabel={1}
                                    withtextlabel={1}
                                    withplaceholder={1}
                                    withicon={1}
                                    placeholder="CORREO DE CONTACTO"
                                    iconclass='fas fa-envelope'
                                    name='correo'
                                    value={formAgenda.correo}
                                    onChange={onChange}
                                    patterns={EMAIL}
                                />
                            </div>
                            <div className="col-md-2 mt-3 d-flex justify-content-center align-items-center">
                                <Button icon={faPlus} pulse={"pulse-ring"} className={"btn btn-icon btn-light-gray pulse pulse-dark mr-5"} onClick={(e) => { e.preventDefault(); this.addCorreo() }} />
                            </div>
                        </div>
                        <div>
                            <div className="form-group row form-group-marginless">
                                <div className="col-md-12 row mx-0">
                                    {
                                        formAgenda.correos.map((correo, key) => {
                                            return (
                                                <div className="tagify form-control p-1 col-md-6 px-2 d-flex justify-content-center align-items-center white-space" tabIndex="-1" style={{ borderWidth: "0px" }} key={key}>
                                                    <div className=" image-upload d-flex px-3 align-items-center tagify__tag tagify__tag--primary tagify--noAnim white-space"  >
                                                        <div
                                                            title="Borrar archivo"
                                                            className="tagify__tag__removeBtn"
                                                            role="button"
                                                            aria-label="remove tag"
                                                            onClick={(e) => { e.preventDefault(); removeCorreo(correo) }}
                                                        >
                                                        </div>
                                                        <div><span className="tagify__tag-text p-1 white-space">{correo}</span></div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    </Col>
                </div>
                <div className='text-center pb-4'>
                    <Button icon='' className="btn btn-primary mr-2"
                        onClick={
                            (e) => {
                                e.preventDefault();
                                onSubmit()
                            }
                        }
                        text="AGENDAR" />
                </div>
                <div className="card-footer pt-3 pr-1 pb-0">
                    <div className="row">
                        <div className="col-lg-12 text-right pr-0 pb-0">

                        </div>
                    </div>
                </div>
            </Form>
        )
    }
}

export default AgendarCitaForm