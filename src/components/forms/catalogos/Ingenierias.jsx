import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { validateAlert } from '../../../functions/alert';
import { InputMoneySinText,Button, InputSinText } from '../../form-components'

export default class IngenieriaForm extends Component {

    onChange = (e, tipo) => {
        const { value, name } = e.target
        const { form, onChange } = this.props
        let aux = form.esquema_3

        aux.map((element)=>{

            if(element.nombre === tipo.nombre){
                element[name] = value
            }
            return ''
        })
        onChange({target:{value:aux,name:'esquema_3'}})
    }

    onChangeName = (e, tipo, index) => {
        const { value } = e.target
        const { form, onChange } = this.props
        let aux = form.esquema_3
        aux[index].name = value
        onChange({target:{value:aux,name:'esquema_3'}})
    }

    render() {
        const { form, addRow, onSubmit, ...props } = this.props
        return (
            <Form 
                id="form-ingenierias"
                onSubmit={
                    (e) => {
                        e.preventDefault();
                        validateAlert(onSubmit, e, 'form-ingenierias')
                    }
                }
                {...props}>
                
                <div className="py-3 d-flex justify-content-center">
                    <table className="table table-responsive-md table-vertical-center text-center" style={{width: '90%'}}>
                        <thead className="bg-gray-200">
                            <tr>
                                <td style={{ minWidth: '150px' }} >
                                  Ingenierías
                                </td>
                                <td  colSpan="2">
                                   Montos
                                </td>                                
                            </tr>
                            <tr>
                                <td>
                                    <b>
                                      Esquema 3
                                    </b>
                                </td>
                                <td>
                                    <b>
                                        Monto
                                    </b>
                                </td>
                                <td >
                                    <b>
                                        %
                                    </b>
                                </td>
                               
                            </tr>
                        </thead>
                        <tbody>
                            {
                                form.esquema_3.map((tipo, key)=>{
                                    return(
                                        <tr key = { key }>
                                            <td className="px-1 py-3 border-0 d-flex justify-content-center">
                                                {
                                                    tipo.id ?
                                                        tipo.nombre 
                                                    : <InputSinText
                                                        name = 'name'
                                                        requireValidation = { 1 }
                                                        value = { tipo.nombre }
                                                        onChange = { (e) => { this.onChangeName(e, tipo, key) }}
                                                        // customstyle={{ width: "auto", borderRadius: 0, borderTop: 'none', borderRight: 'none', borderLeft: 'none' }}
                                                        customclass="border-top-0 border-left-0 border-right-0 rounded-0 w-auto text-center pl-0" 
                                                    />
                                                }
                                            </td>
                                            <td className="px-1 py-3 border-0">
                                                <div className="d-flex justify-content-center">
                                                    <InputMoneySinText
                                                        name = 'monto'
                                                        requireValidation = { 1 }
                                                        value = { tipo.monto }
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
                                                        name = 'porcentaje'
                                                        requireValidation = { 1 }
                                                        value = { tipo.porcentaje }
                                                        onChange = { (e) => { this.onChange(e, tipo) }}
                                                        thousandseparator={true}
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
