import React, { Component } from 'react'
import { Button, InputGray, InputPhoneGray, CalendarDay } from '../../form-components'
import { Form, Col, Row } from 'react-bootstrap'
import { TEL, EMAIL } from '../../../constants'
import SelectSearchGray from '../../form-components/Gray/SelectSearchGray'

import { getEstados } from '../../../functions/options'
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
        return false
    }

    updateEstados= value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'estado' } })
    }

    halfSize = () => {
        const { lead } = this.props
        if(lead){
            if(lead.relaciones_publicas === 1 ||
                this.estatus() === 'En espera' ||
                lead.rh === 1 ||
                lead.proveedor === 1)
            return true
        }
        return false
    }
    
    render() {
        const { form, onChange, onSubmit, lead, formeditado, options } = this.props
        return (
            <Form>
                <Row className="mx-0">
                    <Col md="4" className="align-self-center">
                        <div className="col-md-12 px-0 text-center align-self-center">
                            <CalendarDay value={form.fecha} date={form.fecha} onChange={onChange} name='fecha' requirevalidation={1} title='Fecha de ingreso'/>
                        </div>
                    </Col>
                    <Col md="8" className="align-self-center">
                        <div className="form-group row form-group-marginless mb-2">
                            <div className = { this.halfSize() ? "col-md-6" : "col-md-4" } >
                                <InputGray withtaglabel={1} withtextlabel={1} withplaceholder={1}
                                    withicon={1} withformgroup={1} requirevalidation={formeditado === false ? 0 : 1}
                                    placeholder='NOMBRE DEL LEAD' iconclass="far fa-user" name='name'
                                    value={form.name} onChange={onChange} messageinc="Ingresa el nombre del lead."
                                />
                            </div>
                            <div className = { this.halfSize() ? "col-md-6" : "col-md-4" } >
                                <InputGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1}
                                    withformgroup={1} requirevalidation={formeditado === false ? 0 : 1} placeholder="CORREO ELECTRÓNICO"
                                    iconclass="fas fa-envelope" type="email" name="email" value={form.email} onChange={onChange}
                                    patterns={EMAIL} messageinc="Ingresa el correo electrónico." letterCase={false} />
                            </div>
                            <div className="separator separator-dashed mt-1 mb-2 ml-0 mr-0"></div>
                            <div className = { this.halfSize() ? "col-md-6" : "col-md-4" } >
                                <InputPhoneGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1} withformgroup={1}
                                    requirevalidation={formeditado === false ? 0 : 1} placeholder="TELÉFONO DE CONTACTO"
                                    iconclass="fas fa-mobile-alt" name="telefono" value={form.telefono}
                                    onChange={onChange} patterns={TEL} thousandseparator={false} prefix=''
                                    messageinc="Ingresa el teléfono de contacto." />
                            </div>
                            <div className= { this.halfSize() ? "col-md-6" : "col-md-4" }>
                                <SelectSearchGray options = { getEstados() } placeholder = "SELECCIONA EL ESTADO" name = "estado"
                                    value = { form.estado } onChange = { this.updateEstados } requirevalidation = { 1 }
                                    messageinc = "Selecciona el estado." withtaglabel = { 1 } withtextlabel = { 1 } withicon={1} />
                            </div>
                            { this.halfSize() ? ""
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
                                                                customdiv="mb-0" withtaglabel={1} withtextlabel={1} withicon={1}/>
                                                        </div>
                                                    </>
                                                    : ''
                                                : ''
                                            : ''
                                    }
                                    {
                                        /* this.estatus() === "En espera" && lead.relaciones_publicas === false ?
                                            ''
                                            :
                                            <div className="col-md-4">
                                                <InputGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1}
                                                    requirevalidation={1} withformgroup={1} formeditado={formeditado}
                                                    placeholder='NOMBRE DEL PROYECTO' iconclass="far fa-folder-open" name='proyecto'
                                                    value={form.proyecto} onChange={onChange}
                                                    messageinc="Ingresa el nombre del proyecto."
                                                />
                                            </div> */
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
                <div className="card-footer pt-3 p-0 text-right mx-4 mt-5">
                    <Button icon=''  onClick={ (e) => { e.preventDefault(); onSubmit() } } text="ENVIAR" />
                </div>
            </Form>
        )
    }
}

export default InformacionGeneral