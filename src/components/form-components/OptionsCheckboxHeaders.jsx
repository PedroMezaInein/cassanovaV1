import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'

class OptionsCheckboxHeaders extends Component {

    render() {
        const { onChange, placeholder, options } = this.props
        let options_tipo = {}
        options.forEach((option, key) => {
            let tipo = option.tipo ? option.tipo : ""
            if (!options_tipo[tipo]) {
                options_tipo[tipo] = []
            }
            options_tipo[tipo].push(option)
        })

        return (
            <>
            <Form.Label className="font-weight-bolder m-0">{placeholder}</Form.Label>
             <div className="row justify-content-center">
                                {
                    Object.keys(options_tipo).map((tipo, key) => {
                        return (
                            
                            <div key = { key } >
                                <div className="col-md-12 mx-5 px-2">

                                {tipo !== "" ? <div className="text-dark-50 font-weight-bolder font-size-base mt-3">{tipo}</div> : ""}
                                <div>
                                    <div className="checkbox-list pt-2">
                                        {
                                            options_tipo[tipo].map((option, key) => {
                                                return (
                                                    <label key={key} className="checkbox checkbox-outline checkbox-outline-2x checkbox-primary font-weight-light">
                                                        <input
                                                            type="checkbox"
                                                            onChange={(e) => { onChange(e) }}
                                                            name={option.id}
                                                            checked={option.checked}
                                                            value={option.checked}
                                                        />{option.text}
                                                        <span></span>
                                                    </label>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                                </div>      

                            </div>
                        )
                    })
                }
                  </div>

            </>
        )
    }
}

export default OptionsCheckboxHeaders