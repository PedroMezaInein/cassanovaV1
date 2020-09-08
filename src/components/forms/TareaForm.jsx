import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import { Input, Button } from '../form-components'
import { faTrashAlt, faCalendarCheck } from '@fortawesome/free-solid-svg-icons'
import Calendar from '../form-components/Calendar'
import { Small } from '../texts'
import { GOLD} from '../../constants'

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
        changeValue({ target: { name: 'fecha_limite', value: date } })
        changeValueSend({ target: { name: 'fecha_limite', value: date } })
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
        const { form, changeValue, changeValueSend, deleteTarea, endTarea, formeditado } = this.props
        const { activeEnd, activeDelete } = this.state
        return (
            <Form {... this.props}>
                <div className="row mx-0">
                    <div className="form-group row form-group-marginless pt-3 col-md-12">
                        <div className="col-md-6">
                            <Input
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
                        <div className="col-md-3">
                            <Calendar
                                onChangeCalendar={this.onChangeCalendar}
                                placeholder="FECHA LÍMITE"
                                name="fecha_limite"
                                value={(form.fecha_limite === null || form.fecha_limite === undefined) ? '' : new Date(form.fecha_limite)}
                            />
                        </div>
                        <div className="col-md-3 d-flex justify-content-center align-items-center">
                            <Button 
                                icon={faCalendarCheck} 
                                pulse={"pulse-ring"} 
                                className={"btn btn-icon btn-light-primary pulse pulse-primary mr-2"}
                                onClick={() => this.onClickEnd()}
                                tooltip={{text:'Terminar'}}
                            />
                            <div className={`${activeEnd} transition-all hidden`}>
                                <Small className="d-flex align-items-center">
                                    ¿Das por terminada la tarea?
                                        <Button
                                            className={"btn btn-icon btn-xs mx-2 btn-light btn-text-dark btn-hover-text-dark"}
                                            onClick={() => this.onClickClose()} 
                                            only_icon={"flaticon2-cross icon-xs"}
                                        />
                                        
                                        <Button
                                            className={"btn btn-icon btn-xs mr-2 btn-light btn-text-success btn-hover-text-success"} 
                                            onClick={() => endTarea(form.id)}
                                            only_icon={"flaticon2-check-mark icon-sm"}
                                        />
                                </Small>
                            </div>


                            <Button 
                                icon={faTrashAlt} 
                                pulse={"pulse-ring"} 
                                className={"btn btn-icon btn-light-danger pulse pulse-danger mr-2"} 
                                onClick={() => this.onClickDelete()} 
                                tooltip={{text:'Eliminar'}}
                            />
                            <div className={`${activeDelete} transition-all hidden`}>
                                <Small className="d-flex align-items-center">
                                    ¿Estás seguro?
                                        <Button 
                                            className={"btn btn-icon btn-xs mx-2 btn-light btn-text-dark btn-hover-text-dark"} 
                                            onClick={() => this.onClickClose()}
                                            only_icon={"flaticon2-cross icon-xs"}
                                        />
                                        <Button 
                                            className={"btn btn-icon btn-xs mr-2 btn-light btn-text-success btn-hover-text-success"}  
                                            onClick={() => deleteTarea(form.id)} 
                                            only_icon={"flaticon2-check-mark icon-sm"}
                                        />
                                </Small>
                            </div>

                        </div>
                    </div>

                    <div className="col-md-12">
                        <Input
                            requirevalidation={0}
                            formeditado={formeditado}
                            placeholder='DESCRIPCIÓN'
                            value={form.descripcion}
                            name='descripcion'
                            as="textarea"
                            rows="3"
                            onBlur={(e) => { e.preventDefault(); changeValueSend(e) }}
                            onChange={(e) => { e.preventDefault(); changeValue(e) }}
                            style={{ paddingLeft: "10px" }}
                            messageinc="Incorrecto. Ingresa una descripción."
                        />
                    </div>
                </div>

            </Form>
        )
    }
}

export default TareaForm