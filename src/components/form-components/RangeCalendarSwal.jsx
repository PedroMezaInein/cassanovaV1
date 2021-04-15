import React, { Component } from 'react';
import { DateRange  } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
// import { addDays } from 'date-fns';
import es from "date-fns/locale/es";

class RangeCalendarSwal extends Component {

    state = {
        startDate: null,
        endDate: null
    }

    updateRange = item => {
        const { onChange } = this.props
        const { endDate, startDate } = item.selection
        this.setState({
            startDate: startDate,
            endDate: endDate
        })
        onChange(item.selection)
    }
    
    componentDidMount(){
        const { start, end } = this.props
        this.setState({
            ...this.state,
            startDate: start ? start : null,
            endDate: end ? end : null
        })
    }

    render() {
        const { disabledDates } = this.props
        const { startDate, endDate } = this.state
        return (
            <DateRange 
                locale = { es }
                // className
                // months
                showSelectionPreview = { true }
                // showMonthAndYearPickers
                rangeColors = {["#357ec7"]}
                /* shownDate = { end } */
                // minDate
                // maxDate
                direction = "horizontal"
                disabledDates = { disabledDates }
                // disabledDay
                // scroll
                // showMonthArrow
                // navigatorRenderer
                // ranges = { range }
                ranges = { [
                    {
                        startDate: startDate,
                        endDate: endDate,
                        autoFocus: true,
                        key: 'selection'
                    }
                ] }
                // moveRangeOnFirstSelection = { false }
                onChange={ (item) => { this.updateRange(item)} }
                // color
                // date
                // showDateDisplay = { true }
                // onShownDateChange
                initialFocusedRange = { [0,0] }
                // focusedRange = { [0,0] }
                // onRangeFocusChange
                // preview
                showPreview = { true }
                editableDateInputs = { false }
                // dragSelectionEnabled
                // onPreviewChange
                dateDisplayFormat = 'dd-MMM-yyyy'
                // dayDisplayFormat
                // weekdayDisplayFormat
                // monthDisplayFormat
                weekStartsOn	 = { 1 }
                startDatePlaceholder = "Fecha de inicio"
                endDatePlaceholder = "Fecha Final"
                // fixedHeight
                // renderStaticRangeLabel
                
                // inputRanges
            />
        );
    }
}

export default RangeCalendarSwal;