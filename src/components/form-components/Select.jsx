import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'

import '../../styles/select_custom.css';
 
class Select extends Component{
    /* constructor(props){
        super(props)
    } */ 

    state = {
        selectValido: false
    }

    validarSelect(datosSelect){
        console.log("entre")
        this.setState({
            selectValido:false            
        })
    }

    render(){
        const { options, placeholder, value, name, onChange, messageinc, ...props } = this.props
       // console.log()
        return(
            <>
                <Form.Label className="col-form-label">{ placeholder }</Form.Label>
                
                <Form.Control 
               // className={ selectValido? " form-control is-valid ": " form-control is-invalid " }
                onChange={ (e) => { e.preventDefault(); this.validarSelect(this); this.props.onChange(e) }} 
                name={ name } 
                value={ value } 
                as="select" {... props}>
                    <option value={0} disabled>
                        {placeholder}
                    </option>
                    {
                        options.map((option, key) => {
                            return(
                                <option key={key} value={option.value}>
                                    { option.text }
                                </option>
                            )
                        })
                    }
                </Form.Control>
                    <div className="valid-feedback msgValidation"> Valor correcto </div>
                    <div className="invalid-feedback msgValidation">{messageinc}</div>
                
            </>
        )
    }
}

/* CÓDIGO QUE VALIDA EL SIGUIENTE SELECT
import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'

import '../../styles/select_custom.css';

let selectValido =false;
class Select extends Component{
    

    validarSelect(datosSelect)
    {
        console.log(datosSelect)
        let value = datosSelect.props.value;
        console.log(value);
        if(value=="0")
        {
            console.log("Incorrecto")
            selectValido=false;
        }
        else
        {
            console.log("Correto")
            selectValido=true;
        }
    }
  
    render(){
        const { options, placeholder, value, name, onChange, messageinc, ...props } = this.props
        return(
            <>
                <Form.Label className="col-form-label">{ placeholder }</Form.Label>
                
                <Form.Control 
                className={ selectValido? " form-control is-valid ": " form-control is-invalid " }
                onChange={ this.validarSelect(this), onChange } 
                name={ name } 
                value={ value } 
                as="select" {... props}>
                    <option value={0} disabled>
                        {placeholder}
                    </option>
                    {
                        options.map((option, key) => {
                            return(
                                <option key={key} value={option.value}>
                                    { option.text }
                                </option>
                            )
                        })
                    }
                    <div className="valid-feedback msgValidation"> Valor correcto </div>
                    <div className="invalid-feedback msgValidation">{messageinc}</div>
                </Form.Control>
                
            </>
        )
    }
}

export default Select
*/

export default Select



