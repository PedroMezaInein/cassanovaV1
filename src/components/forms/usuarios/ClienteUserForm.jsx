import React, { Component } from 'react'
import { SelectSearch } from '../../form-components'

class ClienteUserForm extends Component {

    updateProyectos = value => {
        const { onChange, onChangeOptions, options } = this.props
        options.proyectos.map((proyecto) => {
            if (proyecto.value === value)
                onChangeOptions({ target: { value: proyecto.value, name: 'proyecto' } }, 'proyectos')
        })
        onChange({ target: { value: value, name: 'proyecto' } })
    }


    render() {
        const { form, onChange, options, deleteOption, onChangeOption, clear, ...props } = this.props
        return (
            <div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-4">
                        <SelectSearch
                            options={options.proyectos}
                            placeholder="SELECCIONA EL PROYECTO"
                            name="proyecto"
                            value={form.proyecto}
                            onChange={this.updateProyectos}
                            iconclass={"far fa-folder-open"}
                        />
                    </div>
                    <div className="col-md-8">
                        {
                            form.proyectos.length > 0 ?
                                <div className="col-md-12 row mx-0 align-items-center image-upload">
                                    {
                                        form.proyectos.map((proyecto, key) => {
                                            return (
                                                <div key={key} className="tagify form-control p-1 col-md-6 px-2 d-flex justify-content-center align-items-center" tabIndex="-1" style={{ borderWidth: "0px" }}>
                                                    <div className="tagify__tag tagify__tag--primary tagify--noAnim">
                                                        <div
                                                            title="Borrar archivo"
                                                            className="tagify__tag__removeBtn"
                                                            role="button"
                                                            aria-label="remove tag"
                                                            onClick={(e) => { e.preventDefault(); deleteOption(proyecto, 'proyectos') }}
                                                        >
                                                        </div>
                                                        <div><span className="tagify__tag-text p-1 white-space">{proyecto.name}</span></div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                                : ''
                        }
                    </div>
                </div>
            </div>

        )
    }
}

export default ClienteUserForm