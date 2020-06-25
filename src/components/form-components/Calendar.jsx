import React, { Component } from 'react'
import Input from './Input'

import getDay from 'date-fns/getDay';
import DatePicker, { registerLocale } from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import es from "date-fns/locale/es";
import Form from 'react-bootstrap/Form'

registerLocale("es", es);

class Calendar extends Component{

    state = {
        calendarValido: true
    }
    validarFecha(e)
    {         
            if(e instanceof Date){
                this.setState({
                    calendarValido: true
                })
            }else{
                this.setState({
                    calendarValido: false     
                    
                })
            } 
    }
    
    isWeekday = date => {
        let day = getDay(date);
        return day !== 0 && day !== 6;
    }

    render(){
        const { placeholder, onChangeCalendar, name, value, messageinc, iconclass, ...props } = this.props
        const { calendarValido } = this.state
        return(
            <div>  
                <label className="col-form-label">{placeholder}</label> 
                    <DatePicker
                        { ...props }
                        placeholderText="Selecciona la fecha"
                        selected={value}
                        onChange={(date) => {this.validarFecha(date); onChangeCalendar(date);}}
                        locale={'es'} 
                        dateFormat="dd/MM/yyyy" 
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        placeholderText={placeholder} 
                        customInput={
                        
                        <Form.Control    
                            className = { calendarValido ? " form-control is-valid " : " form-control is-invalid" }
                            {...this.props} 
                        />  
                        }
                    /> 
                    <span className={ calendarValido ? "form-text text-danger hidden" : "form-text text-danger" }>Incorrecto. Selecciona la fecha.</span>                  
            </div> 
        )
    }
}

export default Calendar