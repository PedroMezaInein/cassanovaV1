import React, { Component } from 'react'
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
    validarFecha(e) {    
        const { requirevalidation } = this.props 
        let validado = false;
        if (requirevalidation) {    
            if(e instanceof Date){
                this.setState({
                    calendarValido: true
                })
            }else{
                this.setState({
                    calendarValido: false     
                    
                })
            } 
        }else{
            validado = true
        }
    }
    
    isWeekday = date => {
        let day = getDay(date);
        return day !== 0 && day !== 6;
    }

    render(){
        const { placeholder, onChangeCalendar, name, value, messageinc, iconclass, ...props } = this.props
        const { onChangeCalendar: { onChangeCalendar2}, minDate, endDate, selectsEnd, startDate, selectsStart, ... props2} = this.props
        const { calendarValido } = this.state
        return(
            <div>  
                <label className="col-form-label">{placeholder}</label> 
                    <DatePicker
                        { ...props }
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Selecciona la fecha"
                        selected={value}
                        onChange={(date) => {this.validarFecha(date); onChangeCalendar(date);}}
                        locale={'es'} 
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        placeholderText={placeholder} 
                        popperPlacement="bottom"
                        popperModifiers={{
                            flip: {
                                behavior: ["bottom"]
                            },
                            preventOverflow: {
                                enabled: false
                            },
                            hide: {
                                enabled: false
                            }
                        }}
                        customInput={
                        
                        <Form.Control    
                            className = { calendarValido ? " form-control is-valid text-uppercase " : " form-control is-invalid text-uppercase" }
                            {...props2} 
                        />  
                        }
                    /> 
                    <span className={ calendarValido ? "form-text text-danger hidden" : "form-text text-danger" }>Incorrecto. Selecciona la fecha.</span>                  
            </div> 
        )
    }
}

export default Calendar