import React, { Component } from 'react'
import { FileInput, Button, InputGray, InputMoneyGray, RangeCalendar, InputNumberGray, TagInputGray } from '../../form-components'
import { Form, Accordion, Card, Row, Col } from 'react-bootstrap'
import ItemSlider from '../../singles/ItemSlider'
import Scrollbar from 'perfect-scrollbar-react';
import 'perfect-scrollbar-react/dist/style.min.css';
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../functions/routers"
import SliderImages from '../../singles/SliderImages'
import { validateAlert } from '../../../functions/alert';
class AvanceForm extends Component {
    state = {
        activeKey: ''
    }
    handleAccordion = eventKey => {
        const { proyecto: { avances } } = this.props;
        const { activeKey } = this.state
        let aux = activeKey
        avances.find(function (element, index) {
            if (element.id === eventKey) {
                aux = eventKey
            }
            return false
        });
        this.setState({
            activeKey: aux
        })
    }
    updateRangeCalendar = range => {
        const { startDate, endDate } = range
        const { onChange } = this.props
        onChange({ target: { value: startDate, name: 'fechaInicio' } })
        onChange({ target: { value: endDate, name: 'fechaFin' } })
    }
    render() {
        const { form, onChangeAdjuntoAvance, onChangeAvance, clearFilesAvances, addRowAvance, onChange, proyecto, sendMail, formeditado, deleteFile, handleChange, isNew, 
                onChangeAdjunto, deleteRowAvance, tagInputChange, ...props } = this.props
        const { activeKey } = this.state
        return (
            <>
                <Form
                    {...props}
                >
                    <Row className="mx-0">
                        <Col md="5">
                            <div className="form-group row mx-0 form-group-marginless justify-content-center">
                                <div className="col-md-7">
                                    <InputNumberGray
                                        withicon={1}
                                        requirevalidation={1}
                                        placeholder="NÚMERO DE SEMANA"
                                        value={form.semana}
                                        name="semana"
                                        onChange={onChange}
                                        iconclass="far fa-folder-open"
                                        messageinc="Ingresa el número de semana."
                                        type="text"
                                    />
                                </div>
                                <div className="col-md-12 text-center">
                                    <label className="col-form-label mb-2 font-weight-bolder">Fecha de inicio - Fecha final</label><br />
                                    <RangeCalendar
                                        onChange={this.updateRangeCalendar}
                                        start={form.fechaInicio}
                                        end={form.fechaFin}
                                    />
                                </div>
                            </div>
                        </Col>
                        <Col md="7" className="align-self-center">
                            <div className="form-group row mx-0 form-group-marginless justify-content-center">
                                <div className="col-md-12">
                                    <InputGray
                                        withtaglabel={1}
                                        withtextlabel={1}
                                        withplaceholder={1}
                                        withicon={0}
                                        withformgroup={0}
                                        placeholder="ACTIVIDADES REALIZADAS"
                                        name="actividades_realizadas"
                                        value={form.actividades_realizadas}
                                        onChange={onChange}
                                        rows={5}
                                        as='textarea'
                                    />
                                </div>
                            </div>
                            {
                                isNew === true ?
                                    <div className='mt-2 col-md-12'>
                                        <ItemSlider
                                            items={form.adjuntos.avance.files}
                                            item='avance'
                                            multiple={false}
                                            handleChange={handleChange}
                                        />
                                    </div>
                                    : ''
                            }
                            {
                                isNew !== true ?
                                    <>
                                        <div className="border border-gray-300 border-solid rounded m-4 p-4">
                                            <div style={{ display: 'flex', maxHeight: '350px'}} >
                                                <Scrollbar>
                                                    {
                                                        form.avances.map((avance, key) => {
                                                            if(isNew !== true)
                                                            return (
                                                                <>
                                                                    <div className="m-4" key={key}>
                                                                        <table className="w-100">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td>
                                                                                        <div className="d-flex justify-content-between align-items-center">
                                                                                            <div className="font-weight-bolder">Avance {key+1}</div>
                                                                                            <InputMoneyGray
                                                                                                withtaglabel={0}
                                                                                                withtextlabel={0}
                                                                                                withplaceholder={1}
                                                                                                withicon={0}
                                                                                                withformgroup={1}
                                                                                                customdiv="mb-2"
                                                                                                requirevalidation={1}
                                                                                                formeditado={formeditado}
                                                                                                thousandseparator={false}
                                                                                                prefix={'%'}
                                                                                                name="avance"
                                                                                                value={form.avance}
                                                                                                onChange={e => onChangeAvance(key, e, 'avance')}
                                                                                                placeholder="% DE AVANCE"
                                                                                                iconclass={"fas fa-percent"}
                                                                                                messageinc="Ingresa el porcentaje."
                                                                                                // customstyle={{ width: '110px', borderRadius: 0, fontSize: '1rem', padding: '0.65rem 1rem' }}
                                                                                            />
                                                                                        </div>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td>
                                                                                        <InputGray
                                                                                            withtaglabel={0}
                                                                                            withtextlabel={0}
                                                                                            withplaceholder={1}
                                                                                            withicon={0}
                                                                                            withformgroup={1}
                                                                                            requirevalidation={1}
                                                                                            formeditado={formeditado}
                                                                                            as="textarea"
                                                                                            rows="3"
                                                                                            placeholder="DESCRIPCIÓN"
                                                                                            name="descripcion"
                                                                                            value={form['avances'][key]['descripcion']}
                                                                                            onChange={e => onChangeAvance(key, e, 'descripcion')}
                                                                                            messageinc="Ingresa la descripción."
                                                                                            style={{ paddingLeft: "10px" }}
                                                                                            customstyle={{ borderRadius: 0, fontSize: '1rem', padding: '0.65rem 1rem' }}
                                                                                        />
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td className="w-400px p-4 text-left">
                                                                                        <FileInput
                                                                                            requirevalidation={0}
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
                                                                                            classbtn='btn btn-default btn-hover-icon-primary font-weight-bolder btn-hover-bg-light text-hover-primary text-dark-50 mb-3'
                                                                                            iconclass='flaticon2-clip-symbol text-primary'
                                                                                            color_label="dark-75"
                                                                                            classinput='avance'
                                                                                        />
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </div>
                                                                    <div className="separator separator-dashed separator-border-2 mb-7"></div>
                                                                </>
                                                            )
                                                            return ''
                                                        })
                                                    }
                                                        
                                                        <div className="d-flex justify-content-end">
                                                            <Button icon='' className = "btn btn-sm btn-bg-light btn-icon-success btn-hover-light-success text-success font-weight-bolder font-size-13px" onClick={addRowAvance}
                                                                text = 'AGREGAR FILA' only_icon = "flaticon2-plus icon-13px mr-2 px-0 text-success"/>
                                                            {
                                                                form.avances.length > 1 &&
                                                                <Button icon='' className = "btn btn-sm btn-bg-light btn-icon-danger btn-hover-light-danger text-danger font-weight-bolder font-size-13px ml-2" onClick={deleteRowAvance}
                                                                text = 'ELIMINAR FILA' only_icon = "flaticon2-plus icon-13px mr-2 px-0 text-danger"/>
                                                            }
                                                        </div>
                                                </Scrollbar>
                                            </div>
                                        </div>
                                    </>
                                :''
                            }
                        </Col>
                    </Row>
                    <div className="card-footer py-3 pr-1">
                        <div className="row mx-0">
                            <div className="col-lg-12 text-right pr-0 pb-0">
                                <Button icon='' text='ENVIAR' type='submit' className="btn btn-primary mr-2" />
                            </div>
                        </div>
                    </div>
                </Form>
                
                {
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
                }
            </>
        )
    }
}

export default AvanceForm