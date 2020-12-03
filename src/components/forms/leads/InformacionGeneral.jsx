import React, { Component } from 'react'
import { Button, InputGray, InputPhoneGray, CalendarDay } from '../../form-components'
import { Form } from 'react-bootstrap'
import { TEL, EMAIL } from '../../../constants'
class InformacionGeneral extends Component {

    componentDidMount(){
        const { form, onChange } = this.props
        onChange({ target: { name: 'fecha', value: form.fecha } })
    }

    render() {
        const { form, onChange, onSubmit, lead, formeditado } = this.props
        return (
            <>
                <Form>
                    <div className="form-group row form-group-marginless mb-0 justify-content-center">
                        <div className={lead.estatus? lead.estatus.estatus!=="En espera" ?"col-md-3":"col-md-4":"col-md-4"}>
                            <InputGray
                                withtaglabel={1}
                                withtextlabel={1}
                                withplaceholder={1}
                                withicon={1}
                                requirevalidation = { formeditado === false ? 0 : 1 }
                                placeholder='NOMBRE DEL LEAD'
                                iconclass="far fa-user"
                                name='name'
                                value={form.name}
                                onChange={onChange}
                                messageinc="Incorrecto. Ingresa el nombre del lead."
                            />
                        </div>
                        <div className={lead.estatus? lead.estatus.estatus!=="En espera" ?"col-md-3":"col-md-4":"col-md-4"}>
                            <InputGray
                                withtaglabel={1}
                                withtextlabel={1}
                                withplaceholder={1}
                                withicon={1}
                                requirevalidation = { formeditado === false ? 0 : 1 }
                                placeholder="CORREO ELECTRÓNICO"
                                iconclass="fas fa-envelope"
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={onChange}
                                patterns={EMAIL}
                                messageinc="Incorrecto. Ingresa el correo electrónico."
                            />
                        </div>
                        <div className={lead.estatus? lead.estatus.estatus!=="En espera" ?"col-md-3":"col-md-4":"col-md-4"}>
                            <InputPhoneGray
                                withtaglabel={1}
                                withtextlabel={1}
                                withplaceholder={1}
                                withicon={1}
                                requirevalidation = { formeditado === false ? 0 : 1 }
                                placeholder="TELÉFONO DE CONTACTO"
                                iconclass="fas fa-mobile-alt"
                                name="telefono"
                                value={form.telefono}
                                onChange={onChange}
                                patterns={TEL}
                                thousandseparator={false}
                                prefix=''
                                messageinc="Incorrecto. Ingresa el teléfono de contacto."
                            />
                        </div>
                        {
                            lead.estatus?
                                lead.estatus.estatus!=="En espera"  ?
                                    <div className="col-md-3">
                                        <InputGray
                                            withtaglabel={1}
                                            withtextlabel={1}
                                            withplaceholder={1}
                                            withicon={1}
                                            requirevalidation={1}
                                            formeditado={formeditado}
                                            placeholder='NOMBRE DEL PROYECTO'
                                            iconclass="far fa-folder-open"
                                            name='proyecto'
                                            value={form.proyecto}
                                            onChange={onChange}
                                            messageinc="Incorrecto. Ingresa el nombre del proyecto."
                                        />
                                    </div>
                                : ''
                            : ''
                        }
                        
                    </div>
                    <div className="separator separator-dashed mt-1 mb-2"></div>
                    <div className="form-group row form-group-marginless mt-4">
                        <div className="col-md-12 text-center align-self-center">
                            <div className="d-flex justify-content-center" style={{ height: '1px' }}>
                                <label className="text-center font-weight-bold text-dark-60">Fecha de ingreso</label>
                            </div>
                            <CalendarDay
                                value={form.fecha}
                                date = { form.fecha }
                                onChange={onChange}
                                name='fecha'
                            />
                        </div>
                    </div>
                    <div className="card-footer px-2 py-3">
                        <div className="row">
                            <div className="col-lg-12 text-right pr-0 pb-0">
                                <Button icon='' className="btn btn-primary mr-2"
                                    onClick={
                                        (e) => {
                                            e.preventDefault();
                                            onSubmit()
                                        }
                                    }
                                    text="ENVIAR"
                                />
                            </div>
                        </div>
                    </div>
                </Form>
            </>
        )
    }
}

export default InformacionGeneral