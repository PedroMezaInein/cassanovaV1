import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import { RangeCalendar, Button, InputGray, SelectSearchGray, InputMoneyGray } from '../../form-components'
import { validateAlert } from '../../../functions/alert'
import { setMoneyTableForNominas } from '../../../functions/setters'
import { Card } from 'react-bootstrap'
import { ItemSlider, Modal } from '../../../components/singles';
import Scrollbar from 'perfect-scrollbar-react';
import 'perfect-scrollbar-react/dist/style.min.css';
class NominaAdminForm extends Component {
    state = {
        modalForm: false,
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
    openModal = () => {
        this.setState({
            ...this.state,
            modalForm: true,
            formeditado: 0
        })
    }
    onSubmitForm = () => {
        this.setState({
            ...this.state,
            modalForm: false,
        })
    }
    handleCloseModal = () => {
        const { form } = this.props
        form.periodo = ''
        form.empresa = ''
        form.adjuntos.adjunto.value = ''
        form.adjuntos.adjunto.files = []
        form.fechaInicio = new Date()
        form.fechaFin = new Date()
        this.setState({
            ...this.state,
            modalForm: false,
            form
        })
    }
    render() {
        const { options, addRowNominaAdmin, deleteRowNominaAdmin, onChangeNominasAdmin, onChange, form, onSubmit, formeditado, title,  handleChange, onChangeRange } = this.props
        const { modalForm } = this.state
        console.log(form)
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
                        <div className="card-toolbar">
                            <a className="btn text-dark-50 btn-icon-primary btn-hover-icon-success font-weight-bolder btn-hover-bg-light mx-2" onClick={(e) => { this.openModal() }}>
                                <i className="flaticon2-calendar-6 icon-lg text-primary mr-1"></i>
                                Agregar periodo de nómina
                            </a>
                        </div>
                </Card.Header>
                    <Card.Body>
                        <table className="table table-separate table-responsive-sm table_nominas_obras" id="tabla_obra">
                            <thead>
                                <tr>
                                    <th className = 'border-bottom-0'></th>
                                    <th rowSpan="3"><div className="mt-2 pb-3">Empleado</div></th>
                                    <th className="pb-0 border-bottom-0 text-center">Nómina IMSS</th>
                                    <th className="pb-0 border-bottom-0 text-center">Restante Nómina</th>
                                    <th className="pb-0 border-bottom-0 text-center">Extras</th>
                                    <th className="pb-0 border-bottom-0 text-center">Total</th>
                                </tr>
                                <tr>
                                    <th className = 'border-bottom-0'></th>
                                    {
                                        this.getTotalNominaImss("nominImss") > 0 ?
                                            <th className="py-2 border-bottom-0">
                                                <div className="py-1 my-0 font-weight-bolder">
                                                    <SelectSearchGray formeditado = { formeditado } options = { options.cuentas } name = "cuentaImss"
                                                        placeholder = "SELECCIONA LA CUENTA" value = { form.cuentaImss } messageinc = "SELECCIONA LA CUENTA"
                                                        onChange = { (value) => { this.updateCuenta(value, 'cuentaImss') } } withtaglabel={0} withtextlabel={0}
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
                                                    <SelectSearchGray formeditado = { formeditado } options = { options.cuentas } name = "cuentaRestante"
                                                        placeholder = "SELECCIONA LA CUENTA" value = { form.cuentaRestante } messageinc = "SELECCIONA LA CUENTA"
                                                        onChange = { (value) => { this.updateCuenta(value, 'cuentaRestante') } } withtaglabel={0} withtextlabel={0}
                                                        withicon={0} customclass="form-control-sm text-center" customdiv="mb-0" iconvalid={1}/>
                                                </div>
                                            </th>
                                        : <th className="border-bottom-0"></th>
                                    }
                                    {
                                        this.getTotalExtra("extras") > 0 ?
                                            <th className="py-2 border-bottom-0">
                                                <div className="py-1 my-0 font-weight-bolder">
                                                    <SelectSearchGray formeditado = { formeditado } options = { options.cuentas } name = "cuentaExtras"
                                                        placeholder = "SELECCIONA LA CUENTA" value = { form.cuentaExtras } messageinc = "SELECCIONA LA CUENTA" 
                                                        onChange = { (value) => { this.updateCuenta(value, 'cuentaExtras') } } withtaglabel={0} withtextlabel={0}
                                                        withicon={0} customclass="form-control-sm text-center" customdiv="mb-0" iconvalid={1}/>
                                                </div>
                                            </th>
                                        : <th className="border-bottom-0"></th>
                                    }
                                    <th className="border-bottom-0"></th>
                                </tr>
                                <tr>
                                    <th className = ''></th>
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
                                                <td className = 'text-center' style={{minWidth:"60px"}}>
                                                    <Button icon = '' onClick = { () => { deleteRowNominaAdmin(nominaAdmin, key) } }
                                                        className = "btn btn-sm btn-icon btn-bg-white btn-icon-danger btn-hover-danger" only_icon = "far fa-trash-alt icon-md text-danger" />
                                                </td>
                                                <td>
                                                    <SelectSearchGray formeditado = { formeditado } options = { this.setOptions(key) } placeholder = "SELECCIONA EL EMPLEADO"
                                                        name = "usuario" value = { nominaAdmin.usuario } onChange = { (value) => this.updateUsuario(value, key) }
                                                        customstyle={{ minWidth: "300px" }}  withtaglabel={0} withtextlabel={0} withicon={0} customclass="form-control-sm text-center" customdiv="mb-0" iconvalid={1}/>
                                                </td>
                                                <td>
                                                    <InputMoneyGray  withtaglabel = { 0 } withtextlabel = { 0 } withplaceholder = { 1 } withicon = { 0 } 
                                                        withformgroup = { 0 } customclass="form-control-sm text-center" 
                                                        requirevalidation = { 1 } formeditado = { 1 } name = "nominImss" thousandseparator = { true }
                                                        value = { nominaAdmin.nominImss } onChange = { e => onChangeNominasAdmin(key, e, 'nominImss') }
                                                        prefix = '$' customstyle = { { minWidth: "160px" } } classlabel="font-size-sm" iconvalid={1}/>
                                                </td>
                                                <td>
                                                    <InputMoneyGray  withtaglabel = { 0 } withtextlabel = { 0 } withplaceholder = { 1 } withicon = { 0 } 
                                                        withformgroup = { 0 } customclass="form-control-sm text-center" 
                                                        requirevalidation = { 1 }  formeditado = { 1 } name = "restanteNomina"
                                                        value = { nominaAdmin.restanteNomina } onChange = { e => onChangeNominasAdmin(key, e, 'restanteNomina') }
                                                        thousandseparator = { true } prefix = '$' customstyle = { { minWidth: "160px" } } classlabel="font-size-sm" iconvalid={1}/>
                                                </td>
                                                <td>
                                                    <InputMoneyGray  withtaglabel = { 0 } withtextlabel = { 0 } withplaceholder = { 1 } withicon = { 0 } 
                                                        withformgroup = { 0 } customclass="form-control-sm text-center"
                                                        requirevalidation = { 1 } formeditado = { 1 } name = "extras" thousandseparator = { true }
                                                        value = { nominaAdmin.extras } onChange = { e => onChangeNominasAdmin(key, e, 'extras') }
                                                        prefix = '$' customstyle = { { minWidth: "160px" } } classlabel="font-size-sm"  iconvalid={1}/>
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
                        {
                            options.usuarios.length > 0 &&
                            <div className="d-flex justify-content-center">
                                <button type="button" className="btn btn-light-primary font-weight-bolder mr-2" onClick={addRowNominaAdmin}>AGREGAR FILA</button>
                            </div>
                        }
                    </Card.Body>
                    {
                        form.periodo !== '' && form.empresa !== ''? <Card.Footer>
                        <div className="row">
                            <div className="col-lg-12 text-right">
                                <Button icon='' text='ENVIAR' type='submit' className="btn btn-primary mr-2" />
                            </div>
                        </div>
                    </Card.Footer> : ''
                        
                    }
                </Card>
                
                <Modal size="lg" title="NÓMINA ADMINISTRATIVA" show={modalForm} handleClose={this.handleCloseModal} customcontent={true} contentcss="modal modal-sticky modal-sticky-bottom-right d-block modal-sticky-lg modal-dialog modal-dialog-scrollable">
                    <div style={{ display: 'flex', maxHeight: '500px'}} >
                        <Scrollbar>
                            <div className="form-group row form-group-marginless mx-0">
                                <div className="col-md-12 row mx-0">
                                    <div className="col-md-6 mx-auto mb-5">
                                        <InputGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1} withformgroup={0}
                                            requirevalidation={1} formeditado={1} name="periodo" value={form.periodo}
                                            placeholder="PERIODO DE NÓMINA" onChange={onChange} iconclass="far fa-window-maximize"
                                            messageinc="Ingresa el periodo de nómina." />
                                    </div>
                                    <div className="col-md-6 mx-auto mb-5">
                                        <SelectSearchGray formeditado={formeditado} options={options.empresas} placeholder="Selecciona la empresa"
                                            name="empresa" value={form.empresa} onChange={this.updateEmpresa} withtaglabel={1} withtextlabel={1}
                                            messageinc="Selecciona la empresa" withicon={1} />
                                    </div>
                                </div>
                                <div className="col-md-12 d-flex justify-content-center align-self-center">
                                    <div className="text-center">
                                        <label className="col-form-label my-2 font-weight-bold text-dark-60 pt-0 mt-0">Fecha de inicio - Fecha final</label><br />
                                        <RangeCalendar onChange={onChangeRange} start={form.fechaInicio} end={form.fechaFin} />
                                    </div>
                                </div>
                                {
                                    title !== 'Editar nómina administrativa' ?
                                    <div className="col-md-12 text-center">
                                        <label className="col-form-label my-2 font-weight-bold text-dark-60">{form.adjuntos.adjunto.placeholder}</label>
                                        <ItemSlider items={form.adjuntos.adjunto.files} item='adjunto' handleChange={handleChange} multiple={true} />
                                    </div>
                                    :''
                                }
                            </div>
                        </Scrollbar>
                    </div>
                    <div className="card-footer py-3 pr-1">
                            <div className="row mx-0">
                                <div className="col-lg-12 text-right pr-0 pb-0">
                                    <Button icon='' className="btn btn-primary mr-2"
                                        onClick={ (e) => { e.preventDefault();this.onSubmitForm() }}
                                        text="CONFIRMAR"
                                    />
                                </div>
                            </div>
                        </div>
                </Modal>
            </Form>
        )
    }
}

export default NominaAdminForm