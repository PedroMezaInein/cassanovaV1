import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import { Input, RangeCalendar, SelectSearch, Button, InputMoneySinText, SelectSearchSinText } from '../../form-components'
import { validateAlert } from '../../../functions/alert'
import { setMoneyTableForNominas } from '../../../functions/setters'
import { Card } from 'react-bootstrap'
import { ItemSlider } from '../../../components/singles';
class NominaAdminForm extends Component {

    // handleChangeDateInicio = date => {
    //     const { onChange } = this.props
    //     onChange({ target: { value: date, name: 'fechaInicio' } })
    // }
    // handleChangeDateFin = date => {
    //     const { onChange } = this.props
    //     onChange({ target: { value: date, name: 'fechaFin' } })
    // }

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
                                    messageinc="Incorrecto. Selecciona la empresa"
                                />
                            </div>
                            {/* <div className="col-md-3">
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
                            <div className="col-md-3">
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
                            </div> */}
                        </div>
                        {/* <div className="form-group row form-group-marginless d-flex justify-content-center">

                        </div> */}
                        <div className="separator separator-dashed mt-1 mb-2"></div>
                        <div className="form-group row form-group-marginless d-flex justify-content-center">
                            <div className="col-md-6 text-center">
                                <label className="col-form-label my-2 font-weight-bolder">Fecha de inicio - Fecha final</label><br />
                                <RangeCalendar
                                    onChange={onChangeRange}
                                    start={form.fechaInicio}
                                    end={form.fechaFin}
                                />
                            </div>
                            {
                                title !== 'Editar nómina administrativa' ?
                                    <>
                                        <div className="col-md-6 text-center">
                                            <label className="col-form-label my-2 font-weight-bolder">{form.adjuntos.adjunto.placeholder}</label>
                                            <ItemSlider
                                                items={form.adjuntos.adjunto.files}
                                                item='adjunto'
                                                handleChange={handleChange}
                                                multiple={true}
                                            />
                                        </div>
                                    </>
                                    : ''
                            }
                        </div>
                        <table className="table table-separate table-responsive-sm table_nominas_obras" id="tabla_obra">
                            <thead>
                                <tr>
                                    <th rowSpan="2"><div className="mt-2 pb-3">Empleado</div></th>
                                    <th className="pb-0 border-bottom-0">Nómina IMSS</th>
                                    <th className="pb-0 border-bottom-0">Restante Nómina</th>
                                    <th className="pb-0 border-bottom-0">Extras</th>
                                    <th className="pb-0 border-bottom-0">Total</th>
                                </tr>
                                <tr>
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
                                                <td>
                                                    <SelectSearchSinText
                                                        formeditado={formeditado}
                                                        options={options.usuarios}
                                                        placeholder="Selecciona el empleado"
                                                        name="usuario"
                                                        value={form['nominasAdmin'][key]['usuario']}
                                                        onChange={(value) => this.updateUsuario(value, key)}
                                                        customstyle={{ minWidth: "300px" }} />
                                                </td>
                                                <td>
                                                    <InputMoneySinText
                                                        requirevalidation={1}
                                                        formeditado={formeditado}
                                                        name="nominImss"
                                                        value={form['nominasAdmin'][key]['nominImss']}
                                                        onChange={e => onChangeNominasAdmin(key, e, 'nominImss')}
                                                        thousandseparator={true}
                                                        prefix={'$'}
                                                        customstyle={{ minWidth: "160px" }}
                                                    />
                                                </td>
                                                <td>
                                                    <InputMoneySinText
                                                        requirevalidation={1}
                                                        formeditado={formeditado}
                                                        name="restanteNomina"
                                                        value={form['nominasAdmin'][key]['restanteNomina']}
                                                        onChange={e => onChangeNominasAdmin(key, e, 'restanteNomina')}
                                                        thousandseparator={true}
                                                        prefix={'$'}
                                                        customstyle={{ minWidth: "160px" }}
                                                    />
                                                </td>
                                                <td>
                                                    <InputMoneySinText
                                                        requirevalidation={1}
                                                        formeditado={formeditado}
                                                        name="extras"
                                                        value={form['nominasAdmin'][key]['extras']}
                                                        onChange={e => onChangeNominasAdmin(key, e, 'extras')}
                                                        thousandseparator={true}
                                                        prefix={'$'}
                                                        customstyle={{ minWidth: "160px" }}
                                                    />
                                                </td>
                                                <td className="text-center">
                                                    <div className="font-size-lg font-weight-bolder">
                                                        {
                                                            setMoneyTableForNominas(this.getTotal(key))
                                                        }
                                                    </div>
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