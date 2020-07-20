import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import { Input, Calendar, Select} from '../../form-components'
import { validateAlert } from '../../../functions/alert'
import { DATE} from '../../../constants'
import TableForModalsInputs from '../../../components/tables/TableForModalsInputs' 
import { NOMINA_OBRA_INGRESAR_COLUMNS } from '../../../constants'


class NominaObraForm extends Component{

    handleChangeDateInicio = date => {
        const { onChange } = this.props
        onChange({ target: { value: date, name: 'fechaInicio' } })
    }
    handleChangeDateFin = date => {
        const { onChange } = this.props
        onChange({ target: { value: date, name: 'fechaFin' } })
    }

    updateEmpresa = value => {
        const { onChange, setOptions } = this.props
        onChange({ target: { value: value, name: 'empresa' } })
    }
    
    render(){
        const { empresas, onChange, form, onSubmit, formeditado} = this.props
        return(
            <Form id="form-nominaobra"
                onSubmit = { 
                    (e) => {
                        e.preventDefault(); 
                        validateAlert(onSubmit, e, 'form-nominaobra')
                    }
                } 
            >
                {/* <div className="form-group row form-group-marginless pt-4">
                    <div className="col-md-6">
                        <Input 
                            requirevalidation={1} 
                            formeditado={formeditado}
                            name="" 
                            value={""} 
                            placeholder="Periodo de Nómina de Obra" 
                            onChange={""} 
                            iconclass={"far fa-window-maximize"}
                            messageinc="Incorrecto. Ingresa el periodo de nómina de obra."
                        />
                    </div>  
                    <div className="col-md-6">
                        <Select 
                            requirevalidation={1}
                            formeditado={formeditado}
                            placeholder="Selecciona la empresa" 
                            options = { empresas } 
                            name="empresa" 
                            value = { form.empresa } 
                            onChange = { onChange } 
                            iconclass={"far fa-building"} 
                            messageinc="Incorrecto. Selecciona la empresa."
                        /> 
                    </div>
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-6">
                        <Calendar 
                            formeditado={formeditado}
                            onChangeCalendar = { this.handleChangeDateInicio }
                            placeholder = "Fecha de inicio"
                            name = "fechaInicio"
                            value = { form.fechaInicio }
                            selectsStart
                            startDate={ form.fechaInicio }
                            endDate={ form.fechaFin }
                            iconclass={"far fa-calendar-alt"}      
                            patterns={DATE}                      
                        /> 
                    </div>
                    <div className="col-md-4">
                        <Calendar 
                            formeditado={formeditado}
                            onChangeCalendar = { this.handleChangeDateFin }
                            placeholder = "Fecha final"
                            name = "fechaFin"
                            value = { form.fechaFin }
                            selectsEnd
                            startDate={ form.fechaInicio }
                            endDate={ form.fechaFin }
                            minDate={ form.fechaInicio }
                            iconclass={"far fa-calendar-alt"} 
                            patterns={DATE}                        
                        />
                    </div>
                </div> */}
                <TableForModalsInputs   
                    columns = { NOMINA_OBRA_INGRESAR_COLUMNS } data = { "" } 
                    title = 'Nómina de obra' subtitle = 'Listado de nómina de obra'
                    mostrar_boton={false}
                    abrir_modal={false} 
                    mostrar_acciones={false}  
                    elements = { "" }
                />
            </Form>
            )
    }
}

export default NominaObraForm