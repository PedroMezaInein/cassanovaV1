import React, { Component } from 'react'
import { Subtitle, P} from '../../texts'
import { SelectSearch, Select, Calendar, RadioGroup, FileInput, Button, Input, InputMoney } from '../../form-components'
import { Form, Accordion } from 'react-bootstrap'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import SliderImages from '../../singles/SliderImages'

class AvanceForm extends Component {

    state = {
        activeKey: ''
    }

    handleChangeDateInicio = date => {
        const { onChange, form }  = this.props
        if(form.fechaInicio > form.fechaFin){
            onChange( { target: { name: 'fechaFin', value: date } } )
        }
        onChange( { target: { name: 'fechaInicio', value: date } } )
    }

    handleChangeDateFin = date => {
        const { onChange }  = this.props
        onChange( { target: { name: 'fechaFin', value: date } } )
    }

    handleAccordion = eventKey => {
        const { proyecto: { avances: avances } } = this.props;
        const { activeKey } = this.state
        let aux = activeKey
        avances.find(function(element, index) {
            if(element.id === eventKey){
                aux = eventKey      
            }
        });
        this.setState({
            activeKey: aux
        })
    }

    render(){
        const { form, onChangeAdjuntoAvance, onChangeAvance, clearFilesAvances, addRowAvance, onChange, proyecto, sendMail, formeditado, ... props } = this.props    
        const { activeKey } = this.state
        return(
            <>
                <Form 

                    {...props}
                    >
                    <div className="form-group row form-group-marginless pt-4">
                        <div className="col-md-4">
                            <Input 
                                requirevalidation={1}
                                formeditado={formeditado}
                                name="semana" 
                                value={form.semana} 
                                onChange={onChange} 
                                type="text" 
                                placeholder="Número de semana" 
                                iconclass={"far fa-folder-open"}
                                messageinc="Incorrecto. Ingresa el número de semana."
                            />                            
                        </div>
                        <div className="col-md-4">
                            <Calendar 
                                formeditado={formeditado}
                                onChangeCalendar = { this.handleChangeDateInicio }
                                placeholder = "Fecha de inicio"
                                name = "fechaInicio"
                                value = { form.fechaInicio }
                                selectsStart
                                startDate={ form.fechaInicio }
                                endDate={ form.fechaFin }
                                iconclass={"far fa-calendar-alt"}                            
                            />
                        </div>
                        <div className="col-md-4">
                            <Calendar 
                                formeditado={formeditado}
                                onChangeCalendar = { this.handleChangeDateFin }
                                placeholder = "Fecha final"
                                name = "fechaFin"
                                value = { form.fechaFin }
                                selectsEnd
                                startDate={ form.fechaInicio }
                                endDate={ form.fechaFin }
                                minDate={ form.fechaInicio }
                                iconclass={"far fa-calendar-alt"}
                            />
                        </div>
                    </div>
                    <div className="separator separator-dashed mt-1 mb-2"></div>

                        {
                            form.avances.map( ( avance, key ) => {
                                return(
                                    <>   
                                        <div className="form-group row form-group-marginless" key = { key }>
                                            <div className = "col-md-4">
                                                <FileInput
                                                    requirevalidation={0}
                                                    formeditado={formeditado}
                                                    onChangeAdjunto={ e => onChangeAdjuntoAvance(e, key, 'adjuntos') }
                                                    placeholder={form['avances'][key]['adjuntos']['placeholder']}
                                                    value={form['avances'][key]['adjuntos']['value']}
                                                    name={`${key}-avance`} id={`${key}-avance`}
                                                    accept="image/*"
                                                    files={form['avances'][key]['adjuntos']['files']}
                                                    _key = { key }
                                                    deleteAdjuntoAvance = { clearFilesAvances } 
                                                    multiple 
                                                />
                                            </div>
                                            <div className = "col-md-6">
                                                <Input
                                                    requirevalidation={1}
                                                    formeditado={formeditado}
                                                    as = "textarea"
                                                    rows = "1"
                                                    placeholder = "Descripción" 
                                                    name = "descripcion" 
                                                    value = {form['avances'][key]['descripcion']} 
                                                    onChange = { e => onChangeAvance(key, e, 'descripcion')}
                                                    messageinc="Incorrecto. Ingresa la descripción."
                                                    style={{paddingLeft: "10px"}} 
                                                />
                                            </div>
                                            <div className = "col-md-2">
                                                <InputMoney 
                                                    requirevalidation={1}
                                                    formeditado={formeditado}
                                                    thousandSeparator={false}  
                                                    prefix = { '%' } 
                                                    name = "avance" 
                                                    value = { form.avance } 
                                                    onChange = { e => onChangeAvance(key, e, 'avance') } 
                                                    placeholder="% de avance" 
                                                    iconclass={"fas fa-percent"}/>
                                            </div>
                                        </div>
                                        <div className="separator separator-dashed mt-1 mb-2"></div>
                                    </>
                                )
                            })
                        }

                    <div className="d-flex justify-content-end my-2">
                        <Button icon = { faPlus }  tooltip = {{ id: 'add-avance', text: 'Nuevo' }} onClick = { addRowAvance } color = 'transparent' />
                    </div>        
                    <div className="d-flex justify-content-center mt-2 mb-4">
                        <Button text = 'Enviar' type = 'submit' />
                    </div>
                </Form>
                {
                    proyecto ?
                        proyecto.avances ?
                            proyecto.avances.length ?
                                <div className="my-2">
                                    <Accordion activeKey = { activeKey } >
                                        {
                                            proyecto.avances.map( (avance, key) => {
                                                return(
                                                    <>
                                                        <div className="mt-2" key={key}> 
                                                            <div className="d-flex justify-content-between">
                                                                <div className="d-flex align-items-center">
                                                                    <P className="mb-0 mx-2 " > 
                                                                        { avance.semana }    
                                                                    </P>
                                                                </div>
                                                                <Accordion.Toggle as={Button} eventKey={avance.id} className={"small-button "} 
                                                                    color="transparent" icon={faPlus} text='' onClick={() => this.handleAccordion(avance.id)} />
                                                            </div>            
                                                            <Accordion.Collapse eventKey={avance.id}>
                                                                <div>
                                                                    <div className="d-flex justify-content-center">
                                                                        <a  className = 'btn btn-hover btn-text-blue' href={avance.pdf} target="_blank">
                                                                            <i className="flaticon-file-2"></i> Descargar PDF
                                                                        </a>
                                                                        {
                                                                            proyecto ?
                                                                                proyecto.contactos.length ?
                                                                                    <span className = 'btn btn-hover btn-text-blue' onClick={(e) => { e.preventDefault(); sendMail(avance.id) }}>
                                                                                        <i className="fas fa-envelope-open"></i> Enviar por correo
                                                                                    </span>
                                                                                :
                                                                                    ''
                                                                            : ''
                                                                        }
                                                                        
                                                                    </div>
                                                                    <div>
                                                                        <SliderImages elements = {avance.adjuntos} />
                                                                    </div>
                                                                </div>
                                                            </Accordion.Collapse>
                                                        </div>
                                                        <hr />
                                                    </>
                                                )
                                            })
                                        }
                                    </Accordion>
                                </div>
                            :   ''
                        : ''
                    : ''
                }
            </>
        )
    }
}

export default AvanceForm