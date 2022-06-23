import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { Input, Select, SelectSearch, Button, InputNumber, InputPhone, CalendarDay } from '../../form-components'
import { RFC, TEL, EMAIL } from '../../../constants'
import { validateAlert } from '../../../functions/alert'
import { openWizard1, openWizard2 } from '../../../functions/wizard'
class ProveedorForm extends Component {
    // state= {
    //     variableCampoRequerido:0
    // }

    componentWillUpdate() {
        const { form } = this.props
        // let { variableCampoRequerido } = this.state
        if(form.tipo_persona!== "personaMoral"  ){
        let cambioClaseM = document.getElementById('personaMoralContenedor')
        cambioClaseM.classList.add('d-none')
        // variableCampoRequerido=0
        // this.setState({
        //     ...this.state,
        //     variableCampoRequerido
        // })
        }

    }

    // changeRequired = (e) => {
    //     // let { variableCampoRequerido } = this.state
    //     if(e=== 'personaMoral'){
    //         // variableCampoRequerido = 1 
    //         // console.log(variableCampoRequerido, 'moral')
    //         this.setState({
    //             ...this.state,
    //             // variableCampoRequerido,
    //         })
    //     }
    //     if(e==='personaFisica'){
    //         variableCampoRequerido = 0 
    //         console.log(variableCampoRequerido, 'fisica')
    //         this.setState({
    //             ...this.state,
    //             variableCampoRequerido,
    //         })
    //     }
    // }

    updateArea = value => {
        const { onChange, setOptions } = this.props
        onChange({ target: { value: value, name: 'area' } })
        onChange({ target: { value: '', name: 'subarea' } })
        const { options: { areas } } = this.props
        areas.find(function (element, index) {
            if (value.toString() === element.value.toString()) {
                setOptions('subareas', element.subareas)
            }
            return false
        })
    }

    updateSubarea = value => {
        const { onChange } = this.props
        onChange({ target: { name: 'subarea', value: value.toString() } })
    }

    onChangeA = e => {
        let { form } = this.props
        const { name, value } = e.target
      
        if (value === 'personaMoral') {
            let cambioClaseM = document.getElementById('personaMoralContenedor')
            cambioClaseM.classList.remove('d-none')
             form.tipo_persona = value
            //  this.changeRequired('personaMoral')
            this.setState({
                ...this.state,
                form,
            })
            // this.setState({
            //     ...this.state,
            //     variableCampoRequerido,
            // })
        }
        if (value === 'personaFisica') {
            let cambioClaseM = document.getElementById('personaMoralContenedor')
            cambioClaseM.classList.add('d-none')
             form.tipo_persona = value
            //  this.changeRequired('personaFisica')
             this.setState({
                ...this.state,
                form,
            })
            // this.setState({
            //     ...this.state,
            //     variableCampoRequerido,
            // })
        }else{
            form[name] = value
            this.setState({
                ...this.state,
                form,
            })
        }

        }

