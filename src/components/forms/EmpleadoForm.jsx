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
                    <div className="">
                        <CustomToggle eventKey="empleado" >
                            <Small color="gold">
                                Aquí puedes completar la información del empleado
                            </Small>
                        </CustomToggle>
                    </div>
                    
                    <Accordion.Collapse eventKey="empleado">
                        <div>
                            <Accordion defaultActiveKey="empleadoGeneral">
                                <CustomToggle eventKey="empleadoGeneral">
                                    <Small color="gold">
                                        Información general del empleado
                                    </Small>
                                </CustomToggle>
                                <Accordion.Collapse eventKey="empleadoGeneral">
                                    <div>
                                        <div className="mx-0 row mt-4">
                                            <div className="col-md-4 px-2">
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
                                            </div>
                                            <div className="col-md-4 px-2">
                                                <Select
                                                    name={'empresa'}
                                                    options={options}
                                                    onChange= { onChange }
                                                    placeholder={'Selecciona la empresa'}
                                                    value={form.empresa}
                                                    />
                                            </div>
                                            <div className="col-md-4 px-2">
                                                <Input 
                                                    onChange={ onChange } 
                                                    name="puesto" 
                                                    type="text" 
                                                    value={ form.puesto } 
                                                    placeholder="Puesto"/>
                                            </div>
                                        </div>
                                        <div className="row mt-2 mx-0">
                                            <div className="col-md-4 px-2">
                                                <Input 
                                                    onChange={ onChange }         
                                                    name="rfc" 
                                                    type="text" 
                                                    value={ form.rfc } 
                                                    placeholder="RFC"/>
                                            </div>
                                            <div className="col-md-4 px-2">
                                                <Input 
                                                    onChange={ onChange }         
                                                    name="nss" 
                                                    type="text" 
                                                    value={ form.nss } 
                                                    placeholder="NSS"/>
                                            </div>
                                            <div className="col-md-4 px-2">
                                                <Input 
                                                    onChange={ onChange }         
                                                    name="curp" 
                                                    type="text" 
                                                    value={ form.curp } 
                                                    placeholder="CURP"/>
                                            </div>
                                        </div>
                                        <div className="row mt-2 mb-3 mx-0">
                                            <div className="col-md-4 px-2">
                                                <Calendar 
                                                    onChangeCalendar={ onChangeCalendar }
                                                    placeholder="Fecha de inicio"
                                                    name="fecha_inicio"
                                                    value={form.fecha_inicio}
                                                    />
                                            </div>
                                            <div className="col-md-4 px-2">
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
                                            </div>
                                        </div>
                                        
                                    </div>
                                </Accordion.Collapse>
                                <CustomToggle eventKey="cuentaBancaria">
                                    <Small color="gold">
                                        Información bancaria
                                    </Small>
                                </CustomToggle>
                                <Accordion.Collapse eventKey="cuentaBancaria">
                                    <div className="row my-3 mx-0">
                                        <div className="col-md-4 px-2">
                                            <Input 
                                                onChange={ onChange } 
                                                name="banco" 
                                                type="text" 
                                                value={ form.banco } 
                                                placeholder="Banco"/>
                                        </div>
                                        <div className="col-md-4 px-2">
                                            <Input 
                                                onChange={ onChange } 
                                                name="cuenta" 
                                                type="text" 
                                                value={ form.cuenta } 
                                                placeholder="Cuenta"/>
                                        </div>
                                        <div className="col-md-4 px-2">
                                            <Input 
                                                onChange={ onChange } 
                                                name="clabe" 
                                                type="text" 
                                                value={ form.clabe } 
                                                placeholder="Clabe"/>
                                        </div>
                                    </div>
                                </Accordion.Collapse>
                                <CustomToggle eventKey="contactoEmergencia">
                                    <Small color="gold">
                                        Contacto emergencia
                                    </Small>
                                </CustomToggle>
                                <Accordion.Collapse eventKey="contactoEmergencia">
                                    <div className="row mx-0 my-3">
                                        <div className="col-md-6 px-2">
                                            <Input 
                                                onChange={ onChange } 
                                                name="nombre_emergencia" 
                                                type="text" 
                                                value={ form.nombre_emergencia } 
                                                placeholder="Nombre del contacto de emergencia"/>
                                        </div>
                                        <div className="col-md-6 px-2">
                                            <Input 
                                                onChange={ onChange } 
                                                
                                                name="telefono_emergencia" 
                                                type="text" 
                                                value={ form.telefono_emergencia } 
                                                placeholder="Teléfono del contacto de emergencia"/>
                                        </div>
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