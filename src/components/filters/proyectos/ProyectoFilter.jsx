import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { errorAlert, printResponseErrorAlert, waitAlert } from '../../../functions/alert';
import { Button, InputGray, ReactSelectSearchGray, RangeCalendar, InputNumberGray } from '../../form-components';
import axios from 'axios';
import { setSingleHeader } from '../../../functions/routers';
import Swal from 'sweetalert2';
import { URL_DEV } from '../../../constants';
import { setOptionsWithLabel } from '../../../functions/setters';

class ProyectoFilter extends Component {

    state = {
        form: {
            nombre: '',
            status: '',
            descripcion: '',
            empresa: '',
            tipo: '',
            cliente: '',
            fechas: { start: null, end: null },
            m2:'',
            cp:'',
            estado:''
        },
        options: {
            empresas: [], estatus: [], tipos: [], clientes: []
        }
    }

    updateSelect = (value, type) => {
        const { form, options } = this.state
        if(type === 'empresa'){
            if(form.empresa !== value){
                options.tipos = setOptionsWithLabel(value.tipos, 'tipo', 'id')
                form.tipo = ''
            }
        }
        form[type] = value
        this.setState({...this.state, form, options})
    }

    onChange = e => {
        const { form } = this.state
        const { name, value } = e.target
        form[name] = value
        this.setState({...this.state, form})
    }

    componentDidMount = async() => {
        waitAlert()
        const { at, filtrado } = this.props
        const { options, form } = this.state
        await axios.options(`${URL_DEV}v3/proyectos/proyectos`, { headers: setSingleHeader(at) }).then(
            (response) => {
                const { empresas, estatus, clientes } = response.data
                options.empresas = setOptionsWithLabel(empresas, 'name', 'id')
                options.estatus = setOptionsWithLabel(estatus, 'estatus', 'id')
                options.clientes = setOptionsWithLabel(clientes, 'empresa', 'id')
                if(filtrado.nombre)
                    form.nombre = filtrado.nombre
                if(filtrado.estatus)
                    form.estatus = filtrado.estatus
                if(filtrado.empresa){
                    form.empresa = filtrado.empresa
                    options.tipos = setOptionsWithLabel(filtrado.empresa.tipos, 'tipo', 'id')
                    if(filtrado.tipo)
                        form.tipo = filtrado.tipo
                }
                if(filtrado.cliente)
                    form.cliente = filtrado.cliente
                if(filtrado.descripcion)
                    form.descripcion = filtrado.descripcion
                if(filtrado.fechas)
                    form.fechas = filtrado.fechas
                if(filtrado.m2)
                    form.m2 = filtrado.m2
                if(filtrado.cp)
                    form.cp = filtrado.cp
                if(filtrado.estado)
                    form.estado = filtrado.estado
                this.setState({...this.state, options, form })
                Swal.close()
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    onSubmit = (e) => {
        e.preventDefault()
        const { form } = this.state
        const { filtering } = this.props
        filtering(form)
    }

    clear = e => {
        e.preventDefault()
        const { filtering } = this.props
        const { form } = this.state
        form.nombre = ''
        form.estatus = ''
        form.descripcion = ''
        form.empresa = ''
        form.tipo = ''
        form.cliente = ''
        form.fechas = { start: null, end: null }
        form.m2 = ''
        form.cp = ''
        form.estado = ''
        filtering(form)
        this.setState({ ...this.state, form })
    }

    render() {
        const { form, options } = this.state
        return (
            <Form onSubmit={ this.onSubmit} >
                <div className="form-group row form-group-marginless">
                    <div className="col-md-6">
                        <InputGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 } withicon = { 1 } requirevalidation = { 0 }
                            withformgroup = { 0 } name = 'nombre' placeholder = 'NOMBRE' value = { form.nombre } onChange = { this.onChange } 
                            iconclass='las la-folder icon-xl' />
                    </div>
                    <div className="col-md-6">
                        <ReactSelectSearchGray placeholder = 'Selecciona el estatus' defaultvalue = { form.estatus } iconclass = 'las la-check-circle icon-xl'
                            options = { options.estatus } onChange={(value) => { this.updateSelect(value, 'estatus') }} />
                    </div>
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-6">
                        <ReactSelectSearchGray placeholder = 'Selecciona la empresa' defaultvalue = { form.empresa } iconclass = 'las la-building icon-xl'
                            options = { options.empresas } onChange={(value) => { this.updateSelect(value, 'empresa') }} />
                    </div>
                    <div className="col-md-6">
                        <ReactSelectSearchGray placeholder = 'Selecciona el tipo de proyecto' defaultvalue = { form.tipo } 
                            iconclass = 'las la-tools icon-xl' options = { options.tipos } 
                            onChange={(value) => { this.updateSelect(value, 'tipo') }} />
                    </div>
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-6">
                        <ReactSelectSearchGray placeholder = 'Selecciona el cliente' defaultvalue = { form.cliente } iconclass = 'las la-user icon-xl'
                            options = { options.clientes } onChange={(value) => { this.updateSelect(value, 'cliente') }} />
                    </div>
                    <div className="col-md-6">
                        <InputNumberGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1} requirevalidation={0}
                            withformgroup={0} name='m2' placeholder='M²' value={form.m2}
                            onChange={this.onChange} iconclass="las la-ruler-combined icon-xl" />
                    </div>
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-6">
                        <InputGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 } withicon = { 1 } requirevalidation = { 0 }
                            withformgroup = { 0 } name = 'cp' placeholder = 'CP' value = { form.cp }
                            onChange = { this.onChange } iconclass='las la-map-marker icon-xl' customclass="px-2"  />
                    </div>
                    <div className="col-md-6">
                        <InputGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 } withicon = { 1 } requirevalidation = { 0 }
                            withformgroup = { 0 } name = 'estado' placeholder = 'ESTADO' value = { form.estado }
                            onChange = { this.onChange } iconclass='las la-map icon-xl' customclass="px-2"  />
                    </div>
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-12">
                        <InputGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 } withicon = { 0 } requirevalidation = { 0 }
                            withformgroup = { 0 } name = 'descripcion' placeholder = 'DESCRIPCIÓN' value = { form.descripcion }
                            onChange = { this.onChange } iconclass='las la-folder icon-xl' customclass="px-2"  />
                    </div>
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-12 text-center">
                        <label className="col-form-label font-weight-bold text-dark-60">Fechas</label><br />
                        <RangeCalendar start = { form.fechas.start } end = { form.fechas.end } 
                        onChange = { ( value ) => { this.onChange( { target: { name: 'fechas', value: { start: value.startDate, end: value.endDate } } }) } }  />
                    </div>
                </div>
                <div className="mx-0 row justify-content-between border-top pt-4">
                    <Button only_icon='las la-redo-alt icon-lg' className="btn btn-light-danger btn-sm font-weight-bold" type='button' text="LIMPIAR"  onClick = { this.clear } />
                    <Button only_icon='las la-filter icon-xl' className="btn btn-light-info btn-sm font-weight-bold" type='submit' text="FILTRAR" />
                </div>
            </Form>

        )
    }
}

export default ProyectoFilter