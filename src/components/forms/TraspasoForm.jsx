import React, { Component } from 'react'
import { Subtitle } from '../texts'
import { InputMoney, SelectSearch, Input, Button, Calendar } from '../form-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperclip, faTimes } from '@fortawesome/free-solid-svg-icons'
import { DARK_BLUE } from '../../constants'
import { Badge, Form } from 'react-bootstrap'

class TareaForm extends Component{

    updateOrigen = value => {
        console.log(value, 'select search update origen')
        const { onChange } = this.props
        onChange( { target: { name: 'origen', value: value.value } } )
    }

    updateDestino = value => {
        const { onChange } = this.props
        onChange( { target: { name: 'destino', value: value.value } } )
    }

    changeDate = date => {
        const { onChange } = this.props
        onChange( { target: { value: date, name:'fecha' } } )
    }

    render(){

        const { title, cuentas, form, onChange, onChangeAdjunto, deleteAdjunto, ... props } = this.props
        console.log(cuentas, 'Cuentas')
        return(
            <Form { ... props}>
                
                <Subtitle className="text-center my-2" color="gold">
                    {title}
                </Subtitle>

                <div className="row mx-0">
                    <div className="col-md-4 px-2">
                        <InputMoney prefix = { '$' } name = "cantidad" value = { form.cantidad } onChange = { onChange } placeholder="Ingrese el monto de traspaso" />
                    </div>
                    <div className="col-md-4 px-2">
                        <SelectSearch options = { cuentas } value = { form.origen } onChange = { this.updateOrigen } placeholder="Cuenta origen"/>
                    </div>
                    <div className="col-md-4 px-2">
                        <SelectSearch options = { cuentas } value = { form.destino } onChange = { this.updateDestino } placeholder="Cuenta destino"/>
                    </div>
                    <div className="col-md-4 px-2">
                        <Calendar onChangeCalendar = { this.changeDate } name = "fecha" value = { form.fecha } placeholder="Fecha de traspaso"/>
                    </div>
                    <div className="col-md-8 px-2 d-flex">
                        
                        <div className="image-upload d-flex align-items-center">
                            <div className="no-label">
                                <Input onChange = { onChangeAdjunto } value = { form.adjunto } name = "adjunto" type = "file" id = "adjunto"
                                    accept = "application/pdf, image/*" />
                            </div>
                            <label htmlFor="adjunto">
                                <FontAwesomeIcon className = "p-0 font-unset mr-2" icon={ faPaperclip } color={ DARK_BLUE } />
                            </label>
                            {
                                form.adjuntoName &&
                                    <Badge variant="light" className="d-flex px-3 align-items-center" pill>
                                        <FontAwesomeIcon 
                                            icon = { faTimes } 
                                            onClick={ (e) => { e.preventDefault(); deleteAdjunto() } } 
                                            className=" small-button mr-2" />
                                        {
                                            form.adjuntoName
                                        }
                                    </Badge>
                            }
                        </div>
                    </div>
                    <div className="col-md-12 px-2">
                        <Input placeholder = "Comentario" as = "textarea" rows = "3" name = "comentario" value = { form.comentario } onChange = { onChange } />
                    </div>
                </div>

                <div className="text-center mt-3 mb-2">
                    <Button icon='' className="mx-auto" type="submit" text="Enviar" />
                </div>

            </Form>
        )
    }
}

export default TareaForm