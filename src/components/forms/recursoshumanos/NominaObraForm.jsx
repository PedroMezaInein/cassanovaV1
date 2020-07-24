import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import { Input, Calendar, SelectSearch, Button, FileInput} from '../../form-components'
import { validateAlert } from '../../../functions/alert'
import { DATE } from '../../../constants'

class NominaObraForm extends Component {

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

    updateProyecto = (value, key) => {
        const { onChangeNominasObra } = this.props
        onChangeNominasObra(key, { target: { value: value, name: 'proyecto' } }, 'proyecto')
    }

    updateUsuario = (value, key) => {
        const { onChangeNominasObra } = this.props
        onChangeNominasObra(key, { target: { value: value, name: 'usuario' } }, 'usuario')
    }

    getSuma = key => {
        const { form } = this.props
        let nominImss = form.nominasObra[key].nominImss === undefined ? 0 : form.nominasObra[key].nominImss
        let restanteNomina = form.nominasObra[key].restanteNomina === undefined ? 0 : form.nominasObra[key].restanteNomina
        let extras = form.nominasObra[key].extras === undefined ? 0 : form.nominasObra[key].extras

        return parseFloat(nominImss) + parseFloat(restanteNomina) + parseFloat(extras)
    }

    render() {
        const { options, addRowNominaObra, deleteRowNominaObra, onChangeNominasObra, onChange, clearFiles, onChangeAdjunto, form, onSubmit, formeditado, title} = this.props
        return (
            <Form id="form-nominaobra"
                onSubmit={
                    (e) => {
                        e.preventDefault();
                        validateAlert(onSubmit, e, 'form-nominaobra')
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
                            placeholder="PERIODO DE NÓMINA DE OBRA"
                            onChange={onChange}
                            iconclass={"far fa-window-maximize"}
                            messageinc="Incorrecto. Ingresa el periodo de nómina de obra."
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
                    title !== 'Editar nómina obra' ?
                        <>
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
                            <th>Empleado</th>
                            <th>Proyecto</th>
                            <th>Suledo por Hora</th>
                            <th>1 Hora T</th>
                            <th>2 Horas T</th>
                            <th>3 Horas T</th>
                            <th>Nómina IMSS</th>
                            <th>Restante Nómina</th>
                            <th>Extras</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>

                        {
                            form.nominasObra.map((nominas, key) => {
                                return (
                                    <tr key={key}>
                                        <td>
                                            <SelectSearch
                                                formeditado={formeditado}
                                                options={options.usuarios}
                                                placeholder="Selecciona el empleado" 
                                                name="usuario"
                                                value={form['nominasObra'][key]['usuario']}
                                                onChange={(value) => this.updateUsuario(value, key)}
                                                iconclass={"fas fa-building"}
                                                customstyle={{ width: "auto" }}
                                            />
                                        </td>
                                        <td>
                                            <SelectSearch
                                                formeditado={formeditado}
                                                options={options.proyectos}
                                                placeholder="Selecciona el proyecto"
                                                // placeholder={null}
                                                name="proyecto"
                                                value={form['nominasObra'][key]['proyecto']}
                                                onChange={(value) => this.updateProyecto(value, key)}
                                                iconclass={"far fa-folder-open"}
                                                customstyle={{ width: "300px" }}
                                            />
                                        </td>
                                        <td>
                                            <Input
                                                requirevalidation={1}
                                                formeditado={formeditado}
                                                name="sueldoh" 
                                                value={form['nominasObra'][key]['sueldoh']}
                                                onChange={e => onChangeNominasObra(key, e, 'sueldoh')}
                                                placeholder={null}
                                                style={{ paddingLeft: "10px", width: "131px", marginTop: "10px" }}
                                            />
                                        </td>
                                        <td>
                                            <Input
                                                requirevalidation={1}
                                                formeditado={formeditado}
                                                name="hora1T" 
                                                value={form['nominasObra'][key]['hora1T']}
                                                onChange={e => onChangeNominasObra(key, e, 'hora1T')}
                                                placeholder={null}
                                                style={{ paddingLeft: "10px", width: "131px", marginTop: "10px" }}
                                            />
                                        </td>
                                        <td>
                                            <Input
                                                requirevalidation={1}
                                                formeditado={formeditado}
                                                name="hora2T" 
                                                value={form['nominasObra'][key]['hora2T']}
                                                onChange={e => onChangeNominasObra(key, e, 'hora2T')}
                                                placeholder={null}
                                                style={{ paddingLeft: "10px", width: "131px", marginTop: "10px" }}
                                            />
                                        </td>
                                        <td>
                                            <Input
                                                requirevalidation={1}
                                                formeditado={formeditado}
                                                name="hora3T" 
                                                value={form['nominasObra'][key]['hora3T']}
                                                onChange={e => onChangeNominasObra(key, e, 'hora3T')}
                                                placeholder={null}
                                                style={{ paddingLeft: "10px", width: "131px", marginTop: "10px" }}
                                            />
                                        </td>
                                        <td>
                                            <Input
                                                requirevalidation={1}
                                                formeditado={formeditado}
                                                name="nominImss" 
                                                value={form['nominasObra'][key]['nominImss']}
                                                onChange={e => onChangeNominasObra(key, e, 'nominImss')}
                                                placeholder={null}
                                                style={{ paddingLeft: "10px", width: "131px", marginTop: "10px" }}
                                            />
                                        </td>
                                        <td>
                                            <Input
                                                requirevalidation={1}
                                                formeditado={formeditado}
                                                name="restanteNomina"
                                                value={form['nominasObra'][key]['restanteNomina']}
                                                onChange={e => onChangeNominasObra(key, e, 'restanteNomina')}
                                                placeholder={null}
                                                style={{ paddingLeft: "10px", width: "131px", marginTop: "10px" }}
                                            />
                                        </td>
                                        <td>
                                            <Input
                                                requirevalidation={1}
                                                formeditado={formeditado}
                                                name="extras"
                                                value={form['nominasObra'][key]['extras']}
                                                onChange={e => onChangeNominasObra(key, e, 'extras')}
                                                placeholder={null}
                                                style={{ paddingLeft: "10px", width: "131px", marginTop: "10px" }}
                                            />
                                        </td>
                                        <td>
                                            <p style={{ paddingLeft: "10px", width: "131px", marginTop: "30px" }}>
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
                    <button type="button" className="btn btn-light-primary font-weight-bold mr-2" onClick={addRowNominaObra} >Agregar Fila</button>
                    <button type="button" className="btn btn-light-danger font-weight-bold mr-2" onClick={deleteRowNominaObra} >Eliminar Fila</button>
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="d-flex justify-content-center mt-2 mb-4">
                    <Button text='Enviar' type='submit' />
                </div>
            </Form>
        )
    }
}

export default NominaObraForm