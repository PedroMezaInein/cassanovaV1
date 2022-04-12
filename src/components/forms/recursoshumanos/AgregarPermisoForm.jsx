import React, { Component } from 'react'
import { validateAlert } from '../../../functions/alert'
import { Form } from 'react-bootstrap'
import { Button, SelectSearch, RangeCalendar, InputGray, FileInput, SelectHorario } from '../../form-components'
class AgregarPermisosForm extends Component {
    state={
        auxName: ''
    }
    updateRangeCalendar = range => {
        const { startDate, endDate } = range
        const { onChange } = this.props
        onChange({ target: { value: startDate, name: 'fechaInicio' } })
        onChange({ target: { value: endDate, name: 'fechaFin' } })
    }
    updateEmpleado = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'empleado' } })
    }

    onChange = value => {
        const { onChange } = this.props
        // const { name, value } = e.target
        onChange({ target: { value: value, name: 'tipo' } })
        // form[name] = value
        // this.setState({ ...this.state, form })
        // console.log(form)
    }
    render() {
        const { onSubmit, onChange, deleteAdjunto, form, onChangeAdjunto, formeditado, options, disabledDates } = this.props
        return (
            <Form id="form-add-permisos"
            onSubmit={
                (e) => {
                    e.preventDefault();
                     validateAlert(onSubmit, e, 'form-add-permisos')
                    console.log(form)
                }
            }
            >
                <div className="form-group row form-group-marginless justify-content-between">
                    <div className="col-md-4 text-center align-self-center">
                        <div className="col-md-4 text-center">
                            <RangeCalendar
                                disabledDates={disabledDates}
                                onChange={this.updateRangeCalendar}
                                start={form.fechaInicio}
                                end={form.fechaFin} />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group row form-group-marginless">
                            <div className="col-md-12">
                                <InputGray
                                    withtaglabel={1}
                                    withicon={1}
                                    requirevalidation={1}
                                    withtextlabel={1} withplaceholder={1}
                                    name="tipo"
                                    formeditado={formeditado}
                                    value={form.tipo}
                                    onChange={onChange}
                                    placeholder="TIPO DE PERMISO"
                                    iconclass="far fa-file-alt icon-lg text-dark-50" messageinc="Incorrecto. ingresa el tipo de permiso"
                                />
                            </div>
                            <div className="col-md-12">
                                <SelectSearch
                                    options={options.empleados}
                                    placeholder="SELECCIONA EL EMPLEADO"
                                    name="empleado"
                                    value={form.empleado}
                                    onChange={this.updateEmpleado}
                                    iconclass={"fas fa-layer-group"}
                                    formeditado={formeditado}
                                    messageinc="Incorrecto. Selecciona el empleado"
                                />
                            </div>
                            <div className="col-md-12 ">
                                <InputGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1} withformgroup={0} requirevalidation={0}
                                    name='lider' iconclass="far fa-file-alt icon-lg text-dark-50" placeholder='LÍDER INMEDIATO' onChange={onChange}
                                    value={form.lider} messageinc="Incorrecto. Ingresa el líder inmediato" />
                            </div>
                            <div className="col-md-12 ">
                                <label className="col-form-label font-weight-bolder text-dark-60">Entrada tardía</label>
                                <div className="mb-3 row d-flex justify-content-center">
                                    <SelectHorario
                                        onChange={onChange}
                                        minuto={{ value: form.minuto_entrada, name: 'minuto_entrada' }}
                                        hora={{ value: form.hora_entrada, name: 'hora_entrada' }} allhours={true} width='w-60' />
                                </div>
                            </div>
                         
                            <div className="col-md-12 ">
                                <label className="col-form-label font-weight-bolder text-dark-60">Salida anticipada</label>
                                <div className="mb-3 row d-flex justify-content-center">
                                    <SelectHorario
                                        onChange={onChange}
                                        minuto={{ value: form.minuto_salida, name: 'minuto_salida' }}
                                        hora={{ value: form.hora_salida, name: 'hora_salida' }} allhours={true} width='w-60' />
                                </div>
                             
                         </div>     
                         {/* <div className="col-md-12 ">
                         <InputGray withtaglabel={1} withtextlabel={1} withzplaceholder={1} requirevalidation={0} as='textarea' rows='1'
                                    withformgroup={0} name='descripcion' placeholder='DESCRIPCIÓN' value={form.descripcion}
                                    onChange={onChange}
                                    withicon={0} customclass="px-2" />
                         </div> */}
                            
                        </div>
                        <div className="col-md-12 text-center mt-5 mb-10" >
                            <FileInput 
                                requirevalidation={0}
                                onChangeAdjunto={onChangeAdjunto}
                                placeholder={form['adjuntos']['adjuntos']['placeholder']}
                                value={form['adjuntos']['adjuntos']['value']}
                                name='adjuntoPermiso'
                                id='adjuntoPermiso'
                                accept='*/*'
                                files={form['adjuntos']['adjuntos']['files']}
                                deleteAdjunto={deleteAdjunto} multiple
                                classinput='file-input' iconclass='flaticon2-clip-symbol text-primary'
                                classbtn='btn btn-sm btn-light font-weight-bolder mb-0'
                                formeditado={formeditado}
                            />
                        </div>
                    </div>
                    <div className="card-footer col-md-12 py-3 pr-1">
                        <div className="row mx-0 ">
                            <div className="col-lg-12 text-right pr-0 pb-0">
                                <Button icon='' className="btn btn-primary mr-2"
                                    onClick={
                                        (e) => {
                                         e.preventDefault();
                                            validateAlert(onSubmit, e, 'form-add-permisos')
                                        }
                                    }
                                    text="ENVIAR" />
                            </div>
                        </div>
                    </div>
                </div>
            </Form>
        )
    }
}

export default AgregarPermisosForm
// accept='*/*'