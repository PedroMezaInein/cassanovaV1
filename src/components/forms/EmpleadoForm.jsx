import React, { Component } from 'react'
import { Input, Button, RadioGroup, Select, Calendar } from '../form-components'
import Accordion from 'react-bootstrap/Accordion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'
import { Small } from '../texts'
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';


function CustomToggle({ children, eventKey }) {

    let variable = false
    
    const handleClick = useAccordionToggle(eventKey, (e) => {
        if(variable){
            variable = false
        }else{
            variable = true
        }
        console.log(e.target, 'e')
    },);

    
    return (
        <div className="d-flex justify-content-between">
            <div>
                {children}
            </div>
            <Button name={eventKey} className="small-button " color="transparent" icon={faPlus} text='' onClick={handleClick} />
        </div>
    );
}
class RegisterUserForm extends Component{

    constructor(props){
        super(props)
    }

    render(){
        const { children, options, form, onChange, title, onChangeCalendar } = this.props
        
        return(
            <>
                <Accordion>
                    <div className="d-flex justify-content-end">
                        {/* <Accordion.Toggle as={Button} color="transparent" icon={faPlus} variant="link" eventKey="empleado">
                            <FontAwesomeIcon icon={faPlus}/>
                        </Accordion.Toggle> */}
                        <CustomToggle eventKey="empleado" />
                    </div>
                    
                    <Accordion.Collapse eventKey="empleado">
                        <div>
                            <Accordion defaultActiveKey="empleadoGeneral">
                                <CustomToggle eventKey="empleadoGeneral">
                                    <Small>
                                        Información general del empleado
                                    </Small>
                                </CustomToggle>
                                <Accordion.Collapse eventKey="empleadoGeneral">
                                    <div>
                                    <RadioGroup
                                        name={'tipo_empleado'}
                                        onChange={onChange}
                                        options={
                                            [
                                                {
                                                    label: 'Administrativo',
                                                    value: 'Administrativo'
                                                },
                                                {
                                                    label: 'Obra',
                                                    value: 'Obra'
                                                }
                                            ]
                                        }
                                        placeholder={'Selecciona el tipo de empleado'}
                                        value={form.tipo_empleado}
                                        />
                                    <Select
                                        name={'empresa'}
                                        options={options}
                                        onChange= { onChange }
                                        placeholder={'Selecciona la empresa'}
                                        value={form.empresa}
                                        />
                                    <Input 
                                        onChange={ onChange } 
                                         
                                        name="puesto" 
                                        type="text" 
                                        value={ form.puesto } 
                                        placeholder="Puesto"/>
                                    <Calendar 
                                        onChangeCalendar={ onChangeCalendar }
                                        placeholder="Fecha de inicio"
                                        name="fecha_inicio"
                                        value={form.fecha_inicio}
                                        />
                                    <RadioGroup
                                        name={'estatus'}
                                        onChange={onChange}
                                        options={
                                            [
                                                {
                                                    label: 'Activo',
                                                    value: 'Activo'
                                                },
                                                {
                                                    label: 'Inactivo',
                                                    value: 'Inactivo'
                                                }
                                            ]
                                        }
                                        value={form.estatus}
                                        placeholder={'Selecciona el estatus de empleado'}
                                        />
                                    <Input 
                                        onChange={ onChange } 
                                         
                                        name="rfc" 
                                        type="text" 
                                        value={ form.rfc } 
                                        placeholder="RFC"/>
                                    <Input 
                                        onChange={ onChange } 
                                         
                                        name="nss" 
                                        type="text" 
                                        value={ form.nss } 
                                        placeholder="NSS"/>
                                    <Input 
                                        onChange={ onChange } 
                                        
                                        name="curp" 
                                        type="text" 
                                        value={ form.curp } 
                                        placeholder="CURP"/>
                                    </div>
                                </Accordion.Collapse>
                                <CustomToggle eventKey="cuentaBancaria">
                                    <Small>
                                        Información bancaria
                                    </Small>
                                </CustomToggle>
                                <Accordion.Collapse eventKey="cuentaBancaria">
                                    <div>
                                        <Input 
                                            onChange={ onChange } 
                                            
                                            name="banco" 
                                            type="text" 
                                            value={ form.banco } 
                                            placeholder="Banco"/>
                                        <Input 
                                            onChange={ onChange } 
                                            
                                            name="cuenta" 
                                            type="text" 
                                            value={ form.cuenta } 
                                            placeholder="Cuenta"/>
                                        <Input 
                                            onChange={ onChange } 
                                            
                                            name="clabe" 
                                            type="text" 
                                            value={ form.clabe } 
                                            placeholder="clabe"/>
                                    </div>
                                </Accordion.Collapse>
                                <CustomToggle eventKey="contactoEmergencia">
                                    <Small>
                                        Contacto emergencia
                                    </Small>
                                </CustomToggle>
                                <Accordion.Collapse eventKey="contactoEmergencia">
                                    <div>
                                        <Input 
                                            onChange={ onChange } 
                                            
                                            name="nombre_emergencia" 
                                            type="text" 
                                            value={ form.nombre_emergencia } 
                                            placeholder="Nombre"/>
                                        <Input 
                                            onChange={ onChange } 
                                            
                                            name="telefono_emergencia" 
                                            type="text" 
                                            value={ form.telefono_emergencia } 
                                            placeholder="Teléfono"/>
                                    </div>
                                </Accordion.Collapse>
                            </Accordion>
                            
                        </div>
                    </Accordion.Collapse>
                    
                </Accordion>
            </>
        )
    }
}

export default RegisterUserForm