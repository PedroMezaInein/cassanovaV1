import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { optionsTipoLicencias } from '../../../functions/options'
import { InputGray, ReactSelectSearchGray, Button } from '../../form-components'

class FiltersLicencias extends Component{
    state = {
        form: {
            nombre: '',
            tipo: ''
        }
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
        this.setState( { ...this.state, form } )
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
        form.tipo = ''
        form.nombre = ''
        this.setState({ ...this.state, form })
        sendFilters({})
    }

    render(){
        const { form } = this.state
        return(
            <Form onSubmit = { this.onSubmit } >
                <div className="form-group row form-group-marginless mt-3">
                    <div className="col-md-6">
                        <ReactSelectSearchGray placeholder = 'Tipo de licencia' defaultvalue = { form.tipo } iconclass = 'las la-shield-alt icon-xl'
                            options = { optionsTipoLicencias() } onChange = { (value) => { this.updateSelect(value, 'tipo') } } />
                    </div>
                    <div className="col-md-6">
                        <InputGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 } requirevalidation = { 0 }
                            withformgroup = { 0 } name = 'nombre' placeholder = 'NOMBRE DE LA LICENCIA' value = { form.nombre } onChange = { this.onChange } 
                            withicon = { 1 } iconclass = 'las la-lock icon-xl' />
                    </div>
                </div>
                <div className="mx-0 row justify-content-between border-top pt-4">
                    <Button only_icon='las la-redo-alt' className="btn btn-light-danger btn-sm font-weight-bold" type='button' text="LIMPIAR"  
                        onClick = { this.clearFilters } />
                    <Button only_icon='las la-filter' className="btn btn-light-info btn-sm font-weight-bold" type='submit' text="FILTRAR" />
                </div>
            </Form>
        )
    }
}

export default FiltersLicencias