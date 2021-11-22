import React, { Component } from 'react'
import { Form, Row } from 'react-bootstrap'
import { InputGray, InputMoneyGray, ReactSelectSearchGray, Button, RadioGroup, RangeCalendar } from '../../form-components'

class ComprasFilters extends Component{

    state = {
        form: {
            fechas: { start: null, end: null },
            proyecto: '',
            proveedor: '',
            area: '',
            subarea: '',
            total: '',
            empresa: '',
            cuenta: '',
            estatusCompra: 0,
            descripcion:'',
            factura: '',
            identificador: ''
        },
    }

    componentDidMount = () => {
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
        const { setOptions, options: { areas, empresas} } = this.props
        switch (type) {
            case 'area':
                areas.find(function (element, index) {
                    if(value !== null){
                        if (value.value.toString() === element.value.toString()) {
                            setOptions('subareas', element.subareas)
                            return true
                        }
                        return false
                    }
                    return false
                })
                break;
            case 'empresa':
                empresas.find(function (element, index) {
                    if(value !== null){
                        if (value.value.toString() === element.value.toString()) {
                            setOptions('cuentas', element.cuentas)
                            return element
                        }
                        return false
                    }
                    return false
                })
                break;
            default:
                break;
        }
        this.setState({ ...this.state, form })
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
        this.clearForm()
        sendFilters({})
    }
    clearForm = () => {
        const { form } = this.state
        form.fecha = { start: null, end: null }
        form.proyecto = ''
        form.proveedor = ''
        form.area = ''
        form.subarea = ''
        form.total = ''
        form.empresa = ''
        form.cuenta = ''
        form.estatusCompra = 0
        form.descripcion = ''
        form.factura = ''
        form.identificador = ''
        this.setState({ ...this.state, form })
    }

    render(){
        const { form } = this.state
        const { options } = this.props
        return(
            <Form onSubmit = { this.onSubmit } >
                <Row className="mx-0 mt-5 mb-8">
                    <div className="order-md-2 order-xxl-1 col-md-12 col-xxl-3 text-center align-self-center">
                        <div className="col-md-12 text-center">
                            <label className="col-form-label font-weight-bold text-dark-60">Fecha</label><br />
                            <RangeCalendar start = { form.fechas.start } end = { form.fechas.end } 
                                onChange = { ( value ) => { this.onChange( { target: { name: 'fechas', value: { start: value.startDate, end: value.endDate } } }) } }  />
                        </div>
                    </div>
                    <div className="order-md-1 order-xxl-2 col-md-12 col-xxl-9 align-self-center">
                        <div className="form-group row form-group-marginless">
                            <div className="col-md-4 col-xxl-3 mb-5">
                                <InputGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 } requirevalidation = { 0 } 
                                    withformgroup = { 0 } name = 'identificador' placeholder = 'IDENTIFICADOR' value = { form.identificador } 
                                    onChange = { this.onChange }  withicon = { 0 } customclass="px-2"/>
                            </div>
                            <div className="col-md-4 col-xxl-3 mb-5">
                                <ReactSelectSearchGray placeholder = 'Selecciona el proveedor' defaultvalue = { form.proveedor } iconclass = 'las la-user icon-xl'
                                    options = { options.proveedores } onChange = { (value) => { this.updateSelect(value, 'proveedor') } } />
                            </div>
                            <div className="col-md-4 col-xxl-3 mb-5">
                                <ReactSelectSearchGray placeholder = 'Selecciona el proyecto' defaultvalue = { form.proyecto } iconclass = 'las la-folder-open icon-xl'
                                    options = { options.proyectos } onChange = { (value) => { this.updateSelect(value, 'proyecto') } } />
                            </div>
                            <div className="col-md-4 col-xxl-3 mb-5">
                                <ReactSelectSearchGray placeholder = 'Selecciona la empresa' defaultvalue = { form.empresa } iconclass = 'las la-building icon-xl'
                                    options = { options.empresas } onChange = { (value) => { this.updateSelect(value, 'empresa') } } />
                            </div>
                            {
                                form.empresa ?
                                    <div className="col-md-4 col-xxl-3 mb-5">
                                        <ReactSelectSearchGray placeholder = 'Selecciona la cuenta' defaultvalue = { form.cuenta } iconclass = 'las la-credit-card icon-xl'
                                            options = { options.cuentas } onChange = { (value) => { this.updateSelect(value, 'cuenta') } } />   
                                    </div>
                                :<></>
                            }
                            <div className="col-md-4 col-xxl-3 mb-5">
                                <ReactSelectSearchGray placeholder = 'Selecciona el área' defaultvalue = { form.area } iconclass = 'las la-window-minimize icon-xl'
                                    options = { options.areas } onChange = { (value) => { this.updateSelect(value, 'area') } } />
                            </div>
                            {
                                form.area ?
                                    <div className="col-md-4 col-xxl-3 mb-5">
                                        <ReactSelectSearchGray placeholder = 'Selecciona el subárea' defaultvalue = { form.subarea } iconclass = 'las la-window-maximize icon-xl'
                                        options = { options.subareas } onChange = { (value) => { this.updateSelect(value, 'subarea') } } />
                                    </div>
                                :<></>
                            }
                            <div className="col-md-4 col-xxl-3 mb-5">
                                <ReactSelectSearchGray placeholder = 'Selecciona el estatus de compra' defaultvalue = { form.estatusCompra } iconclass = 'las la-check-circle icon-xl'
                                    options = { options.estatusCompras } onChange = { (value) => { this.updateSelect(value, 'estatusCompra') } } />    
                            </div>
                            <div className="col-md-4 col-xxl-3 mb-5">
                                <InputMoneyGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 } withicon = { 1 } withformgroup = { 0 } 
                                    requirevalidation = { 0 } formeditado = { 0 } thousandseparator = { true } prefix = '$' name = "total" 
                                    value = { form.total } onChange = { this.onChange } placeholder = "TOTAL" iconclass = 'las la-dollar-sign' />
                            </div>
                            <div className="col-md-4 col-xxl-3 mb-5">
                                <ReactSelectSearchGray placeholder = '¿Lleva factura?' defaultvalue = { form.factura } iconclass = 'las la-question-circle icon-xl'
                                    options = { [ { label: 'Si', value: 'Con factura' }, { label: 'No', value: 'Sin factura' } ] } onChange = { (value) => { this.updateSelect(value, 'factura') } } />
                            </div>
                            <div className="col col-xxl-12">
                                <InputGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 } requirevalidation = { 0 } as ='textarea' rows = '1'
                                    withformgroup = { 0 } name = 'descripcion' placeholder = 'DESCRIPCIÓN' value = { form.descripcion } onChange = { this.onChange } 
                                    withicon = { 0 } customclass="px-2"/>
                            </div>
                        </div>
                    </div>
                </Row>
                <div className="mx-0 row justify-content-between border-top pt-4">
                    <Button only_icon='las la-redo-alt icon-lg' className="btn btn-light-danger btn-sm font-weight-bold" type='button' text="LIMPIAR"  
                        onClick = { this.clearFilters } />
                    <Button only_icon='las la-filter icon-xl' className="btn btn-light-info btn-sm font-weight-bold" type='submit' text="FILTRAR" />
                </div>
            </Form>
        )
    }
}

export default ComprasFilters
