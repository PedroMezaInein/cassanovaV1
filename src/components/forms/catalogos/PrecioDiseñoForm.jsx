import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { Button } from '../../form-components'
import { validateAlert } from '../../../functions/alert'
import InputNumber from '../../form-components/InputNumber'
import InputMoney from '../../form-components/InputMoney'

class AreaForm extends Component {

    render() {
        const { title, form, onChange, addSubarea, deleteSubarea, onSubmit, formeditado, ...props } = this.props
        return (
            
            // fab fa-uikit   fas fa-camera-retro   fas fa-cubes   
            <Form id="form-precio"
                onSubmit={
                    (e) => {
                        e.preventDefault();
                        validateAlert(onSubmit, e, 'form-precio')
                    }
                }
                {...props}>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-4">
                        <InputNumber
                            requirevalidation = { 1 }
                            formeditado = { formeditado }
                            name = "m2"
                            onChange = { onChange }
                            value = { form.m2 }
                            type = "text"
                            placeholder = "M2"
                            iconclass={"fas fa-ruler-combined"}
                            thousandseparator={true}
                            messageinc = "Incorrecto. Ingresa los M2."
                        />
                    </div>
                    <div className="col-md-4">
                        <InputMoney
                            requirevalidation = { 1 }
                            formeditado = { formeditado }
                            name = "precio_m2"
                            onChange = { onChange }
                            value = { form.precio_m2 }
                            type = "text"
                            placeholder = "Precio por M2"
                            iconclass = {"fas fa-dollar-sign"}
                            prefix="$"
                            thousandseparator={true}
                            messageinc = "Incorrecto. Ingresa el precio por m2."/>
                    </div>
                    <div className="col-md-4">
                        <InputMoney
                            requirevalidation = { 1 }
                            formeditado = { 1 }
                            name = "esquema_1"
                            onChange = { onChange }
                            value = { form.esquema_1 }
                            type = "text"
                            placeholder = "Esquema 1"
                            iconclass = {"fas fa-camera-retro"}
                            prefix="$"
                            thousandseparator={true}
                            messageinc = "Incorrecto. Ingresa el esquema 1."/>
                    </div>
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless pt-4">
                    <div className="col-md-3">
                        <InputNumber
                            requirevalidation = { 1 }
                            formeditado = { formeditado }
                            name = "incremento_esquema_2"
                            onChange = { onChange }
                            value = { form.incremento_esquema_2 }
                            type = "text"
                            placeholder = "Incremento esquema 2"
                            /* prefix={'%'} */
                            iconclass = {"far fa-plus-square"}
                            messageinc = "Incorrecto. Ingresa el incremento al esquema 2."/>
                    </div>
                    <div className="col-md-3">
                        <InputMoney
                            requirevalidation = { 1 }
                            formeditado = { formeditado }
                            name = "esquema_2"
                            onChange = { onChange }
                            value = { form.esquema_2 }
                            type = "text"
                            placeholder = "Esquema 2"
                            prefix={'$'}
                            iconclass = {"fas fa-cubes"}
                            thousandseparator={true}
                            messageinc = "Incorrecto. Ingresa el esquema 2."/>
                    </div>
                    <div className="col-md-3">
                        <InputNumber
                            requirevalidation = { 1 }
                            formeditado = { formeditado }
                            name = "incremento_esquema_3"
                            onChange = { onChange }
                            value = { form.incremento_esquema_3 }
                            type = "text"
                            placeholder = "Incremento esquema 3"
                            /* prefix={'%'} */
                            iconclass = {"far fa-plus-square"}
                            messageinc = "Incorrecto. Ingresa el incremento al esquema 3."/>
                    </div>
                    <div className="col-md-3">
                        <InputMoney
                            requirevalidation = { 1 }
                            formeditado = { formeditado }
                            name = "esquema_3"
                            onChange = { onChange }
                            value = { form.esquema_3 }
                            type = "text"
                            placeholder = "Esquema 3"
                            prefix={'$'}
                            iconclass = {"flaticon2-laptop"}
                            thousandseparator={true}
                            messageinc = "Incorrecto. Ingresa el esquema 3."/>
                    </div>
                </div>

                <div className="card-footer py-3 pr-1">
                    <div className="row mx-0">
                        <div className="col-lg-12 text-right pr-0 pb-0">
                            <Button icon='' text='ENVIAR' type='submit' className="btn btn-primary mr-2" />
                        </div>
                    </div>
                </div>

            </Form>
        )
    }
}

export default AreaForm