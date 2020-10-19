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
        console.log(tipo, index)
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
                        icon = '' onClick = { addRow }
                        className = "btn btn-icon btn-xs p-3 btn-light-success success2"
                        only_icon = "flaticon2-plus icon-13px"
                        tooltip = { { text: 'AGREGAR' } }/>
                </div>
                <div className="py-3">
                    <table className="table table-responsive table-vertical-center text-center">
                        <thead className="bg-gray-200">
                            <tr>
                                <td rowSpan="2" style={{ minWidth: '200px' }} >
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
                                        LIMITE INFERIOR
                                    </b>
                                </td>
                                <td >
                                    <b>
                                        LIMITE SUPERIOR
                                    </b>
                                </td>
                                <td>
                                    <b>
                                        LIMITE INFERIOR
                                    </b>
                                </td>
                                <td>
                                    <b>
                                        LIMITE SUPERIOR
                                    </b>
                                </td>
                                <td>
                                    <b>
                                        LIMITE INFERIOR
                                    </b>
                                </td>
                                <td>
                                    <b>
                                        LIMITE SUPERIOR
                                    </b>
                                </td>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                form.tipos.map((tipo, key)=>{
                                    return(
                                        <tr key = { key }>
                                            <td className="px-1 py-3 border-0">
                                                {
                                                    tipo.id ?
                                                        tipo.name 
                                                    : <InputSinText
                                                        name = 'name'
                                                        requireValidation = { 1 }
                                                        value = { tipo.name }
                                                        onChange = { (e) => { this.onChangeName(e, tipo, key) }}
                                                        customstyle={{ width: "auto", borderRadius: 0, borderTop: 'none', borderRight: 'none', borderLeft: 'none' }}
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
                                                        customstyle={{ width: "auto", borderRadius: 0, borderTop: 'none', borderRight: 'none', borderLeft: 'none' }}
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
                                                        customstyle={{ width: "auto", borderRadius: 0, borderTop: 'none', borderRight: 'none', borderLeft: 'none' }}
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
                                                        customstyle={{ width: "auto", borderRadius: 0, borderTop: 'none', borderRight: 'none', borderLeft: 'none' }}
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
                                                        customstyle={{ width: "auto", borderRadius: 0, borderTop: 'none', borderRight: 'none', borderLeft: 'none' }}
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
                                                        customstyle={{ width: "auto", borderRadius: 0, borderTop: 'none', borderRight: 'none', borderLeft: 'none' }}
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
                                                        customstyle={{ width: "auto", borderRadius: 0, borderTop: 'none', borderRight: 'none', borderLeft: 'none' }}
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
