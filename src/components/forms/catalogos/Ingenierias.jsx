import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { validateAlert } from '../../../functions/alert';
import { InputMoneySinText,Button, InputSinText ,InputNumberSinText} from '../../form-components'

export default class IngenieriaForm extends Component {

    onChange = (e, tipo) => {
        const { value, name } = e.target
        const { form, onChange } = this.props
        let aux = form.esquema_4

        aux.map((element)=>{

            if(element.nombre === tipo.nombre){
                element[name] = value
            }
            element['porcentaje'] = value
            // console.log(element)
            // element['porcentaje'] = 50
            // form.esquema_4.porcentaje = 50
            return ''
        })
        console.log(name)

        onChange({target:{value:aux,name:'esquema_4'}})
    }

    onChangeName = (e, tipo, index) => {
        const { value } = e.target
        const { form, onChange } = this.props
        let aux = form.esquema_4
        aux[index].name = value

        onChange({target:{value:aux,name:'esquema_4'}})
    }

    render() {
        const { form, addRow, onSubmit, formeditado, onChange, ...props } = this.props
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
                <div className="col-md-12 text-center">
                        <div className="d-flex justify-content-center">
                            <div className="col-md-3">
                               
                            </div>
                            <div className="col-md-3">
                                <InputNumberSinText
                                    requirevalidation={0}
                                    formeditado={formeditado}
                                    name="m2"
                                    onChange={onChange}
                                    value={form.m2}
                                    type="text"
                                    placeholder="M2"
                                    messageinc="Incorrecto. Ingresa los M2."
                                    customclass="border-top-0 border-left-0 border-right-0 rounded-0 text-center pl-0"
                                />
                            </div>
                        </div>
                    </div>
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
                                        Total
                                    </b>
                                </td>
                               
                            </tr>
                        </thead>
                        <tbody>
                            {
                                form.esquema_4.map((tipo, key)=>{
                                    return(
                                        <tr key = { key }>
                                            <td className="px-1 py-3 border-0 d-flex justify-content-center">
                                                {
                                                    tipo.id ?
                                                        tipo.tipo 
                                                    : <InputSinText
                                                        name = 'name'
                                                        requireValidation = { 1 }
                                                        value = { tipo.tipo }
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
