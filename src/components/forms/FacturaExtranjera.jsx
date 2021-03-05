import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import ItemSlider from '../singles/ItemSlider'
class FacturaExtranjera extends Component {
    render() {
        const { form, onChangeAdjunto, deleteFile, ...props } = this.props
        return (
            <Form {...props}>
                <div className="col-md-12 text-center">
                    <label className="col-form-label my-2 font-weight-bolder">{form.adjuntos.factura.placeholder}</label>
                    <ItemSlider items = { form.adjuntos.factura.files } item = 'factura' handleChange = { onChangeAdjunto }
                        multiple = { true } deleteFile = { deleteFile } accept = "application/pdf" />
                </div>
            </Form>
        )
    }
}

export default FacturaExtranjera