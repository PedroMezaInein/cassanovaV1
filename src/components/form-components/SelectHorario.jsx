import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { SelectHoras, SelectMinutos } from '.'

class SelectHorario extends Component {
    render(){

        const { hora, minuto, onChange } = this.props

        return(
            <div className="input-daterange input-group" style={{ width: "auto" }}>
                <SelectHoras value = { hora.value } onChange = { onChange } name = { hora.name } />
                <div className="input-group-append">
                    <span className="input-group-text py-0 px-2">
                        :
                    </span>
                </div>
                <SelectMinutos value = { minuto.value } name = { minuto.name } onChange = { onChange } />
            </div>
        )

    }
}

export default SelectHorario