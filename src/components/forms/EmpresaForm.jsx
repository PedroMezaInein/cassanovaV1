import React, { Component } from 'react'
import { Input, Button, TagInput, InputPhone, TagSelectSearch, CalendarDay, Select} from '../form-components' 
import { validateAlert } from '../../functions/alert'
import { RFC, TEL, EMAIL } from '../../constants'
import { openWizard1, openWizard2 /*, openWizard3 */ } from '../../functions/wizard'
import { Form, Row, Col } from 'react-bootstrap'

class EmpresaForm extends Component {

    addTipo = () => {
        const { form, onChange } = this.props
        if(form.tipoProyecto){
            let aux = true
            let array = []
            form.tipos.map((tipo)=>{
                if(tipo === form.tipoProyecto)
                    aux = false
                array.push(tipo)
                return false
            })
            if(aux){
                array.push(form.tipoProyecto)
                onChange({target:{value:array, name: 'tipos'}})
                onChange({target:{value:'', name: 'tipoProyecto'}})
            }
                
        }
    }
    onChangeA = e => {
        let { form } = this.props
        const { name, value } = e.target
            form[name] = value
            this.setState({
                ...this.state,
                form,
            })
        }

    removeTipo = (tipo) => {
        const { form, onChange } = this.props
        let array = []
        form.tipos.map((element)=>{
            if(element !== tipo)
                array.push(element)
            return false
        })
        onChange({target:{value:array, name: 'tipos'}})
        onChange({target:{value:'', name: 'tipoProyecto'}})
    }

    updateDepartamentos = value => {
        const { onChange } = this.props
        onChange({target: { value: value, name: 'departamentos'}}, true)
    }

    transformarOptions = options => {  
        options = options ? options : []
        options.map( (value) => {
            value.label = value.name 
            return ''
        });
        return options
    }

