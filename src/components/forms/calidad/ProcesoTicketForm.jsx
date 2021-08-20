import React, { Component } from 'react'
import { Form, Row, Col } from 'react-bootstrap'
import { validateAlert, questionAlert } from '../../../functions/alert'
import { InputGray, Button, CalendarDay, InputMoneyGray, SelectSearchGray } from '../../form-components'
import ItemSlider from '../../singles/ItemSlider'
import { openWizard1_for2_wizard, openWizard2_for2_wizard } from '../../../functions/wizard'
import { dayDMY } from '../../../functions/setters'

class ProcesoTicketForm extends Component {

    handleChangeDate = (date) => {
        const { onChange } = this.props
        onChange({ target: { name: 'fechaProgramada', value: date } })
    }

    updateEmpleado = value => {
        const { onChange } = this.props
        onChange({ target: { name: 'empleado', value: value } })
    }

    isMantenimiento = () => {
        const { ticket } = this.props
        if(ticket.subarea){
            switch(ticket.subarea.nombre){
                case 'MANTENIMIENTO':
                case 'MANTENIMIENTO CORRECTIVO':
                case 'MANTENIMIENTO PREVENTIVO':
                    return true;
                default: break;
            }
        }
        return false;
    }

    updateSelect = (value, type) => {
        const { onChange } = this.props
        onChange({ target: { name: type, value: value } })
    }

    render() {
        const { form, onSubmit, formeditado, onChange, options, handleChange, deleteFile, generateEmail, estatus, ticket, ...props } = this.props
        return (
            <>
                {
                    estatus === 'En proceso' ?
                        <div className="wizard wizard-3" id="for2-wizardP" data-wizard-state="step-first">
                            <div className="wizard-nav px-6 px-md-0">
                                <div className="wizard-steps">
                                    <div id="for2-wizard-1" className="wizard-step" data-wizard-state="current" data-wizard-type="step" onClick={() => { openWizard1_for2_wizard() }}>
                                        <div className="wizard-label pt-0 pb-6 pb-md-5">
                                            <h3 className="wizard-title">
                                                <span>1.</span> Datos de solicitud</h3>
                                            <div className="wizard-bar"></div>
                                        </div>
                                    </div>
                                    <div id="for2-wizard-2" className="wizard-step" data-wizard-type="step" onClick={() => { openWizard2_for2_wizard() }}>
                                        <div className="wizard-label pt-0 pb-6 pb-md-5">
                                            <h3 className="wizard-title">
                                                <span>2.</span> Reporte de archivos</h3>
                                            <div className="wizard-bar"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row justify-content-center">
                                <div className="col-md-12">
                                    <Form onSubmit = { (e) => { e.preventDefault(); validateAlert(onSubmit, e, 'for2-wizard-2-content') } }
                                        {...props} >
                                        <div id="for2-wizard-1-content" className="px-2" data-wizard-type="step-content" data-wizard-state="current">
                                            <Row className="mx-0">
                                                <Col md="6" className="align-self-center px-0 d-flex justify-content-center">
                                                    <div>
                                                        <div className="col-md-12 text-center px-0" style={{ height: '1px' }}>
                                                            <label className="text-center font-weight-bold text-dark-60">Fecha programada</label>
                                                        </div>
                                                        <div className="col-md-12 text-center px-0">
                                                            <div className="calendar-tickets">
                                                                <CalendarDay value = { form.fechaProgramada } date = { form.fechaProgramada }
                                                                    onChange = { onChange } name = 'fechaProgramada' withformgroup = { 0 }
                                                                    requirevalidation = { 0 } />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col md="6" className="align-self-center">
                                                    <div className="row mx-0 form-group-marginless">
                                                        <div className="col-md-12">
                                                            <InputGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 } withicon = { 1 }
                                                                withformgroup = { 1 } placeholder = "TÉCNICO QUE ASISTE" name = "empleado" 
                                                                value = { form.empleado } onChange = { onChange } iconclass = "la la-user-check icon-xl"
                                                                requirevalidation = { 0 } formeditado = { formeditado } />
                                                        </div>
                                                        <div className="col-md-12">
                                                            <InputGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 } withicon = { 1 }
                                                                withformgroup = { 1 } placeholder = "¿QUIÉN RECIBE?" name = "recibe" value = { form.recibe }
                                                                onChange = { onChange } iconclass = "la la-user icon-xl" requirevalidation = { 0 }
                                                                formeditado = { formeditado } />
                                                        </div>
                                                        <div className="col-md-12">
                                                            <InputGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 } withicon = { 0 }
                                                                withformgroup = { 0 } formeditado = { formeditado } requirevalidation = { 0 } as = 'textarea'
                                                                name = 'descripcion_solucion' placeholder = 'DESCRIPCIÓN DE LA SOLUCIÓN DEL PROBLEMA'
                                                                onChange = { onChange } value = { form.descripcion_solucion } rows = '4'
                                                                messageinc = "Incorrecto. Ingresa una descripción." />
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>
                                            {
                                                this.isMantenimiento() ? 
                                                    <Row className = 'mx-0'>
                                                        <Col md = { 12 }>
                                                            <hr />
                                                            <label className="text-center font-weight-bolder text-dark-60">
                                                                { ticket.subarea ? ticket.subarea.nombre  : '' }
                                                            </label>
                                                        </Col>
                                                        <Col md = { 6 }>
                                                            <div className="col-md-12">
                                                                <InputMoneyGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 } withicon = { 1 } 
                                                                    withformgroup = { 1 } requirevalidation = { 0 } formeditado = { 0 } thousandseparator = { true } 
                                                                    prefix = '$' name = "costo" value = { form.costo } onChange = { onChange } 
                                                                    placeholder = "COSTO" iconclass = "la la-money-bill icon-xl" />
                                                            </div>
                                                            
