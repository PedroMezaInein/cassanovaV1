import React, { Component } from 'react';
import { Form } from 'react-bootstrap';
import { validateAlert } from '../../../functions/alert';
import { SelectSearchGray, Button, InputGray, CalendarDay } from '../../form-components';
import ItemSlider from '../../singles/ItemSlider';
class BitacoraObraForm extends Component {
    updateProveedor = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'proveedor' } })
    }
    updateProyecto = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'proyecto' } })
    }
    updateTipo = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'tipo' } })
    }
    handleChange = date => {
        const { onChange } = this.props
        onChange({ target: { value: date, name: 'fecha' } })
    }
    render() {
        const { form, formeditado, onChange, options, onSubmit, handleChange, deleteFile, proyecto, ...props } = this.props
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
                    <div className="row form-group-marginless mx-0 my-6">
                        <div className="col-md-6 align-self-center text-center">
                            <div className="d-flex justify-content-center" style={{ height: '1px' }}>
                                <label className="text-center font-weight-bolder text-dark-60">Fecha</label>
                            </div>
                            <CalendarDay date={form.fecha} onChange={onChange} name='fecha' requirevalidation={1} />
                        </div>
                        <div className="col-md-6 align-self-center">
                            <div className="row form-group-marginless">
                                <div className="col-md-12">
                                    <SelectSearchGray withtaglabel = { 1 } withtextlabel = { 1 } requirevalidation = { 1 } formeditado = { formeditado }
                                        options = { options.proveedores } placeholder = "SELECCIONA EL PROVEEDOR" name = "proveedor" value = { form.proveedor }
                                        onChange = { this.updateProveedor } iconclass = "far fa-user" messageinc = "Incorrecto. Selecciona el proveedor"
                                        customdiv = "mb-3" />
                                </div>
                                <div className="col-md-12">
                                    <InputGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder={1} withicon = { 1 } requirevalidation = { 1 }
                                        withformgroup = { 0 } formeditado = { formeditado } placeholder = "TIPO DE NOTA" name = "tipo_nota"
                                        value = { form.tipo_nota } onChange = { onChange } messageinc = "Incorrecto. Ingresa el tipo de nota."
                                        iconclass = "far fa-sticky-note" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="separator separator-dashed mt-1 mb-2"></div>
                    <div className="row form-group-marginless mt-4 mx-0">
                        <div className="col-md-12">
                            <InputGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 } withicon = { 0 } withformgroup = { 0 } 
                                requirevalidation = { 0 } formeditado = { formeditado } rows = "3" as = "textarea" placeholder = "NOTAS" 
                                name = "notas" value = { form.notas } onChange = { onChange } style = { { paddingLeft: "10px" } }
                                messageinc = "Incorrecto. Ingresa la nota." />
                        </div>
                    </div>
                    <div className="separator separator-dashed my-5"></div>
                    <div className="row form-group-marginless mt-4 mx-0">
                        <div className="col-md-12 pb-5">
                            <ItemSlider items = { form.adjuntos.adjuntos.files } item = 'adjuntos' handleChange = { handleChange }
                            // deleteFile={deleteFile}
                                />
                        </div>
                    </div>
                    <div className="card-footer py-3 pr-1">
                        <div className="row mx-0">
                            <div className="col-lg-12 text-right pr-0 pb-0">
                                <Button icon='' text='ENVIAR' className="btn btn-primary mr-2" onClick={(e) => { e.preventDefault(); onSubmit(e) }} />
                            </div>
                        </div>
                    </div>
                </Form>
            </>
        );
    }
}

export default BitacoraObraForm;