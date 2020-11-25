import React, { Component } from 'react'
import { CalendarDay, Button, InputGray, TagInputGray, SelectHorario, RadioGroupGray} from '../../../form-components'
import { Col, Form } from 'react-bootstrap'
// import { EMAIL } from '../../../../constants'
// import { faPlus } from '@fortawesome/free-solid-svg-icons'
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
        const { formAgenda, onChange, onSubmit, removeCorreo, tagInputChange} = this.props
        return (
            <Form>
                <div className="row">
                    <Col md="6" className="text-center align-self-center">
                        <div className="form-group row form-group-marginless d-flex justify-content-center mb-0 pb-0">
                            <div className="col-md-12 text-center" style={{ height: '3px' }}>
                                <label className="text-center font-weight-bolder">Fecha</label>
                            </div>
                            <div className="col-md-12 text-center">
                                <CalendarDay value={formAgenda.fecha} name='fecha' onChange={onChange} />
                                <div className="d-flex justify-content-center">
                                    <div className="col-md-4">
                                        <label className="col-form-label text-center font-weight-bolder">Hora de inicio</label>
                                        <div className="form-group row d-flex justify-content-center">
                                            <SelectHorario onChange = { onChange } hora = {{ value: formAgenda.hora_inicio, name: 'hora_inicio'}}
                                                minuto = {{ value: formAgenda.minuto_inicio, name: 'minuto_inicio'}} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <label className="col-form-label text-center font-weight-bolder">Hora final</label>
                                        <div className="form-group row d-flex justify-content-center">
                                            <SelectHorario onChange = { onChange } hora = {{ value: formAgenda.hora_final, name: 'hora_final'}}
                                                minuto = {{ value: formAgenda.minuto_final, name: 'minuto_final'}} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col md="6" className="text-center align-self-center">
                        <div className="form-group row form-group-marginless mt-4 pb-0 mb-0">
                            <div className="col-md-8 text-left">
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
                        </div>
                        <div className="form-group row form-group-marginless pb-0 mb-0">
                            <div className='col-md-8 text-left'>
                                <RadioGroupGray
                                    placeholder = "¿Cita presencial o remota?"
                                    name = 'lugar'
                                    onChange = { onChange }
                                    options = {
                                        [
                                            {
                                                label: 'Presencial',
                                                value: 'presencial'
                                            },
                                            {
                                                label: 'Remota',
                                                value: 'remota'
                                            }
                                        ]
                                    }
                                    value = { formAgenda.lugar }
                                    />
                            </div>
                            <div className='col-md-8 text-left'>
                                <InputGray
                                    letterCase = { formAgenda.lugar === 'presencial' ? true : false }
                                    withtaglabel = { 1 }
                                    withtextlabel = { 1 }
                                    withplaceholder = { 1 }
                                    withicon = { 1 }
                                    placeholder = { formAgenda.lugar === 'presencial' ? 'UBICACIÓN' : 'URL' }
                                    iconclass = { formAgenda.lugar === 'presencial' ? 'fas fa-map-marker-alt' : ' fas fa-link' }
                                    name = { formAgenda.lugar === 'presencial' ? 'ubicacion' : 'url' }
                                    value = { formAgenda.lugar === 'presencial' ? formAgenda.ubicacion : formAgenda.url }
                                    onChange = { onChange }
                                />
                            </div>
                            <div className="col-md-8 text-left">
                                <TagInputGray
                                    tags = { formAgenda.correos }
                                    onChange = { tagInputChange }
                                    placeholder = "CORREOS DE ASISTENTES"
                                    iconclass = "fas fa-envelope"
                                    letterCase = { false }
                                />
                                {/* <InputGray
                                    letterCase = { false }
                                    withtaglabel = { 1 }
                                    withtextlabel = { 1 }
                                    withplaceholder = { 1 }
                                    withicon = { 1 }
                                    placeholder = "CORREOS DE ASISTENTES"
                                    iconclass = 'fas fa-envelope'
                                    name = 'correo'
                                    value = { formAgenda.correo }
                                    onChange = { onChange }
                                    patterns = { EMAIL }
                                /> */}
                            </div>
                            {/* <div className="col-md-2 mt-3 d-flex justify-content-center align-items-center">
                                <Button icon={faPlus} pulse={"pulse-ring"} className={"btn btn-icon btn-light-gray pulse pulse-dark mr-5"} onClick={(e) => { e.preventDefault(); this.addCorreo() }} />
                            </div> */}
                        </div>
                        {/* <div>
                            <div className="form-group row form-group-marginless">
                                <div className="col-md-12 row mx-0">
                                    {
                                        formAgenda.correos.map((correo, key) => {
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
                        </div> */}
                    </Col>
                </div>
                {/* <div className='text-center pb-4'> </div> */}
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
                            text="AGENDAR" 
                            />
                        </div>
                    </div>
                </div>
            </Form>
        )
    }
}

export default AgendarCitaForm