import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import { SelectSearch } from '../../form-components'
import { validateAlert } from '../../../functions/alert'
import RangeCalendar from '../../../components/form-components/RangeCalendar';

class FlujoProyectosForm extends Component {

    updateEmpresa = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'empresa' } })
    }

    render() {
        const { form, onChange, onChangeRange, options, formeditado, onSubmit, ...props } = this.props
        return (
            <>
                <Form id="form-flujo-proyectos"
                    onSubmit={
                        (e) => {
                            e.preventDefault();
                            validateAlert(onSubmit, e, 'form-flujo-proyectos')
                        }
                    }
                    {...props}
                >
                    <div className="">
                            <SelectSearch
                                formeditado={formeditado}
                                name='empresa'
                                options={options.empresas}
                                placeholder='SELECCIONA LA(S) EMPRESA(S)'
                                value={form.empresa}
                                onChange={this.updateEmpresa}
                                iconclass={"far fa-building"}
                                messageinc="Incorrecto. Selecciona la(s) empresa(s)."
                            /> 
                    </div>  
                    <div className="text-center mt-4">
                        <RangeCalendar
                            onChange={onChangeRange}
                            start={form.fechaInicio}
                            end={form.fechaFin}
                        />
                    </div>
                </Form>
            </>
        )
    }
}

export default FlujoProyectosForm