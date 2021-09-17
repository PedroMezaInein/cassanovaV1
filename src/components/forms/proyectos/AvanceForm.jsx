import React, { Component } from 'react'
import { FileInput, Button, InputGray, InputMoneyGray, RangeCalendar, InputNumberGray, /*TagInputGray*/ } from '../../form-components'
import { Form,/* Accordion, Card,*/ Row, Col } from 'react-bootstrap'
import ItemSlider from '../../singles/ItemSlider'
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../functions/routers"
// import SliderImages from '../../singles/SliderImages'
import { validateAlert } from '../../../functions/alert';
import { openWizard1_for2_wizard, openWizard2_for2_wizard } from '../../../functions/wizard'
class AvanceForm extends Component {
    // state = {
    //     activeKey: ''
    // }
    // handleAccordion = eventKey => {
    //     const { proyecto: { avances } } = this.props;
    //     const { activeKey } = this.state
    //     let aux = activeKey
    //     avances.find(function (element, index) {
    //         if (element.id === eventKey) {
    //             aux = eventKey
    //         }
    //         return false
    //     });
    //     this.setState({
    //         activeKey: aux
    //     })
    // }
    updateRangeCalendar = range => {
        const { startDate, endDate } = range
        const { onChange } = this.props
        onChange({ target: { value: startDate, name: 'fechaInicio' } })
        onChange({ target: { value: endDate, name: 'fechaFin' } })
    }
    render() {
        const { form, onChangeAdjuntoAvance, onChangeAvance, clearFilesAvances, addRowAvance, onChange, onSubmit, formeditado, handleChange, isNew,
            deleteRowAvance, 
            
            // tagInputChange, sendMail, proyecto, onChangeAdjunto,  ...props
        } = this.props
        // const { activeKey } = this.state
        return (
            <>
                {
                    isNew !== true ?
                        <div className="wizard wizard-6 mt-6" id="for2-wizardP" data-wizard-state="first">
                            <div className="wizard-content d-flex flex-column mx-auto">
                                <div className="d-flex flex-column-auto flex-column px-0">
                                    <div className="wizard-nav d-flex flex-column align-items-center align-items-md-center">
                                        <div className="wizard-steps d-flex flex-column flex-md-row">
                                            <div id="for2-wizard-1" className="wizard-step flex-grow-1 flex-basis-0" data-wizard-state="current" data-wizard-type="step" onClick={() => { openWizard1_for2_wizard() }}>
                                                <div className="wizard-wrapper pr-lg-7 pr-5">
                                                    <div className="wizard-icon">
                                                        <i className="wizard-check fas fa-check"></i>
                                                        <span className="wizard-number">1</span>
                                                    </div>
                                                    <div className="wizard-label mr-3">
                                                        <h3 className="wizard-title">Semana</h3>
                                                        <div className="wizard-desc">Detalles de la semana</div>
                                                    </div>
                                                    <span className="svg-icon">
                                                        <SVG src={toAbsoluteUrl('/images/svg/Right-2.svg')} />
                                                    </span>
                                                </div>
                                            </div>
                                            <div id="for2-wizard-2" className="wizard-step flex-grow-1 flex-basis-0" data-wizard-type="step" onClick={() => { openWizard2_for2_wizard() }}>
                                                <div className="wizard-wrapper">
                                                    <div className="wizard-icon">
                                                        <i className="wizard-check fas fa-check"></i>
                                                        <span className="wizard-number">2</span>
                                                    </div>
                                                    <div className="wizard-label">
                                                        <h3 className="wizard-title">Avances</h3>
                                                        <div className="wizard-desc">Datos del progreso</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <Form
                                    onSubmit={
                                        (e) => {
                                            e.preventDefault();
                                            validateAlert(onSubmit, e, 'for2-wizardP')
                                        }
                                    }
                                >
                                    <div id="for2-wizard-1-content" data-wizard-type="step-content" data-wizard-state="current">
                                        <Row className="mx-0 mt-5">
                                            <div className="text-center col-md-auto">
                                                <label className="col-form-label mb-2 font-weight-bolder text-dark-60">Periodo del avance</label><br />
                                                <RangeCalendar
                                                    onChange={this.updateRangeCalendar}
                                                    start={form.fechaInicio}
                                                    end={form.fechaFin}
                                                />
                                            </div>
                                            <div className="align-self-center col">
                                                <div className="form-group row form-group-marginless justify-content-end">
                                                    <div className="col-md-12">
                                                        <InputNumberGray
                                                            withtaglabel={1}
                                                            withtextlabel={1}
                                                            withplaceholder={1}
                                                            withformgroup={0}
                                                            withicon={1}
                                                            requirevalidation={1}
                                                            placeholder="NÚMERO DE SEMANA"
                                                            value={form.semana}
                                                            name="semana"
                                                            onChange={onChange}
                                                            iconclass="flaticon-calendar-1"
                                                            messageinc="Ingresa el número de semana."
                                                            type="text"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="separator separator-dashed mt-1 mb-2"></div>
                                                <div className="row form-group-marginless">
                                                    <div className="col-md-12">
                                                        <InputGray
                                                            withtaglabel={1}
                                                            withtextlabel={1}
                                                            withplaceholder={1}
                                                            withicon={0}
                                                            withformgroup={0}
                                                            requirevalidation={1}
                                                            placeholder="ACTIVIDADES REALIZADAS"
                                                            name="actividades_realizadas"
                                                            value={form.actividades_realizadas}
                                                            onChange={onChange}
                                                            rows={5}
                                                            as='textarea'
                                                            messageinc="Ingresa las actividades realizadas."
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </Row>
                                        <div className="d-flex justify-content-end pt-3 border-top mt-10">
                                            <button type="button" className="btn btn-sm d-flex place-items-center btn-primary2 font-weight-bold" onClick={() => { openWizard2_for2_wizard() }}>Siguiente
                                                <span className="svg-icon svg-icon-md ml-2 mr-0">
                                                    <SVG src={toAbsoluteUrl('/images/svg/Right-2.svg')} />
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                    <div id="for2-wizard-2-content" data-wizard-type="step-content">
                                        <div className="form-group row form-group-marginless">
                                            <div className="col-md-12">
                                                <div className="d-flex justify-content-end px-4">
                                                    {
                                                        form.avances.length > 1 &&
                                                        <Button icon='' className="btn btn-sm btn-bg-light btn-icon-danger btn-hover-light-danger text-danger font-weight-bolder font-size-13px mr-2" onClick={deleteRowAvance}
                                                            text='ELIMINAR FILA' only_icon="flaticon2-plus icon-13px mr-2 px-0 text-danger" />
                                                    }
                                                    <Button icon='' className="btn btn-sm btn-bg-light btn-icon-success btn-hover-light-success text-success font-weight-bolder font-size-13px" onClick={addRowAvance}
                                                        text='AGREGAR FILA' only_icon="flaticon2-plus icon-13px mr-2 px-0 text-success" />
                                                </div>
                                                <div>
                                                    {
                                                        form.avances.map((avance, key) => {
                                                            return (
                                                                <Row className="mx-0 d-flex justify-content-center mt-5" key={key}>
                                                                    <Col md="7">
                                                                        <hr className="hr-text hr-text__primary2" data-content={`Avance ${key + 1}`} />
                                                                    </Col>
                                                                    <Col md="12">
                                                                        <div className="row mx-0 form-group-marginless justify-content-end">
                                                                            <InputMoneyGray
                                                                                withtaglabel={1}
                                                                                withtextlabel={1}
                                                                                withplaceholder={1}
                                                                                withicon={0}
                                                                                withformgroup={0}
                                                                                requirevalidation={1}
                                                                                formeditado={formeditado}
                                                                                thousandseparator={false}
                                                                                prefix={'%'}
                                                                                name="avance"
                                                                                value={form.avance}
                                                                                onChange={e => onChangeAvance(key, e, 'avance')}
                                                                                placeholder="% DE AVANCE"
                                                                                iconclass="fas fa-percent"
                                                                                messageinc="Ingresa el porcentaje."
                                                                                customclass="px-4"
                                                                            />
                                                                        </div>
                                                                        <div className="separator separator-dashed mt-5 mb-2"></div>
                                                                        <div className="row form-group-marginless">
                                                                            <div className="col-md-12">
                                                                                <InputGray
                                                                                    withtaglabel={1}
                                                                                    withtextlabel={1}
                                                                                    withplaceholder={1}
                                                                                    withicon={0}
                                                                                    withformgroup={0}
                                                                                    requirevalidation={1}
                                                                                    formeditado={formeditado}
                                                                                    as="textarea"
                                                                                    rows="3"
                                                                                    placeholder="DESCRIPCIÓN"
                                                                                    name="descripcion"
                                                                                    value={form['avances'][key]['descripcion']}
                                                                                    onChange={e => onChangeAvance(key, e, 'descripcion')}
                                                                                    messageinc="Ingresa la descripción."
                                                                                    customclass="px-2"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="separator separator-dashed mt-5 mb-2"></div>
                                                                        <div className="row form-group-marginless mt-5">
                                                                            <div className="col-md-12 text-center align-self-center">
                                                                                <FileInput
                                                                                    requirevalidation={1}
                                                                                    formeditado={formeditado}
                                                                                    onChangeAdjunto={e => onChangeAdjuntoAvance(e, key, 'adjuntos')}
                                                                                    placeholder={form['avances'][key]['adjuntos']['placeholder']}
                                                                                    value={form['avances'][key]['adjuntos']['value']}
                                                                                    name={`${key}-avance`} id={`${key}-avance`}
                                                                                    accept="image/*"
                                                                                    files={form['avances'][key]['adjuntos']['files']}
                                                                                    _key={key}
                                                                                    deleteAdjuntoAvance={clearFilesAvances}
                                                                                    multiple
                                                                                    classbtn='btn btn-default btn-hover-icon-primary font-weight-bolder btn-hover-bg-light text-hover-primary text-dark-50 mb-0'
                                                                                    iconclass='flaticon2-clip-symbol text-primary'
                                                                                    color_label="dark-75"
                                                                                    classinput='avance'
                                                                                    messageinc='Adjunta la foto del avance'
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </Col>
                                                                </Row>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-between border-top pt-3">
                                            <button type="button" className="btn btn-sm  d-flex place-items-center btn-light-primary2 font-weight-bold" onClick={() => { openWizard1_for2_wizard() }}>
                                                <span className="svg-icon svg-icon-md mr-2">
                                                    <SVG src={toAbsoluteUrl('/images/svg/Left-2.svg')} />
                                                </span>Anterior
                                            </button>
                                            <button type="button" className="btn btn-sm d-flex place-items-center btn-primary2 font-weight-bold" onClick={(e) => { e.preventDefault(); validateAlert(onSubmit, e, 'for2-wizardP') }} >Enviar
                                                <span className="svg-icon svg-icon-md ml-2 mr-0">
                                                    <SVG src={toAbsoluteUrl('/images/svg/Sending.svg')} />
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </Form>
                            </div>
                        </div>
                        :
                        <>
                            <Form id="form-avance"
                                onSubmit={
                                    (e) => {
                                        e.preventDefault();
                                        validateAlert(onSubmit, e, 'form-avance')
                                    }
                                }
                            >
                                <Row className="mx-0 mt-5">
                                    <div className="text-center col-md-auto">
                                        <label className="col-form-label mb-2 font-weight-bolder text-dark-60">Periodo del avance</label><br />
                                        <RangeCalendar
                                            onChange={this.updateRangeCalendar}
                                            start={form.fechaInicio}
                                            end={form.fechaFin}
                                        />
                                    </div>
                                    <div className="align-self-center col">
                                        <div className="form-group row form-group-marginless justify-content-end">
                                            <div className="col-md-12">
                                                <InputNumberGray
                                                    withtaglabel={1}
                                                    withtextlabel={1}
                                                    withplaceholder={1}
                                                    withformgroup={0}
                                                    withicon={1}
                                                    requirevalidation={1}
                                                    placeholder="NÚMERO DE SEMANA"
                                                    value={form.semana}
                                                    name="semana"
                                                    onChange={onChange}
                                                    iconclass="flaticon-calendar-1"
                                                    messageinc="Ingresa el número de semana."
                                                    type="text"
                                                />
                                            </div>
                                        </div>
                                        <div className="separator separator-dashed mt-1 mb-2"></div>
                                        <div className="row form-group-marginless">
                                            <div className="col-md-12">
                                                <InputGray
                                                    withtaglabel={1}
                                                    withtextlabel={1}
                                                    withplaceholder={1}
                                                    withicon={0}
                                                    withformgroup={0}
                                                    requirevalidation={1}
                                                    placeholder="ACTIVIDADES REALIZADAS"
                                                    name="actividades_realizadas"
                                                    value={form.actividades_realizadas}
                                                    onChange={onChange}
                                                    rows={5}
                                                    as='textarea'
                                                    messageinc="Ingresa las actividades realizadas."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </Row>
                                <div className="separator separator-dashed mt-5 mb-2"></div>
                                <div className='mt-2 col-md-12 text-center'>
                                    <label className="col-form-label mb-2 font-weight-bolder text-dark-60">Adjuntar avance</label><br />
                                    <ItemSlider items={form.adjuntos.avance.files} item='avance' multiple={false} accept = 'application/pdf' 
                                        handleChange={handleChange} />
                                </div>
                                <div className="d-flex justify-content-end border-top mt-5 pt-3">
                                    <button type="button" className="btn btn-sm d-flex place-items-center btn-primary2 font-weight-bold" onClick={(e) => { e.preventDefault(); validateAlert(onSubmit, e, 'form-avance') }} >Enviar
                                        <span className="svg-icon svg-icon-md ml-2 mr-0">
                                            <SVG src={toAbsoluteUrl('/images/svg/Sending.svg')} />
                                        </span>
                                    </button>
                                </div>
                            </Form>
                        </>
                }
                {/* {
                    proyecto ?
                        proyecto.avances ?
                            proyecto.avances.length ?
                                <div className="d-flex justify-content-center">
                                    <div className="col-md-7">
                                        <Accordion activeKey={activeKey} className="accordion accordion-solid">
                                            {
                                                proyecto.avances.map((avance, key) => {
                                                    return (
                                                        <Card key={key}>
                                                            <Accordion.Toggle as={Card.Header} eventKey={avance.id} onClick={() => this.handleAccordion(avance.id)}>
                                                                <div className="card-title">
                                                                    <div className="text-center">SEMANA {avance.semana}</div>
                                                                </div>
                                                            </Accordion.Toggle>
                                                            <Accordion.Collapse eventKey={avance.id}>
                                                                <Card.Body>
                                                                    <Row className="mx-0">
                                                                        <Col md={12} className="mb-5">
                                                                            <div className="d-flex justify-content-end">
                                                                                <div rel="noopener noreferrer" href={avance.pdf} target="_blank" className="btn btn-sm btn-bg-light btn-icon-info btn-hover-light-info text-info font-weight-bold font-size-13px px-2 py-1">
                                                                                    <span className="svg-icon svg-icon-xl svg-icon-info mr-2">
                                                                                        <SVG src={toAbsoluteUrl('/images/svg/Download.svg')} />
                                                                                    </span>
                                                                                    Descargar PDF
                                                                                </div>
                                                                            </div>
                                                                        </Col>
                                                                        <Col md={12} className="my-5">
                                                                            <SliderImages elements={avance.adjuntos} />
                                                                        </Col>
                                                                        <Col md={12} className="p-0">
                                                                            <Form
                                                                                onSubmit={
                                                                                    (e) => {
                                                                                        e.preventDefault();
                                                                                        validateAlert(sendMail, e, 'form-send-avance')
                                                                                    }
                                                                                }
                                                                                {...props} >
                                                                                <div className="d-flex justify-content-between align-items-end row mx-0">
                                                                                    <div className="col">
                                                                                        <TagInputGray tags={form.correos_avances} onChange={tagInputChange} placeholder="CORREO" iconclass="flaticon-email" uppercase={false} />
                                                                                    </div>
                                                                                    <div className="col-md-auto d-flex justify-content-end">
                                                                                        <div onClick={(e) => { e.preventDefault(); sendMail(avance.id) }} className="btn btn-sm btn-bg-light btn-icon-pink btn-hover-light-pink text-pink font-weight-bold font-size-13px bg-hover-pink px-2 py-1">
                                                                                            <span className="svg-icon svg-icon-xl svg-icon-pink mr-2">
                                                                                                <SVG src={toAbsoluteUrl('/images/svg/Mail-notification.svg')} />
                                                                                            </span>
                                                                                            Enviar por correo
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </Form>
                                                                        </Col>
                                                                    </Row>
                                                                </Card.Body>
                                                            </Accordion.Collapse>
                                                        </Card>
                                                    )
                                                })
                                            }
                                        </Accordion>
                                    </div>
                                </div>
                                : ''
                            : ''
                        : ''
                } */}
            </>
        )
    }
}

export default AvanceForm