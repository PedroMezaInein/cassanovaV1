import React, { Component } from 'react';
import { DateRange  } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
// import { addDays } from 'date-fns';
import es from "date-fns/locale/es";
import moment from 'moment'

class RangeCalendar extends Component {

    state = {
        range:[{
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection',
            autoFocus: true
        }]
    }

    componentDidMount(){
        const { start, end } = this.props
        const { range } = this.state
        range[0] = {
            startDate: new Date(start),
            endDate: new Date(end),
            key: 'selection'
        }
        this.setState({
            ...this.state,
            range
        })
    }

    updateRange = item => {

        const { range } = this.state
        const { onChange } = this.props
        range[0] = item.selection
        this.setState({
            ...this.state,
            range
        })
        onChange(range[0])

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

        const { range } = this.state
        const { disabledDates } = this.props
        const rangeHoy = {
            startDate: new Date(),
            endDate: new Date()
        }
        const rangeEstaSema = this.getThisWeek()
        const rangeEsteMes = this.getThisMonth()
        const rangeMesAnterior = this.getLastMonth()
        const rangeEsteAño = this.getThisYear()
        const rangeAñoPasado = this.getLastYear()
        
        return (
            
            <DateRange 
                disabledDates = { disabledDates }
                onChange={ (item) => { this.updateRange(item)} }
                showSelectionPreview = { true }
                moveRangeOnFirstSelection = { true }
                editableDateInputs = { true }
                ranges = { range }
                rangeColors = {["#357ec7"]}
                direction = "horizontal"
                locale = { es }
                initialFocusedRange = { [0,0] }
                startDatePlaceholder = "Fecha de inicio"
                endDatePlaceholder="Fecha Final"
                staticRanges = {
                    [
                        {
                            label: 'Hoy',
                            range: () => (rangeHoy),
                            isSelected (){ 
                                if(moment(range[0].startDate).startOf('day').toString() === moment(rangeHoy.startDate).startOf('day').toString()
                                    && moment(range[0].endDate).startOf('day').toString()  === moment(rangeHoy.endDate).startOf('day').toString() )
                                    return true
                                return false
                            }
                        },
                        {
                            label: 'Esta semana',
                            range: () => ( rangeEstaSema ),
                            isSelected() {
                                if(moment(range[0].startDate).startOf('day').toString() === moment(rangeEstaSema.startDate).startOf('day').toString() 
                                    && moment(range[0].endDate).startOf('day').toString()  === moment(rangeEstaSema.endDate).startOf('day').toString() )
                                    return true
                                return false
                            }
                        },
                        {
                            label: 'Este mes',
                            range: () => ( rangeEsteMes ),
                            isSelected() {
                                if(moment(range[0].startDate).startOf('day').toString() === moment(rangeEsteMes.startDate).startOf('day').toString() 
                                    && moment(range[0].endDate).startOf('day').toString()  === moment(rangeEsteMes.endDate).startOf('day').toString() )
                                    return true
                                return false
                            }
                        },
                        {
                            label: 'Mes anterior',
                            range: () => ( rangeMesAnterior ),
                            isSelected() {
                                if(moment(range[0].startDate).startOf('day').toString() === moment(rangeMesAnterior.startDate).startOf('day').toString() 
                                    && moment(range[0].endDate).startOf('day').toString()  === moment(rangeMesAnterior.endDate).startOf('day').toString() )
                                    return true
                                return false
                            }
                        },
                        {
                            label: 'Este año',
                            range: () => ( rangeEsteAño ),
                            isSelected() {
                                if(moment(range[0].startDate).startOf('day').toString() === moment(rangeEsteAño.startDate).startOf('day').toString() 
                                    && moment(range[0].endDate).startOf('day').toString()  === moment(rangeEsteAño.endDate).startOf('day').toString() )
                                    return true
                                return false
                            }
                        },
                        {
                            label: 'Año pasado',
                            range: () => ( rangeAñoPasado ),
                            isSelected() {
                                if(moment(range[0].startDate).startOf('day').toString() === moment(rangeAñoPasado.startDate).startOf('day').toString() 
                                    && moment(range[0].endDate).startOf('day').toString()  === moment(rangeAñoPasado.endDate).startOf('day').toString() )
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