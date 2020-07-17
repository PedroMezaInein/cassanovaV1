import React, { Component } from 'react'
import { Input, Button, RadioGroup, Select, Calendar, InputNumber, InputPhone, SelectSearchTrue} from '../form-components'
import Accordion from 'react-bootstrap/Accordion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons'
import { Small } from '../texts'
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';
import { RFC, DATE, NSS, CURP,TEL} from '../../constants'
import Badge from 'react-bootstrap/Badge'
import {Nav, Tab, Row, Col}from 'react-bootstrap'


function CustomToggle({ children, eventKey }) {

    let variable = false
    
    const handleClick = useAccordionToggle(eventKey, (e) => {
        if(variable){
            variable = false
        }else{
            variable = true
        }
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
class EmpleadoForm extends Component{

    constructor(props){
        super(props)
    }

    updateDepartamento = value => {
        const { onChange, onChangeOptions, options, form } = this.props
        options.departamentos.map((departamento)=> {
            if(departamento.value === value){
                let aux = false;
                form.departamentos.map((departamento) => {
                    if(departamento.value === value)
                        aux = true
                }) 
                if(!aux)
                    onChangeOptions({ target: { value: departamento.value, name: 'departamento' } }, 'departamentos')
            }
                
        })
        onChange({ target: { value: value, name: 'departamento' } })
    }

    render(){
        const { children, options, form, onChange, title, onChangeCalendar, deleteOption, formEditado } = this.props
        
        return(
            <>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-4">
                        <SelectSearchTrue
                            options = { options.departamentos } 
                            placeholder = "Selecciona el(los) departamento(s)" 
                            name="departamento"  
                            value = { form.departamento } 
                            onChange = { this.updateDepartamento } 
                            iconclass={"fas fa-layer-group"}
                            
                            />
                    </div>
                    <div className="col-md-8">
                        {                                            
                            form.departamentos.length > 0 ?
                                <div className="col-md-12 row mx-0 align-items-center image-upload">
                                    {
                                        form.departamentos.map((departamento, key)=>{
                                            return(
                                                <div key = { key } className="tagify form-control p-1 col-md-3 px-2 d-flex justify-content-center align-items-center" tabIndex="-1" style={{borderWidth:"0px"}}>
                                                    <div className="tagify__tag tagify__tag--primary tagify--noAnim">
                                                        <div 
                                                            title="Borrar archivo" 
                                                            className="tagify__tag__removeBtn" 
                                                            role="button" 
                                                            aria-label="remove tag" 
                                                            onClick = { (e) => { e.preventDefault(); deleteOption(departamento, 'departamentos', 'empleado')  }}
                                                            >
                                                        </div>                                                            
                                                        <div><span className="tagify__tag-text p-1 white-space">{departamento.name}</span></div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div> 
                            : ''
                        }
                    </div>
                </div>
                
                    
                    <Tab.Container id="left-tabs-example" defaultActiveKey="empleadoGeneral" eventKey="empleado">
                                    <Nav variant="pills" className="nav nav-tabs justify-content-end">
                                        <Nav.Item >
                                            <Nav.Link eventKey="empleadoGeneral">
                                                <span className="nav-icon">
                                                    <i className="far fa-user"></i>
												</span>
                                                <span className="nav-text">INFORMACIÓN GENERAL DEL EMPLEADO</span>
                                            </Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item >
                                            <Nav.Link eventKey="cuentaBancaria">
                                                <span className="nav-icon">
                                                    <i className="fas fa-money-check"></i>
												</span>
                                                <span className="nav-text">INFORMACIÓN BANCARIA</span>
                                            </Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item >
                                            <Nav.Link eventKey="contactoEmergencia">
                                                <span className="nav-icon">
                                                    <i className="fas fa-mobile-alt"></i>
												</span>
                                                <span className="nav-text">CONTACTO EMERGENCIA</span>
                                            </Nav.Link>
                                        </Nav.Item>
                                    </Nav> 
                                    <Tab.Content>
                                        <Tab.Pane eventKey="empleadoGeneral" className="pt-5"> 
                                        <div>
                                            <div className="form-group row form-group-marginless">
                                                <div className="col-md-4">
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
                                                <div className="col-md-4">
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
                                                <div className="col-md-4">
                                                    <Select
                                                        name={'empresa'}
                                                        options={options.empresas}
                                                        onChange= { onChange }
                                                        placeholder={'Selecciona la empresa'}
                                                        value={form.empresa}
                                                        iconclass={"far fa-building"}
                                                    />
                                                </div>
                                            </div>
                                            <div className="separator separator-dashed mt-1 mb-2"></div>
                                            <div className="form-group row form-group-marginless">
                                                <div className="col-md-4">
                                                    <Input 
                                                        onChange={ onChange }         
                                                        name="rfc" 
                                                        type="text" 
                                                        value={ form.rfc } 
                                                        placeholder="RFC"
                                                        iconclass={"far fa-file-alt"}
                                                        patterns={RFC}
                                                        messageinc="Incorrecto. Ej. ABCD001122ABC"
                                                        maxLength="13"
                                                    />
                                                </div>
                                                <div className="col-md-4">
                                                    <InputNumber 
                                                        onChange={ onChange }         
                                                        name="nss" 
                                                        type="text" 
                                                        value={ form.nss } 
                                                        placeholder="NSS"
                                                        iconclass={"fas fa-hospital-user"}
                                                        patterns={NSS}
                                                        messageinc="Incorrecto. Ej. 01234567891"
                                                        //maxLength="11"
                                                    />
                                                </div>
                                                <div className="col-md-4">
                                                    <Input 
                                                        onChange={ onChange }         
                                                        name="curp" 
                                                        type="text" 
                                                        value={ form.curp } 
                                                        placeholder="CURP"
                                                        iconclass={"far fa-address-card"}
                                                        patterns={CURP}
                                                        messageinc="Incorrecto. Ej. ABCD123456EFGHIJ78"
                                                        maxLength="18"
                                                    />
                                                    <pre id="resultado"></pre>
                                                </div>
                                            </div>
                                            <div className="separator separator-dashed mt-1 mb-2"></div>
                                            <div className="form-group row form-group-marginless">
                                                <div className="col-md-4">
                                                    <Input 
                                                        onChange={ onChange } 
                                                        name="puesto" 
                                                        type="text" 
                                                        value={ form.puesto } 
                                                        placeholder="Puesto"
                                                        iconclass={"fas fa-user-tie"}
                                                        messageinc="Incorrecto. Ingresa el puesto."
                                                    />
                                                </div>
                                                <div className="col-md-4">
                                                    <Calendar 
                                                        onChangeCalendar={ onChangeCalendar }
                                                        placeholder="Fecha de inicio"
                                                        name="fecha_inicio"
                                                        value={form.fecha_inicio}
                                                        patterns={DATE}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        </Tab.Pane>
                                        
                                        <Tab.Pane eventKey="cuentaBancaria" className="pt-5"> 
                                        <div className="form-group row form-group-marginless">
                                            <div className="col-md-4">
                                                <Input 
                                                    onChange={ onChange } 
                                                    name="banco" 
                                                    type="text" 
                                                    value={ form.banco } 
                                                    placeholder="Banco"
                                                    iconclass={" fab fa-cc-discover "}
                                                    messageinc="Incorrecto. Ingresa el banco."
                                                />
                                            </div>
                                            <div className="col-md-4">
                                                <InputNumber 
                                                    onChange={ onChange } 
                                                    name="cuenta" 
                                                    type="text" 
                                                    value={ form.cuenta } 
                                                    placeholder="Cuenta"
                                                    iconclass={" fas fa-id-card "} 
                                                    messageinc="Incorrecto. Ingresa el número de cuenta."
                                                />
                                            </div>
                                            <div className="col-md-4">
                                                <InputNumber 
                                                    onChange={ onChange } 
                                                    name="clabe" 
                                                    type="text" 
                                                    value={ form.clabe } 
                                                    placeholder="Clabe"
                                                    iconclass={"fas fa-money-check-alt"}
                                                    messageinc="Incorrecto. Ingresa la clabe."
                                                    maxLength="18"
                                                />
                                            </div>
                                        </div>
                                        </Tab.Pane>
                                        
                                        <Tab.Pane eventKey="contactoEmergencia" className="pt-5"> 
                                        <div className="form-group row form-group-marginless">
                                            <div className="col-md-4">
                                                <Input 
                                                    onChange={ onChange } 
                                                    name="nombre_emergencia" 
                                                    type="text" 
                                                    value={ form.nombre_emergencia } 
                                                    placeholder="Nombre del contacto de emergencia"
                                                    iconclass={"fas fa-user-circle"}
                                                    messageinc="Incorrecto. Ingresa el nombre del contacto de emergencia."
                                                />
                                            </div>
                                            <div className="col-md-4">
                                                <InputPhone 
                                                        requirevalidation={1}
                                                        /* formeditado={formeditado} */
                                                        placeholder="Teléfono" 
                                                        name="telefono_emergencia"
                                                        value={form.telefono_emergencia} 
                                                        onChange={onChange} 
                                                        iconclass={"fas fa-mobile-alt"}
                                                        patterns={TEL}
                                                        messageinc="Incorrecto. Ingresa el número de teléfono."
                                                        thousandSeparator={false}
                                                        prefix = { '' }                                            
                                                    />
                                            </div>
                                        </div>
                                        </Tab.Pane>
                                    </Tab.Content> 
                                </Tab.Container>
            </>
        )
    }
}

export default EmpleadoForm