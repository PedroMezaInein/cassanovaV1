import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import { Input, Calendar, Select} from '../../form-components'
import { validateAlert } from '../../../functions/alert'
import { DATE} from '../../../constants' 
// import { NOMINA_OBRA_INGRESAR_COLUMNS } from '../../../constants'
function agregarFila(){
    document.getElementById("tablaprueba").insertRow(-1).innerHTML = '<td><Select/></td><td><Select/></td><td><Input className="width: 100px"/></td><td><Input/></td><td><Input/></td><td><Input/></td><td><Input/></td><td><Input/></td><td></td>';
}

function eliminarFila(){
    var table = document.getElementById("tablaprueba");
    var rowCount = table.rows.length;
    //console.log(rowCount);
    
    if(rowCount <= 1)
        alert('No se puede eliminar el encabezado');
    else
        table.deleteRow(rowCount -1);
}

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
                </div> 
                table table-separate table-head-custom table-checkable display w-100 table-hover text-justify responsive
                */}
                
                    <table className="table table-responsive table-separate" id="tablaprueba">
                        <thead className="datatable-head">
                            <tr className="datatable-row">
                                <th className="datatable-cell datatable-cell-sort" >Empleado</th>
                                <th className="datatable-cell datatable-cell-sort">ID del Proyecto</th>
                                <th className="datatable-cell datatable-cell-sort">Suledo por Hora</th>
                                <th className="datatable-cell datatable-cell-sort">Hours 2T</th>
                                <th className="datatable-cell datatable-cell-sort">Hours 3T</th>
                                <th className="datatable-cell datatable-cell-sort">Nómina IMSS</th>
                                <th className="datatable-cell datatable-cell-sort">Restante Nómina</th>
                                <th className="datatable-cell datatable-cell-sort">Extras</th>
                                <th className="datatable-cell datatable-cell-sort">Total</th>
                            </tr>
                        </thead>
                        <tbody className="datatable-body">
                        </tbody>
                    </table>
                    <div className="form-group">
                        <button type="button" className="btn btn-primary mr-2" onClick = { () => { agregarFila() } }>Agregar Fila</button>
                        <button type="button" className="btn btn-danger" onClick = { () => { eliminarFila() } }>Eliminar Fila</button>
                    </div> 
            </Form>
            )
    }
}

export default NominaObraForm