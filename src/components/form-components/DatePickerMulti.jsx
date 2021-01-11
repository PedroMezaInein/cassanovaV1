import React, { Component } from 'react'
import { Calendar } from "react-multi-date-picker";

class DatePickerMulti extends Component {

    render() {
        return (
            <Calendar
                multiple
                mapDays={({ date, today, selectedDate, currentMonth, weekDay, isSameDate }) => {
                    // ocultar fines de semana
                    let isWeekend = [0, 6].includes(date.weekDay.index)
                    if (isWeekend) return {
                        disabled: true,
                        style: { color: "#ccc" }
                    }

                    // estilos
                    let props = {}

                    props.style = {
                        // borderRadius: "13px",
                        // backgroundColor: date.month.index === currentMonth.index ? "#ccc" : ""
                    }

                    if (isSameDate(date, today)) props.style = {
                        ...props.style,
                        color: "#2171c1",
                        backgroundColor: "#E1F0FF",
                        fontWeight:500,
                        left:0,
                        right:0,
                        top:'5px',
                        bottom:'5px',
                        display:'flex',
                        alignItems:'center',
                        justifyContent:'center',
                        borderRadius: '27px'
                    }
                    if (isSameDate(weekDay)) props.style = {
                        ...props.style,
                        color: "red",
                        backgroundColor: "red",
                        fontWeight: "bold",
                        border: "1px solid #777"
                    }

                    return props
                }}
                // calendar="indian"
                local="es"
                weekDays={["DOM", "LU", "MAR", "MIÉ", "JUE", "VIE", "SÁB"]}
                months={["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"]}
                
            />
        )
    }
}

export default DatePickerMulti