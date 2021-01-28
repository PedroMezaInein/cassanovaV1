import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { Input, Button, CircleColor } from '../../form-components'
import { validateAlert } from '../../../functions/alert'
import { COLORS } from '../../../constants'
class RolesMercadotecniaForm extends Component {
    handleChangeColor = (color) => {
        const { onChange } = this.props
        onChange({ target: { value: color.hex, name: 'color' } })
    }
    render() {
        const { form, onChange, onSubmit, formeditado, ...props } = this.props
        return (
            <Form id="form-rol"
                onSubmit={
                    (e) => {
                        e.preventDefault();
                        validateAlert(onSubmit, e, 'form-rol')
                    }
                }
                {...props}
            >
                <div className="form-group row form-group-marginless pt-4">
                    <div className="col-md-6">
                        <Input
                            requirevalidation={1}
                            formeditado={formeditado}
                            name="rol"
                            value={form.rol}
                            placeholder="NOMBRE DEL ROL"
                            onChange={onChange}
                            iconclass={"far fa-window-maximize"}
                            messageinc="Incorrecto. Ingresa el nombre del rol."
                        />
                    </div>
                    <div className="col-md-6">
                        <CircleColor
                            circlesize={23}
                            width="auto"
                            onChange={this.handleChangeColor}
                            placeholder="SELECCIONA EL COLOR DEL ROL"
                            colors={COLORS}
                            classlabel="text-center"
                            classname="d-flex justify-content-center"
                            requirevalidation={1}
                            messageinc="Incorrecto. Selecciona el color."
                        />
                    </div>
                </div>
                <div className="card-footer py-3 pr-1">
                    <div className="row">
                        <div className="col-lg-12 text-right pr-0 pb-0">
                            <Button icon='' className="btn btn-primary mr-2"
                                onClick={
                                    (e) => {
                                        e.preventDefault();
                                        validateAlert(onSubmit, e, 'form-rol')
                                    }
                                }
                                text="ENVIAR" />
                        </div>
                    </div>
                </div>
            </Form>
        )
    }
}

export default RolesMercadotecniaForm