import React, { Component } from 'react'
import { Card, Form } from 'react-bootstrap'
import 'perfect-scrollbar-react/dist/style.min.css'
import { validateAlert } from '../../../functions/alert'
import { setMoneyTableForNominas } from '../../../functions/setters'
import { Button, SelectSearchGray, InputMoneyGray, FileInput } from '../../form-components'

class PagoImpuestosForm extends Component {
    updateEmpresa = value => {
        const { onChangeAdmin } = this.props
        onChangeAdmin({ target: { value: value, name: 'empresa' } })
    }
    updateUsuario = (value, key) => {
        const { onChangePagoImpuestosAdmin } = this.props
        onChangePagoImpuestosAdmin(key, { target: { value: value, name: 'usuario' } }, 'usuario')
    }
    getTotal(key) {
        const { form } = this.props
        let imss = form.pagoImpuestos[key].imss === undefined ? 0 : form.pagoImpuestos[key].imss
        let rcv = form.pagoImpuestos[key].rcv === undefined ? 0 : form.pagoImpuestos[key].rcv
        let infonavit = form.pagoImpuestos[key].infonavit === undefined ? 0 : form.pagoImpuestos[key].infonavit
        let isn = form.pagoImpuestos[key].isn === undefined ? 0 : form.pagoImpuestos[key].isn
        return parseFloat(imss) + parseFloat(rcv) + parseFloat(infonavit) + parseFloat(isn)
    }
    getTotalPagoImpuestos(key) {
        const { form } = this.props
        var suma = 0
        form.pagoImpuestos.forEach(element => {
            let aux = element[key] === undefined ? 0 : element[key]
            suma = suma + parseFloat(aux)
        })
        return suma
    }
    getTotales() {
        const { form } = this.props

        let sumaImss = 0;
        let sumaRsv = 0;
        let sumaInfonavit = 0;
        let sumaExtras = 0;

        form.pagoImpuestos.forEach(element => {
            sumaImss += element.imss === undefined ? 0 : parseFloat(element.imss);
            sumaRsv += element.rcv === undefined ? 0 : parseFloat(element.rcv);
            sumaInfonavit += element.infonavit === undefined ? 0 : parseFloat(element.infonavit);
            sumaExtras += element.isn === undefined ? 0 : parseFloat(element.isn);
        });
        return sumaImss + sumaRsv + sumaInfonavit + sumaExtras
    }
    updateCuenta = (value, name) => {
        const { onChangeAdmin } = this.props
        onChangeAdmin({ target: { value: value, name: name } })
    }
    setOptions = key => {
        const { options, form, usuarios } = this.props
        let array = []
        if (form.pagoImpuestos[key].usuario === '')
            return options.usuarios
        let aux = usuarios.find((element) => {
            return element.id.toString() === form.pagoImpuestos[key].usuario
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
    updateMes = value => {
        const { onChangeAdmin } = this.props
        onChangeAdmin({ target: { value: value, name: 'mes' } })
    }
    updateAño = value => {
        const { onChangeAdmin } = this.props
        onChangeAdmin({ target: { value: value, name: 'año' } })
    }
    render() {
        const { options, addRowPagoImpuestoAdmin, deleteRowPagoImpuestoAdmin, onChangePagoImpuestosAdmin, form, onSubmit, formeditado, title, action, clearFilesPagoImpuestoAdmin, onChangeAdjunto } = this.props
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
                                <div className="col-md-4">
                                    <SelectSearchGray formeditado={formeditado} options={options.empresas} placeholder="SELECCIONA LA EMPRESA"
                                        name="empresa" value={form.empresa} onChange={this.updateEmpresa} withtaglabel={1} withtextlabel={1}
                                        messageinc="Selecciona la empresa" withicon={1} customdiv="mb-0" />
                                </div>
                                <div className="col-md-4">
                                    <SelectSearchGray withtaglabel={1} withtextlabel={1} name='mes' options={this.getMeses()}
                                        placeholder='SELECCIONA EL MES' value={form.mes} onChange={this.updateMes}
                                        iconclass="fas fa-calendar-day" messageinc="Selecciona el mes." withicon={1} customdiv="mb-0"/>
                                </div>
                                <div className="col-md-4">
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
                                                    deleteAdjunto={clearFilesPagoImpuestoAdmin}
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
                            <table className="table table-separate table-vertical-center">
                                <thead>
                                    <tr>
                                        <th className='border-bottom-0'></th>
                                        <th rowSpan="3"><div className="mt-2 pb-3">COLABORADOR</div></th>
                                        <th className="pb-0 border-bottom-0 text-center">IMSS</th>
                                        <th className="pb-0 border-bottom-0 text-center">RCV</th>
                                        <th className="pb-0 border-bottom-0 text-center">INFONAVIT</th>
                                        <th className="pb-0 border-bottom-0 text-center">ISN</th>
                                        <th className="pb-0 border-bottom-0 text-center">Total</th>
                                    </tr>
                                    <tr>
                                        <th className='border-bottom-0'></th>
                                        {
                                            this.getTotalPagoImpuestos("imss") > 0 ?
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
                                            this.getTotalPagoImpuestos("rcv") > 0 ?
                                                <th className="py-2 border-bottom-0">
                                                    <div className="py-1 my-0 font-weight-bolder">
                                                        <SelectSearchGray formeditado={formeditado} options={options.cuentas} name="cuentaRcv"
                                                            placeholder="SELECCIONA LA CUENTA" value={form.cuentaRcv} messageinc="SELECCIONA LA CUENTA"
                                                            onChange={(value) => { this.updateCuenta(value, 'cuentaRcv') }} withtaglabel={0} withtextlabel={0}
                                                            withicon={0} customclass="form-control-sm text-center" customdiv="mb-0" iconvalid={1} />
                                                    </div>
                                                </th>
                                                : <th className="border-bottom-0"></th>
                                        }
                                        {
                                            this.getTotalPagoImpuestos("infonavit") > 0 ?
                                                <th className="py-2 border-bottom-0">
                                                    <div className="py-1 my-0 font-weight-bolder">
                                                        <SelectSearchGray formeditado={formeditado} options={options.cuentas} name="cuentaInfonavit"
                                                            placeholder="SELECCIONA LA CUENTA" value={form.cuentaInfonavit} messageinc="SELECCIONA LA CUENTA"
                                                            onChange={(value) => { this.updateCuenta(value, 'cuentaInfonavit') }} withtaglabel={0} withtextlabel={0}
                                                            withicon={0} customclass="form-control-sm text-center" customdiv="mb-0" iconvalid={1} />
                                                    </div>
                                                </th>
                                                : <th className="border-bottom-0"></th>
                                        }
                                        {
                                            this.getTotalPagoImpuestos("isn") > 0 ?
                                                <th className="py-2 border-bottom-0">
                                                    <div className="py-1 my-0 font-weight-bolder">
                                                        <SelectSearchGray formeditado={formeditado} options={options.cuentas} name="cuentaIsn"
                                                            placeholder="SELECCIONA LA CUENTA" value={form.cuentaIsn} messageinc="SELECCIONA LA CUENTA"
                                                            onChange={(value) => { this.updateCuenta(value, 'cuentaIsn') }} withtaglabel={0} withtextlabel={0}
                                                            withicon={0} customclass="form-control-sm text-center" customdiv="mb-0" iconvalid={1} />
                                                    </div>
                                                </th>
                                                : <th className="border-bottom-0"></th>
                                        }
                                        <th className="border-bottom-0"></th>
                                    </tr>
                                    <tr>
                                        <th className=''></th>
                                        <th className="pt-2"><div className="p-1 my-0 text-primary bg-primary-o-40 font-weight-bolder text-center">{setMoneyTableForNominas(this.getTotalPagoImpuestos("imss"))}</div></th>
                                        <th className="pt-2"><div className="p-1 my-0 text-primary bg-primary-o-40 font-weight-bolder text-center">{setMoneyTableForNominas(this.getTotalPagoImpuestos("rcv"))}</div></th>
                                        <th className="pt-2"><div className="p-1 my-0 text-primary bg-primary-o-40 font-weight-bolder text-center">{setMoneyTableForNominas(this.getTotalPagoImpuestos("infonavit"))}</div></th>
                                        <th className="pt-2"><div className="p-1 my-0 text-primary bg-primary-o-40 font-weight-bolder text-center">{setMoneyTableForNominas(this.getTotalPagoImpuestos("isn"))}</div></th>
                                        <th className="pt-2"><div className="p-1 my-0 text-primary bg-primary-o-40 font-weight-bolder text-center">{setMoneyTableForNominas(this.getTotales())}</div></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        form.pagoImpuestos.map((pagoImpuesto, key) => {
                                            return (
                                                <tr key={key}>
                                                    <td className='text-center' style={{ minWidth: "60px" }}>
                                                        <Button icon='' onClick={() => { deleteRowPagoImpuestoAdmin(pagoImpuesto, key) }}
                                                            className="btn btn-sm btn-icon btn-bg-white btn-icon-danger btn-hover-danger" only_icon="far fa-trash-alt icon-md text-danger" />
                                                    </td>
                                                    <td>
                                                        <SelectSearchGray formeditado={formeditado} options={this.setOptions(key)} placeholder="SELECCIONA EL EMPLEADO"
                                                            name="usuario" value={pagoImpuesto.usuario} onChange={(value) => this.updateUsuario(value, key)}
                                                            customstyle={{ minWidth: "300px" }} withtaglabel={0} withtextlabel={0} withicon={0}
                                                            customclass={`form-control-sm text-center ${action === 'edit' ? 'pointer-events-none' : ''}`} customdiv="mb-0" iconvalid={1} />
                                                    </td>
                                                    <td>
                                                        <InputMoneyGray withtaglabel={0} withtextlabel={0} withplaceholder={1} withicon={0}
                                                            withformgroup={0} customclass={`form-control-sm text-center ${action === 'edit' ? 'pointer-events-none' : ''}`}
                                                            requirevalidation={1} formeditado={1} name="imss" thousandseparator={true}
                                                            value={pagoImpuesto.imss} onChange={e => onChangePagoImpuestosAdmin(key, e, 'imss')}
                                                            prefix='$' customstyle={{ minWidth: "120px" }} classlabel="font-size-sm" iconvalid={1} />
                                                    </td>
                                                    <td>
                                                        <InputMoneyGray withtaglabel={0} withtextlabel={0} withplaceholder={1} withicon={0}
                                                            withformgroup={0} customclass={`form-control-sm text-center ${action === 'edit' ? 'pointer-events-none' : ''}`}
                                                            requirevalidation={1} formeditado={1} name="rcv"
                                                            value={pagoImpuesto.rcv} onChange={e => onChangePagoImpuestosAdmin(key, e, 'rcv')}
                                                            thousandseparator={true} prefix='$' customstyle={{ minWidth: "120px" }} classlabel="font-size-sm" iconvalid={1} />
                                                    </td>
                                                    <td>
                                                        <InputMoneyGray withtaglabel={0} withtextlabel={0} withplaceholder={1} withicon={0}
                                                            withformgroup={0} customclass={`form-control-sm text-center ${action === 'edit' ? 'pointer-events-none' : ''}`}
                                                            requirevalidation={1} formeditado={1} name="infonavit"
                                                            value={pagoImpuesto.infonavit} onChange={e => onChangePagoImpuestosAdmin(key, e, 'infonavit')}
                                                            thousandseparator={true} prefix='$' customstyle={{ minWidth: "120px" }} classlabel="font-size-sm" iconvalid={1} />
                                                    </td>
                                                    <td>
                                                        <InputMoneyGray withtaglabel={0} withtextlabel={0} withplaceholder={1} withicon={0}
                                                            withformgroup={0} customclass={`form-control-sm text-center ${action === 'edit' ? 'pointer-events-none' : ''}`}
                                                            requirevalidation={1} formeditado={1} name="isn" thousandseparator={true}
                                                            value={pagoImpuesto.isn} onChange={e => onChangePagoImpuestosAdmin(key, e, 'isn')}
                                                            prefix='$' customstyle={{ minWidth: "120px" }} classlabel="font-size-sm" iconvalid={1} />
                                                    </td>
                                                    <td className="text-center">
                                                        <div className="font-size-lg font-weight-bolder" style={{ minWidth: "130px" }}> {setMoneyTableForNominas(this.getTotal(key))} </div>
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
                                    <button type="button" className="btn btn-sm btn-bg-light btn-icon-primary btn-hover-light-primary font-weight-bolder text-primary align-self-center font-size-13px" onClick={addRowPagoImpuestoAdmin}>AGREGAR COLABORADOR</button>
                                </div>
                            }
                        </div>
                    </Card.Body>
                    {
                        form.empresa !== '' ? <Card.Footer>
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

export default PagoImpuestosForm