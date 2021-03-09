import React, { Component } from 'react';
import { DateRange  } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
// import { addDays } from 'date-fns';
import es from "date-fns/locale/es";
class MultipleRangeCalendar extends Component {

    state = {
        selection1:{
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection1',
        },
        selection2:{
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection2',
        },
        selection3:{
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection3',
            autoFocus: false
        }
    }

    updateRange = item => {
        // console.log(item)
        let { selection1, selection2, selection3 } = this.state
        const { onChange } = this.props
        selection1 = item.selection1
        // selection2 = item.selection2
        // selection3 = item.selection3
        this.setState({
            ...this.state,
            selection1,
            // selection2,
            // selection3
        })
        // onChange(selection1)
        // onChange(selection2)
        // onChange(selection3)
    }

    render() {
        const { selection1, selection2, selection3} = this.state
        const { disabledDates, onClickAddDate } = this.props
        // const { selection1, selection2, selection3} = this.props
        // console.log(selection1)
        return (
            <div>
                <DateRange 
                    disabledDates = { disabledDates }
                    onChange={ (item) => { this.updateRange(item)} }
                    showSelectionPreview = { true }
                    moveRangeOnFirstSelection = { true }
                    editableDateInputs = { true }
                    ranges = {[ selection1, selection2, selection3 ]}
                    direction = "horizontal"
                    locale = { es } 
                    initialFocusedRange = { [0,0] }
                    startDatePlaceholder = "Fecha de inicio"
                    endDatePlaceholder="Fecha Final"
                    rangeColors={["#2171c1", "#8950FC", "#FFA800"]}
                />
                <div className="text-right">
                    <a className="btn text-dark-50 btn-icon-primary btn-hover-icon-success font-weight-bolder btn-hover-bg-light" onClick={onClickAddDate}>
                        <i className="flaticon2-calendar-6 mr-2"></i>Fecha
                    </a>
                </div>
            </div>
        );
    }
}

export default MultipleRangeCalendar;