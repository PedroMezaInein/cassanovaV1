import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import { Button } from '../form-components'
import { faTrashAlt, faCalendarCheck } from '@fortawesome/free-solid-svg-icons'
import Calendar from '../form-components/Calendar'
import { Small } from '../texts'
import InputGray from '../form-components/Gray/InputGray'
import { CalendarDay } from '../form-components'
class TareaForm extends Component {

    state = {
        activeEnd: '',
        activeDelete: ''
    }

    updateParticipantes = value => {
        const { update } = this.props
        update(value);
    }

    onChangeCalendar = date => {
        const { changeValueSend, changeValue } = this.props
        changeValue({ target: { name: 'fecha_limite', value: date.target.value } })
        changeValueSend({ target: { name: 'fecha_limite', value: date.target.value } })
    }

    onClickEnd = () => {
        const { activeEnd } = this.state
        if (activeEnd === '') {
            this.setState({
                activeEnd: 'active',
                activeDelete: ''
            })
        } else {
            this.setState({
                activeEnd: '',
                activeDelete: ''
            })
        }
    }

    onClickDelete = () => {
        const { activeDelete } = this.state
        if (activeDelete === '') {
            this.setState({
                activeDelete: 'active',
                activeEnd: ''
            })
        } else {
            this.setState({
                activeDelete: '',
                activeEnd: ''
            })
        }
    }

    onClickClose = () => {
        this.setState({
            activeDelete: '',
            activeEnd: ''
        })
    }

    render() {
        const { form, changeValue, changeValueSend, deleteTarea, endTarea, formeditado, participantesTask, deleteParticipante, update, ...props } = this.props
        const { activeEnd, activeDelete } = this.state
        return (
            <Form {...props}>
                <div className="row mx-0">
                    <div className="form-group row form-group-marginless col-md-12">
                        <div className="col-md-5 text-center align-self-center pt-5">
                            {/* <Calendar
                                onChangeCalendar={this.onChangeCalendar}
                                placeholder="FECHA LÍMITE"
                                name="fecha_limite"
                                value={(form.fecha_limite === null || form.fecha_limite === undefined) ? '' : new Date(form.fecha_limite)}
                            /> */}
                            <div className="d-flex justify-content-center" style={{ height: '1px' }}>
                                <label className="text-center font-weight-bolder">Fecha</label>
                            </div>
                            <CalendarDay
                                date={(form.fecha_limite === null || form.fecha_limite === undefined || form.fecha_limite === NaN) ? '' : new Date(form.fecha_limite)}
                                value={(form.fecha_limite === null || form.fecha_limite === undefined || form.fecha_limite === NaN) ? '' : new Date(form.fecha_limite)}
                                onChange={this.onChangeCalendar}
                                name='fecha_limite'
                            />
                        </div>
                        <div className="col-md-7 align-self-center">
                            <div>
                                <InputGray
                                    withtaglabel={1}
                                    withtextlabel={1}
                                    withplaceholder={1}
                                    withicon={1}
                                    requirevalidation={0}
                                    formeditado={formeditado}
                                    placeholder='TÍTULO'
                                    value={form.titulo}
                                    name='titulo'
                                    onBlur={(e) => { e.preventDefault(); changeValueSend(e) }}
                                    onChange={(e) => { e.preventDefault(); changeValue(e) }}
                                    iconclass={"fas fa-tasks"}
                                    messageinc="Incorrecto. Ingresa el título de la tarea."
                                />
                            </div>
                            <div>
                                <InputGray
                                    withtaglabel={1}
                                    withtextlabel={1}
                                    withplaceholder={1}
                                    withicon={0}
                                    requirevalidation={0}
                                    formeditado={formeditado}
                                    placeholder='DESCRIPCIÓN'
                                    value = { form.descripcion === null ? '' : form.descripcion }
                                    name='descripcion'
                                    as="textarea"
                                    rows="4"
                                    onBlur={(e) => { e.preventDefault(); changeValueSend(e) }}
                                    onChange={(e) => { e.preventDefault(); changeValue(e) }}
                                    messageinc="Incorrecto. Ingresa una descripción."
                                />
                            </div>
                        </div>
                        
                        <div className="col-md-12 d-flex justify-content-center align-items-center">
                            <Button
                                icon=''
                                only_icon={'far fa-calendar-alt'}
                                className={"btn btn-light-primary font-weight-bold mr-2"}
                                onClick={() => this.onClickEnd()}
                                text='TERMINAR'
                            />
                            <div className={`${activeEnd} transition-all hidden`}>
                                <Small className="d-flex align-items-center">
                                    ¿Das por terminada la tarea?
                                        <Button
                                            icon=''
                                            className={"btn btn-icon btn-xs mx-2 btn-light btn-text-dark btn-hover-text-dark"}
                                            onClick={() => this.onClickClose()} 
                                            only_icon={"flaticon2-cross icon-xs"}
                                        />
                                        
                                        <Button
                                            icon=''
                                            className={"btn btn-icon btn-xs mr-2 btn-light btn-text-success btn-hover-text-success"} 
                                            onClick={() => endTarea(form.id)}
                                            only_icon={"flaticon2-check-mark icon-sm"}
                                        />
                                </Small>
                            </div>
                            <Button
                                icon=''
                                only_icon={'far fa-trash-alt'}
                                className={"btn btn-light-danger font-weight-bold mr-2"} 
                                onClick={() => this.onClickDelete()}
                                text='ELIMINAR'
                            />
                            <div className={`${activeDelete} transition-all hidden`}>
                                <Small className="d-flex align-items-center">
                                    ¿Estás seguro?
                                        <Button 
                                            icon=''
                                            className={"btn btn-icon btn-xs mx-2 btn-light btn-text-dark btn-hover-text-dark"} 
                                            onClick={() => this.onClickClose()}
                                            only_icon={"flaticon2-cross icon-xs"}
                                        />
                                        <Button 
                                            icon=''
                                            className={"btn btn-icon btn-xs mr-2 btn-light btn-text-success btn-hover-text-success"}  
                                            onClick={() => deleteTarea(form.id)} 
                                            only_icon={"flaticon2-check-mark icon-sm"}
                                        />
                                </Small>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-12">
                        
                    </div>
                </div>
            </Form>
        )
    }
}

export default TareaForm