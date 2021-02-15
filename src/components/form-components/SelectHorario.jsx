import React, { Component } from 'react'
import { SelectHorasLaborales, SelectAllHours, SelectMinutos } from '.'

class SelectHorario extends Component {
    render(){

        const { hora, minuto, onChange, quarter, allhours} = this.props

        return(
            <div className="input-daterange input-group" style={{ width: "auto" }}>
                {
                    allhours?
                        <SelectAllHours value = { hora.value } onChange = { onChange } name = { hora.name } />
                    :
                        <SelectHorasLaborales value = { hora.value } onChange = { onChange } name = { hora.name } />
                }
                <div className="input-group-append">
                    <span className="input-group-text py-0 px-2">
                        :
                    </span>
                </div>
                <SelectMinutos value = { minuto.value } name = { minuto.name } onChange = { onChange } quarter = { quarter } />
            </div>
        )

    }
}

export default SelectHorario