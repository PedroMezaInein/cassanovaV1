import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'

class Input extends Component {

    /* constructor(props){
        super(props)
    } */

    render() {
        const { error, onChange, placeholder, iconclass } = this.props 
        return (
            <div >
                <label className="col-form-label">{placeholder}</label>

                <div className="input-group">
                    <div className="input-group-prepend">
                        <span className="input-group-text">
                            <i className={iconclass+" kt-font-boldest text-success"}></i>
                        </span>
                    </div>
                    <Form.Control onChange={(e) => { e.preventDefault(); onChange(e) }} className={`${error}`} {... this.props} />
                    {
                        error &&
                        <label className="error-label">
                            {error}
                        </label>
                    }
                </div>                
            </div>
        )
    }
}

export default Input