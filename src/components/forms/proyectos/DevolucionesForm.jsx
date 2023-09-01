import React, { Component } from 'react'
import { SelectSearch, Select, Calendar, RadioGroup, FileInput, Button, Input, InputMoney } from '../../form-components'
import { Form } from 'react-bootstrap'
import { RFC, DATE } from '../../../constants'
import {openWizard1, openWizard2, openWizard3 } from '../../../functions/wizard'
import { validateAlert } from '../../../functions/alert'
import InputLabel from '@material-ui/core/InputLabel';
import SelectMUI from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { setOptions } from './../../../functions/setters'

class DevolucionesForm extends Component {
    
    updateProyecto = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'proyecto' } })
    }

    updateEmpresa = value => {
        const { onChange, setOptions } = this.props
        onChange({ target: { value: value, name: 'empresa' } })
        onChange({ target: { value: '', name: 'cuenta' } })

        const { options: { empresas } } = this.props

        empresas.find(function (element, index) {
            if (value.toString() === element.value.toString()) {
                setOptions('cuentas', element.cuentas)
                return element
            }
            return false
        })
    }
    updateCuenta = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'cuenta' } })
    }
    
    updateArea = value => {
        const { onChange, setOptions } = this.props

        onChange({ target: { value: value, name: 'area' } })
        onChange({ target: { value: '', name: 'subarea' } })

        const { options: { areas } } = this.props
        areas.find(function (element, index) {
            if (value.toString() === element.value.toString()) {
                setOptions('subareas', element.subareas)
                return true
            }
            return false
        })

    }

    updateProveedor = value => {
        const { onChange, /*setOptions*/ } = this.props
        onChange({ target: { value: value, name: 'proveedor' } })
        // onChange({ target: { value: '', name: 'contrato' } })
        const { data: { proveedores } } = this.props
        proveedores.find(function (element, index) {
            if (value.toString() === element.id.toString()) {
                // setOptions('contratos', element.contratos)
                if(element.rfc !== ''){
                    onChange({ target: { value: element.rfc, name: 'rfc' } })
                }
            }
            return false
        })
    }

    updateSubarea = value => {
        const { onChange } = this.props
        onChange({ target: { name: 'subarea', value: value.toString() } })
    }

    handleChangeDate = date => {
        const { onChange } = this.props
        onChange({ target: { value: date, name: 'fecha' } })
    }

    updateFactura = e => {
        const { value, name } = e.target
        const { onChange, options } = this.props
        onChange({ target: { value: value, name: name } })
        let aux = ''
        options.tiposImpuestos.find(function (element, index) {
            if (element.text === 'IVA')
                aux = element.value
            return false
        });
        onChange({ target: { value: aux, name: 'tipoImpuesto' } })
    }

    updateTipoPago = e => {
        const { options, form, onChange } = this.props
        const { value } = e.target
        if (form.facturaObject) {
            options.tiposPagos.map((option) => {
                if (option.value.toString() === value.toString() && option.text.toString() === 'TOTAL')
                    onChange({ target: { value: form.facturaObject.total, name: 'total' } })
                return false
            })
        }
        onChange(e)
    }

    handleChangeArea = (e) => {
        this.updateSelect(`${e.target.value}`, e.target.name)
    }

    render() {
        const { title, options, form, onChange, setOptions, onChangeAdjunto, clearFiles, onSubmit, sendFactura, formeditado, comprasArray, ...props } = this.props
        console.log(form)
        console.log(options)
        console.log(comprasArray)
        return (
            <div className="wizard wizard-3" id="wizardP" data-wizard-state="step-first">
                <div className="wizard-nav">
                    <div className="wizard-steps"> 
                        <div id="wizard-1" className="wizard-step" data-wizard-state="current" data-wizard-type="step" style={{paddingTop:"0px"}} onClick = { () => { openWizard1() } }>
                            <div className="wizard-label">
                                <h3 className="wizard-title">
                                <span>1.</span> Datos de la factura</h3>
                                <div className="wizard-bar"></div>
                            </div>
                        </div> 
                        <div id="wizard-2" className="wizard-step" data-wizard-type="step" style={{paddingTop:"0px"}} onClick = { () => { openWizard2() } }>
                            <div className="wizard-label">
                                <h3 className="wizard-title">
                                <span>2.</span> Área y fecha</h3>
                                <div className="wizard-bar"></div>
                            </div>
                        </div> 
                        <div id="wizard-3" className="wizard-step" data-wizard-type="step" style={{paddingTop:"0px"}} onClick = { () => { openWizard3() } }>
                            <div className="wizard-label">
                                <h3 className="wizard-title">
                                <span>3.</span> Pago</h3>
                                <div className="wizard-bar"></div>
                            </div>
                        </div>   
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-md-12">                   
                        <Form 
                            onSubmit = { 
                                (e) => {
                                    e.preventDefault(); 
                                    validateAlert(onSubmit, e, 'wizard-3-content')
                                }
                            }
                            {...props}
                            >
                            <div id="wizard-1-content" className="pb-3 px-2" data-wizard-type="step-content" data-wizard-state="current">
                                <h5 className="mb-4 font-weight-bold text-dark">Ingresa los datos de la factura</h5>
                                <div className="form-group row form-group-marginless mb-0">
                                    <div className="col-md-4">
                                        <RadioGroup
                                            name='factura'
                                            onChange={this.updateFactura}
                                            options={
                                                [
                                                    {
                                                        label: 'Si',
                                                        value: 'Con factura'
                                                    },
                                                    {
                                                        label: 'No',
                                                        value: 'Sin factura'
                                                    }
                                                ]
                                            }
                                            placeholder={' Lleva factura '}
                                            value={form.factura}
                                        />
                                    </div> 
                                    {
                                        form.factura === 'Con factura' && title !== 'Editar compra' ?
                                            <div className="col-md-4 align-self-center text-center">
                                                <FileInput
                                                    requirevalidation={0}
                                                    formeditado={formeditado}
                                                    onChangeAdjunto={onChangeAdjunto}
                                                    placeholder={form['adjuntos']['factura']['placeholder']}
                                                    value={form['adjuntos']['factura']['value']}
                                                    name={'factura'} id={'factura'}
                                                    accept="text/xml, application/pdf"
                                                    files={form['adjuntos']['factura']['files']}
                                                    deleteAdjunto={clearFiles} multiple
                                                    classbtn='btn btn-default btn-hover-icon-success font-weight-bolder btn-hover-bg-light text-hover-success text-dark-50 mb-0'
                                                    iconclass='flaticon2-clip-symbol text-primary'
                                                />
                                            </div>
                                        : ''
                                    }
                                    {
                                        form.factura === 'Con factura' && title !== 'Editar compra' ?
                                            <div className="col-md-4">
                                                <Input 
                                                    requirevalidation={0}
                                                    formeditado={formeditado}
                                                    placeholder="RFC" 
                                                    name="rfc" 
                                                    value={form.rfc} 
                                                    onChange={onChange} 
                                                    iconclass={"far fa-file-alt"}
                                                    patterns={RFC}
                                                    messageinc="Incorrecto. Ej. ABCD001122ABC"
                                                    maxLength="13"
                                                />
                                            </div>
                                            : ''
                                    }
                                </div>
                                <div className="separator separator-dashed mt-1 mb-2"></div>
                                <div className="form-group row form-group-marginless">
                                    <div className="col-md-4">
                                        <SelectSearch 
                                            formeditado={formeditado}
                                            options={options.proveedores} 
                                            placeholder="SELECCIONA EL PROVEEDOR"
                                            name="proveedores" 
                                            value={form.proveedor} 
                                            onChange={this.updateProveedor} 
                                            iconclass={"far fa-user"}
                                            messageinc="Incorrecto. Selecciona el proveedor"
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <SelectSearch 
                                            formeditado={formeditado}
                                            options={options.proyectos} 
                                            placeholder="SELECCIONA EL PROYECTO"
                                            name="proyecto" 
                                            value={form.proyecto} 
                                            onChange={this.updateProyecto}
                                            iconclass={"far fa-folder-open"}
                                            messageinc="Incorrecto. Selecciona el proyecto"
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        {
                                            form.facturaObject ?
                                                <Input 
                                                    placeholder="EMPRESA" 
                                                    name="empresa" 
                                                    readOnly 
                                                    value={form.empresa} 
                                                    onChange={onChange} 
                                                    iconclass={"far fa-building"}
                                                />                                    
                                                :
                                                <SelectSearch 
                                                    formeditado={formeditado}
                                                    options={options.empresas} 
                                                    placeholder="SELECCIONA LA EMPRESA"
                                                    name="empresas" 
                                                    value={form.empresa} 
                                                    onChange={this.updateEmpresa} 
                                                    iconclass={"far fa-building"}
                                                    messageinc="Incorrecto. Selecciona la empresa"
                                                />
                                        }
                                    </div>
                                </div>  
                                <div className="d-flex justify-content-between border-top mt-3 pt-3">
                                    <div className="mr-2"></div>
                                    <div>
                                        <button type="button" className="btn btn-primary font-weight-bold text-uppercase" onClick = { () => { openWizard2() }} data-wizard-type="action-next">Siguiente</button>
                                    </div>
                                </div>
                            </div>
                            <div id="wizard-2-content" className="pb-3" data-wizard-type="step-content">
                                <h5 className="mb-4 font-weight-bold text-dark">Selecciona el área y fecha</h5>
                                <div className="form-group row form-group-marginless">
                                    <div className={form.area.length ?'col-md-4':'col-md-6'}>
                                        <Calendar 
                                            formeditado={formeditado}
                                            onChangeCalendar={this.handleChangeDate}
                                            placeholder="FECHA" 
                                            name="fecha" 
                                            value={form.fecha}
                                            patterns={DATE}
                                        />
                                    </div>

                                    <div className={form.area.length ?'col-md-4':'col-md-6'}>
                                        <SelectSearch 
                                            formeditado={formeditado}
                                            options={options.areas} 
                                            placeholder="SELECCIONA EL ÁREA"
                                            name="areas" 
                                            value={form.area} 
                                            onChange={this.updateArea}
                                            iconclass={"far fa-window-maximize"}
                                            messageinc="Incorrecto. Selecciona el área"
                                        />
                                    </div>
                              
                                    {
                                        form.area ?
                                            <div className="col-md-4">
                                                <SelectSearch 
                                                    formeditado={formeditado}
                                                    options={options.subareas} 
                                                    placeholder="SELECCIONA EL SUBÁREA"
                                                    name="subarea" 
                                                    value={form.subarea} 
                                                    onChange={this.updateSubarea}
                                                    iconclass={"far fa-window-restore"} 
                                                    messageinc="Incorrecto. Selecciona el subárea"
                                                />
                                            </div>
                                        : ''
                                    }
                                </div>
                                <div className="separator separator-dashed mt-1 mb-2"></div>
                                <div className="form-group row form-group-marginless">
                                    <div className="col-md-12">
                                        <Input 
                                            requirevalidation={0}
                                            formeditado={formeditado}
                                            as="textarea" 
                                            placeholder="DESCRIPCIÓN" 
                                            rows="3" value={form.descripcion}
                                            name="descripcion" 
                                            onChange={onChange}
                                            messageinc="Incorrecto. Ingresa una descripción."
                                            customclass="px-2"
                                        />
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between border-top mt-3 pt-3">
                                    <div className="mr-2">
                                        <button type="button" className="btn btn-light-primary font-weight-bold text-uppercase" onClick = { () => { openWizard1() }} data-wizard-type="action-prev">Anterior</button>
                                    </div>
                                    <div>
                                        <button type="button" className="btn btn-primary font-weight-bold text-uppercase" onClick = { () => { openWizard3() }} data-wizard-type="action-next">Siguiente</button>
                                    </div>
                                </div>
                            </div>
                            <div id="wizard-3-content" className="pb-3" data-wizard-type="step-content">
                                <h5 className="mb-4 font-weight-bold text-dark">Selecciona el tipo de pago, impuesto y estatus</h5>
                                <div className="form-group row form-group-marginless">
                                    {
                                        form.empresa ?                                            
                                            <div className="col-md-4">
                                                <SelectSearch 
                                                    formeditado={formeditado}
                                                    options={options.cuentas} 
                                                    placeholder="SELECCIONA LA CUENTA"
                                                    name="cuenta" 
                                                    value={form.cuenta} 
                                                    onChange={this.updateCuenta}
                                                    iconclass={"far fa-credit-card"}
                                                    messageinc="Incorrecto. Selecciona la cuenta"
                                                />
                                            </div>
                                        : ''
                                    }
                                    <div className="col-md-4">
                                        <Select 
                                            requirevalidation={1}
                                            formeditado={formeditado}
                                            placeholder="SELECCIONA EL IMPUESTO" 
                                            options={options.tiposImpuestos}
                                            name="tipoImpuesto" 
                                            value={form.tipoImpuesto} 
                                            onChange={onChange}
                                            messageinc="Incorrecto. Selecciona el impuesto."
                                            iconclass={"fas fa-file-invoice-dollar"}
                                            required
                                        />
                                    </div>
                                    {/* <div className="col-md-4">
                                        <Select 
                                            requirevalidation={1}
                                            formeditado={formeditado}
                                            placeholder="SELECCIONA EL ESTATUS DE COMPRA" 
                                            options={options.estatusCompras}
                                            name="estatusCompra" 
                                            value={form.estatusCompra} 
                                            onChange={onChange}
                                            messageinc="Incorrecto. Selecciona el estatus de compra."
                                            required
                                            iconclass={"flaticon2-time"}
                                        />
                                    </div> */}
                                </div>
                                <div className="separator separator-dashed mt-1 mb-2"></div>
                                <div className="form-group row form-group-marginless">
                                    {
                                        options.tiposPagos.length > 0 ?
                                            <div className="col-md-4">
                                                <Select 
                                                    requirevalidation={1}
                                                    formeditado={formeditado}
                                                    placeholder="SELECCIONA EL PAGO" 
                                                    options={options.tiposPagos}
                                                    name="tipoPago" 
                                                    value={form.tipoPago} 
                                                    onChange={this.updateTipoPago} 
                                                    messageinc="Incorrecto. Selecciona el tipo de pago."
                                                    iconclass={"fas fa-coins"}
                                                    required
                                                />
                                            </div>
                                            : ''
                                    }
                                    <div className="col-md-4">
                                        <InputMoney 
                                            requirevalidation={1}
                                            formeditado={formeditado}
                                            thousandseparator={true} 
                                            placeholder="MONTO" 
                                            value={form.total} 
                                            name="total" 
                                            onChange={onChange}
                                            iconclass={"fas fa-money-check-alt"}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <InputMoney 
                                            requirevalidation={0}
                                            formeditado={formeditado}
                                            thousandseparator={true} 
                                            placeholder="COMISIÓN" 
                                            value={form.comision} 
                                            name="comision" 
                                            onChange={onChange} 
                                            iconclass={"fas fa-money-bill-alt"} 
                                        />
                                    </div>
                                </div>
                                {
                                    title !== 'Editar compra' ?
                                        <>
                                            <div className="separator separator-dashed mt-1 mb-2"></div>
                                            <div className="form-group row form-group-marginless mt-8">                                
                                                <div className="col-md-6 text-center">
                                                    <FileInput
                                                        requirevalidation={0}
                                                        formeditado={formeditado}
                                                        onChangeAdjunto={onChangeAdjunto}
                                                        placeholder={form['adjuntos']['presupuesto']['placeholder']}
                                                        value={form['adjuntos']['presupuesto']['value']}
                                                        name={'presupuesto'} id={'presupuesto'}
                                                        files={form['adjuntos']['presupuesto']['files']}
                                                        deleteAdjunto={clearFiles} 
                                                        multiple
                                                        classbtn='btn btn-default btn-hover-icon-success font-weight-bolder btn-hover-bg-light text-hover-success text-dark-50 mb-0'
                                                        iconclass='flaticon2-clip-symbol text-primary'
                                                    />
                                                </div>
                                                <div className="col-md-6 text-center">
                                                    <FileInput
                                                        requirevalidation={0}
                                                        formeditado={formeditado}
                                                        onChangeAdjunto={onChangeAdjunto}
                                                        placeholder={form['adjuntos']['pago']['placeholder']}
                                                        value={form['adjuntos']['pago']['value']}
                                                        name={'pago'} id={'pago'}
                                                        files={form['adjuntos']['pago']['files']}
                                                        deleteAdjunto={clearFiles}
                                                        multiple
                                                        classbtn='btn btn-default btn-hover-icon-success font-weight-bolder btn-hover-bg-light text-hover-success text-dark-50 mb-0'
                                                        iconclass='flaticon2-clip-symbol text-primary'
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    : ''
                                }
                                
                                <div className="d-flex justify-content-between border-top mt-3 pt-3">
                                    <div className="mr-2">
                                        <button type="button" className="btn btn-light-primary font-weight-bold text-uppercase"  onClick = { () => { openWizard2() }} data-wizard-type="action-prev">Anterior</button>
                                    </div>
                                    <div>
                                        <Button icon='' className="btn btn-primary font-weight-bold text-uppercase" 
                                            onClick = { 
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

export default DevolucionesForm

// import React, { useState, useEffect } from 'react';
// import { useSelector } from 'react-redux';

// import InputLabel from '@material-ui/core/InputLabel';
// import Autocomplete from '@material-ui/lab/Autocomplete';
// import TextField from '@material-ui/core/TextField';
// import Select from '@material-ui/core/Select';
// import MenuItem from '@material-ui/core/MenuItem';
// import Accordion from '@material-ui/core/Accordion';
// import AccordionDetails from '@material-ui/core/AccordionDetails';
// import AccordionSummary from '@material-ui/core/AccordionSummary';
// import Typography from '@material-ui/core/Typography';
// import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
// import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
// import Grid from '@material-ui/core/Grid';
// import { es } from 'date-fns/locale'
// import DateFnsUtils from '@date-io/date-fns';
// import CurrencyTextField from '@unicef/material-ui-currency-textfield'
// import FormGroup from '@material-ui/core/FormGroup';
// import Swal from 'sweetalert2'

// import { apiOptions } from './../../../functions/api'

// export default function CrearDevoluciones (props) {
//     const { options } = props
//     console.log(options)
//     const auth = useSelector((state) => state.authUser.access_token);
//     const departamentos = useSelector(state => state.opciones.compras)

//     const [form, setForm] = useState({
//         proveedor: '',
//         proyecto: '',
//         empresa: '',
//         area: '',
//         partida: '',
//         subarea: '',
//         descripcion: '',
//         tiposImpuestos: '',
//         tipoPago: '',
//         monto: '',
//         comision: '',
//     })
//     console.log(form)
//     console.log(options)

//     const handleChangeOpciones = (e, value, fieldName) => {
//         if (value && value.name) {
//             setForm({
//                 ...form,
//                 [fieldName]: value.data.id,
//                 [fieldName + '_nombre']: value.name,
//             });
//         } else if (value === null) {
//             setForm({
//                 ...form,
//                 [fieldName]: null,
//                 [fieldName + '_nombre']: null,
//             });
//         }
//     }

//     const handleChangeInt = (e) => {
//         const name = e.target.name;
//         const value = e.target.value;
    
//         setForm({
//             ...form,
//             [name]: parseInt(value), // Convertir el valor a entero aquí
//         })
//     }

//     const handleChangeFecha = (date, tipo) => {
//         setForm({
//             ...form,
//             [tipo]: new Date(date)
//         })
//     };

//     const handleChangeAreas=(e)=>{
//         const name = e.target.name;
//         const value = e.target.value;

//         setForm({
//             ...form,
//             [name]: parseInt(value),
//             // [e.target.name]:e.target.value,
//             partida: '',
//             // subarea: ''
//         })
//     }

//     const handleChange=(e)=>{
//         const name = e.target.name;
//         const value = e.target.value;

//         setForm({
//             ...form,
//             [name]: value,
//         })
//     }

//     const handleChangePagos = (e, value, fieldName) => {
//         if (value && value.name) {
//             setForm({
//                 ...form,
//                 [fieldName]: value.value,
//                 [fieldName + '_nombre']: value.name,
//             });
//         } else if (value === null) {
//             setForm({
//                 ...form,
//                 [fieldName]: null,
//                 [fieldName + '_nombre']: null,
//             });
//         }
//     }

//     const handleChangeMonto = (e) => {
//         setForm({
//             ...form,
//             monto: e,
//         })
//     }

//     const handleChangeComision = (e) => {
//         setForm({
//             ...form,
//             comision: e,
//         })
//     }

//     return (
//         <>
//             <Accordion defaultExpanded className='proyect-accordion'>
//                 <AccordionSummary
//                         expandIcon={<ExpandMoreIcon />}
//                     >
//                         <Typography className='proyect-Subtitulo'>DATOS DE LA FACTURA</Typography>
//                 </AccordionSummary>

//                 <AccordionDetails> 

//                     <div>
//                         {options.proveedores ? (
//                             <div>
//                             <InputLabel>Proveedor</InputLabel>
//                             <Autocomplete
//                                 name="proveedor"
//                                 options={options.proveedores}
//                                 getOptionLabel={(option) => option.name}
//                                 style={{ width: 230, paddingRight: '1rem' }}
//                                 onChange={(event, value) => handleChangeOpciones(event, value, 'proveedor')}
//                                 renderInput={(params) => (
//                                 <TextField
//                                     {...params}
//                                     variant="outlined"
//                                     label={form.proveedor_nombre ? form.proveedor_nombre : 'proveedor'}
//                                 />
//                                 )}
//                             />
//                             </div>
//                         ) : (
//                             <></>
//                         )}
//                     </div>

//                     <div>
//                         {
//                             options.proyectos ?
//                                 <div> 
//                                     <InputLabel>proyecto</InputLabel>
//                                     <Autocomplete
//                                         name="proyecto"
//                                         options={options.proyectos}
//                                         getOptionLabel={(option) => option.name}
//                                         style={{ width: 230, paddingRight: '1rem' }}
//                                         onChange={(event, value) => handleChangeOpciones(event, value, 'proyecto')}
//                                         renderInput={(params) => <TextField {...params}  variant="outlined"  label={form.proyecto_nombre ? form.proyecto_nombre : 'proyecto'} />}
//                                     />
//                                 </div>    
//                             : <></>
//                         }
//                     </div>  

//                     <div>
//                         {
//                             options.empresas ?
//                                 <div>
//                                     <InputLabel>Empresa</InputLabel>
//                                     <Select
//                                         name="empresa"
//                                         value={form.empresa}
//                                         onChange={handleChangeInt}
//                                         style={{ width: 200, paddingRight: '1rem' }}
//                                     >
//                                         {
//                                             options.empresas.map((item, index) => (
//                                                 <MenuItem key={index} value={item.value}>{item.name}</MenuItem>
//                                             ))
//                                         }
//                                     </Select>
//                                 </div>
//                             : null
//                         }
//                     </div>  
//                 </AccordionDetails>
//             </Accordion>

//             <Accordion defaultExpanded className='proyect-accordion'>
//                 <AccordionSummary
//                         expandIcon={<ExpandMoreIcon />}
//                     >
//                         <Typography className='proyect-Subtitulo'>DATOS DE LA FACTURA</Typography>
//                 </AccordionSummary>

//                 <AccordionDetails> 
//                     <div>
//                         <InputLabel >Fecha de la compra</InputLabel>
//                         <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
//                             <Grid container >
//                                 <KeyboardDatePicker

//                                     format="dd/MM/yyyy"
//                                     name="fecha"
//                                     value={form.fecha !== '' ? form.fecha : null}
//                                     placeholder="dd/mm/yyyy"
//                                     onChange={e => handleChangeFecha(e, 'fecha')} 
//                                     KeyboardButtonProps={{
//                                         'aria-label': 'change date',
//                                     }}
//                                     // error={errores.fecha ? true : false}
//                                 />
//                             </Grid>
//                         </MuiPickersUtilsProvider>
//                     </div>    

//                     <div>
//                         {departamentos.length > 0 ?
//                             <>
//                                 <InputLabel id="demo-simple-select-label">Departamento</InputLabel>
//                                 <Select
//                                     value={form.area}
//                                     name="area"
//                                     onChange={handleChangeAreas}
//                                     style={{ width: 230, marginRight: '1rem' }}
//                                     // error={errores.area ? true : false}
//                                 >
//                                     {departamentos.map((item, index) => (
//                                         <MenuItem key={index} value={item.id_area}>{item.nombreArea}</MenuItem>
//                                     ))}

//                                 </Select>
//                             </>
//                             : null
//                         }

//                     </div>

//                     <div>
//                         {departamentos.length > 0 && form.area !== '' ?
//                             <>
//                                 <InputLabel id="demo-simple-select-label">Tipo de Gasto</InputLabel>
//                                 <Select
//                                     value={form.partida}
//                                     name="partida"
//                                     onChange={handleChangeInt}
//                                     style={{ width: 230, marginRight: '1rem' }}
//                                     // error={errores.partida ? true : false}
//                                 >
//                                     {departamentos.find(item => item.id_area == form.area) && departamentos.find(item => item.id_area == form.area).partidas.map((item, index) => (
//                                         <MenuItem key={index} value={item.id}>{item.nombre}</MenuItem>
//                                     ))}

//                                 </Select>
//                             </>
//                             : null
//                         }
//                     </div>

//                     <div>
//                         {departamentos.length && form.partida !== '' ?
//                             <>
//                                 <InputLabel id="demo-simple-select-label">Tipo de Subgasto</InputLabel>
//                                 <Select
//                                     name="subarea"
//                                     onChange={handleChangeInt}
//                                     value={form.subarea}
//                                     style={{ width: 230, marginRight: '1rem' }}
//                                     // error={errores.subarea ? true : false}
//                                 >
//                                     {departamentos.find(item => item.id_area == form.area).partidas.find(item => item.id == form.partida).subpartidas.map((item, index) => (
//                                         <MenuItem key={index} value={item.id}>{item.nombre}</MenuItem>
//                                     ))}

//                                 </Select>
//                             </>
//                             : null
//                         }
//                     </div>  

//                     <div style={{marginTop: '1rem'}}>
//                         <TextField
//                             name='descripcion'
//                             label="Descripción"
//                             type="text"
//                             defaultValue={form.descripcion}
//                             onChange={handleChange}
//                             InputLabelProps={{
//                                 shrink: true,
//                             }}
//                             multiline
//                             style={{ width: '150px', height: 100 }}
//                             // error={errores.descripcion ? true : false}
//                         />
//                     </div>
//                 </AccordionDetails>
//             </Accordion>

//             <Accordion defaultExpanded className='proyect-accordion'>
//                 <AccordionSummary
//                         expandIcon={<ExpandMoreIcon />}
//                     >
//                         <Typography className='proyect-Subtitulo'>DATOS DE LA FACTURA</Typography>
//                 </AccordionSummary>

//                 <AccordionDetails> 
//                     <div>
//                         {
//                             options.tiposImpuestos ?
//                             <div>    
//                                 <InputLabel>Tipo de impuesto</InputLabel>
//                                 <Autocomplete
//                                     name="tiposImpuestos"
//                                     options={options.tiposImpuestos}
//                                     getOptionLabel={(option) => option.name}
//                                     style={{ width: 230, paddingRight: '1rem' }}
//                                     onChange={(event, value) => handleChangePagos(event, value, 'tiposImpuestos')}
//                                     // onChange={(event, value) => handleChangeImpuestos(event, value)}
//                                     renderInput={(params) => <TextField {...params}  variant="outlined"  label={form.impuesto_nombre ? form.impuesto_nombre : 'tiposImpuestos'} />}                            
//                                 />
//                             </div>    
//                                 : <></>
//                         }
//                     </div>

//                     <div>
//                         {
//                             options.tiposImpuestos ?
//                             <div>    
//                                 <InputLabel>Tipo de pago</InputLabel>
//                                 <Autocomplete
//                                     name="tipoPago"
//                                     options={options.tiposPagos}
//                                     getOptionLabel={(option) => option.name}
//                                     style={{ width: 230, paddingRight: '1rem' }}
//                                     onChange={(event, value) => handleChangePagos(event, value, 'tipoPago')}
//                                     renderInput={(params) => <TextField {...params}  variant="outlined"  label={form.impuesto_nombre ? form.impuesto_nombre : 'tipoPago'} />}                            
//                                 />
//                             </div>    
//                                 : <></>
//                         }
//                     </div>

//                     <div>
//                         <CurrencyTextField
//                             label="monto"
//                             variant="standard"
//                             value={form.monto} 
//                             currencySymbol="$"
//                             outputFormat="number"
//                             onChange={(event, value) => handleChangeMonto(value)} 
                            
//                             // error={errores.monto ? true : false}
//                         />
//                     </div>
//                     <div>
//                         <CurrencyTextField
//                             label="comision"
//                             variant="standard"
//                             value={form.comision} 
//                             currencySymbol="$"
//                             outputFormat="number"
//                             onChange={(event, value) => handleChangeComision(value)} 
//                         />
//                     </div>
//                 </AccordionDetails>
//             </Accordion>
//         </>
//     )
// }