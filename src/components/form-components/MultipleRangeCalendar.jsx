import React, { Component } from 'react';
import { DateRange  } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import moment from 'moment'
import es from "date-fns/locale/es";
class MultipleRangeCalendar extends Component {

    state = {
        colors:["#FFA800"]
    }

    onClickDeleteDate = () => {
        const { clickDeleteRange } = this.props
        const { colors } = this.state
        if(colors.length>1){
            colors.pop()
            clickDeleteRange()
        }
        this.setState({...this.state, colors })
    }
    onClickAddDate = () => {
        const { clickAddRange } = this.props
        const { colors} = this.state
        colors.push("#"+ Math.floor(Math.random()*16777215).toString(16))
        clickAddRange()
        this.setState({ ...this.state, colors })
    }

    updateRange = item => { 
        let { arraySelection, updateRango } = this.props
        let selectionActual = Object.keys(item)[0]
        arraySelection.map((actual) => {
            if(actual.key===selectionActual){
                actual.startDate = new Date(moment(item[selectionActual].startDate))
                actual.endDate = new Date(moment(item[selectionActual].endDate))
            }
            return actual
        });
        updateRango(arraySelection)
    }

    render() {
        const { colors} = this.state
        const { disabledDates, arraySelection, clickDeleteRange, clickAddRange } = this.props
        return (
            <div>
                <DateRange disabledDates = { disabledDates } onChange = { (item) => { this.updateRange(item)} }
                    ranges = {arraySelection }
                    direction = "horizontal"
                    locale = { es } 
                    initialFocusedRange = { [0,0] }
                    startDatePlaceholder = "Fecha de inicio"
                    endDatePlaceholder="Fecha Final"
                    rangeColors={colors}
                />
                <div className="d-flex justify-content-between">
                    {
                        clickDeleteRange && 
                            <span className="btn text-dark-50 btn-icon-primary btn-hover-icon-danger font-weight-bolder btn-hover-bg-light" onClick={this.onClickDeleteDate}>
                                <i className="far fa-calendar-times mr-2"></i>Borrar
                            </span>
                    }
                    {
                        clickAddRange && 
                            <span className="btn text-dark-50 btn-icon-primary btn-hover-icon-success font-weight-bolder btn-hover-bg-light" onClick={this.onClickAddDate}>
                                <i className="far fa-calendar-plus mr-2"></i>Fecha
                            </span>
                    }
                </div>
            </div>
        );
    }
}

export default MultipleRangeCalendar;