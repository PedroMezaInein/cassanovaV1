import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { InputGray, ReactSelectSearchGray, Button } from '../../form-components'

class FiltersPrestaciones extends Component {
    state = {
        form: {
            nombre: '',
            descripcion: '',
            proveedor: ''
        }
    }

    componentDidMount = () => {
        const { filters } = this.props
        let keys = Object.keys(filters)
        if (keys.length) {
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
        form.nombre = ''
        form.descripcion = ''
        form.proveedor = ''
        this.setState({ ...this.state, form })
        sendFilters({})
    }

    render() {
        const { form } = this.state
        const { options } = this.props
        return (
            <Form onSubmit={this.onSubmit} >
                <div className="form-group row form-group-marginless mt-3">
                    <div className="col-md-6">
                        <InputGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1} withformgroup={0} requirevalidation={1}
                            name='nombre' iconclass="las la-file-alt icon-xl" placeholder='NOMBRE DE LA PRESTACIÓN' onChange={this.onChange}
                            value={form.nombre} messageinc="Ingresa el nombre de la prestación." />
                    </div>
                    <div className="col-md-6">
                        <ReactSelectSearchGray placeholder='Proveedor' defaultvalue={form.proveedor}
                            iconclass='las la-user icon-xl' requirevalidation={1} options={options.proveedores}
                            onChange={(value) => this.updateSelect(value, 'proveedor')} messageinc='Selecciona el proveedor.' />
                    </div>
                </div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-12">
                        <InputGray
                            withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={0} withformgroup={0} requirevalidation={0}
                            as="textarea" placeholder="DESCRIPCIÓN" rows="3" value={form.descripcion} name="descripcion" onChange={this.onChange}
                            customclass="px-2" messageinc="Incorrecto. Ingresa la descripción."
                        />
                    </div>
                </div>
                <div className="mx-0 row justify-content-between border-top pt-4">
                    <Button only_icon='las la-redo-alt' className="btn btn-light-danger btn-sm font-weight-bold" type='button' text="LIMPIAR"
                        onClick={this.clearFilters} />
                    <Button only_icon='las la-filter' className="btn btn-light-info btn-sm font-weight-bold" type='submit' text="FILTRAR" />
                </div>
            </Form>
        )
    }
}

export default FiltersPrestaciones