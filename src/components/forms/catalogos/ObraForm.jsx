import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { validateAlert } from '../../../functions/alert';
import { InputMoneySinText,Button, InputSinText } from '../../form-components'

export default class ObraForm extends Component {

    onChange = (e, tipo) => {
        const { value, name } = e.target
        const { form, onChange } = this.props
        let aux = form.tipos
        aux.map((element)=>{
            if(element.name === tipo.name){
                element.parametricos[name] = value
            }
        })
        onChange({target:{value:aux,name:'tipos'}})
    }

    onChangeName = (e, tipo, index) => {
        const { value } = e.target
        const { form, onChange } = this.props
        let aux = form.tipos
        aux[index].name = value
        onChange({target:{value:aux,name:'tipos'}})
    }

    render() {
        const { form, addRow, onSubmit, ...props } = this.props
        return (
            <Form 
                id="form-obra"
                onSubmit={
                    (e) => {
                        e.preventDefault();
                        validateAlert(onSubmit, e, 'form-obra')
                    }
                }
                {...props}>
                <div className="d-flex justify-content-end">
                    <Button
                        icon = '' 
                        onClick = { addRow }
                        className = "btn btn-icon btn-xs p-3 btn-light-success success2"
                        only_icon = "flaticon2-plus icon-13px"
                        tooltip = { { text: 'AGREGAR' } }
                    />
                </div>
                <div className="py-3 d-flex justify-content-center">
                    <table className="table table-responsive-md table-vertical-center text-center" style={{width: '90%'}}>
                        <thead className="bg-gray-200">
                            <tr>
                                <td style={{ minWidth: '150px' }} >
                                    TIPO PROYECTO
                                </td>
                                <td  colSpan="2">
                                    CONSTRUCCIÓN INTERIORES
                                </td>
                                <td  colSpan="2">
                                    MOBILIARIO
                                </td>
                                <td  colSpan="2">
                                    CONSTRUCCIÓN CIVIL
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <b>
                                        LIMITE
                                    </b>
                                </td>
                                <td>
                                    <b>
                                        INFERIOR
                                    </b>
                                </td>
                                <td >
                                    <b>
                                        SUPERIOR
                                    </b>
                                </td>
                                <td>
                                    <b>
                                        INFERIOR
                                    </b>
                                </td>
                                <td>
                                    <b>
                                        SUPERIOR
                                    </b>
                                </td>
                                <td>
                                    <b>
                                        INFERIOR
                                    </b>
                                </td>
                                <td>
                                    <b>
                                        SUPERIOR
                                    </b>
                                </td>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                form.tipos.map((tipo, key)=>{
                                    return(
                                        <tr key = { key }>
                                            <td className="px-1 py-3 border-0 d-flex justify-content-center">
                                                {
                                                    tipo.id ?
                                                        tipo.name 
                                                    : <InputSinText
                                                        name = 'name'
                                                        requireValidation = { 1 }
                                                        value = { tipo.name }
                                                        onChange = { (e) => { this.onChangeName(e, tipo, key) }}
                                                        // customstyle={{ width: "auto", borderRadius: 0, borderTop: 'none', borderRight: 'none', borderLeft: 'none' }}
                                                        customclass="border-top-0 border-left-0 border-right-0 rounded-0 w-auto text-center pl-0" 
                                                    />
                                                }
                                            </td>
                                            <td className="px-1 py-3 border-0">
                                                <div className="d-flex justify-content-center">
                                                    <InputMoneySinText
                                                        name = 'construccion_interiores_inf'
                                                        requireValidation = { 1 }
                                                        value = { tipo.parametricos.construccion_interiores_inf }
                                                        onChange = { (e) => { this.onChange(e, tipo) }}
                                                        thousandseparator={true}
                                                        prefix={'$'}
                                                        // customstyle={{ width: "auto", borderRadius: 0, borderTop: 'none', borderRight: 'none', borderLeft: 'none' }}
                                                        customclass="border-top-0 border-left-0 border-right-0 rounded-0 w-100px text-center pl-0" 
                                                    />
                                                </div>
                                            </td>
                                            <td className="px-1 py-3 border-0">
                                                <div className="d-flex justify-content-center">
                                                    <InputMoneySinText
                                                        name = 'construccion_interiores_sup'
                                                        requireValidation = { 1 }
                                                        value = { tipo.parametricos.construccion_interiores_sup }
                                                        onChange = { (e) => { this.onChange(e, tipo) }}
                                                        thousandseparator={true}
                                                        prefix={'$'}
                                                        // customstyle={{ width: "auto", borderRadius: 0, borderTop: 'none', borderRight: 'none', borderLeft: 'none' }}
                                                        customclass="border-top-0 border-left-0 border-right-0 rounded-0 w-100px text-center pl-0" 
                                                    />
                                                </div>
                                            </td>
                                            <td className="px-1 py-3 border-0">
                                                <div className="d-flex justify-content-center">
                                                    <InputMoneySinText
                                                        name = 'mobiliario_inf'
                                                        requireValidation = { 1 }
                                                        value = { tipo.parametricos.mobiliario_inf }
                                                        onChange = { (e) => { this.onChange(e, tipo) }}
                                                        thousandseparator={true}
                                                        prefix={'$'}
                                                        // customstyle={{ width: "auto", borderRadius: 0, borderTop: 'none', borderRight: 'none', borderLeft: 'none' }}
                                                        customclass="border-top-0 border-left-0 border-right-0 rounded-0 w-100px text-center pl-0" 
                                                    />
                                                </div>
                                            </td>
                                            <td className="px-1 py-3 border-0">
                                                <div className="d-flex justify-content-center">
                                                    <InputMoneySinText
                                                        name = 'mobiliario_sup'
                                                        requireValidation = { 1 }
                                                        value = { tipo.parametricos.mobiliario_sup }
                                                        onChange = { (e) => { this.onChange(e, tipo) }}
                                                        thousandseparator={true}
                                                        prefix={'$'}
                                                        // customstyle={{ width: "auto", borderRadius: 0, borderTop: 'none', borderRight: 'none', borderLeft: 'none' }}
                                                        customclass="border-top-0 border-left-0 border-right-0 rounded-0 w-100px text-center pl-0" 
                                                    />
                                                </div>
                                            </td>
                                            <td className="px-1 py-3 border-0">
                                                <div className="d-flex justify-content-center">
                                                    <InputMoneySinText
                                                        name = 'construccion_civil_inf'
                                                        requireValidation = { 1 }
                                                        value = { tipo.parametricos.construccion_civil_inf }
                                                        onChange = { (e) => { this.onChange(e, tipo) }}
                                                        thousandseparator={true}
                                                        prefix={'$'}
                                                        // customstyle={{ width: "auto", borderRadius: 0, borderTop: 'none', borderRight: 'none', borderLeft: 'none' }}
                                                        customclass="border-top-0 border-left-0 border-right-0 rounded-0 w-100px text-center pl-0" 
                                                    />
                                                </div>
                                            </td>
                                            <td className="px-1 py-3 border-0">
                                                <div className="d-flex justify-content-center">
                                                    <InputMoneySinText
                                                        name = 'construccion_civil_sup'
                                                        requireValidation = { 1 }
                                                        value = { tipo.parametricos.construccion_civil_sup }
                                                        onChange = { (e) => { this.onChange(e, tipo) }}
                                                        thousandseparator={true}
                                                        prefix={'$'}
                                                        // customstyle={{ width: "auto", borderRadius: 0, borderTop: 'none', borderRight: 'none', borderLeft: 'none' }}
                                                        customclass="border-top-0 border-left-0 border-right-0 rounded-0 w-100px text-center pl-0" 
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
                <div className="card-footer py-3 pr-1 text-right">
                    <Button icon='' className="btn btn-primary mr-2"
                        onClick={
                            (e) => {
                                e.preventDefault();
                                validateAlert(onSubmit, e, 'form-obra')
                            }
                        }
                        text="ENVIAR" />
                </div>
            </Form>
        )
    }
}
