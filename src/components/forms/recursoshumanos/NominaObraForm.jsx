import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import { Input, SelectSearch, Button, RangeCalendar, InputMoneySinText, SelectSearchSinText, InputNumberSinText } from '../../form-components'
import { validateAlert } from '../../../functions/alert'
import { setMoneyTableForNominas } from '../../../functions/setters'
import { Card } from 'react-bootstrap'
import { ItemSlider } from '../../../components/singles';
class NominaObraForm extends Component {

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

    updateProyecto = (value, key) => {
        const { onChangeNominasObra } = this.props
        onChangeNominasObra(key, { target: { value: value, name: 'proyecto' } }, 'proyecto')
    }

    updateUsuario = (value, key) => {
        const { onChangeNominasObra } = this.props
        onChangeNominasObra(key, { target: { value: value, name: 'usuario' } }, 'usuario')
    }

    getTotal(key) {
        const { form } = this.props

        let nominImss = form.nominasObra[key].nominImss === undefined ? 0 : form.nominasObra[key].nominImss
        let restanteNomina = form.nominasObra[key].restanteNomina === undefined ? 0 : form.nominasObra[key].restanteNomina
        let extras = form.nominasObra[key].extras === undefined ? 0 : form.nominasObra[key].extras
        return parseFloat(nominImss) + parseFloat(restanteNomina) + parseFloat(extras)
    }


    getTotalNominaImss(key) {
        const { form } = this.props
        var suma = 0
        form.nominasObra.forEach(element => {
            let aux = element[key] === undefined ? 0 : element[key]
            suma = suma + parseFloat(aux)
        })
        return suma
    }

    getTotalRestanteNomina(key) {
        const { form } = this.props
        var suma = 0
        form.nominasObra.forEach(element => {
            let aux = element[key] === undefined ? 0 : element[key]
            suma = suma + parseFloat(aux)
        })
        return suma
    }

