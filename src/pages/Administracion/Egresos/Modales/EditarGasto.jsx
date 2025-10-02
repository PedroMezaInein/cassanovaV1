import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import S3 from 'react-aws-s3'


import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Swal from 'sweetalert2'
import MenuItem from '@material-ui/core/MenuItem';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { es } from 'date-fns/locale'
import DateFnsUtils from '@date-io/date-fns';
import CurrencyTextField from '@unicef/material-ui-currency-textfield'

import { apiPostForm, apiGet, apiPutForm } from './../../../../functions/api';
import Button from '@material-ui/core/Button';

import Select from '@mui/material/Select';
import { Dialog, DialogActions, DialogContent, DialogTitle, Grid, Paper,Box,InputLabel  } from '@mui/material';
import Container from '@material-ui/core/Container';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

export default function EditarEgreso(props) {

    const { opcionesData, handleClose, reload, data } = props
    const departamentos = useSelector(state => state.opciones.areas)
    const proyectos = useSelector(state => state.opciones.proyectos)
    const [errores, setErrores] = useState({})
    const proveedores = useSelector((state) => state.opciones.proveedores);
    const presupuesto = useSelector(state => state.opciones.presupuestos)

    const auth = useSelector((state) => state.authUser.access_token);

    // let valorArea = areaCompras.find((element) => parseInt(element.id_area) === data.area.id)
    // let valorPartida = valorArea.partidas.find((element) => parseInt(element.id) === data.partida_id)
    // let valorSubPartida = valorPartida.subpartidas.find((element) => parseInt(element.id) === data.subarea.id)
    // console.log(data)
    // useEffect(() => {

    //     if (opcionesData) {
    //         setOpciones(opcionesData)
    //     }
    // }, [opcionesData])
    
    useEffect(() => {
        // console.log('Data:', data);
        // console.log('OpcionesData:', opcionesData);
        // console.log('Proyectos:', proyectos);
        // console.log('Departamentos:', departamentos);
    
        if (data && opcionesData) {
            // Encuentra la empresa seleccionada
            const empresaSeleccionada = opcionesData.empresas?.find((empresa) => empresa.id === data.data?.empresa_id);
            const cuentas = empresaSeleccionada?.cuentas || []; // Obtén las cuentas de la empresa seleccionada
    
            // Encuentra la cuenta seleccionada
            const cuentaSeleccionada = cuentas?.find((cuenta) => cuenta.nombre === data.cuenta);
    
            // Procesa las demás relaciones
            const area = departamentos?.find((area) => area.nombreArea === data.area)?.id_area || '';
            const id_partidas = departamentos
                ?.find((area) => area.nombreArea === data.area)
                ?.partidas?.find((partida) => partida.nombre === data.partida)?.id || '';
            const subarea = departamentos
                ?.find((area) => area.nombreArea === data.area)
                ?.partidas?.find((partida) => partida.nombre === data.partida)
                ?.subpartidas?.find((subarea) => subarea.nombre === data.subarea)?.id || '';
            const proveedor = proveedores?.find((proveedor) => proveedor.name === data.proveedor)?.id || '';
            // const proyecto = proyectos?.find((proyecto) => proyecto.nombre === data.proyecto)?.id || '';
            const tipoImpuesto = opcionesData.tiposImpuestos?.find((impuesto) => impuesto.id === data?.data?.tipo_impuesto.id)?.id || '';
            const tipoPago = opcionesData.tiposPagos?.find((pago) => pago.id === data?.data?.tipo_pago.id)?.id || '';
            const presupuestos = presupuesto?.find((presupuesto) => presupuesto.id === data?.data?.requisicion?.presu?.id)?.id || '';
            // console.log(data?.data?.requisicion?.presu?.id)

            // console.log(presupuestos)
    
            // console.log('Processed Values:', {
            //     area,
            //     cuenta: cuentaSeleccionada?.id || '',
            //     id_partidas,
            //     subarea,
            //     proveedor,
            //     tipoImpuesto,
            //     tipoPago,
            //     cuentaSeleccionada,
            //     presupuestos,
            // });
            // console.log(empresaSeleccionada)
            // Actualiza el estado del formulario
            setForm((prevForm) => ({
                ...prevForm,
                empresa: empresaSeleccionada?.id || '',
                cuentas, // Asocia las cuentas disponibles
                cuenta: cuentaSeleccionada?.id || '', // Selecciona la cuenta por defecto
                area,
                descripcion: data.descripcion || '',
                factura: data.factura === 'Con factura',
                fecha: new Date(data.fecha),
                id_partidas,
                proveedor,
                presupuestos,
                subarea,
                total: parseFloat(data.monto?.replace(/[^\d.-]/g, '')) || 0,
                tipoImpuesto : cuentaSeleccionada?.id_impuesto || '',
                tipoPago,
            }));
            // console.log(form)
        }
    }, [data, opcionesData]);
    

    const [form, setForm] = useState({
        adjuntos: {
            pago: { files: [], value: '' },
            pdf: { files: [], value: '' },
            presupuesto: { files: [], value: '' },
            xml: { files: [], value: '' },
        },
        area: '',
        banco: 0,
        comision: 0,
        cuenta: '',
        cuentas: [],
        descripcion: '',
        empresa: '',
        estatusCompra: 2,
        factura: false,
        facturaItem: '',
        facturaObject: {},
        fecha: null,
        id_partidas: '',
        proveedor: '',
        proveedor_nombre: '',
        proyecto_nombre: '',
        razonSocial: '',
        rfc: '',
        subarea: '',
        telefono: '',
        tipo: 0,
        tipoImpuesto: '',
        tipoPago: '',
        total: '',
        disabled: true,
        presupuestos: '',
    });
    
    // console.log(form)

    // const [form, setForm] = useState({
    //     adjuntos: {
    //         pago: { files: [], value: '' },
    //         pdf: { files: [], value: '' },
    //         presupuesto: { files: [], value: '' },
    //         xml: { files: [], value: '' },
    //     },
    //     area: data.area ? data.area.id : '',
    //     banco: 0,
    //     comision: 0,
    //     // correo: '',
    //     // // cuenta: '',
    //     cuenta: data.cuenta ? data.cuenta.id : '',
    //     cuentas: [],
    //     comision: 0,
    //     descripcion: data.descripcion ? data.descripcion : '',
    //     empresa: data.empresa.id,

    //     // empresa: data.empresa.id ? data.empresa.id : '',
    //     estatusCompra: 2,
    //     factura: data.factura == 1 ? true : false,
    //     facturaItem: '',
    //     facturaObject: {},
    //     fecha: data.created_at,
    //     partida: data.partida ? data.partida.id : '',
    //     leadId: "",
    //     nombre: "",
    //     numCuenta: "",
    //     proveedor: data.proveedor ? data.proveedor.id : '',
    //     proveedor_nombre: data.proveedor ? data.proveedor.razon_social : '',
    //     proyecto: data.proyecto.nombre ? data.proyecto.id : '',
    //     proyecto_nombre: data.proyecto.nombre,
    //     razonSocial: '',
    //     rfc: data.proveedor ? data.proveedor.rfc : '',
    //     subarea: data.subarea ? data.subarea.id : '',
    //     telefono: '',
    //     tipo: 0,
    //     tipoImpuesto: data.tipo_impuesto ? data.tipo_impuesto.id : '',
    //     tipoPago: data.tipo_pago ? data.tipo_pago.id : '',
    //     total: data.total ? data.total : '',
    // })

    // console.log(data)
    // console.log(form)
    const [opciones, setOpciones] = useState({
        cuentas: [],
        empresas: [],
        estatusCompras: [],
        proveedores: [],
        proyectos: [],
        tiposImpuestos: [],
        tiposPagos: [],
    })
    // console.log(opciones)

    useEffect(() => {

        if (opcionesData) {

            setOpciones(opcionesData)
        }
    }, [opcionesData])

    const handleEmpresaChange = (event, value) => {
        if (value) {
            // Encuentra la empresa seleccionada
            const selectedEmpresa = opciones.empresas.find((empresa) => empresa.id === value.id);
            if (selectedEmpresa) {
                setForm((prevForm) => ({
                    ...prevForm,
                    empresa: selectedEmpresa.id, // Actualiza la empresa seleccionada
                    cuentas: selectedEmpresa.cuentas || [], // Carga las cuentas de la empresa seleccionada
                    cuenta: '', // Resetea la cuenta seleccionada
                }));
            }
        } else {
            // Si no hay selección, resetea empresa y cuentas
            setForm((prevForm) => ({
                ...prevForm,
                empresa: '',
                cuentas: [],
                cuenta: '',
            }));
        }
    };
    

    const handleCuentaChange = (event) => {
        const selectedCuenta = form.cuentas.find((cuenta) => cuenta.id === event.target.value);
        if (selectedCuenta) {
            setForm((prevForm) => ({
                ...prevForm,
                cuenta: selectedCuenta.id, // Actualiza el ID de la cuenta seleccionada
                factura: selectedCuenta.factura === 1, // Si requiere factura
                tipoImpuesto: selectedCuenta.id_impuesto || '', // Actualiza el tipo de impuesto
            }));
        }
    };
    
    
    

    const handleChangeCheck = () => {
        setForm({
            ...form,
            factura: !form.factura
        });
    };

    const handleChange = (e) => {
        if (e.target.name === 'empresa' && opcionesData?.empresas) {
            const cuentas = opcionesData.empresas.find((empresa) => empresa.id === e.target.value)?.cuentas || [];
            setForm((prevForm) => ({
                ...prevForm,
                [e.target.name]: e.target.value,
                cuentas,
            }));
        } else if (e.target.name === 'cuenta' && form.cuentas.length > 0) {
            const cuentaSeleccionada = form.cuentas.find((cuenta) => cuenta.id === e.target.value);
            const tipoImpuesto = cuentaSeleccionada?.id_impuesto || '';
            setForm((prevForm) => ({
                ...prevForm,
                [e.target.name]: e.target.value,
                factura: cuentaSeleccionada?.factura === 1,
                tipoImpuesto,
                disabled: true
            }));
        } else {
            setForm((prevForm) => ({
                ...prevForm,
                [e.target.name]: e.target.value,
            }));
        }
    };
    

    const handleChangeAreas = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
            partida: '',
            subarea: ''
        })
    }

    const handleChangeProveedor = (e, value) => {
        if (value && value.name) {
            setForm({
                ...form,
                proveedor: value.id,
                proveedor_nombre: value.name,
                rfc: value.rfc
            })
        }
        if (value === null) {
            setForm({
                ...form,
                proveedor: null,
                proveedor_nombre: null,
            })
        }
    }

    const handleChangeFecha = (date, tipo) => {
        setForm({
            ...form,
            [tipo]: new Date(date)
        })
    };

    const handleMoney = (e) => {
        setForm({
            ...form,
            total: e
        })
    }

    const handleMoneyComision = (e) => {
        setForm({
            ...form,
            comision: e
        })
    }

    const addNewFacturaAxios = (files, egreso) => {
        let aux = form
        aux.archivos = files
        apiPostForm(`v2/administracion/facturas`, aux, auth).then(
            (response) => {
                const { factura } = response.data

                setForm({
                    ...form,
                    facturaItem: factura,
                    archivos: files
                })
                attachFactura(egreso, factura)
            }, (error) => { }
        ).catch((error) => {
            console.error(error, 'error')
        })
    }

    const addFacturaS3 = (values, egreso) => {
        apiGet(`v1/constant/admin-proyectos`, auth).then(
            (response) => {
                const { alma } = response.data
                let filePath = `facturas/egresos/`
                let aux = []
                form.adjuntos.xml.files.forEach((file) => {
                    aux.push(file)
                })
                form.adjuntos.pdf.files.forEach((file) => {
                    aux.push(file)
                })
                let auxPromises = aux.map((file) => {
                    return new Promise((resolve, reject) => {
                        new S3(alma).uploadFile(file.file, `${filePath}${Math.floor(Date.now() / 1000)}-${file.name}`)
                            .then((data) => {
                                const { location, status } = data
                                if (status === 204) resolve({ name: file.name, url: location })
                                else reject(data)
                            })
                            .catch((error) => {
                                reject(error)
                            })
                    })
                })

                Promise.all(auxPromises).then(values => { addNewFacturaAxios(values, egreso) }).catch(err => console.error(err))
            }, (error) => { }
        ).catch((error) => {
            Swal.close()
            Swal.fire({
                icon: 'error',
                title: 'Error al adjuntar archivos',
                text: 'Ocurrio un error al adjuntar los archivos',
                showConfirmButton: false,
                timer: 1500
            })

        })
    }

    const attachFilesS3 = (files, egreso) => {
        apiPutForm(`v3/administracion/egresos/${egreso.id}/archivos/s3`, { archivos: files }, auth).then(
            (response) => {
                Swal.close()
                Swal.fire({
                    icon: 'success',
                    title: 'Archivos adjuntados',
                    text: 'Los archivos se adjuntaron correctamente',
                    showConfirmButton: false,
                    timer: 1500
                })
                if (reload) {
                    reload.reload()
                }
                handleClose()

            }, (error) => { }
        ).catch((error) => {
            Swal.close()
            Swal.fire({
                icon: 'error',
                title: 'Error al adjuntar archivos',
                text: 'Ocurrio un error al adjuntar los archivos',
                showConfirmButton: false,
                timer: 1500
            })
        })
    }

    const attachFiles = (egreso) => {
        apiGet(`v1/constant/admin-proyectos`, auth).then(
            (response) => {
                const { alma } = response.data
                let filePath = `egresos/${egreso.id}/`
                let aux = []
                form.adjuntos.pago.files.forEach((file) => {
                    aux.push(
                        {
                            name: `${filePath}pagos/${Math.floor(Date.now() / 1000)}-${file.name}`,
                            file: file,
                            tipo: 'pago'
                        }
                    )
                })
                form.adjuntos.presupuesto.files.forEach((file) => {
                    aux.push(
                        {
                            name: `${filePath}presupuestos/${Math.floor(Date.now() / 1000)}-${file.name}`,
                            file: file,
                            tipo: 'presupuesto'
                        }
                    )
                })
                let auxPromises = aux.map((file) => {
                    return new Promise((resolve, reject) => {
                        new S3(alma).uploadFile(file.file.file, file.name)
                            .then((data) => {
                                const { location, status } = data
                                if (status === 204) resolve({ name: file.name, url: location, tipo: file.tipo })
                                else reject(data)
                            })
                            .catch((error) => {
                                reject(error)
                            })
                    })
                })
                Promise.all(auxPromises).then(values => {
                    attachFilesS3(values, egreso)
                }).catch(err => console.error(err))
            }, (error) => { }
        ).catch((error) => {
            Swal.close()
            Swal.fire({
                icon: 'error',
                title: 'Error al adjuntar archivos',
                text: 'Ocurrio un error al adjuntar los archivos',
                showConfirmButton: false,
                timer: 1500
            })
        })
    }

    const attachFactura = (egreso, factura) => {

        let objeto = {
            dato: egreso.id,
            tipo: 'egreso',
            factura: factura.id
        }

        apiPutForm(`v2/administracion/facturas/attach`, objeto, auth).then(
            (response) => {
                if (form.adjuntos.pago.files.length || form.adjuntos.presupuesto.files.length) {
                    attachFiles(egreso)
                } else {
                    Swal.close()
                    Swal.fire({
                        icon: 'success',
                        title: 'compra editada con éxito',
                        text: 'Se editó la compra con éxito',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            }, (error) => {
                Swal.close()
                Swal.fire({
                    icon: 'error',
                    title: 'Error al adjuntar archivos',
                    text: 'Ocurrio un error al adjuntar los archivos',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        ).catch((error) => {
            Swal.close()
            Swal.fire({
                icon: 'error',
                title: 'Error al adjuntar archivos',
                text: 'Ocurrio un error al adjuntar los archivos',
                showConfirmButton: false,
                timer: 1500
            })
        })
    }

    const handleChangeProyecto = (e, value) => {
        if (value && value.nombre) {
            setForm({
                ...form,
                presupuestos: value.id,
                presupuestos_nombre: value.nombre,
            })
        }
        if (value === null) {
            setForm({
                ...form,
                presupuestos: null,
                presupuestos_nombre: null,
            })
        }
    }

    const validateForm = () => {
        let validar = true
        let error = {}
        if (form.proveedor === '' || form.proveedor === null) {
            error.proveedor = "Seleccione un proveedor"
            validar = false
        }
        // if (form.proyecto === '' || form.proyecto === null) {
        //     error.proyecto = "Seleccione un proyecto"
        //     validar = false
        // }
        if (form.empresa === '') {
            error.empresa = "Seleccione una empresa"
            validar = false
        }
        if (form.fecha === '' || form.fecha === null) {
            error.fecha = "Seleccione una fecha"
            validar = false
        }
        if (form.area === '') {
            error.area = "Seleccione un departamento"
            validar = false
        }
        if (form.id_partidas === '') {
            error.id_partidas = "Seleccione el tipo de gasto"
            validar = false
        }
        if (form.subarea === '') {
            error.subarea = "Seleccione una subarea"
            validar = false
        }
        if (form.cuenta === '') {
            error.cuenta = "Seleccione una cuenta"
            validar = false
        }
        if (form.descripcion === '') {
            error.descripcion = "Escriba una descripcion"
            validar = false
        }
        if (form.total === '') {
            error.total = "indique el monto total"
            validar = false
        }

        setErrores(error)
        return validar
    }

    const handleSend = () => {
        if (validateForm()) {

            Swal.fire({
                title: '¿Estás seguro?',
                text: 'Se editará el gasto',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, editar',
                cancelButtonText: 'No, cancelar',
                cancelButtonColor: '#d33',
                reverseButtons: true
            }).then((result) => {

                if (result.value) {
                    Swal.close()
                    Swal.fire({
                        title: 'editando gasto',
                        text: 'Por favor, espere...',
                        allowOutsideClick: false,
                        onBeforeOpen: () => {
                            Swal.showLoading()
                        },
                    })

                    let aux = form

                    aux.factura = form.factura ? 'Con factura' : 'Sin factura'

                    try {
                    apiPutForm(`v3/administracion/egresos/${data.id}`, form, auth)
                        .then((response) => {
                            const { egreso } = response.data
                            Swal.close()
                            Swal.fire({
                                title: 'Gasto editado con éxito',
                                allowOutsideClick: false,
                                icon: 'success',
                                text: 'Se editó el gasto con éxito',
                                showConfirmButton: false,
                                timer: 1500
                            })
                            setForm({...form, egreso })
                            // if (reload) {
                            //     reload.reload()
                            // }
                                reload();
                            handleClose()

                                // if (compra.factura) {
                                //     // Adjunto un XML
                                //     if (Object.keys(form.facturaObject).length > 0) {
                                //         if (form.facturaItem) {
                                //             //Tiene una factura guardada
                                //             attachFactura(compra, compra.factura)
                                //         } else {
                                //             //No hay factura generada
                                //             addFacturaS3(compra.id, compra)
                                //         }
                                //     } else {
                                //         //No adjunto XML
                                //         if (form.adjuntos.pago.files.length || form.adjuntos.presupuesto.files.length) {
                                //             //El compra tiene adjuntos
                                //             attachFiles(compra)
                                //         } else {
                                //             //compra generado con éxito 

                                //         }
                                //     }
                                //     Swal.close()
                                //     Swal.fire({
                                //         icon: 'success',
                                //         title: 'Adjuntos subidos con éxito',
                                //         text: 'Se subieron los adjuntos con éxito',
                                //         showConfirmButton: false,
                                //         timer: 1500
                                //     })
                                //     if (reload) {
                                //         reload.reload()
                                //     }
                                //     handleClose()
                                // } else {
                                //     // La compra no es con factura
                                //     if (form.adjuntos.pago.files.length || form.adjuntos.presupuesto.files.length) {
                                //         //La compra tiene adjuntos
                                //         attachFiles(compra)

                                //     } else {
                                //         //compra generado con éxito 
                                //         Swal.close()
                                //         Swal.fire({
                                //             icon: 'success',
                                //             title: 'compra editada con éxito',
                                //             text: 'Se editó la compra con éxito',
                                //             showConfirmButton: false,
                                //             timer: 1500
                                //         })
                                //         if (reload) {
                                //             reload.reload()
                                //         }
                                //         handleClose()
                                //     }
                                // }
                            })
                            .catch((error) => {
                                console.log(error)

                                Swal.fire({
                                    title: 'Error',
                                    text: 'No se pudo editar el gasto',
                                    icon: 'error',
                                    confirmButtonText: 'Cerrar',
                                })
                            })
                    } catch (error) {
                        console.log(error)
                    }
                }
            })
        } else {
            Swal.fire({
                title: 'Faltan campos',
                text: 'Favor de llenar todos los campos',
                icon: 'info',
                showConfirmButton: false,
                timer: 2000,
            })
        }

    }


    const handleAutocompleteChange = (event, value) => {
        if (value) {
          // Encuentra la empresa seleccionada en las opciones
          const selectedEmpresa = opciones.empresas.find((empresa) => empresa.id === value.id);
      
          if (selectedEmpresa) {
            setForm((prevForm) => ({
              ...prevForm,
              empresa: selectedEmpresa.id, // Actualiza con el ID de la empresa seleccionada
              cuentas: selectedEmpresa.cuentas, // Asigna las cuentas asociadas a la empresa
            }));
          }
        } else {
          // Si se elimina la selección, limpia los campos relacionados
          setForm((prevForm) => ({
            ...prevForm,
            empresa: '',
            cuentas: [],
          }));
        }
      };
    //   console.log(form.disabled)
    //   console.log(form)
    //   console.log(opciones)
    //   console.log(opcionesData)
    return (
        <>

        <Box>   
            <Container maxWidth="lg">
            {/* <DialogTitle  >Editar Gasto</DialogTitle> */}
            <DialogContent >
                <Grid container spacing={3}>    
                <Grid item  xs={12} sm={8} md={4}>
                    <Paper sx={{padding: 2,  textAlign: 'center', }} elevation={0} >
                            {opciones.empresas.length > 0 && (
                                <>
                                <InputLabel>Empresa</InputLabel>
                                <div> 
                                <Autocomplete
                                id="empresas-autocomplete"
                                options={opciones.empresas}   
                                name="empresa"                             
                                getOptionLabel={(option) => option.name || ''}
                                isOptionEqualToValue={(option, value) => option.id === value} // Compara por ID
                                value={opciones.empresas.find((item) => item.id === form.empresa) || null}
                                onChange={handleAutocompleteChange}
                                renderInput={(params) => (
                                    <TextField
                                    {...params}
                                    label="Empresa"
                                    variant="outlined"
                                    error={!!errores.empresa}
                                    helperText={errores.empresa || ''}
                                    />
                                )}
                                />
                            </div>
                            </>
                            )}

                        </Paper>
                </Grid>    
                <Grid item  xs={12} sm={8} md={4}>
                    <Paper sx={{ padding: 2, textAlign: 'center', }} elevation={0} >
                    {form.cuentas.length > 0 && (
                        <div>
                            <InputLabel>Cuenta</InputLabel>
                            <Select
                                name="cuenta"
                                value={form.cuenta}
                                onChange={handleCuentaChange}
                                className="w-100"
                                error={!!errores.cuenta}
                            >
                                {form.cuentas.map((item, index) => (
                                    <MenuItem key={index} value={item.id}>
                                        {item.nombre}
                                    </MenuItem>
                                ))}
                            </Select>
                        </div>
                    )}
                    </Paper>
                </Grid>
                <Grid item  xs={12} sm={8} md={4}>
                        <Paper sx={{ padding: 2, textAlign: 'center' }} elevation={0} >
                            <InputLabel>¿Lleva factura?</InputLabel>
                            <FormGroup row className="centered-form-group">
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            disabled={form.disabled}
                                            checked={!form.factura}
                                            onChange={handleChangeCheck}
                                            color="secondary"
                                            name="factura"
                                        />
                                    }
                                    label="No"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            disabled={form.disabled}
                                            checked={form.factura}
                                            onChange={handleChangeCheck}
                                            color="primary"
                                            name="factura"
                                        />
                                    }
                                    label="Sí"
                                />
                            </FormGroup>
                        </Paper>
                    </Grid>  

                </Grid>    
               
                <Grid container spacing={3}>
                    <Grid item  xs={12} sm={8} md={4}>
                        <Paper sx={{ padding: 2, textAlign: 'center', }} elevation={0} >
                        <InputLabel>Proveedor</InputLabel>
                        <Autocomplete
                                name="proveedor"
                                options={proveedores.sort((a, b) => a.name.localeCompare(b.name))} // Orden alfabético
                                getOptionLabel={(option) => option.name} // Mostrar nombre del proveedor
                                isOptionEqualToValue={(option, value) => option.id === value?.id} // Comparar por ID
                                value={proveedores.find((item) => item.id === form.proveedor) || null} // Ajustar el valor actual
                                onChange={(event, value) => handleChangeProveedor(event, value)} // Manejar cambios
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="outlined"
                                        label="Proveedor"
                                        error={!!errores.proveedor}
                                        helperText={errores.proveedor || ''}
                                    />
                                )}
                            />

                        </Paper>
                    </Grid>
                     <Grid item  xs={12} sm={8} md={4}>
                            <Paper sx={{ padding: 2, textAlign: 'center', }} elevation={0} >
                            <InputLabel>Presupuesto</InputLabel>
                            <Autocomplete
                            name="presupuestos"
                            options={presupuesto.sort((a, b) => a.nombre.localeCompare(b.nombre))} // Opciones ordenadas alfabéticamente
                            groupBy={(option) => option.nombre.charAt(0).toUpperCase()} // Agrupa por la primera letra del nombre
                            getOptionLabel={(option) => option.nombre} // Muestra el nombre del proveedor
                            onChange={(event, value) => handleChangeProyecto(event, value)} // Controlador de cambio
                            value={presupuesto.find((item) => item.id === form.presupuestos) || null} // Ajustar el valor actual
                            renderInput={(params) => (
                                <TextField 
                                {...params} 
                                variant="outlined" 
                                label="Presupuesto" 
                                error={!!errores.presupuestos}
                                helperText={errores.presupuestos || ''}
                                />
                            )}
                            />
        
                            </Paper>
                        </Grid>
                    {/* <Grid item  xs={12} sm={8} md={4}>
                        <Paper sx={{ padding: 2, textAlign: 'center', }} elevation={0} >
                        <InputLabel>Proyecto</InputLabel>
                        <Autocomplete
                        name="proyecto"
                        options={proyectos.sort((a, b) => a.nombre.localeCompare(b.nombre))} // Opciones ordenadas alfabéticamente
                        groupBy={(option) => option.nombre.charAt(0).toUpperCase()} // Agrupa por la primera letra del nombre
                        getOptionLabel={(option) => option.nombre} // Muestra el nombre del proveedor
                        onChange={(event, value) => handleChangeProyecto(event, value)} // Controlador de cambio
                        value={proyectos.find((item) => item.id === form.proyecto) || null} // Establece el valor actual
                        renderInput={(params) => (
                            <TextField 
                            {...params} 
                            variant="outlined" 
                            label="Proyecto" 
                            error={!!errores.proyecto}
                            helperText={errores.proyecto || ''}
                            />
                        )}
                        />

                        </Paper>
                    </Grid> */}
                    <Grid item  xs={12} sm={8} md={4} justifyContent="space-around">
                        <Paper sx={{ padding: 2, textAlign: 'center', }} elevation={0} >
                        {/* <InputLabel>Fecha de Compra</InputLabel> */}
                        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
                            <KeyboardDatePicker
                                disableToolbar
                                label="Fecha de compra"
                                format="dd/MM/yyyy"
                                margin="normal"
                                name="fecha"
                                value={form.fecha !== '' ? form.fecha : null}
                                placeholder="dd/mm/yyyy"
                                onChange={(e) => handleChangeFecha(e, 'fecha')}
                                className="w-100"
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                                error={errores.fecha ? true : false}
                            />
                        </MuiPickersUtilsProvider>
                        </Paper>
                    </Grid>
                            
                </Grid> 
                <Grid container spacing={3}>        
                <Grid item  xs={12} sm={8} md={4} justifyContent="space-around">
                        <Paper sx={{ padding: 2, textAlign: 'center', }} elevation={0} >
                        <InputLabel>Tipo de Pago</InputLabel>
                            <Autocomplete
                                id="tipo-pago-autocomplete"
                                options={opcionesData.tiposPagos} // Opciones de tipo de pago
                                getOptionLabel={(option) => option.name || ''} // Muestra el nombre del tipo de pago
                                isOptionEqualToValue={(option, value) => option.id === value} // Compara por ID
                                value={opcionesData.tiposPagos.find((item) => item.id === form.tipoPago) || null} // Selecciona el valor actual
                                onChange={(event, value) => {
                                    if (value) {
                                        setForm((prevForm) => ({
                                            ...prevForm,
                                            tipoPago: value.id, // Actualiza el ID del tipo de pago seleccionado
                                        }));
                                    } else {
                                        setForm((prevForm) => ({
                                            ...prevForm,
                                            tipoPago: '', // Limpia el valor si se elimina la selección
                                        }));
                                    }
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Tipo de Pago"
                                        variant="outlined"
                                        error={!!errores.tipoPago} // Muestra el error si existe
                                        helperText={errores.tipoPago || ''} // Muestra el texto de ayuda
                                    />
                                )}
                            />

                        </Paper>
                    </Grid>   
                <Grid item  xs={12} sm={8} md={4} justifyContent="space-around">
                            <Paper sx={{ padding: 2, textAlign: 'center', }} elevation={0} >
                                {opcionesData.tiposImpuestos.length > 0 && (
                                <>
                                <InputLabel>Tipo de Impuesto</InputLabel>
                                    <Autocomplete
                                        id="tipo-impuesto-autocomplete"
                                        options={opcionesData.tiposImpuestos} // Opciones para el tipo de impuesto
                                        getOptionLabel={(option) => option.name || ''} // Muestra el nombre del tipo de impuesto
                                        isOptionEqualToValue={(option, value) => option.id === value} // Compara por ID
                                        value={opcionesData.tiposImpuestos.find((item) => item.id === form.tipoImpuesto) || null} // Selecciona el valor actual
                                        onChange={(event, value) => {
                                            if (value) {
                                                setForm((prevForm) => ({
                                                    ...prevForm,
                                                    tipoImpuesto: value.id, // Actualiza el ID del tipo de impuesto seleccionado
                                                }));
                                            } else {
                                                setForm((prevForm) => ({
                                                    ...prevForm,
                                                    tipoImpuesto: '', // Limpia el valor si se elimina la selección
                                                }));
                                            }
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Tipo de Impuesto"
                                                variant="outlined"
                                                error={!!errores.tipoImpuesto} // Muestra el error si existe
                                                helperText={errores.tipoImpuesto || ''} // Muestra el texto de ayuda
                                            />
                                        )}
                                    />

                                </>
                            )}
                            </Paper>
                        </Grid>
                    <Grid item  xs={12} sm={8} md={4} justifyContent="space-around">
                        <Paper sx={{ padding: 2, textAlign: 'center', }} elevation={0} >
                        {departamentos.length > 0 && (
                            <>
                                <InputLabel>Departamento</InputLabel>
                                <Autocomplete
                                    name="area"
                                    options={departamentos.sort((a, b) => a.nombreArea.localeCompare(b.nombreArea))} // Ordena alfabéticamente por nombreArea
                                    groupBy={(option) => option.nombreArea.charAt(0).toUpperCase()} // Agrupa por la primera letra de nombreArea
                                    getOptionLabel={(option) => option.nombreArea || ''} // Muestra el nombre del área
                                    isOptionEqualToValue={(option, value) => option.id_area === value?.id_area} // Compara por ID del área
                                    value={departamentos.find((item) => item.id_area === form.area) || null} // Selecciona el valor actual del formulario
                                    onChange={(event, value) => {
                                        setForm((prevForm) => ({
                                        ...prevForm,
                                        area: value ? value.id_area : '', // Actualiza el ID del área seleccionada
                                        }));
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                        {...params}
                                        variant="outlined"
                                        label="Departamento"
                                        error={!!errores.area}
                                        helperText={errores.area || ''}
                                        />
                                    )}
                                    sx={{ width: '100%' }} // Ajusta el ancho del componente
                                    />

                            </>
                        )}
                        </Paper>
                    </Grid>                 
                    
                </Grid> 
                <Grid container spacing={3}>
                    <Grid item  xs={12} sm={8} md={4} justifyContent="space-around">
                        <Paper sx={{ padding: 2, textAlign: 'center', }} elevation={0} >
                        {departamentos.length > 0 && form.area !== '' && (
                            <>
                                <InputLabel>Tipo de Gasto</InputLabel>
                                <Autocomplete
                                    name="id_partidas"
                                    options={
                                        departamentos
                                        .find((item) => item.id_area === form.area)?.partidas || []
                                    } // Filtra partidas según el área seleccionada
                                    getOptionLabel={(option) => option.nombre || ''} // Muestra el nombre de la partida
                                    isOptionEqualToValue={(option, value) => option.id === value?.id} // Compara las partidas por ID
                                    value={
                                        departamentos
                                        .find((item) => item.id_area === form.area)
                                        ?.partidas.find((partida) => partida.id === form.id_partidas) || null
                                    } // Establece el valor seleccionado
                                    onChange={(event, value) => {
                                        setForm((prevForm) => ({
                                        ...prevForm,
                                        id_partidas: value ? value.id : '', // Actualiza el ID de la partida seleccionada
                                        }));
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                        {...params}
                                        variant="outlined"
                                        label="Partida"
                                        error={!!errores.id_partidas}
                                        helperText={errores.id_partidas || ''}
                                        />
                                    )}
                                    />

                            </>
                        )}
                        </Paper>
                    </Grid>
                <Grid item  xs={12} sm={8} md={4} justifyContent="space-around">
                        <Paper sx={{ padding: 2, textAlign: 'center', }} elevation={0} >
                            {form.area && form.id_partidas !== '' && (
                                <>
                                    <InputLabel>Tipo de Subgasto</InputLabel>
                                    <Autocomplete
                                        name="subarea"
                                        options={
                                            departamentos
                                            .find((item) => item.id_area === form.area) // Filtra por área seleccionada
                                            ?.partidas.find((item) => item.id === form.id_partidas) // Filtra por partida seleccionada
                                            ?.subpartidas || [] // Obtiene las subpartidas o un array vacío
                                        }
                                        getOptionLabel={(option) => option.nombre || ''} // Muestra el nombre de la subpartida
                                        isOptionEqualToValue={(option, value) => option.id === value?.id} // Compara las opciones por ID
                                        value={
                                            departamentos
                                            .find((item) => item.id_area === form.area) // Encuentra el área seleccionada
                                            ?.partidas.find((item) => item.id === form.id_partidas) // Encuentra la partida seleccionada
                                            ?.subpartidas.find((subpartida) => subpartida.id === form.subarea) || null // Encuentra la subpartida seleccionada
                                        }
                                        onChange={(event, value) => {
                                            setForm((prevForm) => ({
                                            ...prevForm,
                                            subarea: value ? value.id : '', // Actualiza el ID de la subpartida seleccionada
                                            }));
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                            {...params}
                                            variant="outlined"
                                            label="Subárea"
                                            error={!!errores.subarea}
                                            helperText={errores.subarea || ''}
                                            />
                                        )}
                                        />

                                </>
                            )}
                        </Paper>
                    </Grid>
                    <Grid item  xs={12} sm={8} md={4} justifyContent="space-around">
                        <Paper sx={{ padding: 2, textAlign: 'center', }} elevation={0} >
                        <InputLabel>Total</InputLabel>
                            <CurrencyTextField
                                label="Total"
                                variant="standard"
                                value={form.total}
                                currencySymbol="$"
                                outputFormat="number"
                                modifyValueOnWheel={false}
                                onChange={(event, value) => handleMoney(value)}
                                className="form-control"
                                error={errores.total ? true : false}
                            />                        
                        </Paper>
                    </Grid>
                    </Grid>


                <Grid container spacing={3}>

                    <Grid item  xs={12} sm={8} md={4}>
                        <Paper sx={{ padding: 2, textAlign: 'center', }} elevation={0} >
                        <InputLabel>Comisión</InputLabel>
                            <CurrencyTextField
                            label="Comisión"
                            variant="standard"
                            value={form.comision}
                            currencySymbol="$"
                            modifyValueOnWheel={false}
                            outputFormat="number"
                            onChange={(event, value) => handleMoneyComision(value)}
                            className="form-control"
                        />
                        </Paper>
                    </Grid>

                    <Grid item  xs={12} sm={8} md={4}>
                            <Paper sx={{ padding: 2, textAlign: 'center', }} elevation={0} >
                            <InputLabel>Descripción</InputLabel>
                            <TextField
                                name="descripcion"
                                label="Descripción"
                                type="text"
                                defaultValue={form.descripcion}
                                onChange={handleChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                multiline
                                className="w-100"
                                error={errores.descripcion ? true : false}
                            />
                            </Paper>
                        </Grid>                        
                    </Grid>                 

            </DialogContent>

            <DialogActions>
                <Button style={{ backgroundColor: '#F96D49', color: '#fff', '&:hover': { backgroundColor: '#F96D49', }, }} variant="contained"  onClick={() => handleClose()}>
                    Cancelar
                    </Button>
                {/* <Button color="primary" variant="contained" onClick={e => handleSend(form)}>
                    Enviar
                </Button> */}
                <Button style={{ backgroundColor: '#0A3E27', color: '#fff', '&:hover': { backgroundColor: '#0A3E27', }, }} variant="contained" onClick={e => handleSend(form)}>
                editar
                </Button>
            </DialogActions>

            </Container>
            </Box>


        </>
    )
}