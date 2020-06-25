import React, { Component } from 'react'
import { Subtitle } from '../texts'
import { InputMoney, SelectSearch, Input, Button, Calendar } from '../form-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperclip, faTimes } from '@fortawesome/free-solid-svg-icons'
import { DARK_BLUE } from '../../constants'
import { Badge, Form } from 'react-bootstrap'

class TareaForm extends Component{

    updateOrigen = value => {
        const { onChange } = this.props
        onChange( { target: { name: 'origen', value: value } } )
    }

    updateDestino = value => {
        const { onChange } = this.props
        onChange( { target: { name: 'destino', value: value } } )
    }

    changeDate = date => {
        const { onChange } = this.props
        onChange( { target: { value: date, name:'fecha' } } )
    }

    render(){

        const { title, cuentas, form, onChange, onChangeAdjunto, deleteAdjunto, ... props } = this.props
        return(
            <Form { ... props}>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-6">
                        <SelectSearch 
                            options = { cuentas } 
                            value = { form.origen } 
                            onChange = { this.updateOrigen } 
                            placeholder="Cuenta origen" 
                            iconclass={"far fa-credit-card"} 
                        />
                        {/*<span className="form-text text-muted">Por favor, seleccione la cuenta origen</span>*/}
                    </div>
                    <div className="col-md-6">
                        <SelectSearch 
                            options = { cuentas }
                            value = { form.destino }
                            onChange = { this.updateDestino }
                            placeholder="Cuenta destino"
                            iconclass={"far fa-credit-card"}
                        />
                        {/*<span className="form-text text-muted">Por favor, seleccione la cuenta destino</span>*/}
                    </div>
                </div>

                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-4">
                        <InputMoney 
                            thousandSeparator={true}
                            prefix = { '$' }
                            name = "cantidad"
                            value = { form.cantidad }
                            onChange = { onChange }
                            placeholder="Ingrese el monto de traspaso"
                            iconclass={" fas fa-money-check-alt"}
                        />
                        {/*<span className="form-text text-muted">Por favor, ingrese el monto del transpaso </span>*/}
                    </div>
                    <div className="col-md-4">
                        <Calendar 
                            onChangeCalendar = { this.changeDate }
                            name = "fecha" value = { form.fecha }
                            placeholder="Fecha de traspaso"
                            iconclass={"far fa-calendar-alt"}
                        />
                        {/*<span className="form-text text-muted">Por favor, seleccione la fecha del transpaso </span>*/}
                    </div>
                    <div className="col-md-4">
                        <div className="image-upload d-flex align-items-center">
                            <div className="no-label">
                                <Input 
                                    onChange = { onChangeAdjunto }
                                    value = { form.adjunto }
                                    name = "adjunto"
                                    type = "file"
                                    id = "adjunto"
                                    accept = "application/pdf, image/*"
                                    iconclass={"fas fa-paperclip"}
                                />
                                {/*<span className="form-text text-muted">Por favor, adjunte su documento. </span>*/}   
                            </div>
                            {/*<label htmlFor="adjunto">
                                <FontAwesomeIcon className = "p-0 font-unset mr-2" icon={ faPaperclip } color={ DARK_BLUE } />
                            </label>*/}
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
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-12">
                        <Input 
                            placeholder = "Comentario"
                            as = "textarea"
                            rows = "3"
                            name = "comentario"
                            value = { form.comentario }
                            onChange = { onChange }                       
                            style={{paddingLeft:"10px"}}
                        />
                        {/*<span className="form-text text-muted">Por favor, ingrese su comentario</span>*/}
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