import React, { Component } from 'react'
import { Calendar, FileInput, Button, InputSinText, InputMoneySinText, Input } from '../../form-components'
import { Form, Accordion, Card } from 'react-bootstrap'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import SliderImages from '../../singles/SliderImages'
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../functions/routers"
import ItemSlider from '../../singles/ItemSlider'
class AvanceForm extends Component {
    state = {
        activeKey: ''
    }
    handleChangeDateInicio = date => {
        const { onChange, form } = this.props
        if (form.fechaInicio > form.fechaFin) {
            onChange({ target: { name: 'fechaFin', value: date } })
        }
        onChange({ target: { name: 'fechaInicio', value: date } })
    }
    handleChangeDateFin = date => {
        const { onChange } = this.props
        onChange({ target: { name: 'fechaFin', value: date } })
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
    render() {
        const { form, onChangeAdjuntoAvance, onChangeAvance, clearFilesAvances, addRowAvance, onChange, 
            proyecto, sendMail, formeditado, deleteFile, handleChange, isNew, onChangeAdjunto, ...props } = this.props
        const { activeKey } = this.state
        return (
            <>
                <Form
                    {...props}
                >
                    <div className="form-group row form-group-marginless pt-4 m-3">
                        <div className="col-md-4">
                            <Input
                                requirevalidation={1}
                                formeditado={formeditado}
                                name="semana"
                                value={form.semana}
                                onChange={onChange}
                                type="text"
                                placeholder="NÚMERO DE SEMANA"
                                iconclass={"far fa-folder-open"}
                                messageinc="Incorrecto. Ingresa el número de semana."
                            />
                        </div>
                        <div className="col-md-4">
                            <Calendar
                                formeditado={formeditado}
                                onChangeCalendar={this.handleChangeDateInicio}
                                placeholder="FECHA DE INICIO"
                                name="fechaInicio"
                                value={form.fechaInicio}
                                selectsStart
                                startDate={form.fechaInicio}
                                endDate={form.fechaFin}
                                iconclass={"far fa-calendar-alt"}
                            />
                        </div>
                        <div className="col-md-4">
                            <Calendar
                                formeditado={formeditado}
                                onChangeCalendar={this.handleChangeDateFin}
                                placeholder="FECHA FINAL"
                                name="fechaFin"
                                value={form.fechaFin}
                                selectsEnd
                                startDate={form.fechaInicio}
                                endDate={form.fechaFin}
                                minDate={form.fechaInicio}
                                iconclass={"far fa-calendar-alt"}
                            />
                        </div>
                        {
                            isNew === true ?
                                <div className = 'mt-2 col-md-12'>
                                    <ItemSlider
                                        items = {form.adjuntos.avance.files}
                                        item = 'avance'
                                        multiple = { false }
                                        handleChange = { handleChange }
                                        />
                                </div>
                            : ''
                        }
                    </div>
                    {
                        isNew !== true ?
                            <div className="mr-3">
                                <div className="d-flex justify-content-end my-2">
                                    <Button
                                        pulse = "pulse-ring"
                                        className = "btn btn-icon btn-light-info pulse pulse-info"
                                        onClick = { addRowAvance }
                                        icon = { faPlus }
                                        tooltip = { { text: 'Agregar nuevo' } }
                                        />
                                </div>
                            </div>
                        : ''
                    }
                    {
                        form.avances.map((avance, key) => {
                            if(isNew !== true)
                            return (
                                <>
                                    <div className="m-4" key={key}>
                                        <table className="w-100">
                                            <tbody>
                                                <tr>
                                                    <td rowSpan="2" className="w-400px p-4 text-center">
                                                        <FileInput
                                                            requirevalidation={0}
                                                            formeditado={formeditado}
                                                            onChangeAdjunto={e => onChangeAdjuntoAvance(e, key, 'adjuntos')}
                                                            placeholder={form['avances'][key]['adjuntos']['placeholder']}
                                                            value={form['avances'][key]['adjuntos']['value']}
                                                            name={`${key}-avance`} id={'avance'}
                                                            accept="image/*"
                                                            files={form['avances'][key]['adjuntos']['files']}
                                                            _key={key}
                                                            deleteAdjuntoAvance={clearFilesAvances}
                                                            multiple
                                                            classbtn='btn btn-default btn-hover-icon-success font-weight-bolder btn-hover-bg-light text-hover-success text-dark-50 mb-0'
                                                            iconclass='flaticon2-clip-symbol text-primary'
                                                        />
                                                    </td>
                                                    <td>
                                                        <div className="d-flex justify-content-end">
                                                            <InputMoneySinText
                                                                requirevalidation={1}
                                                                formeditado={formeditado}
                                                                thousandseparator={false}
                                                                prefix={'%'}
                                                                name="avance"
                                                                value={form.avance}
                                                                onChange={e => onChangeAvance(key, e, 'avance')}
                                                                placeholder="% DE AVANCE"
                                                                iconclass={"fas fa-percent"}
                                                                customstyle={{ width: '110px', borderRadius: 0, fontSize: '1rem', padding: '0.65rem 1rem' }}
                                                            />
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <InputSinText
                                                            requirevalidation={1}
                                                            formeditado={formeditado}
                                                            as="textarea"
                                                            rows="3"
                                                            placeholder="DESCRIPCIÓN"
                                                            name="descripcion"
                                                            value={form['avances'][key]['descripcion']}
                                                            onChange={e => onChangeAvance(key, e, 'descripcion')}
                                                            messageinc="Incorrecto. Ingresa la descripción."
                                                            style={{ paddingLeft: "10px" }}
                                                            customstyle={{ borderRadius: 0, fontSize: '1rem', padding: '0.65rem 1rem' }}
                                                        />
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            )
                            return ''
                        })
                    }
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
                                                    <>
                                                        <Card key={key}>
                                                            <Accordion.Toggle as={Card.Header} eventKey={avance.id} onClick={() => this.handleAccordion(avance.id)}>
                                                                <div className="card-title">
                                                                    <div className="text-center">{avance.semana}</div>
                                                                </div>
                                                            </Accordion.Toggle>
                                                            <Accordion.Collapse eventKey={avance.id}>
                                                                <Card.Body>
                                                                    <div>
                                                                        <div className="d-flex justify-content-center">
                                                                            <a rel="noopener noreferrer" href={avance.pdf} target="_blank" className="text-info font-weight-bold font-size-sm">
                                                                                <div className="bg-light-info rounded-sm mr-5 p-2">
                                                                                    <span className="svg-icon svg-icon-xl svg-icon-info mr-2">
                                                                                        <SVG src={toAbsoluteUrl('/images/svg/Download.svg')} />
                                                                                    </span>
                                                                                    Descargar PDF
                                                                                </div>
                                                                            </a>
                                                                            {
                                                                                proyecto ?
                                                                                    proyecto.contactos.length ?
                                                                                        <span onClick={(e) => { e.preventDefault(); sendMail(avance.id) }} className="text-pink font-weight-bold font-size-sm">
                                                                                            <div className="bg-light-pink rounded-sm mr-5 p-2">
                                                                                                <span className="svg-icon svg-icon-xl svg-icon-pink mr-2">
                                                                                                    <SVG src={toAbsoluteUrl('/images/svg/Mail-notification.svg')} />
                                                                                                </span>
                                                                                                Enviar por correo
                                                                                            </div>
                                                                                        </span>
                                                                                        :
                                                                                        ''
                                                                                    : ''
                                                                            }
                                                                        </div>
                                                                        <div>
                                                                            <SliderImages elements={avance.adjuntos} />
                                                                        </div>
                                                                    </div>
                                                                </Card.Body>
                                                            </Accordion.Collapse>
                                                        </Card>
                                                    </>
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