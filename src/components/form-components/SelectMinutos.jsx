import React, { Component } from 'react'
import { Form } from 'react-bootstrap'

class SelectMinutos extends Component {
    render(){

        const { value, onChange, name, quarter } = this.props

        return(
            <Form.Control as = "select" className = "px-1 py-0 text-center" style = { { height: "27px" } } 
                value = { value } onChange = { onChange } name = { name } >
                <option disabled value = { 0 }>MM</option>
                <option value = "00" > 00 </option>
                {
                    quarter === true ? 
                        <>
                            <option value = "15" > 15 </option>
                            <option value = "30" > 30 </option>
                            <option value = "45" > 45 </option>
                        </>
                    :   <>            
                            <option value = "05" > 05 </option>
                            <option value = "10" > 10 </option>
                            <option value = "15" > 15 </option>
                            <option value = "20" > 20 </option>
                            <option value = "25" > 25 </option>
                            <option value = "30" > 30 </option>
                            <option value = "35" > 35 </option>
                            <option value = "40" > 40 </option>
                            <option value = "45" > 45 </option>
                            <option value = "50" > 50 </option>
                            <option value = "55" > 55 </option>   
                        </>
                }
            </Form.Control>
        )

    }
}

export default SelectMinutos