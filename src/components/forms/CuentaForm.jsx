import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import Badge from 'react-bootstrap/Badge'
import { Subtitle } from '../texts'
import { Input, InputMoney, Select, Button } from '../form-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

class CuentaForm extends Component{

    constructor(props){
        super(props) 
        this.state = { validated: false };  
    }
    
    handleKeyPress(event) {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
        //event.preventDefault();
        //event.stopPropagation();
        }
        this.setState({ validated: true });
    }
    
    render(){
        const { validated } = this.state;
        const { bancos, estatus, tipos, title, form, onChange, onChangeEmpresa, updateEmpresa, empresas, ...props } = this.props
        return(
            <Form { ... props}
                noValidate
                validated={validated}
                onKeyPress={e => this.handleKeyPress(e)}
            >
                <div className="form-group row form-group-marginless pt-4">
                    <div className="col-md-8">
                        <Input 
                            required
                            placeholder = "Ingrese el nombre de la cuenta" 
                            type = "text"
                            name = "nombre" 
                            value = { form.nombre } 
                            onChange = { onChange }
                            iconclass={"far fa-credit-card"}
                            messageinc="Incorrecto. Ingresa el nombre de la cuenta."
                        />
                        {/*<span className="form-text text-muted">Por favor, ingrese el nombre de cuenta. </span>*/}
                    </div>
                    <div className="col-md-4">
                        <Select 
                            required 
                            name = 'banco' 
                            options = { bancos } 
                            placeholder = 'Selecciona el banco' 
                            value = { form.banco }
                            onChange = { onChange }
                            iconclass={" fab fa-cc-discover"}
                            messageinc="Incorrecto. Selecciona el banco."
                        />
                        {/*<span className="form-text text-muted">Por favor, seleccione el banco </span>*/}
                    </div>
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-4">
                        <Input 
                            required 
                            placeholder = "Ingresa el número de cuenta" 
                            type = "text" 
                            name = "numero" 
                            value = { form.numero }
                            onChange = { onChange }
                            iconclass={" fas fa-id-card "} 
                            pattern="[0-9]{1,18}"
                            messageinc="Incorrecto. Ingresa el número de cuenta."
                        />
                        {/*<span className="form-text text-muted">Por favor, ingrese el número de cuenta </span>*/}
                    </div>
                    <div className="col-md-4">
                        <Select 
                            required 
                            name = 'tipo' 
                            options = { tipos } 
                            placeholder = 'Selecciona el tipo' 
                            value = { form.tipo }
                            onChange = { onChange } 
                            iconclass={" far fa-address-card"}
                            messageinc="Incorrecto. Selecciona el tipo de cuenta."
                        />
                        {/*<span className="form-text text-muted">Por favor, ingrese el tipo de cuenta</span>*/}
                    </div>
                    <div className="col-md-4">
                        <Select 
                            required 
                            name = 'estatus' 
                            options = { estatus } 
                            placeholder = 'Selecciona el estatus' 
                            value = { form.estatus }
                            onChange = { onChange } 
                            iconclass={" far fa-check-square "}
                            messageinc="Incorrecto. Selecciona el estatus."
                        />
                        {/*<span className="form-text text-muted">Por favor, seleccione el estatus</span>*/}
                    </div>
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-4">
                        <Select 
                            required 
                            name = 'empresa' 
                            options = { empresas } 
                            placeholder = 'Selecciona la(s) empresa(s)' 
                            value = { form.empresa }
                            onChange = { onChangeEmpresa } 
                            iconclass={"far fa-building"} 
                            messageinc="Incorrecto. Selecciona la(s) empresas."
                        />
                        {/*<span className="form-text text-muted">Por favor, seleccione la(s) empresa(s)</span>*/}
                    </div>
                    <div className="col-md-8">
                        {
                            form.empresas.length > 0 ?
                                <div className="col-md-12 d-flex align-items-center image-upload">
                                    {
                                        form.empresas.map((empresa, key)=>{
                                            return(
                                                <Badge variant = "light" key = { key } className="d-flex px-3 align-items-center" pill>
                                                    <FontAwesomeIcon
                                                        icon = { faTimes }
                                                        onClick = { (e) => { e.preventDefault(); updateEmpresa(empresa) }}
                                                        className = "small-button mr-2" />
                                                        {
                                                            empresa.text
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
                <div className="separator separator-dashed mt-1 mb-2"></div>
                    <div className="form-group row form-group-marginless">
                    <div className="col-md-12">
                        <Input 
                            rows = "3" 
                            as = "textarea" 
                            placeholder = "Descripción" 
                            name = "descripcion" 
                            value = { form.descripcion }
                            onChange = { onChange } 
                            style={{paddingLeft:"10px"}}
                            messageinc="Incorrecto. Ingresa la descripción."
                        />
                        {/*<span className="form-text text-muted">Por favor, ingrese su descripción. </span>*/}
                    </div>
                </div>
                <div className="mt-3 text-center">
                    <Button icon='' className="mx-auto" type="submit" text="Enviar" />
                </div>
            </Form>
        )
    }
}

export default CuentaForm