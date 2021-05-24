import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import { Input, Button, TagInput, InputPhone, TagSelectSearch} from '../form-components' 
import { validateAlert } from '../../functions/alert'
import { RFC, TEL } from '../../constants'

class EmpresaForm extends Component {

    addTipo = () => {
        const { form, onChange } = this.props
        if(form.tipoProyecto){
            let aux = true
            let array = []
            form.tipos.map((tipo)=>{
                if(tipo === form.tipoProyecto)
                    aux = false
                array.push(tipo)
                return false
            })
            if(aux){
                array.push(form.tipoProyecto)
                onChange({target:{value:array, name: 'tipos'}})
                onChange({target:{value:'', name: 'tipoProyecto'}})
            }
                
        }
    }

    removeTipo = (tipo) => {
        const { form, onChange } = this.props
        let array = []
        form.tipos.map((element)=>{
            if(element !== tipo)
                array.push(element)
            return false
        })
        onChange({target:{value:array, name: 'tipos'}})
        onChange({target:{value:'', name: 'tipoProyecto'}})
    }

    updateDepartamentos = value => {
        const { onChange } = this.props
        onChange({target: { value: value, name: 'departamentos'}}, true)
    }
    render() {
        const { form, onChange, onSubmit, formeditado,tagInputChange, tagInputChangeTelefono, options, ...props } = this.props
        return (
            <Form id="form-empresa"
                onSubmit={
                    (e) => {
                        e.preventDefault();
                        validateAlert(onSubmit, e, 'form-empresa')
                    }
                }
                {...props}
            >
                <div className="form-group row form-group-marginless">
                    <div className="col-md-3">
                        <Input
                            requirevalidation={1}
                            formeditado={formeditado}
                            onChange={onChange}
                            name="name"
                            type="text"
                            value={form.name}
                            placeholder="NOMBRE"
                            iconclass={"far fa-user"}
                            messageinc="Incorrecto. Ingresa el nombre de la empresa"
                        />
                    </div>
                    <div className="col-md-3">
                        <Input
                            requirevalidation={1}
                            formeditado={formeditado}
                            onChange={onChange}
                            name="razonSocial"
                            type="text"
                            value={form.razonSocial}
                            placeholder="RAZÓN SOCIAL"
                            iconclass={"far fa-building"}
                            messageinc="Incorrecto. Ingresa la razón social"
                        />
                    </div>
                    <div className="col-md-3">
                        <Input
                            requirevalidation={1}
                            formeditado={formeditado}
                            onChange={onChange}
                            name="rfc"
                            type="text"
                            value={form.rfc}
                            placeholder="RFC"
                            iconclass={"far fa-file-alt"}
                            patterns={RFC}
                            messageinc="Incorrecto. Ej. ABCD001122ABC"
                            maxLength="13"
                        />
                    </div>
                    <div className="col-md-3">
                        <Input
                            requirevalidation={0}
                            formeditado={formeditado}
                            onChange={onChange}
                            name="pagina_web"
                            type="text"
                            value={form.pagina_web}
                            placeholder="PÁGINA WEB"
                            iconclass={"flaticon2-world"}
                            messageinc="Incorrecto. Ingresa la página web"
                            letterCase = { false }
                        />
                    </div>
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-3">
                        <Input
                            requirevalidation={0}
                            formeditado={formeditado}
                            onChange={onChange}
                            name="facebook"
                            type="text"
                            value={form.facebook}
                            placeholder="FACEBOOK"
                            iconclass={"socicon-facebook"}
                            messageinc="Incorrecto. Ingresa la liga de facebook"
                            letterCase = { false }
                        />
                    </div>
                    <div className="col-md-3">
                        <Input
                            requirevalidation={0}
                            formeditado={formeditado}
                            onChange={onChange}
                            name="instagram"
                            type="text"
                            value={form.instagram}
                            placeholder="INSTAGRAM"
                            iconclass={"socicon-instagram"}
                            messageinc="Incorrecto. Ingresa la liga de instagram"
                            letterCase = { false }
                        />
                    </div>
                    <div className="col-md-3">
                        <Input
                            requirevalidation={0}
                            formeditado={formeditado}
                            onChange={onChange}
                            name="linkedin"
                            type="text"
                            value={form.linkedin}
                            placeholder="LINKEDIN"
                            iconclass={"socicon-linkedin"}
                            messageinc="Incorrecto. Ingresa la liga de linkedin"
                            letterCase = { false }
                        />
                    </div>
                    <div className="col-md-3">
                        <Input
                            requirevalidation={0}
                            formeditado={formeditado}
                            onChange={onChange}
                            name="pinterest"
                            type="text"
                            value={form.pinterest}
                            placeholder="PINTEREST"
                            iconclass={"socicon-pinterest"}
                            messageinc="Incorrecto. Ingresa la liga de pinterest"
                            letterCase = { false }
                        />
                    </div>
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-3">
                        <Input
                            requirevalidation={0}
                            formeditado={formeditado}
                            onChange={onChange}
                            name="blog"
                            type="text"
                            value={form.blog}
                            placeholder="BLOG"
                            iconclass={"fab fa-blogger"}
                            messageinc="Incorrecto. Ingresa la liga del blog"
                            letterCase = { false }
                        />
                    </div>
                    <div className="col-md-3">
                        {/* <TagInput
                            tags={form.telefonos} 
                            onChange={tagInputChangeTelefono} 
                            placeholder={"NÚMEROS TELEFÓNICOS"}
                            iconclass={"fas fa-phone-alt"}
                        /> */}
                        <InputPhone
                            requirevalidation={0}
                            formeditado={formeditado}
                            placeholder="TELÉFONO"
                            name="telefono"
                            value={form.telefono}
                            onChange={onChange}
                            iconclass={"fas fa-mobile-alt"}
                            patterns={TEL}
                            messageinc="Incorrecto. Ingresa el número de teléfono."
                            thousandseparator={false}
                            prefix={''}
                        />
                    </div>
                    <div className="col-md-6">
                        <TagInput
                            tags={form.tipos} 
                            onChange={tagInputChange} 
                            placeholder={"TIPOS DE PROYECTO"}
                            iconclass={"far fa-folder-open"}
                        />
                    </div>
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-6">
                        <Input
                            requirevalidation={1}
                            formeditado={formeditado}
                            onChange={onChange}
                            name="direccion"
                            type="text"
                            value={form.direccion}
                            placeholder="DIRECCIÓN DE LA EMPRESA"
                            iconclass={"flaticon2-map"}
                            messageinc="Incorrecto. Ingresa la dirección de la empresa"
                        />
                    </div>
                    <div className="col-md-6">
                        <TagSelectSearch
                            placeholder='Selecciona el departamento '
                            options={options.departamentos}
                            iconclass='las la-user-friends icon-xl'
                            defaultvalue={form.departamentos}
                            onChange={this.updateDepartamentos}
                        />
                    </div>
                </div>
                <div className="card-footer py-3 pr-1 text-right">
                    <Button text='ENVIAR' type='submit' className="btn btn-primary mr-2" icon=''/>
                </div>
            </Form>
        )
    }
}

export default EmpresaForm