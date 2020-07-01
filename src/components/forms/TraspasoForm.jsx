import React, { Component } from 'react'
import { Subtitle } from '../texts'
import { InputMoney, SelectSearch, Input, Button, Calendar } from '../form-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperclip, faTimes } from '@fortawesome/free-solid-svg-icons'
import { DARK_BLUE } from '../../constants'
import { Badge, Form } from 'react-bootstrap'
import { DATE } from '../../constants'
import { validateAlert } from '../../functions/alert'

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

        const { title, cuentas, form, onChange, onChangeAdjunto, deleteAdjunto, requirevalidation, onSubmit, formeditado, ... props } = this.props
        return(
            <Form id="form-transpasos"
                onSubmit = { 
                    (e) => {
                        e.preventDefault(); 
                        validateAlert(onSubmit, e, 'form-transpasos')
                    }
                }
                {...props}
                >                
                <div className="form-group row form-group-marginless pt-4">
                    <div className="col-md-6">
                        <SelectSearch 
                            formeditado={formeditado}
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
                            formeditado={formeditado}
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
                            requirevalidation={1}
                            formeditado={formeditado}
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
                            formeditado={formeditado}
                            onChangeCalendar = { this.changeDate }
                            name = "fecha" value = { form.fecha }
                            placeholder="Fecha de traspaso"
                            patterns={DATE}
                        />
                        {/*<span className="form-text text-muted">Por favor, seleccione la fecha del transpaso </span>*/}
                    </div>
                    <div className="col-md-4">
                        <div className="image-upload d-flex align-items-center">
                            <div className="no-label pt-5">
                                <input 
                                    requirevalidation={0}
                                    formeditado={formeditado}
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
                        </div>
                            {
                                form.adjuntoName &&
                                <div className="">
                                    <div className="tagify form-control p-1 mt-1" tabIndex="-1" style={{borderWidth:"0px"}}>
                                            <div className="tagify__tag tagify__tag--primary tagify--noAnim">
                                                <div 
                                                    title="Borrar archivo" 
                                                    className="tagify__tag__removeBtn" 
                                                    role="button" 
                                                    aria-label="remove tag" 
                                                    onClick={ (e) => { e.preventDefault(); deleteAdjunto() } }
                                                    >
                                                </div>                                                            
                                                    <div><span className="tagify__tag-text p-1">{form.adjuntoName}</span></div>
                                            </div>
                                    </div>
                                </div> 
                            }
                        
                    </div>                    
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-12">
                        <Input 
                            requirevalidation={0}
                            formeditado={formeditado}
                            placeholder = "Comentario"
                            as = "textarea"
                            rows = "3"
                            name = "comentario"
                            value = { form.comentario }
                            onChange = { onChange }                       
                            messageinc="Incorrecto. Ingresa el comentario."
                            style={{paddingLeft: "10px"}}    
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