                                                        </Col>
                                                        <Col md = { 6 }>
                                                            <div className="col-md-12">
                                                                <SelectSearchGray withtaglabel = { 1 } withtextlabel = { 1 } withicon = { 1 } name = "equipo"
                                                                    options = { options.equipos } placeholder = 'SELECCIONA EL EQUIPO INSTALADO' 
                                                                    value = { form.equipo } onChange = { (value) => { this.updateSelect(value, 'equipo') } } 
                                                                    iconclass = "la la-toolbox icon-xl" formeditado = { 0 } 
                                                                    messageinc = "Incorrecto. Selecciona el equipo instalado" />
                                                            </div>
                                                        </Col>
                                                    </Row>        
                                                : <div></div>
                                            }
                                            <div className="d-flex justify-content-between border-top mt-3 pt-3 card-footer pb-0">
                                                <div className="mr-2"></div>
                                                <div>
                                                    <button type="button" className="btn btn-primary font-weight-bold text-uppercase" onClick={() => { openWizard2_for2_wizard() }} data-wizard-type="action-next">Siguiente</button>
                                                </div>
                                            </div>
                                        </div>
                                        <div id="for2-wizard-2-content" data-wizard-type="step-content">
                                            <div className="form-group row form-group-marginless mx-0">
                                                <div className="col-md-6 align-self-center">
                                                    <div>
                                                        <div className="text-center mt-4 font-weight-bold text-dark-60 mb-4">
                                                            {form.adjuntos.reporte_problema_reportado.placeholder}
                                                        </div>
                                                        <ItemSlider items={form.adjuntos.reporte_problema_reportado.files} item='reporte_problema_reportado' handleChange={handleChange} deleteFile={deleteFile} />
                                                    </div>
                                                </div>
                                                <div className="col-md-6 align-self-center">
                                                    <div>
                                                        <div className="text-center mt-4 font-weight-bold text-dark-60 mb-4">
                                                            {form.adjuntos.reporte_problema_solucionado.placeholder}
                                                        </div>
                                                        <ItemSlider items={form.adjuntos.reporte_problema_solucionado.files} item='reporte_problema_solucionado' handleChange={handleChange} deleteFile={deleteFile} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="border-top mt-3 pt-3">
                                                <div className="row">
                                                    <div className="col-lg-6 text-left">
                                                        <button type="button" className="btn btn-primary font-weight-bold text-uppercase" onClick={() => { openWizard1_for2_wizard() }} data-wizard-type="action-prev">Anterior</button>
                                                    </div>
                                                    <div className="col-lg-6 text-right">
                                                        {
                                                            estatus !== 'Terminado' ?
                                                                <div className="">
                                                                    <Button icon='' className="btn btn-light-primary font-weight-bold text-uppercase mr-2" text="GUARDAR"
                                                                        onClick={(e) => { e.preventDefault(); validateAlert(onSubmit, e, 'for2-wizard-2-content') }} />
                                                                    <Button icon='' className="btn btn-light-success font-weight-bold text-uppercase" text="GENERAR PDF"
                                                                        onClick = { (e) => { questionAlert('¿DESEAS GENERAR EL REPORTE?', 'GENERARÁS UN PDF CON LAS FOTOGRAFÍAS DE LAS PETICIONES Y LOS TRABAJOS REALIZADOS', () => generateEmail(true)) } } />
                                                                </div>
                                                            : ''
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Form>
                                </div>
                            </div>
                        </div>
                        : estatus === 'Terminado'?
                            <div>
                                <Row className="mx-0 d-flex justify-content-center text-center">
                                    <Col md="auto" className="p-5 rounded-xl font-weight-bolder align-self-center mr-8 box-shadow-36">
                                        <i className="las la-calendar-alt icon-2x text-info"></i>
                                        <div className="text-info font-size-h6">{dayDMY(form.fechaProgramada)}</div>
                                        <div className="text-dark-75 font-size-lg font-weight-light">FECHA DE SOLUCIÓN</div>
                                    </Col>
                                    <Col md="auto" className="p-5 rounded-xl font-weight-bolder align-self-center mr-8 box-shadow-36">
                                        <i className="las la-user-cog icon-2x text-primary"></i>
                                        <div className="text-primary font-size-h6">{form.empleado}</div>
                                        <div className="text-dark-75 font-size-lg font-weight-light">TÉCNICO QUE ASISTIÓ</div>
                                    </Col>
                                    <Col md="auto" className="p-5 rounded-xl font-weight-bolder align-self-center box-shadow-36">
                                        <i className="las la-user-check icon-2x text-info"></i>
                                        <div className="text-info font-size-h6">{form.recibe}</div>
                                        <div className="text-dark-75 font-size-lg font-weight-light">RECIBIÓ</div>
                                    </Col>
                            </Row>
                            <div className="separator separator-dashed my-10"></div>
                            <Row className="mx-0 d-flex justify-content-center">
                                <Col md="4" className="text-center">
                                    <div className="mb-4 font-weight-bolder font-size-lg white-space-nowrap">PETICIONES</div>
                                    <ItemSlider items={form.adjuntos.reporte_problema_reportado.files} item='reporte_problema_reportado' />
                                </Col>
                                <Col md="4" className="text-center">
                                    <div className="mb-4 font-weight-bolder font-size-lg white-space-nowrap">TRABAJOS REALIZADOS</div>
                                    <ItemSlider items={form.adjuntos.reporte_problema_solucionado.files} item='reporte_problema_solucionado' />
                                </Col>
                            </Row>
                            {
                                form.descripcion_solucion &&
                                <>
                                    <div className="separator separator-dashed my-10"></div>
                                    <div className="font-weight-light text-center font-size-lg mt-10"><span className="font-weight-bolder">Solución del problema: </span>{form.descripcion_solucion}</div>
                                </>
                            }
                        </div>
                        :<></>
                }
            </>
        );
    }
}

export default ProcesoTicketForm
