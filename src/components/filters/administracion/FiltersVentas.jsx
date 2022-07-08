import React, { Component } from 'react'
import { Form, Row } from 'react-bootstrap'
import { InputGray, InputMoneyGray, ReactSelectSearchGray, Button, RangeCalendar } from '../../form-components'

class FiltersVentas extends Component {
    state = {
        form: {
            fechas: { start: null, end: null },
            cliente: '',
            subarea: '',
            serie: '',
            total: '',
            subtotal: '',
            empresa: '',
            folio: '',
            estatusFactura: '',
            descripcion:'',
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
        // switch (type) {
        //      case 'empresa':
        //         empresas.find(function (element, index) {
        //             if(value !== null){
        //                 if (value.value.toString() === element.value.toString()) {
        //                     setOptions('cuentas', element.cuentas)
        //                     return element
        //                 }
        //                 return false
        //             }
        //             return false
        //         })
        //         break;
        //     default:
        //         break;
        // }
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
        const { form } = this.state

        form.fechas = { start: null, end: null }
        form.cliente = ''
        form.subarea = ''
        form.serie = ''
        form.total = ''
        form.subtotal = ''
        form.empresa = ''
        form.folio = ''
        form.estatusFactura = ''
        form.descripcion = ''

        sendFilters(form)
    }
  
    render() {
        const { form } = this.state
        const { options ,clearFiltros} = this.props
        return (
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
                                    withformgroup = { 0 } name = 'folio' placeholder = 'FOLIO' value = { form.folio } 
                                    onChange = { this.onChange }  withicon = { 0 } customclass="px-2"/>
                            </div>
                            <div className="col-md-4 col-xxl-3 mb-5">
                                <ReactSelectSearchGray placeholder = 'Selecciona el estatus de factura' defaultvalue = { form.estatusFactura } iconclass = 'las la-check-circle icon-xl'
                                    options = { options.estatusFactura } 
                                    onChange={(value) => {
                                        if (value !== null) { this.updateSelect(value, 'estatusFactura') } 
                                        if (value===null){
                                            form.estatusFactura = 0
                                            this.setState({ ...this.state, form })
                                        }}}
                                    />    
                            </div>
                            <div className="col-md-4 col-xxl-3 mb-5">
                                <InputGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 } requirevalidation = { 0 } 
                                    withformgroup = { 0 } name = 'serie' placeholder = 'SERIE' value = { form.serie } 
                                    onChange = { this.onChange }  withicon = { 0 } customclass="px-2"/>
                            </div>

                            <div className="col-md-4 col-xxl-3 mb-5">
                                <ReactSelectSearchGray placeholder = 'Selecciona el EMISOR' defaultvalue = { form.empresa } iconclass = 'las la-user icon-xl'
                                    options = { options.clientes } 
                                    onChange={(value) => {
                                        if (value !== null) { this.updateSelect(value, 'empresa') } 
                                        if (value===null){
                                            form.empresa = ''
                                            this.setState({ ...this.state, form })
                                        }}}
                                />
                            </div>

                            <div className="col-md-4 col-xxl-3 mb-5">
                                <ReactSelectSearchGray placeholder = 'Selecciona el receptor' defaultvalue = { form.cliente } iconclass = 'las la-user icon-xl'
                                    options = { options.clientes } 
                                    onChange={(value) => {
                                        if (value !== null) { this.updateSelect(value, 'cliente') } 
                                        if (value===null){
                                            form.cliente = ''
                                            this.setState({ ...this.state, form })
                                        }}}
                                />
                            </div>
                            <div className="col-md-4 col-xxl-3 mb-5">
                                <InputMoneyGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 } withicon = { 1 } withformgroup = { 0 } 
                                    requirevalidation = { 0 } formeditado = { 0 } thousandseparator = { true } prefix = '$' name = "subtotal" 
                                    value = { form.subtotal } onChange = { this.onChange } placeholder = "SUBTOTAL" iconclass = 'las la-dollar-sign' />
                            </div>
                           
                            <div className="col-md-4 col-xxl-3 mb-5">
                                <InputMoneyGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 } withicon = { 1 } withformgroup = { 0 } 
                                    requirevalidation = { 0 } formeditado = { 0 } thousandseparator = { true } prefix = '$' name = "total" 
                                    value = { form.total } onChange = { this.onChange } placeholder = "TOTAL" iconclass = 'las la-dollar-sign' />
                            </div>                            
                            <div className="col col-xxl-12">
                                <InputGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 } requirevalidation = { 0 } as ='textarea' rows = '1'
                                    withformgroup = { 0 } name = 'descripcion' placeholder = 'DESCRIPCION' value = { form.descripcion } onChange = { this.onChange } 
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

export default FiltersVentas