    getTotalExtra(key) {
        const { form } = this.props
        var suma = 0
        form.nominasObra.forEach(element => {
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

        form.nominasObra.forEach(element => {
            sumaNomImss += element.nominImss === undefined ? 0 : parseFloat(element.nominImss);
            sumaRestanteNomina += element.restanteNomina === undefined ? 0 : parseFloat(element.restanteNomina);
            sumaExtras += element.extras === undefined ? 0 : parseFloat(element.extras);
        });
        return sumaNomImss + sumaRestanteNomina + sumaExtras
    }


    render() {
        const { options, addRowNominaObra, deleteRowNominaObra, onChangeNominasObra, onChange, form, onSubmit, formeditado, title, handleChange, onChangeRange} = this.props
        return (
            <Card className="card card-custom gutter-b example example-compact">
                <Card.Header>
                    <Card.Title>
                        <h3 className="card-label">{title}</h3>
                    </Card.Title>
                </Card.Header>
                <Form id="form-nominaobra"
                    onSubmit={
                        (e) => {
                            e.preventDefault();
                            validateAlert(onSubmit, e, 'form-nominaobra')
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
                                    messageinc="Incorrecto. Selecciona la empresa"
                                />
                            </div>
                        </div>
                        <div className="separator separator-dashed mt-1 mb-2"></div>
                        <div className="form-group row form-group-marginless d-flex justify-content-center">
                            <div className="col-md-6 text-center">
                                <label className="col-form-label my-2 font-weight-bolder">Fecha de inicio - Fecha final</label><br />
                                <RangeCalendar
                                    onChange={onChangeRange}
                                    start={form.fechaInicio}
                                    end={form.fechaFin}
                                    formeditado={formeditado}
                                />
                            </div>
                            {
                                title !== 'Editar nómina obra' ?
                                    <>
                                        <div className="col-md-4 text-center">
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
                        <table className="table table-separate table-responsive-xl table_nominas_obras pt-5" id="tabla_obra">
                            <thead>
                                <tr>
                                    <th rowSpan="2"><div className="mt-2 pb-3 font-size-sm">Empleado</div></th>
                                    <th rowSpan="2"><div className="mt-2 pb-3 font-size-sm">Proyecto</div></th>
                                    <th rowSpan="2"><div className="mt-2 pb-3 font-size-sm">Salario Hora</div></th>
                                    <th rowSpan="2"><div className="mt-2 pb-3 font-size-sm">Horas trabajadas</div></th>
                                    <th rowSpan="2"><div className="mt-2 pb-3 font-size-sm">Salario hora extra</div></th>
                                    <th rowSpan="2"><div className="mt-2 pb-3 font-size-sm">Horas Extras</div></th>
                                    <th className="pb-0 border-bottom-0 font-size-sm ">Nómina IMSS</th>
                                    <th className="pb-0 border-bottom-0 font-size-sm ">Restante Nómina</th>
                                    <th className="pb-0 border-bottom-0 font-size-sm ">Extras</th>
                                    <th className="pb-0 border-bottom-0 font-size-sm ">Total</th>
                                </tr>
                                <tr>
                                    <th className="pt-2"><div className="p-0 my-0 text-primary bg-primary-o-40 font-weight-bolder font-size-sm ">{setMoneyTableForNominas(this.getTotalNominaImss("nominImss"))}</div></th>
                                    <th className="pt-2"><div className="p-0 my-0 text-primary bg-primary-o-40 font-weight-bolder font-size-sm ">{setMoneyTableForNominas(this.getTotalRestanteNomina("restanteNomina"))}</div></th>
                                    <th className="pt-2"><div className="p-0 my-0 text-primary bg-primary-o-40 font-weight-bolder font-size-sm ">{setMoneyTableForNominas(this.getTotalExtra("extras"))}</div></th>
                                    <th className="pt-2"><div className="p-0 my-0 text-primary bg-primary-o-40 font-weight-bolder font-size-sm ">{setMoneyTableForNominas(this.getTotales())}</div></th>
                                </tr>
                            </thead>
                            <tbody>

                                {
                                    form.nominasObra.map((nominas, key) => {
                                        return (
                                            <tr key={key}>
                                                <td>
                                                    <SelectSearchSinText
                                                        identificador={"empleado"}
                                                        formeditado={formeditado}
                                                        options={options.usuarios}
                                                        placeholder="Selecciona el empleado"
                                                        name="usuario"
                                                        value={form['nominasObra'][key]['usuario']}
                                                        onChange={(value) => this.updateUsuario(value, key)}
                                                    />
                                                </td>
                                                <td>
                                                    <SelectSearchSinText
                                                        identificador={"proyecto"}
                                                        formeditado={formeditado}
                                                        options={options.proyectos}
                                                        placeholder="Selecciona el proyecto"
                                                        name="proyecto"
                                                        value={form['nominasObra'][key]['proyecto']}
                                                        onChange={(value) => this.updateProyecto(value, key)}
                                                    />
                                                </td>
                                                <td>
                                                    <InputMoneySinText
                                                        identificador={"salario_hr"}
                                                        requirevalidation={1}
                                                        formeditado={formeditado}
                                                        name="salario_hr"
                                                        value={form['nominasObra'][key]['salario_hr']}
                                                        onChange={e => onChangeNominasObra(key, e, 'salario_hr')}
                                                        thousandseparator={true}
                                                        prefix={'$'}
                                                    />
                                                </td>
                                                <td>
                                                    <InputNumberSinText
                                                        identificador={"hr_trabajadas"}
                                                        requirevalidation={1}
                                                        formeditado={formeditado}
                                                        name="hr_trabajadas"
                                                        value={form['nominasObra'][key]['hr_trabajadas']}
                                                        onChange={e => onChangeNominasObra(key, e, 'hr_trabajadas')}
                                                        thousandseparator={true}
                                                        typeformat="###########"
                                                    />
                                                </td>
                                                <td>
                                                    <InputMoneySinText
                                                        identificador={"salario_hr_extra"}
                                                        requirevalidation={1}
                                                        formeditado={formeditado}
                                                        name="salario_hr_extra"
                                                        value={form['nominasObra'][key]['salario_hr_extra']}
                                                        onChange={e => onChangeNominasObra(key, e, 'salario_hr_extra')}
                                                        thousandseparator={true}
                                                        prefix={'$'}
                                                    />
                                                </td>
                                                <td>
                                                    <InputNumberSinText
                                                        identificador={"hr_extra"}
                                                        requirevalidation={1}
                                                        formeditado={formeditado}
                                                        name="hr_extra"
                                                        value={form['nominasObra'][key]['hr_extra']}
                                                        onChange={e => onChangeNominasObra(key, e, 'hr_extra')}
                                                        thousandseparator={true}
                                                        typeformat="###########"
                                                    />
                                                </td>
                                                <td>
                                                    <InputMoneySinText
                                                        identificador={"nominImss"}
                                                        requirevalidation={1}
                                                        formeditado={formeditado}
                                                        name="nominImss"
                                                        value={form['nominasObra'][key]['nominImss']}
                                                        onChange={e => onChangeNominasObra(key, e, 'nominImss')}
                                                        thousandseparator={true}
                                                        prefix={'$'}
                                                    />
                                                </td>
                                                <td>
                                                    <InputMoneySinText
                                                        identificador={"restanteNomina"}
                                                        requirevalidation={1}
                                                        formeditado={formeditado}
                                                        name="restanteNomina"
                                                        value={form['nominasObra'][key]['restanteNomina']}
                                                        onChange={e => onChangeNominasObra(key, e, 'restanteNomina')}
                                                        thousandseparator={true}
                                                        prefix={'$'}
                                                    />
                                                </td>
                                                <td>
                                                    <InputMoneySinText
                                                        identificador={"extras"}
                                                        requirevalidation={1}
                                                        formeditado={formeditado}
                                                        name="extras"
                                                        value={form['nominasObra'][key]['extras']}
                                                        onChange={e => onChangeNominasObra(key, e, 'extras')}
                                                        thousandseparator={true}
                                                        prefix={'$'}
                                                    />
                                                </td>
                                                <td className="text-center">
                                                    <div id="total" className="font-size-lg font-weight-bolder">
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
                            <button type="button" className="btn btn-light-primary font-weight-bold mr-2" onClick={addRowNominaObra} >Agregar Fila</button>
                            <button type="button" className="btn btn-light-danger font-weight-bold mr-2" onClick={deleteRowNominaObra} >Eliminar Fila</button>
                        </div>
                    </Card.Body>
                    <Card.Footer>
                        <div className="row">
                            <div className="col-lg-12 text-right">
                                <Button text='ENVIAR' type='submit' className="btn btn-primary mr-2" icon=''/>
                            </div>
                        </div>
                    </Card.Footer>
                </Form>
            </Card>
        )
    }
}

export default NominaObraForm