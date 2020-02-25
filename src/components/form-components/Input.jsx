import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'

class Input extends Component{

    constructor(props){
        super(props)
    }

    render(){
        const { error, onChange } = this.props
        return(
            <div>
                <Form.Control onChange={ (e) => {e.preventDefault(); onChange(e)} } className={`mt-3 ${error}`} { ... this.props}/>
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