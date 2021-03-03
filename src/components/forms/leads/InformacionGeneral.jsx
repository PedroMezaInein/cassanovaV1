import React, { Component } from 'react'
import { Button, InputGray, InputPhoneGray, CalendarDay } from '../../form-components'
import { Form, Col, Row} from 'react-bootstrap'
import { TEL, EMAIL } from '../../../constants'
import SelectSearchGray from '../../form-components/Gray/SelectSearchGray'
class InformacionGeneral extends Component {

    componentDidMount(){
        const { form, onChange } = this.props
        onChange({ target: { name: 'fecha', value: form.fecha } })
    }

    updateTipoProyecto = value => {
        const { onChange } = this.props
        onChange({ target: { name: 'tipoProyecto', value: value } })
    }

    estatus(){
        const { lead } = this.props
        if(lead.estatus){
            return lead.estatus.estatus
        }
    }
    render() {
        const { form, onChange, onSubmit, lead, formeditado, options, showComment1, showComment2} = this.props
        return (
            <>
                <Form>
                    <Row className="mx-0 mb-5">
                        <Col md={lead.relaciones_publicas === 1 || this.estatus()==="En espera" ?12:4} className={lead.relaciones_publicas === 1 || this.estatus()==="En espera" ?"order-2":"order-1"}>
                            <div className="col-md-12 text-center align-self-center">
                                <div className="d-flex justify-content-center" style={{ height: '1px' }}>
                                    <label className="text-center font-weight-bold text-dark-60">Fecha de ingreso</label>
                                </div>
                                <CalendarDay value={form.fecha} date={form.fecha} onChange={onChange} name='fecha' withformgroup={0} />
                            </div>
                        </Col>
                        <Col md={lead.relaciones_publicas === 1 || this.estatus()==="En espera" ?12:8} className={`align-self-center ${lead.relaciones_publicas === 1 || this.estatus()==="En espera" ?"order-1":"order-2"}`}>
                            <div className="form-group row form-group-marginless mb-2">
                                <div className="col-md-4">
                                    <InputGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 }
                                        withicon = { 1 } withformgroup = { 1 } requirevalidation = { formeditado === false ? 0 : 1 }
                                        placeholder = 'NOMBRE DEL LEAD' iconclass = "far fa-user" name = 'name'
                                        value = { form.name } onChange = { onChange } messageinc="Incorrecto. Ingresa el nombre del lead." />
                                </div>
                                <div className="col-md-4">
                                    <InputGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 } withicon = { 1 }
                                        withformgroup = { 1 } requirevalidation = { formeditado === false ? 0 : 1 } placeholder = "CORREO ELECTRÓNICO"
                                        iconclass = "fas fa-envelope" type = "email" name = "email" value = { form.email } onChange = { onChange }
                                        patterns = { EMAIL } messageinc="Incorrecto. Ingresa el correo electrónico." letterCase = { false }/>
                                </div>
                                <div className="col-md-4">
                                    <InputPhoneGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 } withicon = { 1 }
                                        requirevalidation = { formeditado === false ? 0 : 1 } placeholder = "TELÉFONO DE CONTACTO"
                                        iconclass = "fas fa-mobile-alt" name = "telefono" value = { form.telefono }
                                        onChange = { onChange } patterns = { TEL } thousandseparator = { false } prefix = ''
                                        messageinc = "Incorrecto. Ingresa el teléfono de contacto." />
                                </div>
                            </div>
                            {
                                lead.relaciones_publicas === 1 || this.estatus()==="En espera" ? ""
                                    : <div className="separator separator-dashed mt-1 mb-2"></div>
                                
                            }
                            {
                                lead.relaciones_publicas === 1 || this.estatus()==="En espera" ?  ""
                                    : <div className="form-group row form-group-marginless mb-2">
                                        {
                                            options ? 
                                                options.tipos ?
                                                    options.tipos.length ?
                                                        <>
                                                                <div className = 'col-md-6'>
                                                                    <SelectSearchGray options = { options.tipos } placeholder="SELECCIONE UN TIPO DE PROYECTO"
                                                                        name="tipoProyecto" value = { form.tipoProyecto } onChange = { this.updateTipoProyecto }
                                                                        requirevalidation = { 1 } messageinc = "Incorrecto. Seleccione el proyecto."
                                                                        customdiv = "mb-0" withtaglabel = { 1 } withtextlabel = { 1 } />
                                                                </div>
                                                        </>
                                                    : ''
                                                : ''
                                            : ''
                                        }
                                        {
                                            this.estatus()==="En espera" && lead.relaciones_publicas === false ?
                                                    ''
                                                : 
                                                <div className="col-md-6">
                                                    <InputGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 } withicon = { 1 } 
                                                        requirevalidation = { 1 } withformgroup = { 1 } formeditado = { formeditado }
                                                        placeholder = 'NOMBRE DEL PROYECTO' iconclass = "far fa-folder-open" name = 'proyecto'
                                                        value = { form.proyecto } onChange = { onChange }
                                                        messageinc = "Incorrecto. Ingresa el nombre del proyecto." />
                                                </div>
                                        }
                                    </div>
                            }
                            {
                                showComment1?
                                    lead.comentario?
                                        <>
                                            <div className="separator separator-dashed mt-1 mb-6"></div>
                                            <div className="form-group row form-group-marginless mb-2 justify-content-center">
                                                <div className="col-md-12">
                                                    <div className="bg-gray-100 p-3 font-size-lg font-weight-light text-justify" style={{fontSize:'13.5px'}}>
                                                        <span className="font-weight-bolder text-dark-60">Comentario: </span>{lead.comentario}
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    :""
                                :""
                            }
                            {
                                lead.relaciones_publicas === 1 || this.estatus()==="En espera" ? <div className="separator separator-dashed mb-5"></div>
                                    :
                                    ""
                            }
                        </Col>
                    </Row>
                    {
                        showComment2 ?
                            lead.comentario ?
                                <div className="form-group row form-group-marginless mb-2 justify-content-center">
                                    <div className="col-md-12 mb-5">
                                        <div className="bg-gray-100 p-3 font-size-lg font-weight-light text-justify" style={{ fontSize: '13.5px' }}>
                                            <span className="font-weight-bolder text-dark-60">Comentario: </span>{lead.comentario}
                                        </div>
                                    </div>
                                </div>
                            :""
                        : ""
                    }
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