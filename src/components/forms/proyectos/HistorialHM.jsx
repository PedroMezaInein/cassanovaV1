import React, { Component } from 'react';
import SVG from "react-inlinesvg";
import { Tab, Nav, OverlayTrigger, Tooltip, Form } from 'react-bootstrap';
import { setDiaMesTexto, setFechaTexto } from '../../../functions/functions';
import { validateAlert, deleteAlert } from '../../../functions/alert';
import { InputGray, CalendarDay, Button, InputNumberGray, RadioGroupGray, InputCantidad } from '../../form-components'
import moment from 'moment';
import { toAbsoluteUrl } from "../../../functions/routers"

class HistorialHM extends Component {

    state = {
        active: '',
        showForm:false
    }

    mostrarFormulario() {
        const { showForm } = this.state
        this.setState({
            ...this.state,
            showForm: !showForm
        })
    }
    
    render() {
        const { bodega, form, onChange, onSubmit, deletePrestamo, deleteDevolucion, tipo } = this.props
        const { active, showForm } = this.state
        return (
            <>
                <Form
                    onSubmit={
                        (e) => {
                            e.preventDefault();
                            validateAlert(onSubmit, e, 'wizard-3-content')
                        }
                    }>
                    <div className="form-group row form-group-marginless mx-0 mt-2 justify-content-center">
                        <div className="col-md-4">
                            <InputCantidad
                                requirevalidation={1}
                                placeholder="INGRESA LA CANTIDAD"
                                type="text"
                                name="cantidad"
                                value={form.cantidad}
                                onChange={onChange}
                                messageinc="Incorrecto. Ingresa la cantidad."
                                customlabel="font-weight-bold text-dark-60"
                                customclass="text-dark-50 font-weight-bold"
                            />
                        </div>
                        {
                            form.cantidad >0?
                            <div className="col-md-2 d-flex align-self-end place-content-center mt-5">
                                <Button icon='' text='ENVIAR' onClick={(e) => { e.preventDefault(); onSubmit(e) }} className="btn btn-bg-light btn-icon-info btn-hover-light-success text-success font-weight-bolder font-size-13px"/>
                            </div>
                            :<></>
                        }
                    </div>
                </Form>
                <div className="row justify-content-center">
                    <div className="timeline timeline-historial mt-3 d-inline-block">
                        <div className="timeline-item align-items-start">
                            <div className="timeline-label font-weight-bolder text-dark-75 font-size-lg">11 JUN 2021</div>
                            <div className="timeline-badge">
                                <i className="fa fa-genderless text-primary icon-xl"></i>
                            </div>
                            <div className="timeline-content">
                                <div className="font-weight-bolder font-size-h6 text-dark-75">
                                    CENTAURO - OBRA - CHURUBUSCO
                                </div>
                                <div className="font-weight-normal font-size-lg text-muted">
                                    CANTIDAD: <u>12</u>
                                </div>
                            </div>
                        </div>
                        <div className="timeline-item align-items-start">
                            <div className="timeline-label font-weight-bolder text-dark-75 font-size-lg">15 JUL 2021</div>
                            <div className="timeline-badge">
                                <i className="fa fa-genderless text-info icon-xl"></i>
                            </div>
                            <div className="timeline-content">
                                <div className="font-weight-bolder font-size-h6 text-dark-75">
                                    CLINICA DIAGNOSTICO Y LABORATORIO
                                </div>
                                <div className="font-weight-normal font-size-lg text-muted">
                                    CANTIDAD: <u>12</u>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default HistorialHM;