    render() {
        // const { variableCampoRequerido } =this.state
        const { title, options, form, onChange, setOptions, onSubmit, formeditado, ...props } = this.props
        return (

            // <Form id="form-proveedor"
            //     onSubmit={
            //         (e) => {
            //             e.preventDefault();
            //             validateAlert(onSubmit, e, 'form-proveedor')
            //         }
            //     }
            //     {...props}
            // >
                <div className="wizard wizard-3  " id="wizardP" data-wizard-state="step-f">
                    <div className="wizard-nav">
                        <div className="wizard-steps">
                            <div id="wizard-1" className="wizard-step" data-wizard-state="current" data-wizard-type="step" onClick={() => { openWizard1() }}>
                                <div className="wizard-label">
                                    <h3 className="wizard-title">
                                        <span>1.</span> Datos generales</h3>
                                    <div className="wizard-bar"></div>
                                </div>
                            </div>
                            <div id="wizard-2" className="wizard-step" data-wizard-type="step" onClick={() => { openWizard2() }}>
                                <div className="wizard-label">
                                    <h3 className="wizard-title">
                                        <span>2.</span> Tipo de persona</h3>
                                    <div className="wizard-bar"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                     <Form id="form-proveedor"
               onSubmit={
                     (e) => {
                     e.preventDefault();
                         validateAlert(onSubmit, e, 'form-proveedor')
                     }
                }
                 {...props}
         >
                        <div id="wizard-1-content" className="pb-3 " data-wizard-type="step-content" data-wizard-state="current">
                            <div className="form-group row form-group-marginless mt-4">
                                <div className="col-md-3">
                                    <Input
                                        requirevalidation={1}
                                        name="nombre"
                                        value={form.nombre}
                                        placeholder="NOMBRE DE CONTACTO"
                                        onChange={onChange}
                                        iconclass={"far fa-user"}
                                        formeditado={formeditado}
                                        messageinc="Incorrecto. Ingresa el nombre."
                                    />
                                </div>
                                <div className="col-md-3">
                                    <Input
                                        requirevalidation={1}
                                        name="razonSocial"
                                        value={form.razonSocial}
                                        placeholder="RAZÓN SOCIAL / NOMBRE DE LA EMPRESA"
                                        onChange={onChange}
                                        iconclass={"far fa-building"}
                                        formeditado={formeditado}
                                        messageinc="Incorrecto. Ingresa la razón social."
                                    />
                                </div>
                                <div className="col-md-3">
                                    <Input
                                        name="rfc"
                                        value={form.rfc}
                                        placeholder="RFC"
                                        onChange={onChange}
                                        iconclass={"far fa-file-alt"}
                                        patterns={RFC}
                                        formeditado={formeditado}
                                        messageinc="Incorrecto. Ej. ABCD001122ABC"
                                        maxLength="13"
                                    />
                                </div>
                                <div className="col-md-3">
                                    <Input
                                        requirevalidation={0}
                                        name="correo"
                                        value={form.correo}
                                        placeholder="CORREO ELECTRÓNICO PERSONAL"
                                        type="email"
                                        onChange={onChange}
                                        iconclass={"fas fa-envelope"}
                                        messageinc="Incorrecto. Ej. usuario@dominio.com"
                                        patterns={EMAIL}
                                        formeditado={formeditado}
                                    />
                                </div>
                            </div>
                            <div className="separator separator-dashed mt-1 mb-2"></div>
                            <div className="form-group row form-group-marginless">
                                <div className="col-md-3">
                                    <InputPhone
                                        requirevalidation={0}
                                        thousandseparator={false}
                                        prefix={''}
                                        name="telefono"
                                        value={form.telefono}
                                        placeholder="TELÉFONO"
                                        onChange={onChange}
                                        iconclass={"fas fa-mobile-alt"}
                                        messageinc="Incorrecto. Ingresa el número de teléfono."
                                        patterns={TEL}
                                        formeditado={formeditado}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <InputNumber
                                        requirevalidation={0}
                                        name="numCuenta"
                                        value={form.numCuenta}
                                        placeholder="NÚMERO DE CUENTA"
                                        onChange={onChange}
                                        iconclass={" fas fa-id-card "}
                                        formeditado={formeditado}
                                        messageinc="Incorrecto. Ingresa el número de cuenta."
                                    />
                                </div>
                                <div className="col-md-3">
                                    <Select
                                        requirevalidation={0}
                                        name='tipo'
                                        options={options.tipos}
                                        placeholder='SELECCIONA EL TIPO DE CUENTA'
                                        value={form.tipo}
                                        onChange={onChange}
                                        formeditado={formeditado}
                                        iconclass={" far fa-address-card"}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <Select
                                        requirevalidation={0}
                                        name='banco'
                                        options={options.bancos}
                                        placeholder='SELECCIONA EL BANCO'
                                        value={form.banco}
                                        onChange={onChange}
                                        formeditado={formeditado}
                                        iconclass={" fab fa-cc-discover "}
                                    />
                                </div>
                            </div>
                            <div className="separator separator-dashed mt-1 mb-2"></div>
                            <div className="form-group row form-group-marginless">
                                {
                                    form.leadId ?
                                        <Input
                                            name="leadId"
                                            value={form.leadIn}
                                            readOnly
                                            hidden
                                        />
                                        : ''
                                }
                                <div className="col-md-3">
                                    <SelectSearch
                                        required
                                        options={options.areas}
                                        placeholder="SELECCIONA EL ÁREA"
                                        name="area"
                                        value={form.area}
                                        onChange={this.updateArea}
                                        formeditado={formeditado}
                                        iconclass={"far fa-window-maximize"}
                                        messageinc="Incorrecto. Selecciona el área"
                                    />
                                </div>
                                {
                                    form.area ?
                                        <div className="col-md-3">
                                            <SelectSearch
                                                required
                                                options={options.subareas}
                                                placeholder="SELECCIONA EL SUBÁREA"
                                                name="subarea"
                                                value={form.subarea}
                                                onChange={this.updateSubarea}
                                                formeditado={formeditado}
                                                iconclass={"far fa-window-restore"}
                                                messageinc="Incorrecto. Selecciona el subárea"
                                            />
                                        </div>
                                        : ''
                                }
                            </div>
                            <div className="d-flex justify-content-end align-items-center border-top mt-3 pt-3 stay-bottom">
                                <div className="mr-2"></div>
                                <div>
                                    <button type="button" className="btn btn-primary font-weight-bold text-uppercase"
                                        onClick={openWizard2} data-wizard-type="action-next">
                                        Siguiente
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div id="wizard-2-content" className="pb-3" data-wizard-type="step-content">
                            <div className="col-md-3 form-group row form-group-marginless">
                                <Select
                                    tipo='tipoPersona'
                                    general={false}
                                    requirevalidation={0}
                                    name='tipo_persona'
                                    options={options.tipo_persona}
                                    placeholder='SELECCIONA TIPO DE PERSONA'
                                    value={form.tipo_persona}
                                    onChange={this.onChangeA}
                                    formeditado={formeditado}
                                    iconclass={" fab fa-cc-discover "}
                                />
                            </div>
                            <div >
                                <div className="form-group row form-group-marginless ">
                                    <div className="col-md-3">
                                        <Input
                                            requirevalidation={0}
                                            name="nombre_persona"
                                            value={form.nombre_persona}
                                            placeholder="NOMBRE PERSONA Fisica/moral"
                                            onChange={onChange}
                                            iconclass={"far fa-building"}
                                            formeditado={formeditado}
                                            messageinc="Incorrecto. Ingresa el nombre."
                                        />
                                    </div>
                                    <div className="col-md-3">
                                        <Input
                                            requirevalidation={0}
                                            name="direccion_persona"
                                            value={form.direccion_persona}
                                            placeholder="DIRECCIÓN"
                                            onChange={onChange}
                                            iconclass={"far fa-building"}
                                            formeditado={formeditado}
                                            messageinc="Incorrecto. Ingresa la dirección ."
                                        />
                                    </div>
                                    <div className="col-md-3">
                                        <Input
                                            name="rfc_persona"
                                            value={form.rfc_persona}
                                            placeholder="RFC "
                                            onChange={onChange}
                                            iconclass={"far fa-file-alt"}
                                            patterns={RFC}
                                            formeditado={formeditado}
                                            messageinc="Incorrecto. Ingresa el rfc ."
                                            maxLength="13"
                                        />
                                    </div>
                                    <div className="col-md-3">
                                        <InputPhone
                                            requirevalidation={0}
                                            thousandseparator={false}
                                            prefix={''}
                                            name="telefono_persona"
                                            value={form.telefono_persona}
                                            placeholder="TELÉFONO"
                                            onChange={onChange}
                                            iconclass={"fas fa-mobile-alt"}
                                            messageinc="Incorrecto. Ingresa el número de teléfono."
                                            patterns={TEL}
                                            formeditado={formeditado}
                                        />
                                    </div>
                                </div>
                                <div className="form-group row form-group-marginless">
                                    <div className="col-md-3">
                                        <Input
                                            requirevalidation={0}
                                            name="email_persona"
                                            value={form.email_persona}
                                            placeholder="CORREO ELECTRÓNICO"
                                            type="email"
                                            onChange={onChange}
                                            iconclass={"fas fa-envelope"}
                                            messageinc="Incorrecto. Ej. usuario@dominio.com"
                                            patterns={EMAIL}
                                            formeditado={formeditado}
                                        />
                                    </div>
                                    <div className="col-md-3">
                                        <Input
                                            requirevalidation={0}
                                            name="nombre_representante"
                                            value={form.nombre_representante}
                                            placeholder="NOMBRE DEL REPRESENTANTE"
                                            onChange={onChange}
                                            iconclass={"far fa-building"}
                                            formeditado={formeditado}
                                            messageinc="Incorrecto. Ingresa el Nombre del representante."
                                        />
                                    </div>
                                </div>
                            </div>
                            <div id='personaMoralContenedor' className="form-group row pb-6 mb-8 border-top pt-4">
                            
                                <div className="col-md-4 mr-4" >
                                    <div className="col-md-12 d-flex flex-column align-items-center">
                                        {/* <div className="d-flex justify-content-center" style={{ height: '1px' }}>  */}
                                            <label  className="text-center font-weight-bold text-dark-60">Fecha de la sociedad</label>
                                        
                                        {/* </div>  */}
                                        <CalendarDay  value={form.fecha_sociedad} name='fecha_sociedad' date={form.fecha_sociedad} onChange={onChange} withformgroup={0} />
                                    </div>
                                </div>
                                <div className="row col-md-8">
                                    <div className="col-md-4 align-self-center">
                                        <Select
                                            general={false}
                                            // requirevalidation={variableCampoRequerido}
                                            tipo= 'tipoConstancia'
                                            name='tipo_consta'
                                            options={options.tipo_consta}
                                            placeholder='SELECCIONA TIPO DE ACTA CONSTITUTIVA'
                                            value={form.tipo_consta}
                                            onChange={this.onChangeA}
                                            formeditado={formeditado}
                                            iconclass={" fab fa-cc-discover "}
                                            messageinc="Incorrecto. TIPO DE ACTA CONSTITUTIVA."
                                        />
                                    </div>
                                    <div className="col-md-4 align-self-center">
                                        <Input
                                            name="numero_consta"
                                            // requirevalidation={1}
                                            // variableCampoRequerido={variableCampoRequerido}
                                            value={form.numero_consta}
                                            placeholder="NÚMERO"
                                            onChange={onChange}
                                            iconclass={"far fa-file-alt"}
                                            patterns={RFC}
                                            formeditado={formeditado}
                                            messageinc="Incorrecto. Ingresa el numero."
                                            maxLength="13"
                                        />
                                    </div>
                                    <div className="col-md-4 align-self-center">
                                        <Input
                                            // requirevalidation={variableCampoRequerido}
                                            name="nombre_notario"
                                            value={form.nombre_notario}
                                            placeholder="NOMBRE DEL NOTARIO O CORREDOR"
                                            onChange={onChange}
                                            iconclass={"far fa-building"}
                                            formeditado={formeditado}
                                            messageinc="Incorrecto. Ingresa el Nombre del notario o corredor."
                                        />
                                    </div>
                                    <div className="col-md-4 align-self-center">
                                        <Input
                                            name="numero_notario"
                                            // requirevalidation={variableCampoRequerido}
                                            value={form.numero_notario}
                                            placeholder="NÚMERO DEL NOTARIO O CORREDOR"
                                            onChange={onChange}
                                            iconclass={"far fa-file-alt"}
                                            patterns={RFC}
                                            formeditado={formeditado}
                                            messageinc="Incorrecto. Ingresa el número del notario o corredor."
                                            maxLength="13"
                                        />
                                    </div>
                                    <div className="col-md-4 align-self-center">
                                        <Input
                                            // requirevalidation={variableCampoRequerido}
                                            name="ciudad_notario"
                                            value={form.ciudad_notario}
                                            placeholder="CIUDAD"
                                            onChange={onChange}
                                            iconclass={"far fa-building"}
                                            formeditado={formeditado}
                                            messageinc="Incorrecto. Ingresa la ciudad."
                                        />
                                    </div>
                                </div>
                        
                            </div>
                            <div className="d-flex justify-content-between align-items-center border-top mt-3 pt-3 stay-bottom  ">
                                <div className="mr-2">
                                    <button type="button" className="btn btn-light-primary font-weight-bold text-uppercase" onClick={openWizard1}
                                        data-wizard-type="action-prev">
                                        Anterior
                                    </button>
                                </div>
                                <div>
                                    <Button icon='' className="btn btn-primary font-weight-bold text-uppercase" text="ENVIAR"
                                        onClick={
                                            (e) => {
                                                e.preventDefault();
                                                validateAlert(onSubmit, e, 'form-proveedor')
                                                console.log(form)
                                            }
                                        } />
                                </div>
                            </div>
                        </div>
                    </Form>
                </div>
            // </Form>
        )
    }
}

export default ProveedorForm