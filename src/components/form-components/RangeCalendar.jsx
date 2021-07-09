import React, { Component } from 'react';
import { DateRange  } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
// import { addDays } from 'date-fns';
import es from "date-fns/locale/es";
import moment from 'moment'

class RangeCalendar extends Component {

    updateRange = item => {
        const { onChange } = this.props
        onChange(item.selection)
    }

    getThisWeek = () => {
        var startOfWeek = moment().startOf('week').add(1, 'days').toDate();
        var endOfWeek   = moment().endOf('week').add(1, 'days').toDate();
        return {
            startDate: startOfWeek,
            endDate: endOfWeek
        }
    }

    getThisMonth = () => {
        var startOfWeek = moment().startOf('month').toDate();
        var endOfWeek   = moment().endOf('month').toDate();
        return {
            startDate: startOfWeek,
            endDate: endOfWeek
        }
    }

    getLastMonth = () => {
        var start = moment().startOf('month').add(-1, 'months').toDate();
        var end   = moment().startOf('month').add(-1, 'days').toDate();
        return {
            startDate: start,
            endDate: end
        }
    }

    getThisYear = () => {
        var start = moment().startOf('year').toDate();
        var end   = moment().endOf('year').toDate();
        return {
            startDate: start,
            endDate: end
        }
    }

    getLastYear = () => {
        var start = moment().startOf('year').add(-1, 'years').toDate();
        var end   = moment().startOf('year').add(-1, 'days').toDate();
        return {
            startDate: start,
            endDate: end
        }
    }

    render() {
        const { start, end } = this.props
        const { disabledDates } = this.props
        const rangeHoy = { startDate: new Date(), endDate: new Date() }
        const rangeEstaSema = this.getThisWeek()
        const rangeEsteMes = this.getThisMonth()
        const rangeMesAnterior = this.getLastMonth()
        const rangeEsteAño = this.getThisYear()
        const rangeAñoPasado = this.getLastYear()
        
        return (
            <DateRange 
                locale = { es }
                showSelectionPreview = { true }
                rangeColors = {["#357ec7"]}
                direction = "horizontal"
                disabledDates = { disabledDates }
                ranges = { [
                    {
                        startDate: start,
                        endDate: end,
                        autoFocus: true,
                        key: 'selection'
                    }
                ] }
                onChange={ (item) => { this.updateRange(item)} }
                initialFocusedRange = { [0,0] }
                showPreview = { true }
                editableDateInputs = { false }
                dateDisplayFormat = 'dd-MMM-yyyy'
                weekStartsOn	 = { 1 }
                startDatePlaceholder = "Fecha de inicio"
                endDatePlaceholder = "Fecha Final"
                staticRanges = {
                    [
                        {
                            label: 'Hoy', range: () => (rangeHoy),
                            isSelected (){ 
                                if(moment(start).startOf('day').toString() === moment(rangeHoy.startDate).startOf('day').toString()
                                    && moment(end).startOf('day').toString()  === moment(rangeHoy.endDate).startOf('day').toString() )
                                    return true
                                return false
                            }
                        },
                        {
                            label: 'Esta semana', range: () => ( rangeEstaSema ),
                            isSelected() {
                                if(moment(start).startOf('day').toString() === moment(rangeEstaSema.startDate).startOf('day').toString() 
                                    && moment(end).startOf('day').toString()  === moment(rangeEstaSema.endDate).startOf('day').toString() )
                                    return true
                                return false
                            }
                        },
                        {
                            label: 'Este mes', range: () => ( rangeEsteMes ),
                            isSelected() {
                                if(moment(start).startOf('day').toString() === moment(rangeEsteMes.startDate).startOf('day').toString() 
                                    && moment(end).startOf('day').toString()  === moment(rangeEsteMes.endDate).startOf('day').toString() )
                                    return true
                                return false
                            }
                        },
                        {
                            label: 'Mes anterior', range: () => ( rangeMesAnterior ),
                            isSelected() {
                                if(moment(start).startOf('day').toString() === moment(rangeMesAnterior.startDate).startOf('day').toString() 
                                    && moment(end).startOf('day').toString()  === moment(rangeMesAnterior.endDate).startOf('day').toString() )
                                    return true
                                return false
                            }
                        },
                        {
                            label: 'Este año', range: () => ( rangeEsteAño ),
                            isSelected() {
                                if(moment(start).startOf('day').toString() === moment(rangeEsteAño.startDate).startOf('day').toString() 
                                    && moment(end).startOf('day').toString()  === moment(rangeEsteAño.endDate).startOf('day').toString() )
                                    return true
                                return false
                            }
                        },
                        {
                            label: 'Año pasado', range: () => ( rangeAñoPasado ),
                            isSelected() {
                                if(moment(start).startOf('day').toString() === moment(rangeAñoPasado.startDate).startOf('day').toString() 
                                    && moment(end).startOf('day').toString()  === moment(rangeAñoPasado.endDate).startOf('day').toString() )
                                    return true
                                return false
                            }
                        }
                    ]
                }
            />
        );
    }
}

export default RangeCalendar;