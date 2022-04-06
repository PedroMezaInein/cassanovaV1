import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { printResponseErrorAlert } from '../../../functions/alert'
import { apiOptions, catchErrors } from '../../../functions/api'
import { setOptionsWithLabel } from '../../../functions/setters'
import { InputGray, InputMoneyGray, ReactSelectSearchGray, Button } from '../../form-components'

class FiltersSolicitudFactura extends Component{

    state = {
        form: {
            emisor: '',
            receptor: '',
            monto: '',
            tipo: '',
            forma: '',
            metodo: '',
            estatus: '',
            origen: '',
            detalle: ''
        },
        options: {
            tipos: [],
            formas: [],
            metodos: [],
            estatus: [],
            origenes: [
                { value: 'fase1', name: 'Fase 1', label: 'Fase 1'},
                { value: 'fase2', name: 'Fase 2', label: 'Fase 2'},
                { value: 'fase3', name: 'Fase 3', label: 'Fase 3'}
            ]
        }
    }

    componentDidMount = () => {
        this.getOptions()
        const { filters } = this.props
        let keys = Object.keys(filters)
        if(keys.length){
            const { form } = this.state
            keys.forEach((element) => {
                form[element] = filters[element]
            })
            this.setState({ ...this.state, form })
        }
    }

    onChange = e => {
        const { name, value } = e.target
        const { form } = this.state
        form[name] = value
        this.setState({ ...this.state, form })
    }

    updateSelect = (value, type) => {
        const { form } = this.state
        form[type] = value
        this.setState( { ...this.state, form } )
    }

    getOptions = async() => {
        const { at } = this.props
        apiOptions(`v1/administracion/solicitud-factura`, at).then(
            (response) => {
                const { tiposPago, formasPago, metodosPago, estatusFactura } = response.data
                const { options } = this.state
                options.tipos = setOptionsWithLabel(tiposPago, 'tipo', 'id')
                options.formas = setOptionsWithLabel(formasPago, 'nombre', 'id')
                options.metodos = setOptionsWithLabel(metodosPago, 'nombre', 'id')
                options.estatus = setOptionsWithLabel(estatusFactura, 'estatus', 'id')
                this.setState({ ...this.state, options })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }

    onSubmit = (e) => {
        e.preventDefault();
        const { sendFilters } = this.props
        const { form } = this.state
        sendFilters(form)
    }

    clearFilters = (e) => {
        e.preventDefault();
        const { sendFilters } = this.props
        const { form } = this.state
        form.emisor = ''
        form.receptor = ''
        form.monto = ''
        form.tipo = ''
        form.forma = ''
        form.metodo = ''
        form.estatus = ''
        form.origen = ''
        this.setState({ ...this.state, form })
        sendFilters({})
    }

    render(){
        const { form, options } = this.state
        return(
            <Form onSubmit = { this.onSubmit } >
                <div className="form-group row form-group-marginless">
                    <div className="col-md-6">
                        <InputGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 } requirevalidation = { 0 }
                            withformgroup = { 0 } name = 'emisor' placeholder = 'EMISOR' value = { form.emisor } onChange = { this.onChange } 
                            withicon = { 1 } iconclass = 'las la-user-alt' />
                    </div>
                    <div className="col-md-6">
                        <InputGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 } requirevalidation = { 0 }
                            withformgroup = { 0 } name = 'receptor' placeholder = 'RECEPTOR' value = { form.receptor } onChange = { this.onChange } 
                            withicon = { 1 } iconclass = 'las la-user-alt' />
                    </div>
                    <div className="col-12 mt-4 mb-2 d-none d-md-block">
                        <div className="separator separator-dashed" />
                    </div>
                    <div className="col-md-6">
                        <InputMoneyGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 } withicon = { 1 } withformgroup = { 0 } 
                            requirevalidation = { 0 } formeditado = { 0 } thousandseparator = { true } prefix = '$' name = "monto" 
                            value = { form.monto } onChange = { this.onChange } placeholder = "MONTO" iconclass = 'las la-dollar-sign' />
                    </div>
                    <div className="col-md-6">
                        <ReactSelectSearchGray placeholder = 'Selecciona el tipo de pago' defaultvalue = { form.tipo } iconclass = 'las la-credit-card'
                            options = { options.tipos } 
                            onChange={(value) => {
                                if (value !== null) { this.updateSelect(value, 'tipo') } 
                                if (value===null){
                                    form.tipo = ''
                                    this.setState({ ...this.state, form })
                                }}}
                            />
                    </div>
                    <div className="col-12 mt-4 mb-2 d-none d-md-block">
                        <div className="separator separator-dashed" />
                    </div>
                    <div className="col-md-6">
                        <ReactSelectSearchGray placeholder = 'Selecciona la forma de pago' defaultvalue = { form.forma } iconclass = 'las la-credit-card'
                            options = { options.formas }
                            onChange={(value) => {
                                if (value !== null) { this.updateSelect(value, 'forma') } 
                                if (value===null){
                                    form.forma = ''
                                    this.setState({ ...this.state, form })
                                }}}
                        />
                    </div>
                    <div className="col-md-6">
                        <ReactSelectSearchGray placeholder = 'Selecciona el método de pago' defaultvalue = { form.metodo } iconclass = 'las la-credit-card'
                            options = { options.metodos } 
                            onChange={(value) => {
                                if (value !== null) { this.updateSelect(value, 'metodo') } 
                                if (value===null){
                                    form.metodo = ''
                                    this.setState({ ...this.state, form })
                                }}}
                            />
                    </div>
                    <div className="col-12 mt-4 mb-2 d-none d-md-block">
                        <div className="separator separator-dashed" />
                    </div>
                    <div className="col-md-6">
                        <ReactSelectSearchGray placeholder = 'Selecciona el estatus de facturación' defaultvalue = { form.estatus } 
                            iconclass = 'las la-credit-card' options = { options.estatus } 
                            onChange={(value) => {
                                if (value !== null) { this.updateSelect(value, 'estatus') } 
                                if (value===null){
                                    form.estatus = ''
                                    this.setState({ ...this.state, form })
                                }}}
                            />
                    </div>
                    <div className="col-md-6">
                        <ReactSelectSearchGray placeholder = 'Selecciona el origen' defaultvalue = { form.origen } options = { options.origenes } 
                            iconclass = 'las la-credit-card'
                            onChange={(value) => {
                                if (value !== null) { this.updateSelect(value, 'origen') } 
                                if (value===null){
                                    form.origen = ''
                                    this.setState({ ...this.state, form })
                                }}}

                            />
                    </div>
                    <div className="col-12 mt-4 mb-2 d-none d-md-block">
                        <div className="separator separator-dashed" />
                    </div>
                    <div className="col-12">
                        <InputGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 } requirevalidation = { 0 } as ='textarea' rows = '2'
                            withformgroup = { 0 } name = 'detalle' placeholder = 'DETALLE' value = { form.detalle } 
                            onChange = { this.onChange } 
                            withicon = { 1 } iconclass = 'las la-text-height' />
                    </div>
                </div>
                <div className="mx-0 row justify-content-between border-top pt-4">
                    <Button only_icon='las la-redo-alt icon-lg' className="btn btn-light-danger btn-sm font-weight-bold" type='button' text="LIMPIAR"  
                        onClick = { this.clearFilters } />
                    <Button only_icon='las la-filter icon-xl' className="btn btn-light-info btn-sm font-weight-bold" type='submit' text="FILTRAR" />
                </div>
            </Form>
        )
    }
}

export default FiltersSolicitudFactura