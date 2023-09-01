import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { apiPostForm, catchErrors, apiPutForm } from '../../functions/api'
import { doneAlert, printResponseErrorAlert, validateAlert, waitAlert } from '../../functions/alert'
import { CalendarDay, InputGray, RadioGroupGray, SelectSearchGray, Button } from '../form-components'

class FormProveedoresRh extends Component{

    state = {
        form: {
            fecha: new Date(),
            empresa: '',
            nombre: '',
            origen: '',
            opcionrhp: 'Proveedor',
            comentario: ''
        }
    }
    componentDidMount(){
        const { lead, title } = this.props
        const { form } = this.state
        if(title === 'Editar'){
            form.fecha = new Date(lead.created_at)
            form.nombre = lead.nombre.toUpperCase()
            form.empresa = lead.empresa_id.toString()
            form.origen = lead.origen.id.toString()
            form.comentario = lead.comentario
            form.opcionrhp = lead.proveedor===1?'Proveedor':'RRHH'
            this.setState({ ...this.state, form })
        }
    }

    onChange = e => {
        const { name, value } = e.target
        const { form } = this.state
        form[name] = value
        this.setState({ ...this.state, form })
    }

    updateSelect = (value, name) => {
        const { form } = this.state
        form[name] = value
        this.setState({ ...this.state, form })
    }

    onSubmitRRHHPP = e => {
        e.preventDefault()
        const { title } = this.props
        waitAlert()
        if (title === 'Editar')
            this.editRRHHP()
        else
            this.addRRHHP()
    }
    editRRHHP = async () => {
        const { at, lead, refresh } = this.props
        const { form} = this.state
        waitAlert()
        apiPutForm(`crm/table/lead-rh-proveedor/update/${lead.id}`, form, at).then(
            (response) => {
                doneAlert(`Lead editado con éxito`, () => { refresh() } )
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    addRRHHP = async() => {
        const { at, refresh } = this.props
        const { form } = this.state
        waitAlert()
        apiPostForm('crm/table/lead-rh-proveedor', form, at).then(
            (response) => {
                doneAlert(`Lead registrado con éxito`, () => { refresh() } )
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    render(){
        const { form } = this.state
        const { options } = this.props
        return(
            <Form id="form-rrhh-p" onSubmit={ (e) => { e.preventDefault(); validateAlert(this.onSubmitRRHHPP, e, 'form-rrhh-p') } }>
                <div className="row mx-0 mt-5">
                    <div className="col-md-4 text-center align-self-center">
                        <CalendarDay value = { form.fecha } name = 'fecha' onChange = { this.onChange } 
                            date = { form.fecha } withformgroup = { 1 } requirevalidation = { 1 } title="Fecha" />
                    </div>
                    <div className="col-md-8 align-self-center">
                        <div className="form-group row form-group-marginless mt-4 mb-0">
                            <div className="col-md-6">
                                <InputGray formeditado = { 1 } withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 }
                                    withicon = { 1 } withformgroup = { 1 } requirevalidation = { 1 } placeholder = 'NOMBRE'
                                    iconclass = "far fa-user" name='nombre' value = { form.nombre } onChange = { this.onChange }
                                    messageinc = "Ingresa el nombre." /> 
                            </div>
                            <div className="col-md-6">
                                <SelectSearchGray formeditado = { 1 } withtaglabel = { 1 } withtextlabel = { 1 } name = 'empresa'
                                    options = { options.empresas } placeholder = 'SELECCIONA LA EMPRESA' value = { form.empresa }
                                    onChange = { (value) => { this.updateSelect(value, 'empresa') } } iconclass = "far fa-building"
                                    messageinc = "Selecciona la empresa." withicon = { 1 } />
                            </div>
                        </div>
                        <div className="separator separator-dashed mt-1 mb-2" />
                        <div className="form-group row form-group-marginless mt-4 mb-0">
                            <div className="col-md-6">
                                <SelectSearchGray formeditado = { 1 } withtaglabel = { 1 } withtextlabel = { 1 } name = 'origen'
                                    options = { options.origenes } placeholder = 'SELECCIONA EL ORIGEN' value = { form.origen }
                                    onChange = { (value) => { this.updateSelect(value, 'origen') } } iconclass = "fas fa-mail-bulk"
                                    messageinc = "Selecciona el origen." withicon = { 1 } />
                            </div>
                            <div className="col-md-6 align-self-center">
                                <RadioGroupGray formeditado = { 1 } placeholder = "Selecciona el tipo" name = 'opcionrhp'
                                    onChange = { this.onChange } value = { form.opcionrhp }
                                    options={ [ { label: 'Proveedor', value: 'Proveedor' }, { label: 'RRHH', value: 'RRHH' } ] } />
                            </div>
                        </div>
                        <div className="separator separator-dashed mt-1 mb-2"></div>
                        <div className="form-group row form-group-marginless mt-4 mb-0">
                            <div className="col-md-12">
                                <InputGray formeditado = { 1 } withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 }
                                    withicon = { 0 } withformgroup = { 0 } placeholder = "COMENTARIO" name = "comentario"
                                    value = { form.comentario } onChange = { this.onChange } rows = { 3 } as = 'textarea' />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card-footer mt-3 pr-1 pb-0">
                    <div className="row">
                        <div className="col-lg-12 text-right pr-0 pb-0">
                            <Button icon = '' className = "btn btn-primary mr-2" text="ENVIAR"
                                onClick = { (e) => { e.preventDefault(); validateAlert(this.onSubmitRRHHPP, e, 'form-rrhh-p')  } } />
                        </div>
                    </div>
                </div>
            </Form>
        )
    }
}

export default FormProveedoresRh