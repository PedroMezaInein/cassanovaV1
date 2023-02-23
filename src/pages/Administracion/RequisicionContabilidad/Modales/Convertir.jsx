import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import { apiPutForm, apiPostForm } from '../../../../functions/api'

import DateFnsUtils from '@date-io/date-fns';
import { es } from 'date-fns/locale'
import Grid from '@material-ui/core/Grid';

import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import CurrencyTextField from '@unicef/material-ui-currency-textfield'
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import Swal from 'sweetalert2'

import Style from './AprobarSolicitud.module.css'


import j2xParser from 'fast-xml-parser'

const useStyles = makeStyles((theme) => ({
    textField: {
        width: '75%',
    },
    error: {
        color: 'red',
    }
}));

export default function Convertir(props) {
    const { data, handleClose, reload, opciones, estatusCompras } = props
    const departamentos = useSelector(state => state.opciones.areas)
    const auth = useSelector(state => state.authUser)
    const [form, setForm] = useState({
        fecha: new Date(data.fecha),
        departamento: data.departamento_id,
        tipoGasto: data.tipoEgreso_id,
        tipoSubgasto: data.tipoSubEgreso_id,
        tipoPago: data.tipoPago_id,
        monto: data.monto,
        descripcion: data.descripcion,
        id: data.id,
        orden_compra: data.orden_compra,
        fecha_pago: data.fecha_pago ? new Date(data.fecha_pago) : '',
        id_cuenta: data.cuenta ? data.cuenta.id : null,
        monto_solicitado: data.monto_solicitado,
        auto1: data.auto1 ? data.auto1 : false,
        auto2: data.auto2 ? data.auto2 : false,
        auto3: data.auto3 ? data.auto3 : false,
        /* id_estatus: data.id_estatus_compra, */
        proveedor: data.proveedor,
        estatus_compra: data.estatus_compra,
        estatus_conta: data.estatus_conta,
        afectarCuentas: false,
        compra: data.compra,
        conta: data.conta,
        factura: data.factura,
        empresa: "",
        labelCuenta: data.cuenta ? data.cuenta.nombre : 'cuenta',
    })

    const [file, setFile] = useState({
        factura: '',
        xml: ''
    })

    const [errores, setErrores] = useState({})
    const classes = useStyles();

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleChangeFecha = (date, tipo) => {
        setForm({
            ...form,
            [tipo]: new Date(date)
        })
    }

    const handleChangeDepartamento = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
            tipoGasto: null,
            tipoSubgasto: null
        })
    }

    const aprobar = () => {
        if (validateForm()) {
            if (form.auto2) {
                    Swal.fire({
                        title: '¿Estas seguro de aprobar esta solicitud?',
                        text: "Confirma los datos antes de continuar",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Si, aprobar!',
                        cancelButtonText: 'Cancelar'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            if (validateForm()) {
                                Swal.fire({
                                    title: 'Aprobando...',
                                    allowOutsideClick: false,
                                    onBeforeOpen: () => {
                                        Swal.showLoading()
                                    }
                                })
                                let newForm = {
                                    id_departamento: form.departamento,
                                    id_gasto: form.tipoGasto,
                                    descripcion: form.descripcion,
                                    id_subarea: form.tipoSubgasto,
                                    id_pago: form.tipoPago,
                                    id_solicitante: data.solicitante_id,
                                    monto_pagado: form.monto,
                                    cantidad: form.monto_solicitado,
                                    autorizacion_1: form.auto1 ? form.auto1.id: null,
                                    autorizacion_2: form.auto2 ? auth.user.id : null,
                                    orden_compra: form.orden_compra,
                                    fecha_pago: form.fecha_pago,
                                    id_cuenta: form.id_cuenta,
                                    /* id_estatus: form.id_estatus, */
                                    id_proveedor: form.proveedor,
                                    id_estatus_compra: form.compra,
                                    id_estatus_factura: form.factura,
                                    id_estatus_conta: form.conta,
                                    afectar_cuentas: form.afectarCuentas,
                                    empresa: form.empresa,
                                    autorizacion_conta: true,
                                }
                                apiPutForm(`requisicion/${form.id}`, newForm, auth.access_token).then(
                                    (response) => {
                                        Swal.close()
                                        handleClose('convertir')
                                        if (reload) {
                                            reload.reload()
                                        }
                                        Swal.fire({
                                            title: 'Subiendo factura..',
                                            allowOutsideClick: false,
                                            didOpen: () => {
                                                Swal.showLoading()
                                            }
                                        })
                                        if (form.factura && file.factura && file.factura !== '' && file.xml && file.xml !== '') {
                                            let archivo = new FormData();
                                            let aux = [...file.xml, ...file.factura]
                                            archivo.append(`files_name_requisicion[]`, file.factura.name)
                                            archivo.append(`files_requisicion[]`, aux)
                                            archivo.append('adjuntos[]', "requisicion")
                                            archivo.append('tipo', 'Factura')
                                            try {
                                                apiPostForm(`requisicion/${props.data.id}/archivos/s3`, archivo, auth.access_token)
                                                    .then(res => {
                                                        Swal.close()
                                                        Swal.fire({
                                                            icon: 'success',
                                                            title: 'Guardado',
                                                            text: 'Se ha guardado correctamente',
                                                            timer: 2000,
                                                            timerProgressBar: true,
                                                        })
                                                    })
                                                    .catch(err => {
                                                        Swal.close()
                                                        Swal.fire({
                                                            icon: 'error',
                                                            title: 'El registro fue actualizado pero no fue posible subir la factura',
                                                            text: 'Algo salio mal!',
                                                        })
                                                    })
                                            } catch (error) {
                                                Swal.close()
                                                Swal.fire({
                                                    icon: 'error',
                                                    title: 'Oops...',
                                                    text: 'Algo salio mal!',
                                                })
                                            }
                                        }
                                    }, (error) => { }
                                ).catch((error) => {
                                    Swal.close()
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Oops...',
                                        text: 'Ha ocurrido un error',
                                    })
                                })
                            } else {
                                Swal.fire(
                                    'Error!',
                                    'Faltan datos por llenar',
                                    'error'
                                )
                            }
                        }
                    })
                } else {
                    Swal.fire({
                        title: 'Requisición no autorizada!',
                        text: 'Debes aprobar la requisición para poder convertirla',
                        icon: 'error',
                        showCancelButton: false,
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: 'Ok',
                    })
                }
        } else {
            Swal.fire({
                title: 'Faltan datos por llenar!',
                text: 'Debes llenar todos los campos para poder convertirla',
                icon: 'error',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Ok',
            })
        }
    }

    const validateForm = () => {
        let valid = true
        let aux = {}
        if (form.fecha === '' || form.fecha === null) {
            valid = false
            aux.fecha = true
        }
        if (form.fecha_pago === '' || form.fecha_pago === null){
            valid = false
            aux.fecha_pago = true
        }
        if (form.departamento === '' || form.departamento === null) {
            valid = false
            aux.departamento = true
        }
        if (form.tipoGasto === '' || form.tipoGasto === null) {
            valid = false
            aux.tipoGasto = true
        }
        if (form.tipoSubgasto === '' || form.tipoSubgasto === null) {
            valid = false
            aux.tipoSubgasto = true
        }
        if (form.tipoPago === '' || form.tipoPago === null) {
            valid = false
            aux.tipoPago = true
        }
        if (form.monto === '' || form.monto === null || form.monto === 0) {
            valid = false
            aux.monto = true
        }
        if (form.descripcion === '' || form.descripcion === null) {
            valid = false
            aux.descripcion = true
        }
        /* if (form.factura) {
            if(file.factura === '' || file.factura === null){
                valid = false
                aux.factura = true
            }
            if(file.xml === '' || file.xml === null){
                valid = false
                aux.xml = true
            }
        } */
        if(form.empresa === '' || form.empresa === null) {
            valid = false
            aux.empresa = true
        }
        if (!form.afectarCuentas) { 
            valid = false
            aux.afectarCuentas = true
        }
        if (form.proveedor === '' || form.proveedor === null) {
            valid = false
            aux.proveedor = true
        }
        if (form.compra === '' || form.compra === null) {
            valid = false
            aux.compra = true
        }
        if (form.factura === '' || form.factura === null) {
            valid = false
            aux.conta = true
        }
        if( form.tipoGasto === '' || form.tipoGasto === null){
            valid = false
            aux.tipoGasto = true
        }
        if( form.tipoSubgasto === '' || form.tipoSubgasto === null){
            valid = false
            aux.tipoSubgasto = true
        }
        if( form.tipoPago === '' || form.tipoPago === null){
            valid = false
            aux.tipoPago = true
        }
        if (form.id_cuenta === '' || form.id_cuenta === null) {
            valid = false
            aux.id_cuenta = true
        }

        setErrores(aux) 
        return valid
    }

    const handleAprueba = (e) => {
        if (e.target.name === 'auto2') {
            setForm({
                ...form,
                auto2: !form.auto2
            })
        }
    }

    const handleCuentas = (e) => {
        Swal.fire({
            title: '¿Desea afectar cuentas?',
            text: "Si acepta, se afectaran las cuentas de la requisición y no podrá modificarlas",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: 'red',
            cancelButtonColor: 'gray',
            confirmButtonText: 'AFECTAR CUENTAS',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                setForm({
                    ...form,
                    afectarCuentas: !form.afectarCuentas
                })
            }
        })
    }

    const handleFactura = (e, tipo) => { 
        setForm({
            ...form,
            factura: tipo
        })

    }

    const handleFile = (e, tipo) => {
        setFile({
            ...file,
            [tipo]: e.target.files[0]
        })
    }

    const handleMoney = (e) => {
        setForm({
            ...form,
            monto: e
        })
    }

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
                    setForm({
                        ...form,
                        monto: obj.total ? obj.total : form.monto,
                        fecha_pago: obj.fecha ? obj.fecha : form.fecha_pago,
                    })
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

            setFile({
                ...file,
                xml: files[0]
            })
        
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

    const handleDeleteAdjunto = (tipo) => { 
        setFile({
            ...file,
            [tipo]: ''
        })
    }

    const handleChangeCuenta = (e, value) => {
        if (value && value.nombre) {
            setForm({
                ...form,
                id_cuenta: value.id,
                labelCuenta: value.nombre
            })
        }
    }

    return (
        <>
            <div>
                {/* <div className={Style.container_factura}>
                    <div>
                        <InputLabel id="demo-simple-select-label">Lleva facura</InputLabel>
                        <FormGroup aria-label="position" row>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={form.factura}
                                        onChange={e => handleFactura(e, true)}
                                        name="factura"
                                        color="primary"
                                        style={{ marginLeft: '20%' }}
                                    />
                                }
                                label="Si"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={!form.factura}
                                        onChange={e => handleFactura(e, false)}
                                        name="factura"
                                        color="primary"
                                        style={{ marginLeft: '20%' }}
                                    />
                                }
                                label="No"
                            />
                        </FormGroup>

                    </div>
                    <div className={Style.files}>
                        {
                            form.factura &&
                            <>
                                <div className={Style.nuevaRequisicion_adjunto}>
                                    <label htmlFor="file_factura">Agregar factura pdf</label>
                                    <input id="file_factura" className={Style.nuevaRequisicion_adjunto_input} type='file' onChange={e => handleFile(e, "factura")}></input>
                                    <div>
                                        {file.factura && file.factura.name ? <div className={Style.adjunto_nombre}><span className={Style.adjunto_delete} onClick={e => handleDeleteAdjunto('factura')}>X</span>{file.factura.name}</div> : null}
                                    </div>
                                </div>
                                <div className={Style.nuevaRequisicion_adjunto}>
                                    <label htmlFor="file_xml">Agregar XML</label>
                                    <input id="file_xml" className={Style.nuevaRequisicion_adjunto_input} type='file' onChange={onChangeFactura}></input>
                                    {
                                        file.xml !== '' &&
                                            file.xml.name ? <div className={Style.adjunto_nombre}><span className={Style.adjunto_delete} onClick={e => handleDeleteAdjunto('xml')}>X</span>{file.xml.name}</div> : null
                                    }
                                    
                                </div>
                            </>
                        }    
                    </div>
                    
                </div> */}

                <div className={Style.container}>
                    <div>
                        <InputLabel>Fecha de solicitud</InputLabel>
                        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
                            <Grid container >
                                <KeyboardDatePicker

                                    format="dd/MM/yyyy"
                                    name="fecha"
                                    value={form.fecha !== '' ? form.fecha : null}
                                    placeholder="dd/mm/yyyy"
                                    onChange={e => handleChangeFecha(e, 'fecha')}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                />
                            </Grid>
                        </MuiPickersUtilsProvider>
                    </div>

                    <div>
                        <InputLabel className={`${errores.fecha_pago ? classes.error : ''}`}>Fecha de Pago</InputLabel>
                        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
                            <Grid container >
                                <KeyboardDatePicker

                                    format="dd/MM/yyyy"
                                    name="fecha_pago"
                                    value={form.fecha_pago !== '' ? form.fecha_pago : null}
                                    placeholder="dd/mm/yyyy"
                                    onChange={e => handleChangeFecha(e, 'fecha_pago')}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                /* error={errores.fecha_pago ? true : false} */
                                />
                            </Grid>
                        </MuiPickersUtilsProvider>
                    </div>

                    <div>
                        <TextField
                            label="N. Orden de compra"
                            name='orden_compra'
                            defaultValue={form.orden_compra}
                            className={classes.textField}
                            disabled
                        />
                    </div>

                    <div>
                        <CurrencyTextField
                            label="monto Solicitado"
                            variant="standard"
                            value={form.monto_solicitado}
                            currencySymbol="$"
                            outputFormat="number"
                            onChange={(event, value) => handleMoney(value)}
                            disabled
                        />
                    </div>

                    <div>
                        {departamentos.length > 0 ?
                            <>
                                <InputLabel id="demo-simple-select-label">Departamento</InputLabel>
                                <Select
                                    value={form.departamento}
                                    name="departamento"
                                    onChange={handleChangeDepartamento}
                                    disabled
                                    className={classes.textField}
                                    error={errores.departamento ? true : false}
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
                        {departamentos.length > 0 ?
                            <>
                                <InputLabel id="demo-simple-select-label">Tipo de Gasto</InputLabel>
                                <Select
                                    value={form.tipoGasto}
                                    name="tipoGasto"
                                    onChange={handleChange}

                                    className={classes.textField}
                                >
                                    {departamentos.find(item => item.id_area == form.departamento).partidas.map((item, index) => (
                                        <MenuItem key={index} value={item.id}>{item.nombre}</MenuItem>
                                    ))}

                                </Select>
                            </>
                            : null
                        }
                    </div>

                    <div>
                        {departamentos.length && form.tipoGasto ?
                            <>
                                <InputLabel>Tipo de Subgasto</InputLabel>
                                <Select
                                    name="tipoSubgasto"
                                    onChange={handleChange}
                                    value={form.tipoSubgasto}
                                    className={classes.textField}
                                    error={errores.tipoSubgasto ? true : false}
                                >
                                    {departamentos.find(item => item.id_area == form.departamento).partidas.find(item => item.id == form.tipoGasto).subpartidas.map((item, index) => (
                                        <MenuItem key={index} value={item.id}>{item.nombre}</MenuItem>
                                    ))}

                                </Select>
                            </>
                            : null
                        }
                    </div>

                    <div>
                        <CurrencyTextField
                            label="monto pagado"
                            variant="standard"
                            value={form.monto}
                            currencySymbol="$"
                            outputFormat="number"
                            onChange={(event, value) => handleMoney(value)}
                            error={errores.monto ? true : false}
                        />
                    </div>

                    <div>
                        {
                            opciones ?
                                <>
                                    <InputLabel id="demo-simple-select-label">Empresa</InputLabel>
                                    <Select
                                        name="empresa"
                                        value={form.empresa}
                                        onChange={handleChange}
                                        className={classes.textField}
                                        error={errores.empresa ? true : false}
                                    >
                                        {opciones.empresas.map((item, index) => (
                                            <MenuItem key={index} value={item.value}>{item.name}</MenuItem>
                                        ))}
                                    </Select>

                                </>
                                : null
                        }
                    </div>

                    <div>
                        {
                            opciones && form.empresa !== "" ?
                                <>
                                    {/* <InputLabel>Cuenta de salida</InputLabel>
                                    <Select
                                        name="id_cuenta"
                                        value={form.id_cuenta}
                                        onChange={handleChange}
                                        className={classes.textField}
                                        error={errores.id_cuenta ? true : false}
                                    >
                                        {opciones.empresas.find(item => item.value == form.empresa).cuentas.map((item, index) => (
                                            <MenuItem key={index} value={item.id}>{item.nombre}</MenuItem>
                                        ))}
                                    </Select> */}
                                    <InputLabel>Cuenta de salida</InputLabel>
                                    <Autocomplete
                                        name="cuenta"
                                        options={opciones.empresas.find(item => item.value == form.empresa).cuentas}
                                        getOptionLabel={(option) => option.nombre}
                                        style={{ width: 230, paddingRight: '1rem' }}
                                        onChange={(event, value) => handleChangeCuenta(event, value)}
                                        renderInput={(params) => <TextField {...params} label={form.labelCuenta} variant="outlined" />}
                                    />
                                </>
                                : opciones ?
                                    <>
                                        <InputLabel>Cuenta de Salida</InputLabel>
                                        <Select
                                            name="id_cuenta"
                                            value={form.id_cuenta}
                                            onChange={handleChange}
                                            className={classes.textField}
                                            error={errores.id_cuenta ? true : false}
                                        >
                                            {opciones.cuentas.map((item, index) => {
                                                if (item.value == form.id_cuenta) {
                                                    return <MenuItem key={index} value={item.value}>{item.name}</MenuItem>
                                                }
                                            })}

                                        </Select>
                                    </>
                                    : null
                        }
                    </div>

                    <div>
                        {
                            opciones ?
                                <>
                                    <InputLabel >Tipo de Pago</InputLabel>
                                    <Select
                                        name="tipoPago"
                                        value={form.tipoPago}
                                        onChange={handleChange}
                                        className={classes.textField}
                                        error={errores.tipoPago ? true : false}
                                    >
                                        {opciones.tiposPagos.map((item, index) => (
                                            <MenuItem key={index} value={item.value}>{item.name}</MenuItem>
                                        ))}

                                    </Select>
                                </>
                                : null
                        }
                    </div>

                    <div>
                        {
                            estatusCompras ?
                                <>
                                    <InputLabel>Estatus de pago</InputLabel>
                                    <Select
                                        name="conta"
                                        value={form.conta}
                                        onChange={handleChange}
                                        className={classes.textField}
                                        error={errores.compra ? true : false}
                                    >
                                        {estatusCompras.map((item, index) => {
                                            if (item.nivel === 2) {
                                                return <MenuItem key={index} value={item.id}>{item.estatus}</MenuItem>
                                            }
                                        })}
                                    </Select>
                                </>
                                : null
                        }

                    </div>

                    <div>
                        {
                            estatusCompras ?
                                <>
                                    <InputLabel >Estatus de facturación</InputLabel>
                                    <Select
                                        name="factura"
                                        value={form.factura}
                                        onChange={handleChange}
                                        className={classes.textField}
                                        error={errores.conta ? true : false}
                                    >
                                        {estatusCompras.map((item, index) => {
                                            if (item.nivel === 3) {
                                                return <MenuItem key={index} value={item.id}>{item.estatus}</MenuItem>
                                            }
                                        })}
                                    </Select>
                                </>
                                : null
                        }

                    </div>

                    <div>
                        {
                            opciones ?
                                <>
                                    <InputLabel className={`${errores.proveedor ? classes.error : ''}`}>Proveedor</InputLabel>
                                    <Select
                                        name="proveedor"
                                        value={form.proveedor}
                                        onChange={handleChange}
                                        className={classes.textField}
                                        disabled
                                    >
                                        {opciones.proveedores.map((item, index) => (
                                            <MenuItem key={index} value={item.value}>{item.name}</MenuItem>
                                        ))}

                                    </Select>
                                </>
                                : null
                        }
                    </div>

                    <div>
                        <TextField
                            name='descripcion'
                            label="Descripción"
                            type="text"
                            defaultValue={form.descripcion}
                            onChange={handleChange}
                            className={classes.textField}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            error={errores.descripcion ? true : false}
                        />
                    </div>

                    <div>
                        <InputLabel >Aprobar Requsición</InputLabel>
                        <Checkbox
                            checked={form.auto2}
                            onChange={handleAprueba}
                            name="auto2"
                            color="primary"
                            style={{ marginLeft: '20%' }}
                        />
                    </div>

                    <div>
                        <InputLabel className={`${errores.afectarCuentas ? classes.error : ''}`}>AFECTAR CUENTAS</InputLabel>
                        <Checkbox
                            checked={form.afectarCuentas}
                            onChange={handleCuentas}
                            name="afectarCuentas"
                            color="secondary"
                            style={{ marginLeft: '15%' }}
                            disabled={form.afectarCuentas}
                        />
                    </div>
                </div>

            </div>

            <div className="row justify-content-end">
                <div className="col-md-4">
                    <button className={Style.sendButton} onClick={aprobar}>Convertir</button>
                </div>
            </div>
        </>
    )
}