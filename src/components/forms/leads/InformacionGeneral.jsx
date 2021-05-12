import React, { Component } from 'react'
import { Button, InputGray, InputPhoneGray, CalendarDay } from '../../form-components'
import { Form, Col, Row } from 'react-bootstrap'
import { TEL, EMAIL } from '../../../constants'
import SelectSearchGray from '../../form-components/Gray/SelectSearchGray'
import { getEstados } from '../../../functions/setters'
class InformacionGeneral extends Component {

    componentDidMount() {
        const { form, onChange } = this.props
        onChange({ target: { name: 'fecha', value: form.fecha } })
    }

    updateTipoProyecto = value => {
        const { onChange } = this.props
        onChange({ target: { name: 'tipoProyecto', value: value } })
    }

    estatus() {
        const { lead } = this.props
        if (lead.estatus) {
            return lead.estatus.estatus
        }
    }
    updateEstados= value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'estado' } })
    }
    render() {
        const { form, onChange, onSubmit, lead, formeditado, options } = this.props
        return (
            <Form>
                <Row className="mx-0">
                    <Col md="4" className="align-self-center">
                        <div className="col-md-12 px-0 text-center align-self-center">
                            <div className="d-flex justify-content-center" style={{ height: '1px' }}>
                                <label className="text-center font-weight-bold text-dark-60">Fecha de ingreso</label>
                            </div>
                            <CalendarDay value={form.fecha} date={form.fecha} onChange={onChange} name='fecha' withformgroup={0} requirevalidation={1}/>
                        </div>
                    </Col>
                    <Col md="8" className="align-self-center">
                        <div className="form-group row form-group-marginless mb-2">
                            <div className={lead.relaciones_publicas === 1 || this.estatus() === "En espera" ? "col-md-6" : "col-md-4"}>
                                <InputGray withtaglabel={1} withtextlabel={1} withplaceholder={1}
                                    withicon={1} withformgroup={1} requirevalidation={formeditado === false ? 0 : 1}
                                    placeholder='NOMBRE DEL LEAD' iconclass="far fa-user" name='name'
                                    value={form.name} onChange={onChange} messageinc="Ingresa el nombre del lead."
                                />
                            </div>
                            <div className={lead.relaciones_publicas === 1 || this.estatus() === "En espera" ? "col-md-6" : "col-md-4"}>
                                <InputGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1}
                                    withformgroup={1} requirevalidation={formeditado === false ? 0 : 1} placeholder="CORREO ELECTRÓNICO"
                                    iconclass="fas fa-envelope" type="email" name="email" value={form.email} onChange={onChange}
                                    patterns={EMAIL} messageinc="Ingresa el correo electrónico." letterCase={false} />
                            </div>
                            <hr/>
                            <div className="separator separator-dashed mt-1 mb-2 ml-0 mr-0"></div>
                            <div className={lead.relaciones_publicas === 1 || this.estatus() === "En espera" ? "col-md-6" : "col-md-4"}>
                                <InputPhoneGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1}
                                    requirevalidation={formeditado === false ? 0 : 1} placeholder="TELÉFONO DE CONTACTO"
                                    iconclass="fas fa-mobile-alt" name="telefono" value={form.telefono}
                                    onChange={onChange} patterns={TEL} thousandseparator={false} prefix=''
                                    messageinc="Ingresa el teléfono de contacto." />
                            </div>
                            <div className={lead.relaciones_publicas === 1 || this.estatus() === "En espera" ? "col-md-6" : "col-md-4"}>
                                <SelectSearchGray options = { getEstados() } placeholder = "SELECCIONA EL ESTADO" name = "estado"
                                    value = { form.estado } onChange = { this.updateEstados } requirevalidation = { 1 }
                                    messageinc = "Selecciona el estado." customdiv = "mb-0" withtaglabel = { 1 } withtextlabel = { 1 } />
                            </div>
                            {
                            lead.relaciones_publicas === 1 || this.estatus() === "En espera" ? ""
                                : <>
                                    {
                                        options ?
                                            options.tipos ?
                                                options.tipos.length ?
                                                    <>
                                                        <div className='col-md-4 form-group'>
                                                            <SelectSearchGray options={options.tipos} placeholder="TIPO DE PROYECTO"
                                                                name="tipoProyecto" value={form.tipoProyecto} onChange={this.updateTipoProyecto}
                                                                requirevalidation={1} messageinc="Seleccione el proyecto."
                                                                customdiv="mb-0" withtaglabel={1} withtextlabel={1} />
                                                        </div>
                                                    </>
                                                    : ''
                                                : ''
                                            : ''
                                    }
                                    {
                                        this.estatus() === "En espera" && lead.relaciones_publicas === false ?
                                            ''
                                            :
                                            <div className="col-md-4">
                                                <InputGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1}
                                                    requirevalidation={1} withformgroup={1} formeditado={formeditado}
                                                    placeholder='NOMBRE DEL PROYECTO' iconclass="far fa-folder-open" name='proyecto'
                                                    value={form.proyecto} onChange={onChange}
                                                    messageinc="Ingresa el nombre del proyecto."
                                                />
                                            </div>
                                    }
                                </>
                        }
                        </div>
                        {
                            lead.comentario?
                            <>
                                <div className="separator separator-dashed mt-1 mb-2"></div>
                                <div className="form-group row form-group-marginless my-6 justify-content-center">
                                    <div className="col-md-12 px-4">
                                        <div className="bg-gray-100 p-3 font-size-lg font-weight-light text-justify" style={{ fontSize: '13.5px' }}>
                                            <span className="font-weight-bolder text-dark-60">Comentario: </span>{lead.comentario}
                                        </div>
                                    </div>
                                </div>
                            </>
                            :""
                        }
                    </Col>
                </Row>
                <div className="card-footer px-2 py-3">
                    <div className="row mx-0">
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
        )
    }
}

export default InformacionGeneral