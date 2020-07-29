import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'

class InputImage extends Component {

    render() {
        const { error, onChange, placeholder} = this.props 
        return (
            <div >
                <label className="col-form-label">{placeholder}</label>

                    
                    <Form.Control onChange={(e) => { e.preventDefault(); onChange(e) }} className={`${error}`} {... this.props} />
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

export default InputImage