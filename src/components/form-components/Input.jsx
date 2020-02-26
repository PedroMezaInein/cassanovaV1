import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'

class Input extends Component{

    constructor(props){
        super(props)
    }

    render(){
        const { error, onChange, placeholder  } = this.props
        return(
            <div>
                <Form.Label className="mt-2 mb-1 label-form">
                    {placeholder}
                </Form.Label>
                <Form.Control onChange={ (e) => {e.preventDefault(); onChange(e)} } className={`${error}`} { ... this.props}/>
                {
                    error && 
                        <label className="error-label">
                            {error}
                        </label>
                }
            </div>
        )
    }
}

export default Input