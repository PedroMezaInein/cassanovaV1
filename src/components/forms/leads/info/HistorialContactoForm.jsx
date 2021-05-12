import React, { Component } from 'react'
import { RadioGroupGray, InputGray, SelectSearchGray, CalendarDay, Button, SelectHorario} from '../../../form-components'
import { ItemSlider } from '../../../../components/singles'
import { openWizard1_for2_wizard, openWizard2_for2_wizard } from '../../../../functions/wizard'
import { validateAlert } from '../../../../functions/alert'
import { Form } from 'react-bootstrap'
class HistorialContactoForm extends Component {

    state = {
        newTipoContacto: false
    }

    updateTipoContacto = value => {
        const { onChangeHistorial } = this.props
        onChangeHistorial({ target: { name: 'tipoContacto', value: value } })
        if (value === 'New') {
            this.setState({
                newTipoContacto: true
            })
        } else {
            this.setState({
                newTipoContacto: false
            })
        }
    }

    handleChangeDate = (date) => {
        const { onChangeHistorial } = this.props
        onChangeHistorial({ target: { name: 'fechaContacto', value: date } })
    }

    render() {
        
        const { form, onSubmit, formeditado, onChange, options, handleChange, formHistorial ,onChangeHistorial, ...props } = this.props
        const { newTipoContacto } = this.state
        return (
            <div className="wizard wizard-3" id="for2-wizardP" data-wizard-state="step-first">
                <div className="wizard-nav">
                    <div className="wizard-steps">
                        <div id="for2-wizard-1" className="wizard-step" data-wizard-state="current" data-wizard-type="step" onClick={() => { openWizard1_for2_wizard() }}>
                            <div className="wizard-label pt-1">
                                <h3 className="wizard-title">
                                    <span>1.</span> Datos de generales</h3>
                                <div className="wizard-bar"></div>
                            </div>
                        </div>
                        <div id="for2-wizard-2" className="wizard-step" data-wizard-type="step" onClick={() => { openWizard2_for2_wizard() }}>
                            <div className="wizard-label pt-1">
                                <h3 className="wizard-title">
                                    <span>2.</span> Adjunto y fecha</h3>
                                <div className="wizard-bar"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-md-12">
                        <Form
                            onSubmit={
                                (e) => {
                                    e.preventDefault();
                                    validateAlert(onSubmit, e, 'for2-wizardP')
                                }
                            }
                            {...props}
                        >
                            <div id="for2-wizard-1-content" className="pb-3 px-2" data-wizard-type="step-content" data-wizard-state="current">
                                <h5 className="mb-4 font-weight-bold text-dark">Ingresa los datos</h5>
                                <div className="form-group row form-group-marginless">
                                    <div className="col-md-4">
                                        <RadioGroupGray
                                            placeholder="Selecciona el estatus del intento de contacto"
                                            formeditado={formeditado}
                                            name={'success'}
                                            onChange={onChangeHistorial}
                                            options={
                                                [
                                                    {
                                                        label: 'Contactado',
                                                        value: 'Contactado'
                                                    },
                                                    {
                                                        label: 'Sin respuesta',
                                                        value: 'Sin respuesta'
                                                    }
                                                ]
                                            }
                                            value={formHistorial.success}
                                        />
                                    </div>
                                    <div className={newTipoContacto ? 'col-md-4' : 'col-md-8'}>
                                        <SelectSearchGray
                                            formeditado={formeditado}
                                            requirevalidation={1}
                                            options={options.tiposContactos}
                                            placeholder="SELECCIONA EL MEDIO DE CONTACTO"
                                            name="tipoContacto"
                                            value={formHistorial.tipoContacto}
                                            onChange={this.updateTipoContacto}
                                            messageinc="Incorrecto. Selecciona el medio de contacto."
                                            withtaglabel={1}
                                            withtextlabel={1}
                                        />
                                    </div>
                                    {
                                        newTipoContacto &&
                                        <div className="col-md-4">
                                            <InputGray
                                                withtaglabel={1}
                                                withtextlabel={1}
                                                withplaceholder={1}
                                                withicon={1}
                                                withformgroup={1}
                                                formeditado={formeditado}
                                                requirevalidation={1}
                                                onChange={onChangeHistorial}
                                                name="newTipoContacto"
                                                type="text"
                                                value={formHistorial.newTipoContacto}
                                                placeholder="NUEVO TIPO DE CONTACTO"
                                                iconclass={"fas fa-mail-bulk"}
                                                messageinc="Incorrecto. Ingresa el nuevo tipo de contacto."
                                            />
                                        </div>
                                    }
                                </div>
                                <div className="form-group row form-group-marginless">
                                    <div className="col-md-12">
                                        <InputGray
                                            withtaglabel={1}
                                            withtextlabel={1}
                                            withplaceholder={1}
                                            withicon={0}
                                            withformgroup={1}
                                            formeditado={formeditado}
                                            requirevalidation={1}
                                            as='textarea'
                                            name='descripcion'
                                            placeholder='DESCRIPCIÓN DEL CONTACTO'
                                            onChange={onChangeHistorial}
                                            value={formHistorial.descripcion}
                                            rows='3'
                                            messageinc="Incorrecto. Ingresa una descripción."
                                        />
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between border-bottom mt-3 py-3">
                                    <div className="mr-2"></div>
                                    <div>
                                        <button type="button" className="btn btn-primary font-weight-bold text-uppercase" onClick={() => { openWizard2_for2_wizard() }} data-wizard-type="action-next">Siguiente</button>
                                    </div>
                                </div>
                            </div>
                            <div id="for2-wizard-2-content" className="pb-3" data-wizard-type="step-content">
                                <h5 className="mb-4 font-weight-bold text-dark">Adjunto y fecha de contacto</h5>
                                <div className="form-group row form-group-marginless d-flex justify-content-center">
                                    <div className="col-md-6 text-center align-self-center">
                                        <label className="col-4 font-weight-bolder align-self-center">Adjunto</label>
                                        <ItemSlider 
                                            items={formHistorial.adjuntos.adjuntos.files}
                                            item='adjuntos' 
                                            handleChange={handleChange}
                                            multiple={false}
                                        />
                                    </div>
                                    <div className="col-md-6 text-center align-self-center">
                                        <div className="d-flex justify-content-center" style={{ height: '1px' }}>
                                            <label className="text-center font-weight-bolder">Fecha de contacto</label>
                                        </div>
                                        <CalendarDay
                                            date={formHistorial.fechaContacto}
                                            value={formHistorial.fechaContacto}
                                            onChange={onChangeHistorial}
                                            name='fechaContacto'
                                            withformgroup={1}
                                            requirevalidation={1}
                                        />
                                        <div className="d-flex justify-content-center">
                                            <div className="col-md-5">
                                                <label className="col-form-label text-center font-weight-bolder">Hora de contacto</label>
                                                <div className="form-group row d-flex justify-content-center">
                                                    <SelectHorario onChange={onChangeHistorial} minuto={{ value: formHistorial.minuto, name: 'minuto' }}
                                                        hora={{ value: formHistorial.hora, name: 'hora' }} allhours={1}/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="border-bottom mt-3 py-3">
                                    <div className="row">
                                        <div className="col-lg-6 text-left">
                                            <button type="button" className="btn btn-light-primary font-weight-bold text-uppercase" onClick={() => { openWizard1_for2_wizard() }} data-wizard-type="action-prev">Anterior</button>
                                        </div>
                                        <div className="col-lg-6 text-right">
                                            <div className="">
                                                <Button icon='' className="btn btn-primary font-weight-bold text-uppercase mr-2"
                                                    onClick={
                                                        (e) => {
                                                            e.preventDefault();
                                                            validateAlert(onSubmit, e, 'for2-wizardP')
                                                        }
                                                    }
                                                    text="Enviar" />
                                            </div>
                                        </div>
                                    </div> 
                                </div>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        )
    }
}

export default HistorialContactoForm