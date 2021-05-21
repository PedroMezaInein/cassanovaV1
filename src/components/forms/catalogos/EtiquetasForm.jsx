import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { Input, Button, CircleColor } from '../../form-components'
import { validateAlert } from '../../../functions/alert'
import { COLORS } from '../../../constants'
class EtiquetasForm extends Component {

    state = {
        color: ''
    }

    handleChangeColor = (color) => {
        const { onChange } = this.props
        onChange({ target: { value: color.hex, name: 'color' } })
        this.setState({...this.state,color:color});
    }

    componentDidMount = () => {
        const { color } = this.props
        this.setState({ ...this.state,color: {hex: color} })
    }

    render() {
        const { form, onChange, onSubmit, formeditado, ...props } = this.props
        return (
            <Form id="form-etiqueta" {...props}
                onSubmit = {
                    (e) => {
                        e.preventDefault();
                        validateAlert(onSubmit, e, 'form-etiqueta')
                    }
                } >
                <div className = "form-group row form-group-marginless pt-4" >
                    <div className = "col-md-6 align-self-center" >
                        <Input requirevalidation = { 1 } formeditado = { formeditado }
                            name = "etiqueta" value = { form.etiqueta } placeholder = "NOMBRE DE LA ETIQUETA"
                            onChange = { onChange } iconclass = "fas fa-tag"
                            messageinc = "Incorrecto. Ingresa el nombre de la etiqueta." />
                    </div>
                    <div className="col-md-6">
                        <CircleColor circlesize = { 23 } width = "auto" onChange = { this.handleChangeColor }
                            placeholder = "SELECCIONA EL COLOR DE LA ETIQUETA" colors = { COLORS } classlabel = "text-center"
                            classname = "d-flex justify-content-center" requirevalidation = { 1 }
                            messageinc = "Incorrecto. Selecciona el color." value = { this.state.color } />
                    </div>
                </div>
                <div className="card-footer py-3 pr-1">
                    <div className="row mx-0">
                        <div className="col-lg-12 text-right pr-0 pb-0">
                            <Button icon='' className="btn btn-primary mr-2"
                                onClick = { (e) => { e.preventDefault(); validateAlert(onSubmit, e, 'form-etiqueta') } }
                                text="ENVIAR" />
                        </div>
                    </div>
                </div>
            </Form>
        )
    }
}

export default EtiquetasForm