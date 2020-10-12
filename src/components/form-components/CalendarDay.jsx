import React, { Component } from 'react'
import { Calendar } from 'react-date-range'
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import es from "date-fns/locale/es";
export default class CalendarDay extends Component {

    state = {
        date: new Date()
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
        const { date } = this.state
        return (
            <Calendar
                onChange={ (item) => { this.updateDate(item)} }
                locale = { es }
                date = { date }
                />
        )
    }
}
