import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import { Input, Button } from '../form-components' 
import { validateAlert } from '../../functions/alert'
import { RFC } from '../../constants'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

class EmpresaForm extends Component {

    addTipo = () => {
        const { form, onChange } = this.props
        console.log('add tipo')
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

    render() {
        const { form, onChange, onSubmit, formeditado } = this.props
        return (
            <Form id="form-empresa"
                onSubmit={
                    (e) => {
                        e.preventDefault();
                        validateAlert(onSubmit, e, 'form-empresa')
                    }
                }
                {...this.props}
            >
                <div className="form-group row form-group-marginless pb-1">
                    <div className="col-md-4">
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
                    <div className="col-md-4">
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
                    <div className="col-md-4">
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
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless pb-1">
                    <div className="col-md-3">
                        <Input
                            requirevalidation = { 0 }
                            formeditado = { formeditado }
                            prefix = ''
                            name = "tipoProyecto"
                            value = { form.tipoProyecto }
                            onChange = { onChange }
                            placeholder = "Tipos de proyectos"
                            iconclass = "fas fa-asterisk"
                            type="text"
                            />
                    </div>
                    <div className="col-md-1 mt-3 d-flex justify-content-center align-items-center">
                        <Button icon = { faPlus } pulse = "pulse-ring" 
                            className = "btn btn-icon btn-light-primary pulse pulse-primary mr-5" 
                            onClick = { this.addTipo } />
                    </div>
                    <div className="col-md-8 row mx-0">
                        {
                            form.tipos.map((tipo, key) => {
                                return (
                                    <div className = "tagify form-control p-1 col-md-2 px-2 d-flex justify-content-center align-items-center white-space" 
                                        tabIndex = "-1" style = { { borderWidth: "0px" } } key = { key }>
                                        <div className=" image-upload d-flex px-3 align-items-center tagify__tag tagify__tag--info tagify--noAnim white-space"  >
                                            <div title="Borrar archivo" className="tagify__tag__removeBtn" role="button" aria-label="remove tag"
                                                onClick={(e) => { e.preventDefault(); this.removeTipo(tipo) }}></div>
                                            <div>
                                                <span className="tagify__tag-text p-1 white-space">
                                                    {tipo}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
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