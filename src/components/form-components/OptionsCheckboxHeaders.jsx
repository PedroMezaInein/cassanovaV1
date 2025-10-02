import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'

class OptionsCheckboxHeaders extends Component {
    render() {
        const { onChange, onChangeMonto, placeholder, options, montos, esquema } = this.props

        let options_tipo = {}
        options.forEach(option => {
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
                        Object.keys(options_tipo).map((tipo, key) => (
                            <div key={key} className="col-md-12 mx-5 px-2">
                                {tipo !== "" && (
                                    <div className="text-dark-50 font-weight-bolder font-size-base mt-3">
                                        {tipo}
                                    </div>
                                )}
                                <div className="checkbox-list pt-2">
                                    {
                                        options_tipo[tipo].map((option, i) => (
                                            <label key={i} className="w-100 font-weight-light">
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div className="flex-grow-1">
                                                        <Form.Check
                                                            type="checkbox"
                                                            name={option.id.toString()}
                                                            checked={option.checked}
                                                            onChange={(e) => onChange(e)}
                                                            label={option.text}
                                                        />
                                                    </div>
                                                    {/* {
                                                        esquema === "esquema_1" && (
                                                            <div className="ml-3" style={{ width: '180px' }}>
                                                                <input
                                                                    type="number"
                                                                    step="0.01"
                                                                    className="form-control form-control-sm"
                                                                    placeholder="Monto"
                                                                    value={montos?.[option.id] || ''}
                                                                    onChange={(e) => onChangeMonto(option.id, e)}
                                                                />
                                                            </div>
                                                        )
                                                    } */}
                                                </div>
                                            </label>
                                        ))
                                    }
                                </div>
                            </div>
                        ))
                    }
                </div>
            </>
        )
    }
}

export default OptionsCheckboxHeaders
