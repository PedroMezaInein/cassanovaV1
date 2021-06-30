import React, { Component } from 'react'
import getDay from 'date-fns/getDay';
import DatePicker, { registerLocale } from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import es from "date-fns/locale/es";
import Form from 'react-bootstrap/Form'

registerLocale("es", es);

class CalendarDayGray extends Component{

    state = { calendarValido: true }

    validarFecha(e) {    
        const { requirevalidation } = this.props 
        if (requirevalidation) {    
            if(e instanceof Date){ this.setState({ calendarValido: true }) }
            else{ this.setState({ calendarValido: false }) } 
        }
    }
    
    isWeekday = date => {
        let day = getDay(date);
        return day !== 0 && day !== 6;
    }

    render(){
        const { placeholder, onChangeCalendar, name, value, messageinc, iconclass, customdiv,withicon, ...props } = this.props
        const { minDate, endDate, selectsEnd, startDate, selectsStart, onChangeCalendar: onChangeCalendarProps, withPlaceholder, ...props2} = this.props
        const { calendarValido } = this.state
        return(
            <div className={`form-group ${customdiv}`}>
                <label className="col-form-label text-dark-50 font-weight-bold">{placeholder}</label>
                <div className="input-group input-group-solid rounded-0">
                <DatePicker
                    { ...props }
                    dateFormat="dd/MM/yyyy"
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
                            className = { calendarValido ? " form-control is-valid text-uppercase sin_icono text-dark-50" : " form-control is-invalid text-uppercase sin_icono text-dark-50" }
                            {...props2}  />
                    }
                /> 
                </div>
                <span className={ calendarValido ? "form-text text-danger hidden" : "form-text text-danger" }>Incorrecto. Selecciona la fecha.</span>                  
            </div> 
        )
    }
}

export default CalendarDayGray