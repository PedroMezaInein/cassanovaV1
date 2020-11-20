import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { Input, SelectSearch, Button, RangeCalendar, InputNumber, InputPhone, SelectSearchTrue } from '../../form-components'
import { faPlus} from '@fortawesome/free-solid-svg-icons'
import { TEL, EMAIL } from '../../../constants'
import { openWizard1, openWizard2, openWizard3 } from '../../../functions/wizard'
import { validateAlert } from '../../../functions/alert'
import ItemSlider from '../../singles/ItemSlider'
class ProyectosForm extends Component {

    addCorreo = () => {
        const { onChange, form } = this.props
        let aux = false
        let array = []
        if (/^(?:[^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*|"[^\n"]+")@(?:[^<>()[\].,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,63}$/i.test(form.correo)) {
            if (form.correo) {
                form.correos.map((correo) => {
                    if (correo === form.correo) {
                        aux = true
                    }
                    return false
                })
                if (!aux) {
                    array = form.correos
                    array.push(form.correo)
                    onChange({ target: { name: 'correos', value: array } })
                    onChange({ target: { name: 'correo', value: '' } })
                }
            }
        } else {
            alert("La dirección de email es incorrecta.");
        }
    }

    // handleChangeDateInicio = date => {
    //     const { onChange, form } = this.props
    //     if (form.fechaInicio > form.fechaFin) {
    //         onChange({ target: { name: 'fechaFin', value: date } })
    //     }
    //     onChange({ target: { name: 'fechaInicio', value: date } })
    // }

    // handleChangeDateFin = date => {
    //     const { onChange } = this.props
    //     onChange({ target: { name: 'fechaFin', value: date } })
    // }

    updateCliente = value => {
        const { onChange, options, onChangeOptions, form } = this.props
        options.clientes.map((cliente) => {
            if (cliente.value === value) {
                let aux = false;
                form.clientes.map((element) => {
                    if (element.value === value)
                        aux = true
                    return false
                })
                if (!aux)
                    onChangeOptions({ target: { value: cliente.value, name: 'cliente' } }, 'clientes')
            }
            return false
        })
        onChange({ target: { value: value, name: 'cliente' } })
    }

    updateEmpresa = value => {
        const { onChange } = this.props
        onChange({ target: { name: 'empresa', value: value } })
    }

    updateColonia = value => {
        const { onChange } = this.props
        onChange({ target: { name: 'colonia', value: value } })
    }

    updateEstatus = value => {
        const { onChange } = this.props
        onChange({ target: { name: 'estatus', value: value } })
    }

    handleToggler = e => {
        const { name, checked } = e.target
        const { onChange } = this.props
        onChange({ target: { name: name, value: checked } })
    }

    render() {
        const { title, children, form, onChange, onChangeCP, onChangeAdjunto, onChangeAdjuntoGrupo, clearFiles, clearFilesGrupo, options, onSubmit, removeCorreo, formeditado, deleteOption, onChangeOptions, action,handleChange, onChangeRange, ...props } = this.props
        return (
            <div className="wizard wizard-3" id="wizardP" data-wizard-state="step-first">
                <div className="wizard-nav">
                    <div className="wizard-steps">
                        <div id="wizard-1" className="wizard-step" data-wizard-state="current" data-wizard-type="step" style={{ paddingTop: "0px" }} onClick={() => { openWizard1() }}>
                            <div className="wizard-label">
                                <h3 className="wizard-title">
                                    <span>1.</span> Datos generales</h3>
                                <div className="wizard-bar"></div>
                            </div>
                        </div>
                        <div id="wizard-2" className="wizard-step" data-wizard-type="step" style={{ paddingTop: "0px" }} onClick={() => { openWizard2() }}>
                            <div className="wizard-label">
                                <h3 className="wizard-title">
                                    <span>2.</span> Ubicación</h3>
                                <div className="wizard-bar"></div>
                            </div>
                        </div>
                        <div id="wizard-3" className="wizard-step" data-wizard-type="step" style={{ paddingTop: "0px" }} onClick={() => { openWizard3() }}>
                            <div className="wizard-label">
                                <h3 className="wizard-title">
                                    <span>3.</span> Fechas e imagen</h3>
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
                                    validateAlert(onSubmit, e, 'wizard-3-content')
                                }
                            }
                            {...props}
                        >
                            {children}
                            <div id="wizard-1-content" className="pb-3 px-2" data-wizard-type="step-content" data-wizard-state="current">
                                <h5 className="mb-4 font-weight-bold text-dark">Ingresa los datos de generales</h5>
                                <div className="form-group row form-group-marginless">
                                    <div className = 'col-md-2 mt-2'>
                                        <div className="d-flex">
                                            <div className="mr-5">
                                                <div className="text-center">
                                                    <p className="font-size-sm font-weight-bold">FASE 1</p>
                                                </div>
                                                <div className="d-flex justify-content-center">
                                                    <Form.Group>
                                                        <div className="checkbox-list pt-2">
                                                            <label className="checkbox checkbox-outline checkbox-outline-2x checkbox-primary">
                                                                <input
                                                                    name = 'fase1'
                                                                    type="checkbox"
                                                                    checked = { form.fase1 }
                                                                    onChange={e => this.handleToggler(e)}
                                                                    disabled = { form.fase1_relacionado === false ? false : form.fase1_relacionado }
                                                                    />
                                                                <span class = { form.fase1_relacionado === false ? '' : 'disabled-label-span' } ></span>
                                                            </label>
                                                        </div>
                                                    </Form.Group>
                                                </div>
                                            </div>
                                            <div className="mr-5">
                                                <div className="text-center">
                                                    <p className="font-size-sm font-weight-bold">FASE 2</p>
                                                </div>
                                                <div className="d-flex justify-content-center">
                                                    <Form.Group>
                                                        <div className="checkbox-list pt-2">
                                                            <label className="checkbox checkbox-outline checkbox-outline-2x checkbox-primary">
                                                                <input
                                                                    name = 'fase2'
                                                                    type="checkbox"
                                                                    checked = { form.fase2 }
                                                                    onChange={e => this.handleToggler(e)}
                                                                    disabled = { form.fase2_relacionado === false ? false : form.fase2_relacionado }
                                                                    />
                                                                <span class = { form.fase2_relacionado === false ? '' : 'disabled-label-span' } ></span>
                                                            </label>
                                                        </div>
                                                    </Form.Group>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-center">
                                                    <p className="font-size-sm font-weight-bold">FASE 3</p>
                                                </div>
                                                <div className="d-flex justify-content-center">
                                                    <Form.Group>
                                                        <div className="checkbox-list pt-2">
                                                            <label className="checkbox checkbox-outline checkbox-outline-2x checkbox-primary">
                                                                <input
                                                                    name = 'fase3'
                                                                    type="checkbox"
                                                                    checked = { form.fase3 }
                                                                    onChange={e => this.handleToggler(e)}
                                                                    disabled = { form.fase3_relacionado === false ? false : form.fase3_relacionado }
                                                                    />
                                                                <span class = { form.fase3_relacionado === false ? '' : 'disabled-label-span' } ></span>
                                                            </label>
                                                        </div>
                                                    </Form.Group>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-5">
                                        <Input
                                            requirevalidation={1}
                                            formeditado={formeditado}
                                            name="nombre"
                                            value={form.nombre}
                                            onChange={onChange}
                                            type="text"
                                            placeholder="NOMBRE DEL PROYECTO"
                                            iconclass={"far fa-folder-open"}
                                            messageinc="Incorrecto. Ingresa el nombre del proyecto."
                                        />
                                    </div>
                                    <div className="col-md-5">
                                        <InputPhone
                                            requirevalidation={1}
                                            formeditado={formeditado}
                                            thousandseparator={false}
                                            prefix={''}
                                            name="numeroContacto"
                                            value={form.numeroContacto}
                                            onChange={onChange}
                                            placeholder="NÚMERO DE CONTACTO"
                                            iconclass={"fas fa-mobile-alt"}
                                            messageinc="Incorrecto. Ingresa el número de contacto."
                                            patterns={TEL}
                                        />
                                    </div>
                                </div>
                                <div className="separator separator-dashed mt-1 mb-2"></div>
                                <div className="form-group row form-group-marginless">
                                    <div className={form.clientes.length ? "col-md-4" : "col-md-6"}>
                                        <Input
                                            requirevalidation={1}
                                            formeditado={formeditado}
                                            name="contacto"
                                            value={form.contacto}
                                            onChange={onChange}
                                            type="text"
                                            placeholder="NOMBRE DEL CONTACTO"
                                            iconclass={"far fa-user-circle"}
                                            messageinc="Incorrecto. Ingresa el nombre de contacto."
                                        />
                                    </div>
                                    <div className={form.clientes.length ? "col-md-4" : "col-md-6"}>
                                        {
                                            formeditado && form.clientes.length ? 
                                                <SelectSearchTrue
                                                    formeditado={formeditado}
                                                    options={options.clientes}
                                                    placeholder="SELECCIONA EL CLIENTE"
                                                    name="cliente"
                                                    value={form.cliente}
                                                    onChange={this.updateCliente}
                                                    iconclass={"far fa-user"}
                                                    />
                                            :   
                                                <SelectSearch
                                                    formeditado={formeditado}
                                                    options={options.clientes}
                                                    placeholder="SELECCIONA EL CLIENTE"
                                                    name="cliente"
                                                    value={form.cliente}
                                                    onChange={this.updateCliente}
                                                    iconclass={"far fa-user"}
                                                    messageinc="Incorrecto. Selecciona el cliente"
                                                />
                                        }
                                        
                                    </div>
                                    <div className="col-md-4 row mx-0">
                                        {
                                            form.clientes.map((cliente, key) => {
                                                return (
                                                    <div className="tagify form-control p-1 col-md-6 px-2 d-flex justify-content-center align-items-center white-space" tabIndex="-1" style={{ borderWidth: "0px" }} key={key}>
                                                        <div className=" image-upload d-flex px-3 align-items-center tagify__tag tagify__tag--primary tagify--noAnim white-space"  >
                                                            <div
                                                                title="Borrar archivo"
                                                                className="tagify__tag__removeBtn"
                                                                role="button"
                                                                aria-label="remove tag"
                                                                onClick={(e) => { e.preventDefault(); deleteOption(cliente, 'clientes') }}
                                                            >
                                                            </div>
                                                            <div><span className="tagify__tag-text p-1 white-space">{cliente.name}</span></div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                                <div className="separator separator-dashed mt-1 mb-2"></div>
                                <div className="form-group row form-group-marginless">
                                    <div className="col-md-10">
                                        <Input
                                            requirevalidation={0}
                                            formeditado={formeditado}
                                            thousandseparator={false}
                                            prefix={''}
                                            name="correo"
                                            value={form.correo}
                                            onChange={onChange}
                                            placeholder="CORREO DE CONTACTO"
                                            iconclass={"fas fa-envelope"}
                                            messageinc="Incorrecto. Ej. usuario@dominio.com"
                                            patterns={EMAIL}
                                            type="email"
                                        />
                                    </div>
                                    <div className="col-md-2 mt-3 d-flex justify-content-center align-items-center">
                                        <Button icon={faPlus} pulse={"pulse-ring"} className={"btn btn-icon btn-light-primary pulse pulse-primary mr-5"} onClick={(e) => { e.preventDefault(); this.addCorreo() }} />
                                    </div>
                                </div>
                                <div className="form-group row form-group-marginless">
                                    <div className="col-md-12 row mx-0">
                                        {
                                            form.correos.map((correo, key) => {
                                                return (
                                                    <div className="tagify form-control p-1 col-md-4 px-2 d-flex justify-content-center align-items-center white-space" tabIndex="-1" style={{ borderWidth: "0px" }} key={key}>
                                                        <div className=" image-upload d-flex px-3 align-items-center tagify__tag tagify__tag--primary tagify--noAnim white-space"  >
                                                            <div
                                                                title="Borrar archivo"
                                                                className="tagify__tag__removeBtn"
                                                                role="button"
                                                                aria-label="remove tag"
                                                                onClick={(e) => { e.preventDefault(); removeCorreo(correo) }}
                                                            >
                                                            </div>
                                                            <div><span className="tagify__tag-text p-1 white-space">{correo}</span></div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between border-top mt-3 pt-3">
                                    <div className="mr-2"></div>
                                    <div>
                                        <button type="button" className="btn btn-primary font-weight-bold text-uppercase" onClick={() => { openWizard2() }} data-wizard-type="action-next">Siguiente</button>
                                    </div>
                                </div>
                            </div>
                            <div id="wizard-2-content" className="pb-3" data-wizard-type="step-content">
                                <h5 className="mb-4 font-weight-bold text-dark">Escribe la ubicación</h5>
                                <div className="form-group row form-group-marginless">
                                    <div className="col-md-4">
                                        <InputNumber
                                            requirevalidation={1}
                                            formeditado={formeditado}
                                            name="cp"
                                            onChange={onChangeCP}
                                            value={form.cp}
                                            type="text"
                                            placeholder="CÓDIGO POSTAL"
                                            iconclass={"far fa-envelope"}
                                            maxLength="5"
                                            messageinc="Incorrecto. Ingresa el código postal."
                                        />
                                    </div>
                                    <div className="col-md-4" hidden={options.colonias.length <= 0 ? true : false}>
                                        <Input
                                            requirevalidation={0}
                                            formeditado={formeditado}
                                            readOnly={options.colonias.length <= 0 ? true : false}
                                            value={form.estado}
                                            name="estado"
                                            type="text"
                                            placeholder="ESTADO"
                                            iconclass={"fas fa-map-marked-alt"}
                                            disabled
                                        />
                                    </div>
                                    <div className="col-md-4" hidden={options.colonias.length <= 0 ? true : false}>
                                        <Input
                                            requirevalidation={0}
                                            formeditado={formeditado}
                                            readOnly={options.colonias.length <= 0 ? true : false}
                                            value={form.municipio}
                                            name="municipio"
                                            type="text"
                                            placeholder="MUNICIPIO/DELEGACIÓN"
                                            iconclass={"fas fa-map-marker-alt"}
                                            disabled
                                        />
                                    </div>
                                </div>
                                <div className="separator separator-dashed mt-1 mb-2" hidden={options.colonias.length <= 0 ? true : false}></div>
                                <div className="form-group row form-group-marginless">
                                    <div className="col-md-5" hidden={options.colonias.length <= 0 ? true : false}>
                                        {
                                            options.colonias.length > 0 &&
                                            <SelectSearch
                                                formeditado={formeditado}
                                                options={options.colonias}
                                                placeholder="SELECCIONA LA COLONIA"
                                                name="colonia"
                                                iconclass={"fas fa-map-pin"}
                                                value={form.colonia}
                                                defaultValue={form.colonia}
                                                onChange={this.updateColonia}
                                                messageinc="Incorrecto. Selecciona la colonia"
                                            />
                                        }
                                        {
                                            options.colonias.length <= 0 &&
                                            <Input
                                                requirevalidation={1}
                                                formeditado={formeditado}
                                                readOnly
                                                value={form.colonia}
                                                name="colonia" type="text"
                                                placeholder="SELECCIONA LA COLONIA"
                                                iconclass={"fas fa-map-pin"}
                                            />
                                        }
                                    </div>
                                    <div className="col-md-7" hidden={options.colonias.length <= 0 ? true : false}>
                                        <Input
                                            requirevalidation={1}
                                            formeditado={formeditado}
                                            name="calle"
                                            value={form.calle}
                                            onChange={onChange}
                                            type="text"
                                            placeholder="CALLE Y NÚMERO"
                                            iconclass={"fas fa-map-signs"}
                                            messageinc="Incorrecto. Ingresa la calle y número."
                                        />
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between border-top mt-3 pt-3">
                                    <div className="mr-2">
                                        <button type="button" className="btn btn-light-primary font-weight-bold text-uppercase" onClick={() => { openWizard1() }} data-wizard-type="action-prev">Anterior</button>
                                    </div>
                                    <div>
                                        <button type="button" className="btn btn-primary font-weight-bold text-uppercase" onClick={() => { openWizard3() }} data-wizard-type="action-next">Siguiente</button>
                                    </div>
                                </div>
                            </div>
                            <div id="wizard-3-content" className="pb-3" data-wizard-type="step-content">
                                <h5 className="mb-4 font-weight-bold text-dark">Ingresa las fechas e imagenes</h5>
                                <div className="form-group row form-group-marginless">
                                    {
                                        action === 'edit' ?
                                            <div className={action === 'edit' ? "col-md-2" : "col-md-6"}>
                                                <SelectSearch
                                                    formeditado = { formeditado }
                                                    options = { options.estatus }
                                                    placeholder = "SELECCIONA EL ESTADO"
                                                    name = "cliente"
                                                    value={form.estatus}
                                                    onChange = { this.updateEstatus }
                                                    iconclass={"far fa-user"}
                                                    messageinc="Incorrecto. Selecciona el estado"
                                                />
                                            </div>
                                        :''
                                    }
                                    <div className={form.estatus? "col-md-3":"col-md-6"}>
                                        <SelectSearch
                                            formeditado={formeditado}
                                            options={options.empresas}
                                            placeholder="SELECCIONA LA EMPRESA"
                                            name="empresa"
                                            value={form.empresa}
                                            onChange={this.updateEmpresa}
                                            iconclass={"far fa-building"}
                                            messageinc="Incorrecto. Selecciona la empresa"
                                        />
                                    </div>
                                    <div className={form.estatus? "col-md-7":"col-md-6"}>
                                        <Input
                                            requirevalidation={0}
                                            formeditado={formeditado}
                                            rows="1"
                                            as="textarea"
                                            placeholder="DESCRIPCIÓN"
                                            name="descripcion"
                                            onChange={onChange}
                                            value={form.descripcion}
                                            style={{ paddingLeft: "10px" }}
                                            messageinc="Incorrecto. Ingresa una descripción."
                                        />
                                    </div>
                                    {/* <div className={form.estatus? "col-md-3":"col-md-4"}>
                                        <Calendar
                                            formeditado={formeditado}
                                            onChangeCalendar={this.handleChangeDateInicio}
                                            placeholder="FECHA DE INICIO"
                                            name="fechaInicio"
                                            value={form.fechaInicio}
                                            selectsStart
                                            startDate={form.fechaInicio}
                                            endDate={form.fechaFin}
                                            patterns={DATE}
                                        />
                                    </div>
                                    <div className={form.estatus? "col-md-3":"col-md-4"}>
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
                                            patterns={DATE}
                                        />
                                    </div> */}
                                </div>
                                {/* <div className="separator separator-dashed mt-1 mb-2"></div>
                                <div className="form-group row form-group-marginless">
                                    
                                </div> */}
                                <div className="separator separator-dashed mt-1 mb-2"></div>
                                <div className="form-group row form-group-marginless justify-content-center mt-3">
                                    <div className="col-md-6 text-center">
                                    <label className="col-form-label my-2 font-weight-bolder">{form.adjuntos.image.placeholder}</label>
                                        <ItemSlider
                                            items={form.adjuntos.image.files}
                                            item='image' 
                                            handleChange={handleChange}
                                            multiple={false} 
                                        />
                                    </div>
                                    <div className="col-md-6 text-center">
                                        <label className="col-form-label my-2 font-weight-bolder">Fecha de inicio - Fecha final</label><br/>
                                        <RangeCalendar
                                            onChange={onChangeRange}
                                            start={form.fechaInicio}
                                            end={form.fechaFin}
                                        />
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between border-top mt-3 pt-3">
                                    <div className="mr-2">
                                        <button type="button" className="btn btn-light-primary font-weight-bold text-uppercase" onClick={() => { openWizard2() }} data-wizard-type="action-prev">Anterior</button>
                                    </div>
                                    <div>
                                        <Button icon='' className="btn btn-primary font-weight-bold text-uppercase"
                                            onClick={
                                                (e) => {
                                                    e.preventDefault();
                                                    validateAlert(onSubmit, e, 'wizard-3-content')
                                                }
                                            }
                                            text="ENVIAR" />
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

export default ProyectosForm