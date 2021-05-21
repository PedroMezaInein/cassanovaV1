import React, { Component } from 'react';
import { Form } from 'react-bootstrap';
import { validateAlert } from '../../../functions/alert';
import { Input, SelectSearch, Button } from '../../form-components';
import { ItemSlider } from '../../singles';
class DocumentosForm extends Component {
    updateEmpresa = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'empresa' } })
    }
    render() {
        const { form, formeditado, onChange, options, onSubmit, handleChange, deleteFile, ...props } = this.props
        return (
            <>
                <Form
                    onSubmit={
                        (e) => {
                            e.preventDefault();
                            validateAlert(onSubmit, e, 'wizard-3-content')
                        }
                    }
                    {...props} >
                    <div className="form-group row form-group-marginless justify-content-md-center">
                        <div className="col-md-4">
                            <SelectSearch
                                formeditado={formeditado}
                                options={options.empresas}
                                placeholder='EMPRESA'
                                name='empresa'
                                value={form.empresa}
                                onChange={this.updateEmpresa}
                                messageinc="Incorrecto. Selecciona la empresa"
                            />
                        </div>
                        <div className="col-md-4">
                            <Input
                                requirevalidation={1}
                                formeditado={formeditado}
                                name='nombre'
                                value={form.nombre}
                                onChange={onChange}
                                type='text'
                                placeholder='NOMBRE DEL DOCUMENTO'
                                iconclass='far fa-file-alt'
                                messageinc='Incorrecto. Ingresa el nombre del documento.' />
                        </div>
                    </div>
                    <div className="form-group row form-group-marginless justify-content-center">
                        <div className="col-md-6">
                            <ItemSlider
                                multiple={false}
                                items={form.adjuntos.adjuntos.files}
                                item='adjuntos' handleChange={handleChange}
                                deleteFile={deleteFile} />
                        </div>
                    </div>
                    {
                        form.adjuntos.adjuntos.files.length > 0 ?
                            <div className="card-footer py-3 pr-1">
                                <div className="row mx-0">
                                    <div className="col-lg-12 text-right pr-0 pb-0">
                                        <Button
                                            icon=''
                                            text='ENVIAR'
                                            onClick={(e) => { e.preventDefault(); onSubmit(e) }}
                                        />
                                    </div>
                                </div>
                            </div>
                            : ''
                    }
                </Form>
            </>
        );
    }
}

export default DocumentosForm;

