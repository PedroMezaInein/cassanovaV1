import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { apiOptions, catchErrors, apiPutForm, apiPostForm, apiGet } from './../../../../functions/api';

import DateFnsUtils from '@date-io/date-fns';
import Swal from 'sweetalert2'
import { es } from 'date-fns/locale'
import axios from 'axios';

import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Chip from '@material-ui/core/Chip';
import Autocomplete from '@material-ui/lab/Autocomplete';
import InputLabel from '@material-ui/core/InputLabel';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';
import TrashIcon from '@material-ui/icons/DeleteOutline';
import CurrencyTextField from '@unicef/material-ui-currency-textfield'

import j2xParser from 'fast-xml-parser'

export default function CrearEgreso() {
    const auth = useSelector((state) => state.authUser.access_token);
    const departamentos = useSelector(state => state.opciones.areas)
    const [opciones, setOpciones] = useState({
        cuentas: [],
        empresas: [],
        estatusCompras: [],
        proveedores: [],
        tiposImpuestos: [],
        tiposPagos: [],
    })

    const [form, setForm] = useState({
        adjuntos: {
            pago: {files:[], value: ''},
            pdf: { files: [], value: '' },
            presupuesto: { files: [], value: '' },
            xml: { files: [], value: '' },
        },
        area: '',
        banco: 0,
        comision: '',
        correo: '',
        cuenta: '',
        descripcion: '',
        empresa: '',
        estatusCompra: '',
        factura: false, //'Sin factura, con factura'
        facturaItem: { nombre_emisor: "", nombre_receptor: "" },
        facturaObject: {},
        fecha: '',
        id_partidas: "",
        leadId: "",
        nombre: "",
        numCuenta: "",
        partida: '',
        proveedor: '',
        razonSocial: '',
        rfc: null,
        subarea: '', //subpartida?
        telefono: '',
        tipo: 0,
        tipoImpuesto: '',
        tipoPago: '',
        total: '',
    })

    useEffect(() => {
        getProveedores()
    }, [])

    const getProveedores = () => {
        Swal.fire({
            title: 'Cargando...',
            allowOutsideClick: false,
            onBeforeOpen: () => {
                Swal.showLoading()
            },
        })
        apiOptions(`v2/administracion/egresos`, auth)
            .then(res => {
                let data = res.data
                let aux = {
                    cuentas: [],
                    empresas: [],
                    estatusCompras: [],
                    proveedores: [],
                    tiposImpuestos: [],
                    tiposPagos: [],
                }

                data.proveedores.map((proveedor) => {
                    if (proveedor.nombre !== null) {
                        aux.proveedores.push({
                            id: proveedor.id,
                            name: proveedor.nombre
                        })   
                    }  
                })

                data.empresas.map((empresa) => {
                    if (empresa.nombre !== null) {
                        aux.empresas.push({
                            id: empresa.id,
                            name: empresa.name,
                        })
                    }
                })

                data.estatusCompras.map((estatusCompra) => {
                    if (estatusCompra.estatus !== null) {
                        aux.estatusCompras.push({
                            id: estatusCompra.id,
                            name: estatusCompra.estatus,
                        })
                    }
                })

                data.tiposImpuestos.map((tipoImpuesto) => {
                    if (tipoImpuesto.tipo !== null) {
                        aux.tiposImpuestos.push({
                            id: tipoImpuesto.id,
                            name: tipoImpuesto.tipo,
                        })
                    }
                })

                data.tiposPagos.map((tipoPago) => {
                    if (tipoPago.tipo !== null) {
                        aux.tiposPagos.push({
                            id: tipoPago.id,
                            name: tipoPago.tipo,
                        })
                    }
                })

                Swal.close()
                setOpciones(aux)
                    
            }
        )
        
    }

    const handleChangeCheck = () => {
        setForm({
            ...form,
            factura: !form.factura
        });
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const onChangeFactura = (e) => {
        const { files } = e.target
        const reader = new FileReader()
        if (files[0].type === 'text/xml') {
            reader.onload = (event) => {
                const text = (event.target.result)
                let jsonObj = j2xParser.parse(text, {
                    ignoreAttributes: false,
                    attributeNamePrefix: ''
                })
                if (jsonObj['cfdi:Comprobante']) {
                    jsonObj = jsonObj['cfdi:Comprobante']
                    const keys = Object.keys(jsonObj)
                    let obj = {}
                    let errores = []
                    if (keys.includes('cfdi:Receptor')) {
                        obj.rfc_receptor = jsonObj['cfdi:Receptor']['Rfc']
                        obj.nombre_receptor = jsonObj['cfdi:Receptor']['Nombre']
                        obj.uso_cfdi = jsonObj['cfdi:Receptor']['UsoCFDI']
                        /* form.nombre = obj.nombre_receptor */

                        /* this.setState({
                            ...this.state,
                            form
                        }) */
                    } else { errores.push('El XML no tiene el receptor') }
                    if (keys.includes('cfdi:Emisor')) {
                        obj.rfc_emisor = jsonObj['cfdi:Emisor']['Rfc']
                        obj.nombre_emisor = jsonObj['cfdi:Emisor']['Nombre']
                        obj.regimen_fiscal = jsonObj['cfdi:Emisor']['RegimenFiscal']
                        /* form.rfc = obj.rfc_emisor
                        form.razonSocial = obj.nombre_emisor */
                        /* this.setState({
                            ...this.state,
                            form
                        }) */
                    } else { errores.push('El XML no tiene el emisor') }
                    obj.lugar_expedicion = jsonObj['LugarExpedicion']
                    obj.fecha = jsonObj['Fecha'] ? new Date(jsonObj['Fecha']) : null
                    obj.metodo_pago = jsonObj['MetodoPago']
                    obj.tipo_de_comprobante = jsonObj['TipoDeComprobante']
                    obj.total = jsonObj['Total']
                    obj.subtotal = jsonObj['SubTotal']
                    obj.tipo_cambio = jsonObj['TipoCambio']
                    obj.moneda = jsonObj['Moneda']
                    if (keys.includes('cfdi:Complemento')) {
                        if (jsonObj['cfdi:Complemento']['tfd:TimbreFiscalDigital']) {
                            obj.numero_certificado = jsonObj['cfdi:Complemento']['tfd:TimbreFiscalDigital']['UUID']
                        } else { errores.push('El XML no tiene el UUID') }
                    } else { errores.push('El XML no tiene el UUID') }
                    obj.descripcion = ''
                    if (keys.includes('cfdi:Conceptos')) {
                        if (jsonObj['cfdi:Conceptos']['cfdi:Concepto']) {
                            if (Array.isArray(jsonObj['cfdi:Conceptos']['cfdi:Concepto'])) {
                                jsonObj['cfdi:Conceptos']['cfdi:Concepto'].forEach((element, index) => {
                                    if (index) {
                                        obj.descripcion += ' - '
                                    }
                                    obj.descripcion += element['Descripcion']
                                })
                            } else {
                                obj.descripcion += jsonObj['cfdi:Conceptos']['cfdi:Concepto']['Descripcion']
                            }
                        }
                    }
                    obj.folio = jsonObj['Folio']
                    obj.serie = jsonObj['Serie']
                    if (keys.includes('cfdi:CfdiRelacionados')) {
                        if (Array.isArray(jsonObj['cfdi:CfdiRelacionados'])) {
                            obj.tipo_relacion = jsonObj['cfdi:CfdiRelacionados'][0]['TipoRelacion']
                        }
                    }
                    if (keys.includes('cfdi:CfdiRelacionado')) {
                        if (Array.isArray(jsonObj['cfdi:CfdiRelacionado'])) {
                            obj.uuid_relacionado = jsonObj['cfdi:CfdiRelacionado'][0]['UUID']
                        }
                    }
                    console.log(obj)
                    /* setForm({
                        ...form,
                        monto: obj.total ? obj.total : form.monto,
                        fecha_pago: obj.fecha ? obj.fecha : form.fecha_pago,
                    }) */
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Fromato XML incorrecto',
                        text: 'La factura no tiene el formato correcto',
                        showConfirmButton: false,
                        timer: 1500
                    })

                }
            }

            /* setFile({
                ...file,
                xml: files[0]
            }) */

        } else {
            Swal.fire({
                icon: 'error',
                title: 'Fromato XML incorrecto',
                text: 'La factura no tiene el formato correcto',
                showConfirmButton: false,
                timer: 3000
            })
        }

        reader.readAsText(files[0])

    }

    console.log(opciones)

    return (
        <>
            
            <Accordion defaultExpanded className='proyect-accordion'>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                >
                    <Typography className='proyect-Subtitulo'>DATOS DE LA FACTURA</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginRight: '10px' }}>
                            <div>
                                <InputLabel>Lleva factura?</InputLabel>
                                <FormGroup row>
                                    <FormControlLabel
                                        control={<Checkbox checked={!form.factura} onChange={handleChangeCheck} color='secondary' name='factura' />}
                                        label="No"

                                    />
                                    <FormControlLabel
                                        control={<Checkbox checked={form.factura} onChange={handleChangeCheck} color='primary' name='factura' />}
                                        label="Si"

                                    />
                                </FormGroup>
                            </div>  
                            {
                                form.factura ?
                                    <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                                        <div>
                                            <InputLabel>XML de la factura</InputLabel>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <div>
                                                    <input
                                                        accept="application/xml"
                                                        style={{ display: 'none' }}
                                                        id="xml"
                                                        multiple
                                                        type="file"
                                                        onChange={onChangeFactura}
                                                    />
                                                    <label htmlFor="xml">
                                                        <Button variant="contained" color="primary" component="span">
                                                            Agregar
                                                        </Button>
                                                    </label>
                                                </div>
                                            </div>   
                                        </div>    
                                        <div>
                                            <InputLabel>PDF de la factura</InputLabel>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <div>
                                                    <input
                                                        accept="application/pdf"
                                                        style={{ display: 'none' }}
                                                        id="pdf"
                                                        multiple
                                                        type="file"
                                                    /* onChange={(e) => handleChangeFile(e, 'pdf')} */
                                                    />
                                                    <label htmlFor="pdf">
                                                        <Button variant="contained" color="primary" component="span">
                                                            Agregar
                                                        </Button>
                                                    </label>
                                                </div>
                                                
                                            </div>
                                        </div>
                                        <div>
                                            <TextField
                                                id="outlined-basic"
                                                label="RFC"
                                                variant="outlined"
                                                name="nombreArchivo"
                                            /* onChange={handleChange} */
                                            />

                                        </div>
                                    </div>
                                    : null
                                
                            }

                            
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div>
                                {
                                    opciones.proveedores.length > 0 ?
                                        <Autocomplete
                                            name="proveedor"
                                            options={opciones.proveedores}
                                            getOptionLabel={(option) => option.name}
                                            style={{ width: 230, paddingRight: '1rem' }}
                                            /* onChange={(event, value) => handleChangeProveedor(event, value)} */
                                            renderInput={(params) => <TextField {...params} label={'proveedor'} variant="outlined" />}
                                        />
                                        : null
                                }
                                
                            </div>   
                            <div>
                                {
                                    opciones.empresas.length > 0 ?
                                        <Autocomplete
                                            name="empresa"
                                            options={opciones.empresas}
                                            getOptionLabel={(option) => option.name}
                                            style={{ width: 230, paddingRight: '1rem' }}
                                            /* onChange={(event, value) => handleChangeEmpresa(event, value)} */
                                            renderInput={(params) => <TextField {...params} label={'empresa'} variant="outlined" />}
                                        />
                                        : null

                                }
                            </div>    
                        </div>
                        
                        
                    </div>
                </AccordionDetails>
            </Accordion>


            <Accordion defaultExpanded className='proyect-accordion'>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                >
                    <Typography className='proyect-Subtitulo'>ÁREA Y FECHA</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <div>

                        <div>
                            <div>
                                <InputLabel >Fecha del egreso</InputLabel>
                                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
                                    <Grid container >
                                        <KeyboardDatePicker

                                            format="dd/MM/yyyy"
                                            name="fecha"
                                            value={form.fecha !== '' ? form.fecha : null}
                                            placeholder="dd/mm/yyyy"
                                            /* onChange={e => handleChangeFecha(e, 'fecha')} */
                                            KeyboardButtonProps={{
                                                'aria-label': 'change date',
                                            }}
                                        />
                                    </Grid>
                                </MuiPickersUtilsProvider>
                            </div>    
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <div>
                                {departamentos.length > 0 ?
                                    <>
                                        <InputLabel id="demo-simple-select-label">Departamento</InputLabel>
                                        <Select
                                            value={form.area}
                                            name="area"
                                            onChange={handleChange}
                                            style={{ width: 230, marginRight: '1rem' }}
                                        >
                                            {departamentos.map((item, index) => (
                                                <MenuItem key={index} value={item.id_area}>{item.nombreArea}</MenuItem>
                                            ))}

                                        </Select>
                                    </>
                                    : null
                                }

                            </div>

                            <div>
                                {departamentos.length > 0 && form.area !== '' ?
                                    <>
                                        <InputLabel id="demo-simple-select-label">Tipo de Gasto</InputLabel>
                                        <Select
                                            value={form.partida}
                                            name="partida"
                                            onChange={handleChange}
                                            style={{ width: 230, marginRight: '1rem' }}
                                        >
                                            {departamentos.find(item => item.id_area == form.area) && departamentos.find(item => item.id_area == form.area).partidas.map((item, index) => (
                                                <MenuItem key={index} value={item.id}>{item.nombre}</MenuItem>
                                            ))}

                                        </Select>
                                    </>
                                    : null
                                }
                            </div>

                            <div>
                                {departamentos.length && form.partida !== '' ?
                                    <>
                                        <InputLabel id="demo-simple-select-label">Tipo de Subgasto</InputLabel>
                                        <Select
                                            name="subarea"
                                            onChange={handleChange}
                                            value={form.subarea}
                                            style={{ width: 230, marginRight: '1rem' }}
                                        >
                                            {departamentos.find(item => item.id_area == form.area).partidas.find(item => item.id == form.partida).subpartidas.map((item, index) => (
                                                <MenuItem key={index} value={item.id}>{item.nombre}</MenuItem>
                                            ))}

                                        </Select>
                                    </>
                                    : null
                                }
                            </div>  
                            
                        </div>

                        <div>

                            <div>
                                <TextField
                                    name='descripcion'
                                    label="Descripción"
                                    type="text"
                                    defaultValue={form.descripcion}
                                    onChange={handleChange}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    multiline
                                    style={{ width: '70vh', height: 100 }}
                                />
                            </div>

                        </div>

                        
                    </div>
                </AccordionDetails>
            </Accordion>


            <Accordion defaultExpanded className='proyect-accordion'>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                >
                    <Typography className='proyect-Subtitulo'>PAGO</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <div>  
                        
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <div>
                                {
                                    opciones.tiposPagos.length > 0 ?
                                        <Autocomplete
                                            name="proveedor"
                                            options={opciones.tiposPagos}
                                            getOptionLabel={(option) => option.name}
                                            style={{ width: 230, paddingRight: '1rem' }}
                                            /* onChange={(event, value) => handleChangeProveedor(event, value)} */
                                            renderInput={(params) => <TextField {...params} label={'cuenta'} variant="outlined" />}
                                        />
                                        : null
                                }

                            </div> 
                            <div>
                                {
                                    opciones.tiposPagos.length > 0 ?
                                        <Autocomplete
                                            name="proveedor"
                                            options={opciones.tiposPagos}
                                            getOptionLabel={(option) => option.name}
                                            style={{ width: 230, paddingRight: '1rem' }}
                                            /* onChange={(event, value) => handleChangeProveedor(event, value)} */
                                            renderInput={(params) => <TextField {...params} label={'tipo de pago'} variant="outlined" />}
                                        />
                                        : null
                                }

                            </div> 
                            <div>
                                {
                                    opciones.estatusCompras.length > 0 ?
                                        <Autocomplete
                                            name="proveedor"
                                            options={opciones.estatusCompras}
                                            getOptionLabel={(option) => option.name}
                                            style={{ width: 230, paddingRight: '1rem' }}
                                            /* onChange={(event, value) => handleChangeProveedor(event, value)} */
                                            renderInput={(params) => <TextField {...params} label={'estatus de compra'} variant="outlined" />}
                                        />
                                        : null
                                }

                            </div> 
                        </div>
                        
                        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '2rem'}}>
                            <div>
                                {
                                    opciones.tiposImpuestos.length > 0 ?
                                        <Autocomplete
                                            name="proveedor"
                                            options={opciones.tiposImpuestos}
                                            getOptionLabel={(option) => option.name}
                                            style={{ width: 230, paddingRight: '1rem' }}
                                            /* onChange={(event, value) => handleChangeProveedor(event, value)} */
                                            renderInput={(params) => <TextField {...params} label={'tipo de impuesto'} variant="outlined" />}
                                        />
                                        : null
                                }

                            </div> 
                            <div>
                                <CurrencyTextField
                                    label="monto"
                                    variant="standard"
                                    /* value={form.monto} */
                                    currencySymbol="$"
                                    outputFormat="number"
                                    /* onChange={(event, value) => handleMoney(value)} */
                                    
                                />
                            </div>
                            <div>
                                <CurrencyTextField
                                    label="comision"
                                    variant="standard"
                                    /* value={form.monto} */
                                    currencySymbol="$"
                                    outputFormat="number"
                                    /* onChange={(event, value) => handleMoney(value)} */
                                    
                                />
                            </div>
                        </div>
                        

                        

                    </div>
                </AccordionDetails>
            </Accordion>
        
        </>
    )
        
}
