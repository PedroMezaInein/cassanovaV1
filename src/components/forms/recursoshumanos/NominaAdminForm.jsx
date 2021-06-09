import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import { Button, SelectSearchGray, InputMoneyGray, FileInput } from '../../form-components'
import { validateAlert } from '../../../functions/alert'
import { setMoneyTableForNominas } from '../../../functions/setters'
import { Card } from 'react-bootstrap'
import 'perfect-scrollbar-react/dist/style.min.css';
class NominaAdminForm extends Component {
    state = {
        formeditado: 0
    }
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
        if (form.nominasAdmin[key].usuario === '')
            return options.usuarios
        let aux = usuarios.find((element) => {
            return element.id.toString() === form.nominasAdmin[key].usuario
        })
        options.usuarios.forEach((element) => {
            array.push(element)
        })
        if (aux)
            array.push({ 'label': aux.nombre, 'name': aux.nombre, 'value': aux.id.toString() })
        return array
    }
    getMeses = () => {
        return [
            { name: 'Enero', value: '01' },
            { name: 'Febrero', value: '02' },
            { name: 'Marzo', value: '03' },
            { name: 'Abril', value: '04' },
            { name: 'Mayo', value: '05' },
            { name: 'Junio', value: '06' },
            { name: 'Julio', value: '07' },
            { name: 'Agosto', value: '08' },
            { name: 'Septiembre', value: '09' },
            { name: 'Octubre', value: '10' },
            { name: 'Noviembre', value: '11' },
            { name: 'Diciembre', value: '12' }
        ]
    }
    getAños = () => {
        var fecha = new Date().getFullYear()
        var arreglo = [];
        for (let i = 0; i < 10; i++)
            arreglo.push(
                {
                    name: fecha - i,
                    value: fecha - i
                }
            );
        return arreglo
    }
    getQuincena = () => {
        return [
            { name: 'Quincena 1', value: '1Q' },
            { name: 'Quincena 2', value: '2Q' }
        ]
    }
    updateMes = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'mes' } })
    }

    updateAño = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'año' } })
    }
    updateQuincena = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'quincena' } })
    }
    render() {
        const { options, addRowNominaAdmin, deleteRowNominaAdmin, onChangeNominasAdmin, form, onSubmit, formeditado, title, action, clearFiles, onChangeAdjunto } = this.props
        return (
            <Form id="form-nominaadmin"
                onSubmit={
                    (e) => {
                        e.preventDefault();
                        validateAlert(onSubmit, e, 'form-nominaadmin')
                    }
                }
            >
                <Card className="card card-custom gutter-b example example-compact">
                    <Card.Header>
                        <Card.Title>
                            <h3 className="card-label">{title}</h3>
                        </Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <div>
                            <div className="row form-group-marginless mx-0">
                                <div className="col-md-3">
                                    <SelectSearchGray formeditado={formeditado} options={options.empresas} placeholder="SELECCIONA LA EMPRESA"
                                        name="empresa" value={form.empresa} onChange={this.updateEmpresa} withtaglabel={1} withtextlabel={1}
                                        messageinc="Selecciona la empresa" withicon={1} customdiv="mb-0" />
                                </div>
                                <div className="col-md-3">
                                    <SelectSearchGray withtaglabel={1} withtextlabel={1} name='quincena' options={this.getQuincena()}
                                        placeholder='SELECCIONA LA QUINCENA' value={form.quincena} onChange={this.updateQuincena}
                                        iconclass="fas fa-calendar-day" messageinc="Selecciona el quincena." withicon={1} customdiv="mb-0"/>
                                </div>
                                <div className="col-md-3">
                                    <SelectSearchGray withtaglabel={1} withtextlabel={1} name='mes' options={this.getMeses()}
                                        placeholder='SELECCIONA EL MES' value={form.mes} onChange={this.updateMes}
                                        iconclass="fas fa-calendar-day" messageinc="Selecciona el mes." withicon={1} customdiv="mb-0"/>
                                </div>
                                <div className="col-md-3">
                                    <SelectSearchGray withtaglabel={1} withtextlabel={1} name='año' options={this.getAños()}
                                        placeholder='SELECCIONA EL AÑO' value={form.año} onChange={this.updateAño}
                                        iconclass="fas fa-calendar-day" messageinc="Selecciona el año." withicon={1} customdiv="mb-0"/>
                                </div>
                            </div>
                            <div className="separator separator-dashed mt-10 mb-2"></div>
                            {
                                action !== 'edit' &&
                                <>
                                    <div className="align-self-center col-md-12 mt-8">
                                        <div className="row form-group-marginless mx-0">
                                            <div className="col-md-12 text-center align-self-center">
                                                {/* <label className="col-form-label my-2 font-weight-bold text-dark-60">{form.adjuntos.adjunto.placeholder}</label>
                                                <ItemSlider items={form.adjuntos.adjunto.files} item='adjunto' handleChange={handleChange} multiple={true} /> */}
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
                                                    classbtn='btn btn-default btn-hover-icon-success font-weight-bolder btn-hover-bg-light text-hover-success text-dark-50 mb-0'
                                                    iconclass='flaticon2-clip-symbol text-primary'
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="separator separator-dashed mt-10 mb-2"></div>
                                </>
                            }

                            <table className="table table-separate table-responsive-sm table_nominas_obras" id="tabla_obra">
                                <thead>
                                    <tr>
                                        <th className='border-bottom-0'></th>
                                        <th rowSpan="3"><div className="mt-2 pb-3">Empleado</div></th>
                                        <th className="pb-0 border-bottom-0 text-center">Nómina IMSS</th>
                                        <th className="pb-0 border-bottom-0 text-center">Restante Nómina</th>
                                        <th className="pb-0 border-bottom-0 text-center">Extras</th>
                                        <th className="pb-0 border-bottom-0 text-center">Total</th>
                                    </tr>
                                    <tr>
                                        <th className='border-bottom-0'></th>
                                        {
                                            this.getTotalNominaImss("nominImss") > 0 ?
                                                <th className="py-2 border-bottom-0">
                                                    <div className="py-1 my-0 font-weight-bolder">
                                                        <SelectSearchGray formeditado={formeditado} options={options.cuentas} name="cuentaImss"
                                                            placeholder="SELECCIONA LA CUENTA" value={form.cuentaImss} messageinc="SELECCIONA LA CUENTA"
                                                            onChange={(value) => { this.updateCuenta(value, 'cuentaImss') }} withtaglabel={0} withtextlabel={0}
                                                            withicon={0} customclass="form-control-sm text-center" customdiv="mb-0" iconvalid={1}
                                                        />
                                                    </div>
                                                </th>
                                                : <th className="border-bottom-0"></th>
                                        }
                                        {
                                            this.getTotalExtra("restanteNomina") > 0 ?
                                                <th className="py-2 border-bottom-0">
                                                    <div className="py-1 my-0 font-weight-bolder">
                                                        <SelectSearchGray formeditado={formeditado} options={options.cuentas} name="cuentaRestante"
                                                            placeholder="SELECCIONA LA CUENTA" value={form.cuentaRestante} messageinc="SELECCIONA LA CUENTA"
                                                            onChange={(value) => { this.updateCuenta(value, 'cuentaRestante') }} withtaglabel={0} withtextlabel={0}
                                                            withicon={0} customclass="form-control-sm text-center" customdiv="mb-0" iconvalid={1} />
                                                    </div>
                                                </th>
                                                : <th className="border-bottom-0"></th>
                                        }
                                        {
                                            this.getTotalExtra("extras") > 0 ?
                                                <th className="py-2 border-bottom-0">
                                                    <div className="py-1 my-0 font-weight-bolder">
                                                        <SelectSearchGray formeditado={formeditado} options={options.cuentas} name="cuentaExtras"
                                                            placeholder="SELECCIONA LA CUENTA" value={form.cuentaExtras} messageinc="SELECCIONA LA CUENTA"
                                                            onChange={(value) => { this.updateCuenta(value, 'cuentaExtras') }} withtaglabel={0} withtextlabel={0}
                                                            withicon={0} customclass="form-control-sm text-center" customdiv="mb-0" iconvalid={1} />
                                                    </div>
                                                </th>
                                                : <th className="border-bottom-0"></th>
                                        }
                                        <th className="border-bottom-0"></th>
                                    </tr>
                                    <tr>
                                        <th className=''></th>
                                        <th className="pt-2"><div className="p-1 my-0 text-primary bg-primary-o-40 font-weight-bolder text-center">{setMoneyTableForNominas(this.getTotalNominaImss("nominImss"))}</div></th>
                                        <th className="pt-2"><div className="p-1 my-0 text-primary bg-primary-o-40 font-weight-bolder text-center">{setMoneyTableForNominas(this.getTotalRestanteNomina("restanteNomina"))}</div></th>
                                        <th className="pt-2"><div className="p-1 my-0 text-primary bg-primary-o-40 font-weight-bolder text-center">{setMoneyTableForNominas(this.getTotalExtra("extras"))}</div></th>
                                        <th className="pt-2"><div className="p-1 my-0 text-primary bg-primary-o-40 font-weight-bolder text-center">{setMoneyTableForNominas(this.getTotales())}</div></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* { console.log( 'FORM NOMINAS ADMIN', form.nominasAdmin ) } */}
                                    {
                                        form.nominasAdmin.map((nominaAdmin, key) => {
                                            return (
                                                <tr key={key}>
                                                    <td className='text-center' style={{ minWidth: "60px" }}>
                                                        <Button icon='' onClick={() => { deleteRowNominaAdmin(nominaAdmin, key) }}
                                                            className="btn btn-sm btn-icon btn-bg-white btn-icon-danger btn-hover-danger" only_icon="far fa-trash-alt icon-md text-danger" />
                                                    </td>
                                                    <td>
                                                        <SelectSearchGray formeditado={formeditado} options={this.setOptions(key)} placeholder="SELECCIONA EL EMPLEADO"
                                                            name="usuario" value={nominaAdmin.usuario} onChange={(value) => this.updateUsuario(value, key)}
                                                            customstyle={{ minWidth: "300px" }} withtaglabel={0} withtextlabel={0} withicon={0}
                                                            customclass={`form-control-sm text-center ${action === 'edit' ? 'pointer-events-none' : ''}`} customdiv="mb-0" iconvalid={1} />
                                                    </td>
                                                    <td>
                                                        <InputMoneyGray withtaglabel={0} withtextlabel={0} withplaceholder={1} withicon={0}
                                                            withformgroup={0} customclass={`form-control-sm text-center ${action === 'edit' ? 'pointer-events-none' : ''}`}
                                                            requirevalidation={1} formeditado={1} name="nominImss" thousandseparator={true}
                                                            value={nominaAdmin.nominImss} onChange={e => onChangeNominasAdmin(key, e, 'nominImss')}
                                                            prefix='$' customstyle={{ minWidth: "160px" }} classlabel="font-size-sm" iconvalid={1} />
                                                    </td>
                                                    <td>
                                                        <InputMoneyGray withtaglabel={0} withtextlabel={0} withplaceholder={1} withicon={0}
                                                            withformgroup={0} customclass={`form-control-sm text-center ${action === 'edit' ? 'pointer-events-none' : ''}`}
                                                            requirevalidation={1} formeditado={1} name="restanteNomina"
                                                            value={nominaAdmin.restanteNomina} onChange={e => onChangeNominasAdmin(key, e, 'restanteNomina')}
                                                            thousandseparator={true} prefix='$' customstyle={{ minWidth: "160px" }} classlabel="font-size-sm" iconvalid={1} />
                                                    </td>
                                                    <td>
                                                        <InputMoneyGray withtaglabel={0} withtextlabel={0} withplaceholder={1} withicon={0}
                                                            withformgroup={0} customclass={`form-control-sm text-center ${action === 'edit' ? 'pointer-events-none' : ''}`}
                                                            requirevalidation={1} formeditado={1} name="extras" thousandseparator={true}
                                                            value={nominaAdmin.extras} onChange={e => onChangeNominasAdmin(key, e, 'extras')}
                                                            prefix='$' customstyle={{ minWidth: "160px" }} classlabel="font-size-sm" iconvalid={1} />
                                                    </td>
                                                    <td className="text-center">
                                                        <div className="font-size-lg font-weight-bolder"> {setMoneyTableForNominas(this.getTotal(key))} </div>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                            {
                                options.usuarios.length > 0 &&
                                <div className="d-flex justify-content-center">
                                    <button type="button" className="btn btn-light-primary font-weight-bolder mr-2" onClick={addRowNominaAdmin}>AGREGAR FILA</button>
                                </div>
                            }
                        </div>
                    </Card.Body>
                    {
                        form.periodo !== '' && form.empresa !== '' ? <Card.Footer>
                            <div className="row">
                                <div className="col-lg-12 text-right">
                                    <Button icon='' text='ENVIAR' type='submit' className="btn btn-primary mr-2" />
                                </div>
                            </div>
                        </Card.Footer> : ''

                    }
                </Card>
            </Form>
        )
    }
}

export default NominaAdminForm