import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import { Button } from '../form-components'
import InputGray from '../form-components/Gray/InputGray'
import { CalendarDay } from '../form-components'
import { questionAlert, deleteAlert } from '../../functions/alert'
class TareaForm extends Component {

    updateParticipantes = value => {
        const { update } = this.props
        update(value);
    }

    onChangeCalendar = date => {
        const { changeValueSend, changeValue } = this.props
        changeValue({ target: { name: 'fecha_limite', value: date.target.value } })
        changeValueSend({ target: { name: 'fecha_limite', value: date.target.value } })
    }

    render() {
        const { form, changeValue, changeValueSend, deleteTarea, endTarea, formeditado, participantesTask, deleteParticipante, update, ...props } = this.props
        return (
            <Form {...props}>
                <div className="row mx-0">
                    <div className="form-group row form-group-marginless col-md-12 pt-4">
                        <div className="col-md-5 text-center align-self-center">
                            <div className="d-flex justify-content-center" style={{ height: '1px' }}>
                                <label className="text-center font-weight-bolder">Fecha de entrega</label>
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
                                    placeholder='TÍTULO DE LA TAREA'
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
                    </div>
                    <div className="col-md-12 d-flex justify-content-center align-items-center mt-1">
                            <Button
                                icon=''
                                className={"btn btn-icon btn-xs w-auto p-3 btn-light-gray mr-2 mt-2"}
                                onClick={(e) => { questionAlert('¿ESTÁS SEGURO QUE DESEAS TERMINAR LA TAREA?', '¡NO PODRÁS REVERTIR ESTO!', () => endTarea(form.id)) }}
                                only_icon={"far fa-calendar-check icon-15px mr-2"}
                                text='TERMINAR TAREA'
                            />
                            <Button
                                icon=''
                                className={"btn btn-icon btn-xs w-auto p-3 btn-light-danger mr-2 mt-2"}
                                onClick={(e) => { deleteAlert('¿ESTÁS SEGURO QUE DESEAS ELIMINAR LA TAREA?', '¡NO PODRÁS REVERTIR ESTO!', () => deleteTarea(form.id)) }}
                                only_icon={"far fa-trash-alt icon-15px mr-2"}
                                text='ELIMINAR TAREA'
                            />
                        </div>
                </div>
            </Form>
        )
    }
}

export default TareaForm