import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import { Input, Calendar, SelectSearch, Button, FileInput, InputMoney} from '../../form-components'
import { validateAlert } from '../../../functions/alert'
import { DATE } from '../../../constants'

class NominaAdminForm extends Component {

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

    updateUsuario = (value, key) => {
        const { onChangeNominasAdmin } = this.props
        onChangeNominasAdmin(key, { target: { value: value, name: 'usuario' } }, 'usuario')
    }

    getSuma = key => {
        const { form } = this.props
        let nominImss = form.nominasAdmin[key].nominImss === undefined ? 0 : form.nominasAdmin[key].nominImss
        let restanteNomina = form.nominasAdmin[key].restanteNomina === undefined ? 0 : form.nominasAdmin[key].restanteNomina
        let extras = form.nominasAdmin[key].extras === undefined ? 0 : form.nominasAdmin[key].extras
        
        var resultado = parseFloat(nominImss) + parseFloat(restanteNomina) + parseFloat(extras)
        var separators = resultado.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        return '$' + separators
    }

    getSumaNomina = valor => {
        var total = 0;	;

        return '$' + total
    }

    render() {
        const { options, addRowNominaAdmin, deleteRowNominaAdmin, onChangeNominasAdmin, onChange, onChangeAdjunto, clearFiles, form, onSubmit, formeditado, title,nomina} = this.props
        return (
            <Form id="form-nominaadmin"
                onSubmit={
                    (e) => {
                        e.preventDefault();
                        validateAlert(onSubmit, e, 'form-nominaadmin')
                    }
                }
            >
                <div className="form-group row form-group-marginless pt-4">
                    <div className="col-md-6">
                        <Input
                            requirevalidation={1}
                            formeditado={formeditado}
                            name="periodo"
                            value={form.periodo}
                            placeholder="PERIODO DE NÓMINA ADMINISTRATIVA"
                            onChange={onChange}
                            iconclass={"far fa-window-maximize"}
                            messageinc="Incorrecto. Ingresa el periodo de nómina Administrativa."
                        />
                    </div>

                    <div className="col-md-6">
                        <SelectSearch
                            formeditado={formeditado}
                            options={options.empresas}
                            placeholder="Selecciona la empresa"
                            name="empresa"
                            value={form.empresa}
                            onChange={this.updateEmpresa}
                            iconclass={"far fa-building"}
                        />
                    </div>
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-6">
                        <Calendar
                            formeditado={formeditado}
                            onChangeCalendar={this.handleChangeDateInicio}
                            placeholder="Fecha de inicio"
                            name="fechaInicio"
                            value={form.fechaInicio}
                            selectsStart
                            startDate={form.fechaInicio}
                            endDate={form.fechaFin}
                            iconclass={"far fa-calendar-alt"}
                            patterns={DATE}
                        />
                    </div>
                    <div className="col-md-6">
                        <Calendar
                            formeditado={formeditado}
                            onChangeCalendar={this.handleChangeDateFin}
                            placeholder="Fecha final"
                            name="fechaFin"
                            value={form.fechaFin}
                            selectsEnd
                            startDate={form.fechaInicio}
                            endDate={form.fechaFin}
                            minDate={form.fechaInicio}
                            iconclass={"far fa-calendar-alt"}
                            patterns={DATE}
                        />
                    </div>
                </div>
                
                {
                    title !== 'Editar nómina administrativa' ?
                        <>
                            <div className="separator separator-dashed mt-1 mb-2"></div>
                            <div className="form-group row form-group-marginless">
                                <div className="col-md-12">
                                    <FileInput
                                        requirevalidation={0}
                                        formeditado={formeditado}
                                        onChangeAdjunto={onChangeAdjunto}
                                        placeholder={form.adjuntos.adjunto.placeholder}
                                        value={form.adjuntos.adjunto.value}
                                        name='adjunto'
                                        id='adjunto'
                                        accept="image/*, application/pdf"
                                        files={form.adjuntos.adjunto.files}
                                        deleteAdjunto={clearFiles}
                                        multiple
                                    />
                                </div>
                            </div>
                        </>
                        : ''
                }
                

                <table className="table table-separate table-responsive" id="tabla_obra">
                    <thead>
                        <tr>
                            <th rowspan="2"><p className="mt-2">Empleado</p></th> 
                            <th className="pb-0 border-bottom-0">Nómina IMSS</th>
                            <th className="pb-0 border-bottom-0">Restante Nómina</th>
                            <th className="pb-0 border-bottom-0">Extras</th>
                            <th className="pb-0 border-bottom-0">Total</th>
                        </tr>
                        <tr>  
                            <th className="pt-2"><p className="p-0 my-0 text-primary bg-primary-o-40 font-weight-bolder">{this.getSumaNomina(nomina)}</p></th>
                            <th className="pt-2"><p className="p-0 my-0 text-primary bg-primary-o-40 font-weight-bolder">Restante Nómina</p></th>
                            <th className="pt-2"><p className="p-0 my-0 text-primary bg-primary-o-40 font-weight-bolder">Extras</p></th>
                            <th className="pt-2"><p className="p-0 my-0 text-primary bg-primary-o-40 font-weight-bolder">Total</p></th>
                        </tr>
                    </thead>
                    <tbody>

                        {
                            form.nominasAdmin.map((nominaAdmin, key) => {
                                return (
                                    <tr key={key}>
                                        <td>
                                            <SelectSearch
                                                formeditado={formeditado}
                                                options={options.usuarios}
                                                placeholder="Selecciona el empleado" 
                                                name="usuario"
                                                value={form['nominasAdmin'][key]['usuario']}
                                                onChange={(value) => this.updateUsuario(value, key)}
                                                iconclass={"fas fa-building"}
                                                customstyle={{ width: "auto" }}
                                            />
                                        </td>     
                                        <td>
                                            <InputMoney
                                                requirevalidation={1}
                                                formeditado={formeditado}
                                                name="nominImss"
                                                value={form['nominasAdmin'][key]['nominImss']}
                                                onChange={e => onChangeNominasAdmin(key, e, 'nominImss')}
                                                placeholder={null}
                                                thousandSeparator={true} 
                                                customstyle={{ paddingLeft: "10px", marginTop: "13px" }}
                                                prefix={'$'}
                                                onkeyup={this.getSumaNomina}
                                            />
                                        </td>
                                        <td>
                                            <InputMoney
                                                requirevalidation={1}
                                                formeditado={formeditado}
                                                name="restanteNomina"
                                                value={form['nominasAdmin'][key]['restanteNomina']}
                                                onChange={e => onChangeNominasAdmin(key, e, 'restanteNomina')}
                                                placeholder={null}
                                                thousandSeparator={true} 
                                                customstyle={{ paddingLeft: "10px", marginTop: "13px" }}
                                                prefix={'$'}
                                                onkeyup={this.getSumaNomina}
                                            />
                                        </td>
                                        <td>
                                            <InputMoney
                                                requirevalidation={1}
                                                formeditado={formeditado}
                                                name="extras"
                                                value={form['nominasAdmin'][key]['extras']}
                                                onChange={e => onChangeNominasAdmin(key, e, 'extras')}
                                                placeholder={null}
                                                thousandSeparator={true} 
                                                customstyle={{ paddingLeft: "10px", marginTop: "13px" }}
                                                prefix={'$'}
                                                onkeyup={this.getSumaNomina}
                                            />
                                        </td>
                                        <td>
                                            <p className="font-size-lg font-weight-bolder" style={{ paddingLeft: "10px", width: "auto", marginTop: "42px", paddingRight: "20px" }}>
                                                {
                                                    this.getSuma(key)
                                                }
                                            </p>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
                <div className="form-group d-flex justify-content-center">
                    <button type="button" className="btn btn-light-primary font-weight-bold mr-2" onClick={addRowNominaAdmin} >Agregar Fila</button>
                    <button type="button" className="btn btn-light-danger font-weight-bold mr-2" onClick={deleteRowNominaAdmin} >Eliminar Fila</button>
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="d-flex justify-content-center mt-2 mb-4">
                    <Button text='Enviar' type='submit' />
                </div>
            </Form>
        )
    }
}

export default NominaAdminForm