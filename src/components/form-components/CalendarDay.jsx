import React, { Component } from 'react'
import { Calendar } from 'react-date-range'
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import es from "date-fns/locale/es";
import parseISO from 'date-fns/parseISO'
export default class CalendarDay extends Component {

    state = {
        date: new Date()
    }

    componentDidMount(){
        const { date } = this.props
        
        let newDate = new Date(date)
        let aux = Date.parse(newDate)
        console.log(newDate, 'new', isNaN(aux) ? 'INVALID' : 'VALID')
        this.setState({
            ...this.state,
            date: isNaN(aux) ? null : newDate
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
        const { date } = this.props
        return (
            <>
                <div className="form-group">
                    <Calendar
                        onChange={ (item) => { this.updateDate(item)} }
                        locale = { es }
                        date = { date }
                    />
                    <span className={ date ? "form-text text-danger hidden" : "form-text text-danger is-invalid" }>Incorrecto. Selecciona la fecha.</span>
                </div>
            </>
        )
    }
}
