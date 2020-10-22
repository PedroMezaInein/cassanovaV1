import React, { Component } from 'react'
import { CalendarDay, InputGray, Button } from '../../form-components'
import { TEL, EMAIL } from '../../../constants'
import { Col } from 'react-bootstrap'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import TimeRangePicker from '@wojtekmaj/react-timerange-picker';
import { messageAlert } from '../../../functions/alert'
import TimeRange from 'react-time-range';
import moment from 'moment';
class AgendaLlamada extends Component {
    state = {
        time: ['10:00', '11:00'],
    }
    
    onChange = time => this.setState({time })
    addCorreo = () => {
        const { onChange, form } = this.props
        let aux = false
        let array = []
        if (/^(?:[^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*|"[^\n"]+")@(?:[^<>()[\].,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,63}$/i.test(form.correo)) {
            if (form.correo) {
                form.correos.map((correo) => {
                    if (correo === form.correo) {
                        aux = true
                    }
                    return false
                })
                if (!aux) {
                    array = form.correos
                    array.push(form.correo)
                    onChange({ target: { name: 'correos', value: array } })
                    onChange({ target: { name: 'correo', value: '' } })
                }
            }
        } else {
            messageAlert("LA DIRECCIÓN DEL CORREO ELECTRÓNICO ES INCORRECTA");
        }
    }
    render() {
        const { changeHora, form, onChange, removeCorreo } = this.props
        let startTime = moment();
        startTime.set({hour:8,minute:0,second:0,millisecond:0})
        let endTime = moment();
        endTime.set({hour:19,minute:0,second:0,millisecond:0})
        console.log(startTime.toISOString())
        return (
            <div className="row">
                <Col md="6" className="text-center">
                    <CalendarDay />
                    <TimeRangePicker
                        onChange={changeHora}
                        disableClock={true}
                        format="h:mm a"
                        // hourPlaceholder="hh"
                        // minutePlaceholder="mm"
                        value={[form.horaInicio, form.horaFin]}
                        
                    />  
                    <TimeRange
                        startLabel={""}
                        endLabel={""}
                        startMoment={startTime}
                        endMoment={endTime}
                        minuteIncrement={15}
                    />
                    {/* <TimeRangePicker
                        onChange={this.onChange}
                        format="h:mm a"
                        value={this.state.time}
                    /> */}
                </Col>
                <Col md="6" className="text-center">
                    <div className="form-group row form-group-marginless mt-4">
                        <div className="col-md-12">
                            <InputGray
                                placeholder='Titulo'
                                withicon={1}
                                iconclass="fas fa-users"
                                name='titulo'
                                value={form.titulo}
                                onChange={onChange}
                            />
                        </div>
                        <div className="col-md-12">
                            <InputGray
                                placeholder='Ubicación'
                                withicon={1}
                                iconclass="flaticon2-pin-1"
                                name='ubicacion'
                                value={form.ubicacion}
                                onChange={onChange}
                            />
                        </div>
                        <div className="col-md-12">
                            <InputGray
                                placeholder='Link'
                                withicon={1}
                                iconclass="fas fa-external-link-alt"
                                name='link'
                                value={form.link}
                                onChange={onChange}
                            />
                        </div>
                    </div>
                </Col>
                <Col md="12">
                    <div className="separator separator-dashed mt-4 mb-2"></div>
                    <div className="d-flex justify-content-center">
                        <span className="bg-gray-200 text-dark-50 font-size-h6 p-1 font-weight-bolder">Asistentes</span>
                    </div>
                    <div className="d-flex justify-content-center mt-2">
                        <div className="mr-5 text-center">
                            <div className="text-dark-75 font-weight-bolder text-hover-primary mb-1 font-size-lg">Carina Jiménez</div>
                            <span className="text-muted font-weight-bold d-block">Vendedor</span>
                        </div>
                        <div className="ml-5 text-center">
                            <div className="text-dark-75 font-weight-bolder text-hover-primary mb-1 font-size-lg">Ricardo García</div>
                            <span className="text-muted font-weight-bold d-block">Cliente</span>
                        </div>
                    </div>
                    <div>
                        <div className="form-group row form-group-marginless">
                            <div className="col-md-10">
                                <InputGray
                                    placeholder="CORREO DE CONTACTO"
                                    withicon={1}
                                    iconclass='fas fa-envelope'
                                    name='correo'
                                    value={form.correo}
                                    onChange={onChange}
                                    patterns={EMAIL}
                                />
                            </div>
                            <div className="col-md-2 mt-3 d-flex justify-content-center align-items-center">
                                <Button icon={faPlus} pulse={"pulse-ring"} className={"btn btn-icon btn-light-gray pulse pulse-dark mr-5"} onClick={(e) => { e.preventDefault(); this.addCorreo() }} />
                            </div>
                        </div>
                        <div className="form-group row form-group-marginless">
                            <div className="col-md-12 row mx-0">
                                {
                                    form.correos.map((correo, key) => {
                                        return (
                                            <div className="tagify form-control p-1 col-md-4 px-2 d-flex justify-content-center align-items-center white-space" tabIndex="-1" style={{ borderWidth: "0px" }} key={key}>
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
        )
    }
}

export default AgendaLlamada