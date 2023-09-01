import React, { Component } from 'react'
import { CalendarDay, Button, InputGray, TagInputGray, SelectHorario, RadioGroupGray} from '../../form-components'
import { Col, Form } from 'react-bootstrap'
import { messageAlert, confirmarCita } from '../../../functions/alert'
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
        const { formAgenda, onChange, onSubmit, tagInputChange, onChangeAgendaLC, lead, formeditado} = this.props
        return (
            <Form id="form-agendar">
                <div className="row mx-0 justify-content-center">
                    <Col md="12" className="text-center align-self-center">
                        <div className="mb-10 row mx-0 form-group-marginless d-flex justify-content-center pb-0">
                            <label className="w-auto mr-4 py-0 col-form-label text-dark-60 font-weight-bold font-size-h6">¿Qué opción deseas realizar?</label>
                            <div className="w-auto px-3">
                                <div className="radio-inline mt-0 ">
                                    <label className="radio radio-outline radio-brand text-dark-60 font-weight-bold">
                                        <input
                                            type="radio"
                                            name='agendarCita'
                                            value={formAgenda.agendarCita}
                                            onChange={onChangeAgendaLC}
                                            checked={formAgenda.agendarCita}
                                        />Agendar cita
										<span></span>
                                    </label>
                                    <label className="radio radio-outline radio-brand text-dark-60 font-weight-bold">
                                        <input
                                            type="radio"
                                            name='agendarLlamada'
                                            value={formAgenda.agendarLlamada}
                                            onChange={onChangeAgendaLC}
                                            checked={formAgenda.agendarLlamada}
                                        />Agendar llamada
										<span></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <div className={` ${formAgenda.agendarLlamada?"col-md-12":"col-md-6 col-xxl-5"} text-center align-self-center`}>
                        <div className="form-group row form-group-marginless d-flex justify-content-center mb-0 pb-0">
                            <div className="col-md-12 text-center">
                                <div className={`${formAgenda.agendarLlamada? 'col-md-6 col-xxl-3':'col-md-11 col-xxl-7'} mx-auto`}>
                                    <CalendarDay date = { formAgenda.fecha } value={formAgenda.fecha} name='fecha' onChange={onChange} withformgroup={1} requirevalidation={1} title='Fecha'/>
                                </div>
                                <div className={`d-flex justify-content-center ${formAgenda.agendarLlamada? 'col-md-6':'col-md-12'} mx-auto`}>
                                    <div className="col-md-5 col-xxl-3">
                                        <label className="col-form-label text-center font-weight-bolder text-dark-60">Hora de inicio</label>
                                        <div className="form-group row d-flex justify-content-center">
                                            <SelectHorario onChange = { onChange } hora = {{ value: formAgenda.hora_inicio, name: 'hora_inicio'}}
                                                minuto = {{ value: formAgenda.minuto_inicio, name: 'minuto_inicio'}} />
                                        </div>
                                    </div>
                                    <div className="col-md-5 col-xxl-3">
                                        <label className="col-form-label text-center font-weight-bolder text-dark-60">Hora final</label>
                                        <div className="form-group row d-flex justify-content-center">
                                            <SelectHorario onChange = { onChange } hora = {{ value: formAgenda.hora_final, name: 'hora_final'}}
                                                minuto = {{ value: formAgenda.minuto_final, name: 'minuto_final'}} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`col-md-6 text-center align-self-center ${formAgenda.agendarLlamada?"d-none":""}`}>
                        {
                            formAgenda.agendarCita?
                                <div className="form-group row form-group-marginless pb-0 mb-0">
                                    <div className="col-md-12 col-xxl-8 text-left">
                                        <InputGray
                                            withtaglabel={1}
                                            withtextlabel={1}
                                            withplaceholder={1}
                                            withicon={1}
                                            withformgroup={1}
                                            placeholder='NOMBRE DE LA REUNIÓN'
                                            iconclass="fas fa-users"
                                            name='titulo'
                                            value={formAgenda.titulo}
                                            onChange={onChange}
                                            requirevalidation={1}
                                            messageinc={"Ingresa el nombre de la reunión."}
                                            formeditado={formeditado}
                                        />
                                    </div>
                                </div>
                            :''
                        }
                        <div className="form-group row form-group-marginless pb-0 mb-0">
                            <div className="col-md-12 text-left">
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
                            {
                                formAgenda.lugar === 'presencial' ?
                                    <div className='col-md-12 text-left'>
                                        <RadioGroupGray
                                            placeholder = {`¿La cita es en ${lead?lead.empresa.name:""}?`}
                                            name = 'cita_empresa'
                                            onChange = { onChange }
                                            options = {
                                                [
                                                    {
                                                        label: 'Si',
                                                        value: 'si_empresa'
                                                    },
                                                    {
                                                        label: 'No',
                                                        value: 'no_empresa'
                                                    }
                                                ]
                                            }
                                            value = { formAgenda.cita_empresa }
                                        />
                                    </div>
                                :''
                            }
                            {
                                formAgenda.lugar === 'remota' ||  formAgenda.cita_empresa === 'no_empresa'?
                                    <div className='col-md-12 col-xxl-8 text-left'>
                                        <InputGray
                                            letterCase = { formAgenda.lugar === 'presencial' ? true : false }
                                            withtaglabel = { 1 }
                                            withtextlabel = { 1 }
                                            withplaceholder = { 1 }
                                            withicon = { 1 }
                                            withformgroup={1}
                                            placeholder = { formAgenda.lugar === 'presencial' ? 'UBICACIÓN' : 'URL' }
                                            iconclass = { formAgenda.lugar === 'presencial' ? 'fas fa-map-marker-alt' : ' fas fa-link' }
                                            name = { formAgenda.lugar === 'presencial' ? 'ubicacion' : 'url' }
                                            value = { formAgenda.lugar === 'presencial' ? formAgenda.ubicacion : formAgenda.url }
                                            onChange = { onChange }
                                            requirevalidation={formAgenda.agendarCita?1:0}
                                            messageinc={formAgenda.agendarCita?`INGRESA LA ${formAgenda.lugar === 'presencial' ? 'UBICACIÓN' : 'URL'}`:''}
                                            formeditado={formeditado}
                                        />
                                    </div>
                                :''
                            }
                            <div className="col-md-12 col-xxl-8 text-left">
                                <TagInputGray
                                    tags = { formAgenda.correos }
                                    onChange = { tagInputChange }
                                    placeholder = "CORREOS DE ASISTENTES"
                                    iconclass = "fas fa-envelope"
                                    letterCase = { false }
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`card-footer pt-3 px-0 pb-0 text-right mt-${formAgenda.agendarCita?'11':'4'}`}>
                    <Button icon='' 
                        onClick={
                            (e) => { e.preventDefault(); confirmarCita('¿ESTÁS SEGURO DE ENVIAR LOS SIGUIENTES DATOS?', formAgenda, lead, () => onSubmit(), e, 'form-agendar') }
                        }
                        text="AGENDAR"/>
                </div>
            </Form>
        )
    }
}

export default AgendarCitaForm