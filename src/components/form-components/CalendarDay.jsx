import React, { Component } from 'react'
import { Calendar } from 'react-date-range'
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import es from "date-fns/locale/es";
export default class CalendarDay extends Component {

    state = {
        date: new Date(),
        calendarValido: true
    }
    validarFecha(e) { 
        const { requirevalidation } = this.props
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
        }
    }

    componentDidMount(){
        const { date } = this.props
        this.setState({
            ...this.state,
            date: date
        })
    }

    updateDate = item => {
        const { onChange, name } = this.props
        this.setState({
            ...this.state,
            date: item
        })
        onChange({ target: { name: name, value: item } })
    }
    render() {
        const { date, calendarValido } = this.state
        return (
            <>
                <div className="form-group">
                    <Calendar
                        onChange={ (item) => { this.validarFecha(item); this.updateDate(item)} }
                        locale = { es }
                        date = { date }
                    />
                    <span className={ calendarValido ? "form-text text-danger hidden" : "form-text text-danger is-invalid" }>Incorrecto. Selecciona la fecha.</span>
                </div>
            </>
        )
    }
}
