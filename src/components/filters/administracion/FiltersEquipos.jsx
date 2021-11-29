import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { InputGray, Button } from '../../form-components'

class FiltersEquipos extends Component{
    state = {
        form: {
            equipo: '',
            modelo: '',
            marca: '',
            serie: '',
            descripcion: ''
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
        form.equipo = ''
        form.modelo = ''
        form.marca = ''
        form.serie = ''
        form.descripcion = ''
        this.setState({ ...this.state, form })
        sendFilters({})
    }

    render(){
        const { form } = this.state
        return(
            <Form onSubmit = { this.onSubmit } >
                <div className="form-group row form-group-marginless mt-3">
                    <div className="col-md-6">
                        <InputGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 } requirevalidation = { 0 }
                            withformgroup = { 0 } name = 'equipo' placeholder = 'EQUIPO' value = { form.equipo } 
                            onChange = { this.onChange } withicon = { 1 } iconclass = 'las la-desktop icon-xl'
                        />
                    </div>
                    <div className="col-md-6">
                        <InputGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 } requirevalidation = { 0 }
                            withformgroup = { 0 } name = 'modelo' placeholder = 'MODELO' value = { form.modelo } 
                            onChange = { this.onChange } withicon = { 1 } iconclass = 'las la-stream icon-xl'
                        />
                    </div>
                </div>
                <div className="separator separator-dashed" />
                <div className="form-group row form-group-marginless mt-3">
                    <div className="col-md-6">
                        <InputGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 } requirevalidation = { 0 }
                            withformgroup = { 0 } name = 'marca' placeholder = 'MARCA' value = { form.marca } 
                            onChange = { this.onChange } withicon = { 1 } iconclass = 'lab la-apple icon-xl'
                        />
                    </div>
                    <div className="col-md-6">
                        <InputGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 } requirevalidation = { 0 }
                            withformgroup = { 0 } name = 'serie' placeholder = 'SERIE' value = { form.serie } 
                            onChange = { this.onChange } withicon = { 1 } iconclass = 'las la-key icon-xl'
                        />
                    </div>
                </div>
                <div className="separator separator-dashed" />
                <div className="form-group row form-group-marginless mt-3">
                    <div className="col-md-12">
                        <InputGray 
                            withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 } requirevalidation = { 0 } as ='textarea' rows = '2'
                            withformgroup = { 0 } name = 'descripcion' placeholder = 'DESCRIPCION' value = { form.descripcion } onChange = { this.onChange } 
                            withicon = { 0 } customclass="px-2"
                        />
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

export default FiltersEquipos