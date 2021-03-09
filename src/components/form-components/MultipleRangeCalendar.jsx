import React, { Component } from 'react';
import { DateRange  } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
// import { addDays } from 'date-fns';
import es from "date-fns/locale/es";
class MultipleRangeCalendar extends Component {

    state = {
        colors:["#FFA800"]
    }

    onClickDeleteDate = () => {
        const { colors} = this.state
        let { arraySelection } = this.props
        if(arraySelection.length>1){
            arraySelection.pop()
            colors.pop() 
            this.setState({
                colors
            })
        }
    }
    onClickAddDate = () => {
        let { arraySelection } = this.props
        const { colors} = this.state
        arraySelection.push(
            { 
                startDate: new Date(),
                endDate: new Date(),
                key: 'selection'+(arraySelection.length),  
            }
        )
        colors.push("#"+ Math.floor(Math.random()*16777215).toString(16))
        this.setState({
            colors
        })
    }
    updateRange = item => { 
        let { arraySelection } = this.props
        console.log(item) 
        let selectionActual = Object.keys(item)[0]
        console.log(selectionActual) 
        
        arraySelection.map((actual) => {
            if(actual.key===selectionActual){
                actual.startDate=item[selectionActual].startDate
                actual.endDate=item[selectionActual].endDate
            }
            return actual
        });
    }

    render() {
        const { colors} = this.state
        const { disabledDates, arraySelection } = this.props
        return (
            <div>
                <DateRange 
                    disabledDates = { disabledDates }
                    onChange={ (item) => { this.updateRange(item)} }
                    ranges = {arraySelection}
                    direction = "horizontal"
                    locale = { es } 
                    initialFocusedRange = { [0,0] }
                    startDatePlaceholder = "Fecha de inicio"
                    endDatePlaceholder="Fecha Final"
                    rangeColors={colors}
                />
                <div className="d-flex justify-content-between">
                    <a className="btn text-dark-50 btn-icon-primary btn-hover-icon-danger font-weight-bolder btn-hover-bg-light" onClick={this.onClickDeleteDate}>
                        <i className="far fa-calendar-times mr-2"></i>Borrar
                    </a>
                    <a className="btn text-dark-50 btn-icon-primary btn-hover-icon-success font-weight-bolder btn-hover-bg-light" onClick={this.onClickAddDate}>
                        <i className="far fa-calendar-plus mr-2"></i>Fecha
                    </a>
                </div>
            </div>
        );
    }
}

export default MultipleRangeCalendar;