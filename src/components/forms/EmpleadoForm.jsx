import React, { Component } from 'react'
import { Input, Button, RadioGroup, Select, Calendar, InputNumber, InputPhone, SelectSearch} from '../form-components'
import Accordion from 'react-bootstrap/Accordion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons'
import { Small } from '../texts'
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';
import { RFC, DATE, NSS, CURP,TEL} from '../../constants'
import Badge from 'react-bootstrap/Badge'


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
                        <SelectSearch
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
                                <div className="col-md-12 d-flex align-items-center image-upload flex-wrap">
                                    {
                                        form.departamentos.map((departamento, key)=>{
                                            return(
                                                <Badge variant = "light" key = { key } className="d-flex px-4 align-items-center mb-3" pill>
                                                    <FontAwesomeIcon
                                                        icon = { faTimes }
                                                        onClick = { (e) => { e.preventDefault(); deleteOption(departamento, 'departamentos', 'empleado')  }}
                                                        className = "small-button mr-2" />
                                                        {
                                                            departamento.name
                                                        }
                                                </Badge>
                                            )
                                        })
                                    }
                                </div>
                            : ''
                        }
                    </div>
                </div>
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
                                </Accordion.Collapse>
                                <CustomToggle eventKey="cuentaBancaria">
                                    <Small color="gold">
                                        Información bancaria
                                    </Small>
                                </CustomToggle>
                                <Accordion.Collapse eventKey="cuentaBancaria">
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
                                </Accordion.Collapse>
                                <CustomToggle eventKey="contactoEmergencia">
                                    <Small color="gold">
                                        Contacto emergencia
                                    </Small>
                                </CustomToggle>
                                <Accordion.Collapse eventKey="contactoEmergencia">
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
                                        {/* <Input 
                                            onChange={ onChange } 
                                            name="telefono_emergencia" 
                                            type="text" 
                                            value={ form.telefono_emergencia } 
                                            placeholder="Teléfono del contacto de emergencia"
                                            iconclass={"fas fa-phone-square-alt"}
                                            messageinc="Incorrecto. Ingresa el teléfono de emergencia."
                                            pattern="^(\d{10})$"
                                            messageinc="Incorrecto. Ingresa el número de contacto."
                                            maxLength="10"
                                        /> */}
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
                                </Accordion.Collapse>
                            </Accordion>
                            
                        </div>
                    </Accordion.Collapse>
                    
                </Accordion>
            </>
        )
    }
}

export default EmpleadoForm