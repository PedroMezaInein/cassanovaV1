import React, { Component } from 'react'
import { Calendar } from 'react-date-range'
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import es from "date-fns/locale/es";
export default class CalendarDay extends Component {

    /* state = {
        date: new Date(),
        currentDate:new Date()
    }

    componentDidMount(){
        const { date } = this.props
        let newDate = new Date(date)
        let aux = Date.parse(newDate)
        this.setState({
            ...this.state,
            currentDate: newDate,
            date: isNaN(aux) ? null : newDate
        })
    }

    componentDidUpdate(nextProps){
        if (nextProps.date !== this.props.date){
            const { date } = this.props
            this.setState({
                ...this.state,
                date: new Date(date),
                currentDate: new Date(date)
            })
        }
    } */

    updateDate = item => {
        const { onChange, name } = this.props 
        /* this.setState({ ...this.state, date: item, currentDate : item }) */
        onChange({ target: { name: name, value: item } })
    }

    render() {
        const { date, withformgroup, disabledWeekends, className, requirevalidation, onChange, ...props } = this.props
        /* let { currentDate } = this.state */
        return (
            <>
                <div className = { withformgroup ? 'form-group' : '' } >
                    <Calendar className = { className } onChange={ (item) => {  this.updateDate(item)} } locale = { es } 
                        date = { date && date !== '' ? date : null } color = "#2171c1"
                        disabledDay = {
                            (date) => {
                                if(disabledWeekends){
                                    let newDate = new Date(date);
                                    newDate = newDate.getDay()
                                    if(newDate === 0 || newDate === 6)
                                        return true
                                    return false
                                } return false
                            }
                        } { ...props} />
                    {
                        requirevalidation ? <span className={ date ? "form-text text-danger hidden" : "form-text text-danger is-invalid" }>Incorrecto. Selecciona la fecha.</span> : ''
                    }
                </div>
            </>
        )
    }
}
