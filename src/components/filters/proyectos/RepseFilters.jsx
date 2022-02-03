import React, { Component } from 'react'
import { Form, Row } from 'react-bootstrap'
import { InputGray,  ReactSelectSearchGray, Button, RangeCalendar } from '../../form-components'

class RepseFilters extends Component{

    state = {
        form: {
            fechas: { start: null, end: null },
            empresa: '',
            repse: '',     
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
        form.empresa = ''
        form.repse = ''
        
        this.setState({ ...this.state, form })
    }

    render(){
        const { form } = this.state
        const { options } = this.props
        return(
            <Form onSubmit = { this.onSubmit } >
                <Row className="mx-0 mt-5 mb-8 "> <br />
                    <div className="order-md-2 order-xxl-3 col-md-6 col-xxl-6 text-center align-self-center">
                        <div className="form-group row form-group-marginless">
                            <div className="col-md-6 text-center">
                                <label className="col-form-label font-weight-bold text-dark-60">Fecha</label><br />
                                <RangeCalendar start = { form.fechas.start } end = { form.fechas.end } 
                                    onChange = { ( value ) => { this.onChange( { target: { name: 'fechas', value: { start: value.startDate, end: value.endDate } } }) } }  />
                            </div>
                        </div>
                    </div>
                    <div className="order-md-1 order-xxl- col-md-6 col-xxl-6 align-self-left">
                        <div className="form-group row form-group-marginless">
                            <div className="col-md-12">
                                <InputGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 } requirevalidation = { 0 } 
                                    withformgroup = { 0 } name = 'repse' placeholder = 'NUMERO REPSE' value = { form.repse } 
                                    onChange = { this.onChange }  withicon = { 0 } customclass="px-2"/>
                            </div>
                           
                            <div className="col-md-12 col-xxl-12 mb-5">
                                <ReactSelectSearchGray placeholder = 'Selecciona la empresa' defaultvalue = { form.empresa } iconclass = 'las la-building icon-xl'
                                    options = { options.empresas } onChange = { (value) => { this.updateSelect(value, 'empresa') } } />
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

export default RepseFilters
