import React, { Component } from 'react'
import { Form } from 'react-bootstrap'

class SelectHorasLaborales extends Component {
    render(){

        const { value, onChange, name } = this.props

        return(
            <Form.Control as = "select" className = "px-1 py-0 text-center" style = { { height: "27px" } } 
                value = { value } onChange = { onChange } name = { name } >
                <option disabled value = { 0 }> HH </option>
                <option value = "08" > 08 </option>
                <option value = "09" > 09 </option>
                <option value = "10" > 10 </option>
                <option value = "11" > 11 </option>
                <option value = "12" > 12 </option>
                <option value = "13" > 13 </option>
                <option value = "14" > 14 </option>
                <option value = "15" > 15 </option>
                <option value = "16" > 16 </option>
                <option value = "17" > 17 </option>
                <option value = "18" > 18 </option>
                <option value = "19" > 19 </option>
                <option value = "20" > 20 </option>
            </Form.Control>
        )

    }
}

export default SelectHorasLaborales