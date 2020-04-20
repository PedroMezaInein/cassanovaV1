import React, { Component } from 'react'
import Input from './Input'

import getDay from 'date-fns/getDay';
import DatePicker, { registerLocale } from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import es from "date-fns/locale/es";
registerLocale("es", es);


class Calendar extends Component{
    
    isWeekday = date => {
        let day = getDay(date);
        return day !== 0 && day !== 6;
    }

    render(){
        const { placeholder, onChangeCalendar, name, value, ...props } = this.props
        return(
            <>
                <DatePicker
                    { ...props }
                    selected={value}
                    onChange={date => onChangeCalendar(date)}
                    locale={'es'}
                    isClearable
                    /* filterDate={this.isWeekday} */
                    placeholderText={placeholder}
                    customInput={
                        <Input
                            value={value}
                            placeholder={placeholder}
                            name={name} 
                            type="text"
                            onChange= { onChangeCalendar }
                            />
                    }
                    />
            </>
            
        )
    }
}

export default Calendar