    render() {
        const { form, onChange,children, onChangeRange,onSubmit, formeditado,tagInputChange, tagInputChangeTelefono, options, ...props } = this.props
        return (

            <div className="wizard wizard-3" id="wizardP" data-wizard-state="step-first">
            <div className="wizard-nav">
                <div className="wizard-steps">
                    <div id="wizard-1" className="wizard-step" data-wizard-state="current" data-wizard-type="step" style={{ paddingTop: "0px" }} onClick={() => { openWizard1() }}>
                        <div className="wizard-label">
                            <h3 className="wizard-title">
                                <span>1.</span> Datos de la empresa</h3>
                            <div className="wizard-bar"></div>
                        </div>
                    </div>
                    <div id="wizard-2" className="wizard-step" data-wizard-type="step" style={{ paddingTop: "0px" }} onClick={(e) => { e.preventDefault(e); openWizard2() }}>
                        <div className="wizard-label">
                            <h3 className="wizard-title">
                                <span>2.</span> Datos para contrato</h3>
                            <div className="wizard-bar"></div>
                        </div>
                    </div>
                   
                </div>
            </div>
            <div className="row justify-content-center">
                <div className="col-md-12">
                    <Form onSubmit = { (e) => { e.preventDefault(); validateAlert(onSubmit, e, 'wizard-3-content') } } {...props} >
                        {children}
                        <div id="wizard-1-content" className="pb-3 px-2" data-wizard-type="step-content" data-wizard-state="current">
                          
                            <div className="form-group row form-group-marginless">
                                <div className="col-md-3">
                                    <Input  requirevalidation={1} formeditado={formeditado}  onChange={onChange} name="name" type="text"
                                    value={form.name} placeholder="NOMBRE" iconclass={"far fa-user"} messageinc="Incorrecto. Ingresa el nombre de la empresa" />
                                </div>
                                <div className="col-md-3">
                                    <Input
                                        requirevalidation={1} formeditado={formeditado} onChange={onChange} name="razonSocial" type="text" value={form.razonSocial}
                                        placeholder="RAZÓN SOCIAL" iconclass={"far fa-building"} messageinc="Incorrecto. Ingresa la razón social" />
                                </div>
                                <div className="col-md-2">
                                    <Input  requirevalidation={1} formeditado={formeditado} onChange={onChange} name="rfc" type="text" value={form.rfc} placeholder="RFC"
                                        iconclass={"far fa-file-alt"} patterns={RFC} messageinc="Incorrecto. Ej. ABCD001122ABC"  maxLength="13" />
                                </div>
                                <div className="col-md-3">
                                     <Input requirevalidation={0} formeditado={formeditado} onChange={onChange} name="pagina_web"  type="text" value={form.pagina_web}
                                        placeholder="PÁGINA WEB" iconclass={"flaticon2-world"} messageinc="Incorrecto. Ingresa la página web" letterCase = { false } />
                                </div>
                            </div>
                            <div className="form-group row form-group-marginless">
                            {/* <div className="col-md-3">
                                 <Input requirevalidation={0} formeditado={formeditado} onChange={onChange} name="facebook"  type="text"  value={form.facebook} placeholder="FACEBOOK"
                                        iconclass={"socicon-facebook"} messageinc="Incorrecto. Ingresa la liga de facebook" letterCase = { false }/>
                                </div> */}
                                <div className="col-md-3">
                                    <Input requirevalidation={0} formeditado={formeditado}  onChange={onChange} name="facebook" type="text" value={form.facebook}
                                        placeholder="FACEBOOK" iconclass={"socicon-facebook"} messageinc="Incorrecto. Ingresa la liga de facebook" letterCase = { false } />
                                </div>
                                <div className="col-md-3">
                                    <Input  requirevalidation={0}  formeditado={formeditado} onChange={onChange}  name="instagram"  type="text"  value={form.instagram} placeholder="INSTAGRAM"
                                        iconclass={"socicon-instagram"} messageinc="Incorrecto. Ingresa la liga de instagram" letterCase = { false }  />
                                </div>
                                <div className="col-md-3">
                                    <Input requirevalidation={0} formeditado={formeditado} onChange={onChange} name="linkedin" type="text" value={form.linkedin} placeholder="LINKEDIN" 
                                    iconclass={"socicon-linkedin"} messageinc="Incorrecto. Ingresa la liga de linkedin" letterCase = { false } />
                                </div>                               
                            </div>
                            <div className="form-group row form-group-marginless">
                                <div className="col-md-3">
                                   <Input  requirevalidation={0} formeditado={formeditado}  onChange={onChange}  name="pinterest"  type="text" value={form.pinterest}
                                     placeholder="PINTEREST" iconclass={"socicon-pinterest"} messageinc="Incorrecto. Ingresa la liga de pinterest" letterCase = { false }  />
                                </div>
                                <div className="col-md-3">
                                    <Input requirevalidation={0} formeditado={formeditado} onChange={onChange} name="blog" type="text" value={form.blog} placeholder="BLOG" 
                                    iconclass={"fab fa-blogger"} messageinc="Incorrecto. Ingresa la liga del blog" letterCase = { false } />
                                </div>
                                <div className="col-md-2">
                                    <InputPhone  requirevalidation={0}  formeditado={formeditado} placeholder="TELÉFONO"  name="telefono"  value={form.telefono} onChange={onChange} 
                                    iconclass={"fas fa-mobile-alt"} patterns={TEL} messageinc="Incorrecto. Ingresa el número de teléfono." thousandseparator={false}  prefix={''}/>
                                </div>      
                                <div className="col-md-4">
                                    <TagInput tags={form.tipos}  onChange={tagInputChange}  placeholder={"TIPOS DE PROYECTO"} iconclass={"far fa-folder-open"} />
                                </div>                                                  
                            </div>
                            <div className="form-group row form-group-marginless">  
                                <div className="col-md-6">
                                    <TagSelectSearch placeholder='Selecciona el departamento' options={options.departamentos} iconclass='las la-user-friends icon-xl' 
                                    defaultvalue={form.departamentos} onChange={this.updateDepartamentos} />
                                </div>                                     
                                <div className="col-md-6">
                                    <Input  requirevalidation={1}  formeditado={formeditado}  onChange={onChange}  name="direccion" type="text" value={form.direccion}  placeholder="DIRECCIÓN DE LA EMPRESA"   
                                    iconclass={"flaticon2-map"}  messageinc="Incorrecto. Ingresa la dirección de la empresa" />
                                </div>
                            </div>

                            <div className="separator separator-dashed mt-1 mb-2"></div>

                            <div className="d-flex justify-content-between border-top mt-3 pt-3">
                                <div className="mr-2"></div>
                                <div>
                                    <button type="button" className="btn btn-primary font-weight-bold text-uppercase" onClick={(e) => { e.preventDefault(e); openWizard2(); }}
                                    data-wizard-type="action-next">Siguiente</button>
                                </div>
                            </div>
                        </div>
                        <div id="wizard-2-content" className="pb-3" data-wizard-type="step-content">
                          <Row className="mx-0">
                                <Col md="4" className="text-center">
                                    <label className="text-center font-weight-bold text-dark-60">Fecha de la sociedad</label>
                                    <CalendarDay value={form.fecha_sociedad} name='fecha_sociedad' date={form.fecha_sociedad}  onChange={onChange} withformgroup={0} requirevalidation={0}/>
                                </Col>

                                <Col md="8" className="align-self-center">
                                    <div className="form-group row form-group-marginless">      
                                        <div className="col-md-4">
                                            <Select requirevalidation={0} name='tipo_persona' options={options.tipo_persona} placeholder='TIPO DE PERSONA' value={form.tipo_persona} 
                                            onChange={onChange} formeditado={formeditado} iconclass={" fab fa-cc-discover "}  />
                                        </div>
                                        <div className="col-md-4">
                                        <Input
                                            requirevalidation={1}
                                            name="nombre_persona"
                                            value={form.nombre_persona}
                                            placeholder="NOMBRE"
                                            onChange={onChange}
                                            iconclass={"far fa-building"}
                                            formeditado={formeditado}
                                            messageinc="Incorrecto. Ingresa el nombre."
                                        />
                                        </div>
                                        <div className="col-md-4">
                                        <Input
                                            requirevalidation={1}
                                            name="direccion_persona"
                                            value={form.direccion_persona}
                                            placeholder="DIRECCIÓN"
                                            onChange={onChange}
                                            iconclass={"far fa-building"}
                                            formeditado={formeditado}
                                            messageinc="Incorrecto. Ingresa la dirección ."
                                        />
                                        </div>
                                    {/* </div> */}

                                    {/* <div className="form-group row form-group-marginless">       */}
                                        <div className="col-md-4">
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
                                        <div className="col-md-4">
                                        <InputPhone
                                            requirevalidation={1}
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
                                        <div className="col-md-4">
                                            <Input  requirevalidation={0} name="email_persona" value={form.email_persona} placeholder="CORREO ELECTRÓNICO"  type="email" 
                                            onChange={onChange}  iconclass={"fas fa-envelope"}  messageinc="Incorrecto. Ej. usuario@dominio.com" patterns={EMAIL} formeditado={formeditado} />
                                        </div>    
                                        <div className="col-md-4">
                                        <Input
                                            requirevalidation={1}
                                            name="nombre_representante"
                                            value={form.nombre_representante}
                                            placeholder="NOMBRE DEL REPRESENTANTE"
                                            onChange={onChange}
                                            iconclass={"far fa-building"}
                                            formeditado={formeditado}
                                            messageinc="Incorrecto. Ingresa el Nombre del representante."
                                        />
                                        </div>      
                                    {/* </div>
                                    <div className="form-group row form-group-marginless">   */}
                                        <div className="col-md-4">
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
                                        <div className="col-md-4">
                                             <Input name="numero_consta" requirevalidation={0} value={form.numero_consta}  placeholder="NÚMERO" onChange={onChange} iconclass={"far fa-file-alt"} 
                                              patterns={RFC} formeditado={formeditado} messageinc="Incorrecto. Ingresa el numero." maxLength="13" />                        
                                        </div>
                                        <div className="col-md-4">
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
                                        <div className="col-md-4">
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
                                    {/* </div>
                                    <div className="form-group row form-group-marginless">   */}
                                        <div className="col-md-4">
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

                                </Col>

                            </Row>
                            
                            <div className="d-flex justify-content-between border-top mt-3 pt-3">
                                <div className="mr-2">
                                    <button type="button" className="btn btn-light-primary font-weight-bold text-uppercase" onClick={() => { openWizard1() }} data-wizard-type="action-prev">Anterior</button>
                                </div>
                                <div>
                                     <Button icon='' className = "btn btn-primary font-weight-bold text-uppercase"
                                        onClick = { (e) => { e.preventDefault(); validateAlert(onSubmit, e, 'wizard-2-content') } }
                                        text="ENVIAR" />
                                </div>
                            </div>
                        </div>
                        
                    </Form>
                </div>
            </div>
        </div>
            // <Form id="form-empresa"
            //     onSubmit={
            //         (e) => {
            //             e.preventDefault();
            //             validateAlert(onSubmit, e, 'form-empresa')
            //         }
            //     }
            //     {...props}
            // >
            // </Form>

        )
    }
}

export default EmpresaForm