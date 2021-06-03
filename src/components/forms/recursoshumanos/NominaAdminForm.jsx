import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import { Input, RangeCalendar, SelectSearch, Button, InputMoneySinText, SelectSearchSinText } from '../../form-components'
import { validateAlert } from '../../../functions/alert'
import { setMoneyTableForNominas } from '../../../functions/setters'
import { Card } from 'react-bootstrap'
import { ItemSlider } from '../../../components/singles';
class NominaAdminForm extends Component {

    updateEmpresa = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'empresa' } })
    }

    updateUsuario = (value, key) => {
        const { onChangeNominasAdmin } = this.props
        onChangeNominasAdmin(key, { target: { value: value, name: 'usuario' } }, 'usuario')
    }

    getTotal(key) {
        const { form } = this.props
        let nominImss = form.nominasAdmin[key].nominImss === undefined ? 0 : form.nominasAdmin[key].nominImss
        let restanteNomina = form.nominasAdmin[key].restanteNomina === undefined ? 0 : form.nominasAdmin[key].restanteNomina
        let extras = form.nominasAdmin[key].extras === undefined ? 0 : form.nominasAdmin[key].extras
        return parseFloat(nominImss) + parseFloat(restanteNomina) + parseFloat(extras)
    }

    getTotalNominaImss(key) {
        const { form } = this.props
        var suma = 0
        form.nominasAdmin.forEach(element => {
            let aux = element[key] === undefined ? 0 : element[key]
            suma = suma + parseFloat(aux)
        })
        return suma
    }

    getTotalRestanteNomina(key) {
        const { form } = this.props
        var suma = 0
        form.nominasAdmin.forEach(element => {
            let aux = element[key] === undefined ? 0 : element[key]
            suma = suma + parseFloat(aux)
        })
        return suma
    }

    getTotalExtra(key) {
        const { form } = this.props
        var suma = 0
        form.nominasAdmin.forEach(element => {
            let aux = element[key] === undefined ? 0 : element[key]
            suma = suma + parseFloat(aux)
        })
        return suma
    }

    getTotales() {
        const { form } = this.props

        let sumaNomImss = 0;
        let sumaRestanteNomina = 0;
        let sumaExtras = 0;

        form.nominasAdmin.forEach(element => {
            sumaNomImss += element.nominImss === undefined ? 0 : parseFloat(element.nominImss);
            sumaRestanteNomina += element.restanteNomina === undefined ? 0 : parseFloat(element.restanteNomina);
            sumaExtras += element.extras === undefined ? 0 : parseFloat(element.extras);
        });
        return sumaNomImss + sumaRestanteNomina + sumaExtras
    }

    updateCuenta = (value, name) => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: name } })
    }

    setOptions = key => {
        const { options, form, usuarios } = this.props
        let array = []
        if(form.nominasAdmin[key].usuario === '')
            return options.usuarios
        let aux = usuarios.find((element) => {
            return element.id.toString() === form.nominasAdmin[key].usuario
        })
        options.usuarios.forEach((element) => {
            array.push(element)
        })
        if(aux)
            array.push({'label': aux.nombre, 'name': aux.nombre, 'value': aux.id.toString()})
        return array
    }
    
    render() {
        const { options, addRowNominaAdmin, deleteRowNominaAdmin, onChangeNominasAdmin, onChange, form, onSubmit, formeditado, title, handleChange, onChangeRange } = this.props

        return (
            <Card className="card card-custom gutter-b example example-compact">
                <Card.Header>
                    <Card.Title>
                        <h3 className="card-label">{title}</h3>
                    </Card.Title>
                </Card.Header>
                <Form id="form-nominaadmin"
                    onSubmit={
                        (e) => {
                            e.preventDefault();
                            validateAlert(onSubmit, e, 'form-nominaadmin')
                        }
                    }
                >
                    <Card.Body>
                        <div className="form-group row form-group-marginless">
                            <div className="col-md-6">
                                <Input requirevalidation = { 1 } formeditado = { formeditado } name = "periodo" value = { form.periodo }
                                    placeholder = "PERIODO DE NÓMINA ADMINISTRATIVA" onChange = { onChange } iconclass = "far fa-window-maximize"
                                    messageinc = "Incorrecto. Ingresa el periodo de nómina Administrativa." />
                            </div>
                            <div className="col-md-6">
                                <SelectSearch formeditado = { formeditado } options = { options.empresas } placeholder = "Selecciona la empresa"
                                    name = "empresa" value = { form.empresa }  onChange = { this.updateEmpresa } 
                                    messageinc = "Incorrecto. Selecciona la empresa" />
                            </div>
                        </div>
                        <div className="separator separator-dashed mt-1 mb-2" />
                        <div className="form-group row form-group-marginless d-flex justify-content-center">
                            <div className="col-md-6 text-center">
                                <label className="col-form-label my-2 font-weight-bolder">Fecha de inicio - Fecha final</label><br />
                                <RangeCalendar onChange = { onChangeRange } start = { form.fechaInicio } end = { form.fechaFin } />
                            </div>
                            {
                                title !== 'Editar nómina administrativa' ?
                                    <div className="col-md-6 text-center">
                                        <label className="col-form-label my-2 font-weight-bolder">{form.adjuntos.adjunto.placeholder}</label>
                                        <ItemSlider items = { form.adjuntos.adjunto.files } item = 'adjunto' handleChange = { handleChange }
                                            multiple = { true } />
                                    </div>
                                : ''
                            }
                        </div>
                        <table className="table table-separate table-responsive-sm table_nominas_obras" id="tabla_obra">
                            <thead>
                                <tr>
                                    <th className = 'border-bottom-0'></th>
                                    <th rowSpan="3"><div className="mt-2 pb-3">Empleado</div></th>
                                    <th className="pb-0 border-bottom-0">Nómina IMSS</th>
                                    <th className="pb-0 border-bottom-0">Restante Nómina</th>
                                    <th className="pb-0 border-bottom-0">Extras</th>
                                    <th className="pb-0 border-bottom-0">Total</th>
                                </tr>
                                <tr>
                                    <th className = 'border-bottom-0'></th>
                                    {
                                        this.getTotalNominaImss("nominImss") > 0 ?
                                            <th className="py-2 border-bottom-0">
                                                <div className="py-1 my-0 font-weight-bolder">
                                                    <SelectSearchSinText formeditado = { formeditado } options = { options.cuentas } name = "cuentaImss"
                                                        placeholder = "Selecciona la cuenta" value = { form.cuentaImss } messageinc = "Incorrecto. Selecciona la cuenta"
                                                        onChange = { (value) => { this.updateCuenta(value, 'cuentaImss') } } />
                                                </div>
                                            </th>
                                        : <th className="border-bottom-0"></th>    
                                    }
                                    {
                                        this.getTotalExtra("restanteNomina") > 0 ?
                                            <th className="py-2 border-bottom-0">
                                                <div className="py-1 my-0 font-weight-bolder">
                                                    <SelectSearchSinText formeditado = { formeditado } options = { options.cuentas } name = "cuentaRestante"
                                                        placeholder = "Selecciona la cuenta" value = { form.cuentaRestante } messageinc = "Incorrecto. Selecciona la cuenta"
                                                        onChange = { (value) => { this.updateCuenta(value, 'cuentaRestante') } } />
                                                </div>
                                            </th>
                                        : <th className="border-bottom-0"></th>
                                    }
                                    {
                                        this.getTotalExtra("extras") > 0 ?
                                            <th className="py-2 border-bottom-0">
                                                <div className="py-1 my-0 font-weight-bolder">
                                                    <SelectSearchSinText formeditado = { formeditado } options = { options.cuentas } name = "cuentaExtras"
                                                        placeholder = "Selecciona la cuenta" value = { form.cuentaExtras } messageinc = "Incorrecto. Selecciona la cuenta"
                                                        onChange = { (value) => { this.updateCuenta(value, 'cuentaExtras') } } />
                                                </div>
                                            </th>
                                        : <th className="border-bottom-0"></th>
                                    }
                                    <th className="border-bottom-0"></th>
                                </tr>
                                <tr>
                                    <th className = ''></th>
                                    <th className="pt-2"><div className="p-0 my-0 text-primary bg-primary-o-40 font-weight-bolder">{setMoneyTableForNominas(this.getTotalNominaImss("nominImss"))}</div></th>
                                    <th className="pt-2"><div className="p-0 my-0 text-primary bg-primary-o-40 font-weight-bolder">{setMoneyTableForNominas(this.getTotalRestanteNomina("restanteNomina"))}</div></th>
                                    <th className="pt-2"><div className="p-0 my-0 text-primary bg-primary-o-40 font-weight-bolder">{setMoneyTableForNominas(this.getTotalExtra("extras"))}</div></th>
                                    <th className="pt-2"><div className="p-0 my-0 text-primary bg-primary-o-40 font-weight-bolder">{setMoneyTableForNominas(this.getTotales())}</div></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    form.nominasAdmin.map((nominaAdmin, key) => {
                                        return (
                                            <tr key={key}>
                                                <td className = 'text-center'>
                                                    <Button icon = '' onClick = { () => { deleteRowNominaAdmin(nominaAdmin, key) } } tooltip = { { text: 'ELIMINAR' } }
                                                        className = "btn btn-icon btn-light-danger btn-sm pulse pulse-danger" only_icon = "flaticon2-cross icon-sm" />
                                                </td>
                                                <td>
                                                    <SelectSearchSinText formeditado = { formeditado } options = { this.setOptions(key) } placeholder = "Selecciona el empleado"
                                                        name = "usuario" value = { nominaAdmin.usuario } onChange = { (value) => this.updateUsuario(value, key) }
                                                        customstyle={{ minWidth: "300px" }} />
                                                </td>
                                                <td>
                                                    <InputMoneySinText requirevalidation = { 1 } formeditado = { 1 } name = "nominImss" thousandseparator = { true }
                                                        value = { nominaAdmin.nominImss } onChange = { e => onChangeNominasAdmin(key, e, 'nominImss') }
                                                        prefix = '$' customstyle = { { minWidth: "160px" } } />
                                                </td>
                                                <td>
                                                    <InputMoneySinText requirevalidation = { 1 }  formeditado = { 1 } name = "restanteNomina"
                                                        value = { nominaAdmin.restanteNomina } onChange = { e => onChangeNominasAdmin(key, e, 'restanteNomina') }
                                                        thousandseparator = { true } prefix = '$' customstyle = { { minWidth: "160px" } } />
                                                </td>
                                                <td>
                                                    <InputMoneySinText requirevalidation = { 1 } formeditado = { 1 } name = "extras" thousandseparator = { true }
                                                        value = { nominaAdmin.extras } onChange = { e => onChangeNominasAdmin(key, e, 'extras') }
                                                        prefix = '$' customstyle = { { minWidth: "160px" } } />
                                                </td>
                                                <td className="text-center">
                                                    <div className="font-size-lg font-weight-bolder"> { setMoneyTableForNominas(this.getTotal(key)) } </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                        <div className="form-group d-flex justify-content-center">
                            <button type="button" className="btn btn-light-primary font-weight-bold mr-2" onClick={addRowNominaAdmin} >Agregar Fila</button>
                            {/* <button type="button" className="btn btn-light-danger font-weight-bold mr-2" onClick={deleteRowNominaAdmin} >Eliminar Fila</button> */}
                        </div>

                    </Card.Body>
                    <Card.Footer>
                        <div className="row">
                            <div className="col-lg-12 text-right">
                                <Button icon='' text='ENVIAR' type='submit' className="btn btn-primary mr-2" />
                            </div>
                        </div>
                    </Card.Footer>
                </Form>
            </Card>
        )
    }
}

export default NominaAdminForm