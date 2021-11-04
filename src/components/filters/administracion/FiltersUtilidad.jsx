import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { optionsFases } from '../../../functions/options'
import { InputGray, TagSelectSearchGray, Button } from '../../form-components'

class FiltersUtilidad extends Component{

    state = {
        form: {
            proyecto: '',
            fases: ''
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
        form.proyecto = ''
        form.fases = ''
        this.setState({ ...this.state, form })
        sendFilters({})
    }

    render(){
        const { form } = this.state
        return(
            <Form onSubmit = { this.onSubmit }>
                <div className="form-group row form-group-marginless mt-4 mb-8">
                    <div className="col-md-12">
                        <InputGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 } requirevalidation = { 0 }
                            withformgroup = { 0 } name = 'proyecto' placeholder = 'PROYECTO' value = { form.proyecto } onChange = { this.onChange } 
                            withicon = { 1 } iconclass = 'las la-folder-open icon-xl' />
                    </div>
                    <div className="col-12 mt-6 mb-2">
                        <div className="separator separator-dashed" />
                    </div>
                    <div className="col-md-12">
                        <TagSelectSearchGray
                            requirevalidation={0}
                            placeholder="SELECCIONA LA FASE"
                            options={optionsFases()}
                            defaultvalue={form.fases}
                            onChange={(value) => { this.updateSelect(value, 'fases') }}
                            iconclass="las la-pencil-ruler icon-xl"
                            messageinc="Selecciona la fase."
                        />
                    </div>
                </div>
                <div className="mx-0 row justify-content-between border-top pt-4">
                    <Button only_icon='las la-redo-alt icon-lg mr-2 p-0' className="btn btn-light-danger btn-xs font-weight-bold px-3 py-2" type='button' text="LIMPIAR" onClick = { this.clearFilters } />
                    <Button only_icon='las la-filter icon-lg mr-2 p-0' className="btn btn-light-success btn-xs font-weight-bold px-3 py-2" type='submit' text="FILTRAR" />
                </div>
            </Form>
        )
    }
}

export default FiltersUtilidad