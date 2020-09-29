import React, { Component } from 'react';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { addDays } from 'date-fns';
import es from "date-fns/locale/es";
import moment from 'moment'

class RangeCalendar extends Component {

    state = {
        range:[{
            startDate: new Date(),
            endDate: addDays(new Date(), 7),
            key: 'selection'
        }]
    }

    componentDidMount(){
        const { start, end } = this.props
        const { range } = this.state
        range[0] = {
            startDate: start,
            endDate: end,
            key: 'selection'
        }
        this.setState({
            ... this.state,
            range
        })
    }

    updateRange = item => {
        const { range } = this.state
        const { onChange } = this.props
        range[0] = item.selection
        this.setState({
            ... this.state,
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
        return (
            <DateRangePicker
                disabledDates = { disabledDates }
                onChange={ (item) => { this.updateRange(item)} }
                showSelectionPreview = { true }
                moveRangeOnFirstSelection = { false }
                months = { 1 }
                ranges = { range }
                direction = "horizontal"
                locale = { es }
                staticRanges = {
                    [
                        {
                            label: 'Hoy',
                            range: () => ({
                                startDate: new Date(),
                                endDate: new Date()
                            }),
                            isSelected() {
                                return true;
                            }
                        },
                        {
                            label: 'Esta semana',
                            range: () => ( this.getThisWeek()),
                            isSelected() {
                                return true;
                            }
                        },
                        {
                            label: 'Este mes',
                            range: () => ( this.getThisMonth()),
                            isSelected() {
                                return true;
                            }
                        },
                        {
                            label: 'Mes anterior',
                            range: () => ( this.getLastMonth()),
                            isSelected() {
                                return true;
                            }
                        },
                        {
                            label: 'Este año',
                            range: () => ( this.getThisYear()),
                            isSelected() {
                                return true;
                            }
                        },
                        {
                            label: 'Año pasado',
                            range: () => ( this.getLastYear()),
                            isSelected() {
                                return true;
                            }
                        }
                    ]
                }
            />
        );
    }
}

export default RangeCalendar;