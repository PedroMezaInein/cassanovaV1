

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import S3 from 'react-aws-s3';
import Swal from 'sweetalert2';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import InputLabel from '@mui/material/InputLabel';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
// import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import Typography from '@mui/material/Typography';
import Button from '@material-ui/core/Button';

// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import CurrencyTextField from '@unicef/material-ui-currency-textfield';

import { apiPostForm, apiGet, apiPutForm } from '../../../functions/api';
import Style from './../../Administracion/Egresos/Modales/CrearEgreso.module.css';
// import dayjs from 'dayjs';

export default function EditarVenta(props) {

    const { opcionesData, handleClose, reload, data } = props
    const departamentos = useSelector(state => state.opciones.ventas) || [];
    const proyectos = useSelector(state => state.opciones.proyectos) || [];
    const areaCompras = useSelector(state => state.opciones.compras) || [];

    const [errores, setErrores] = useState({})

    const auth = useSelector((state) => state.authUser.access_token);

    // let valorArea = areaCompras.find((element) => parseInt(element.id_area) === data.area.id)
    // let valorPartida = valorArea.partidas.find((element) => parseInt(element.id) === data.partida_id)
    // let valorSubPartida = valorPartida.subpartidas.find((element) => parseInt(element.id) === data.subarea.id)


    // console.log(data)


    const [form, setForm] = useState({
        adjuntos: {
            pago: { files: [], value: '' },
            pdf: { files: [], value: '' },
            presupuesto: { files: [], value: '' },
            xml: { files: [], value: '' },
        },
        area: '',
        banco: '',
        cuenta: '',
        cuentas: [],
        descripcion: '',
        empresa: '',
        proveedor: '',
        proveedor_nombre: '',
        estatusCompra: 2,
        factura: false,

        facturaItem: '',
        facturaObject: {},
        rfc: '',
        // fecha: data.created_at ? dayjs(data.created_at) : null,
        partida: '',
        numCuenta: "",
        proyecto: '',
        proyecto_nombre: '',
        subarea: '',
        tipo: 0,
        tipoImpuesto: 1,
        tipoPago: 4,
        total: '',
    });


    useEffect(() => {
        // console.log('Data al abrir:', data);
    }, [data]);
    const [opciones, setOpciones] = useState({
        cuentas: [],
        empresas: [],
        clientes: [],
        estatusCompras: [],
        proveedores: [],
        proyectos: [],
        tiposImpuestos: [],
        tickets: [],
        rfc: [],
        tiposPagos: [],
    })
    // console.log(opciones)

    useEffect(() => {
        if (data && opciones.clientes.length > 0 && proyectos.length > 0 && departamentos.length > 0) {
            const partidaId = departamentos
                ?.find((area) => area.nombreArea === data.area)
                ?.partidas?.find((partida) => partida.nombre === data.partida)?.id || '';

            const subareaId = departamentos
                ?.find((area) => area.nombreArea === data.area)
                ?.partidas?.find((partida) => partida.nombre === data.partida)
                ?.subpartidas?.find((subarea) => subarea.nombre === data.subarea)?.id || '';
            // console.log(data)
            //             console.log(opciones.empresas)

            const cuentaId = opciones.empresas
                ?.find((e) => e.name === data.empresa)
                ?.cuentas?.find((c) => c.id === data.data?.cuenta?.id)?.id || '';

            setForm({
                adjuntos: {
                    pago: { files: [], value: '' },
                    pdf: { files: [], value: '' },
                    presupuesto: { files: [], value: '' },
                    xml: { files: [], value: '' },
                },
                area: departamentos.find(d => d.nombreArea === data.area)?.id_area || '',
                banco: 0,
                cuenta: cuentaId,
                cuentas: [],
                descripcion: data.descripcion || '',
                empresa: opciones.empresas.find(e => e.name === data.empresa)?.id || '',
                proveedor: opciones.clientes.find(c => c.name === data.cliente)?.id || '',
                proveedor_nombre: data.cliente || '',
                estatusCompra: 2,
                factura: data.factura_icon === 'Con factura',
                facturaItem: '',
                facturaObject: {},
                rfc: opciones.clientes.find(e => e.name === data.cliente)?.rfc || '',
                partida: partidaId,   // ✅ Usas el id real obtenido
                numCuenta: '',
                proyecto: proyectos.find(p => p.nombre === data.proyecto)?.id || '',
                proyecto_nombre: data.proyecto || '',
                subarea: subareaId,  // ✅ Usas el id real obtenido
                tipo: 0,
                tipoImpuesto: 1,
                tipoPago: 4,
                total: data.monto.replace(/[^0-9.]+/g, "") || '',
                fecha: data.fecha || '',

            });
        }
    }, [data, opciones, departamentos, proyectos]);




    useEffect(() => {
        if (opcionesData && Object.keys(opcionesData).length > 0) {
            setOpciones({
                cuentas: opcionesData.cuentas || [],
                empresas: opcionesData.empresas || [],
                clientes: opcionesData.clientes || [],
                estatusCompras: opcionesData.estatusCompras || [],
                proveedores: opcionesData.proveedores || [],
                proyectos: opcionesData.proyectos || [],
                tiposImpuestos: opcionesData.tiposImpuestos || [],
                tickets: opcionesData.tickets || [],
                tiposPagos: opcionesData.tiposPagos || [],
            });
        }
    }, [opcionesData]);





    const handleChangeCheck = () => {
        setForm({
            ...form,
            factura: !form.factura
        });
    };
    const handleChange = (e) => {
        if (e.target.name === 'empresa') {
            const empresa = opciones.empresas.find(empresa => empresa.id === e.target.value);
            setForm({
                ...form,
                [e.target.name]: e.target.value,
                cuentas: empresa?.cuentas || [],
            });
        } else {
            setForm({
                ...form,
                [e.target.name]: e.target.value
            });
        }

    };



    const handleChangeTicket = (e, value) => {
        if (value && value.name) {
            setForm({
                ...form,
                tickets: value.id,
                tickets_nombre: value.name,
            })
        }
        if (value === null) {
            setForm({
                ...form,
                tickets: null,
                tickets_nombre: null,
            })
        }
    }

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
                let filePath = `facturas/venta/`
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
        apiPutForm(`v3/administracion/egresos/${egreso.id}/archivos/s3`, { archivos: files }, auth)
            .then(() => {
                Swal.close();
                Swal.fire({
                    icon: 'success',
                    title: 'Archivos adjuntados',
                    text: 'Los archivos se adjuntaron correctamente',
                    showConfirmButton: false,
                    timer: 1500,
                });
            })
            .then((response) => {
                // console.log("Venta que regresa la API:", response.data.venta);
            })
            .catch((error) => {
                console.error(error);
                Swal.close();
                Swal.fire({
                    icon: 'error',
                    title: 'Error al adjuntar archivos',
                    text: 'Ocurrió un error al adjuntar los archivos',
                    showConfirmButton: false,
                    timer: 1500,
                });
            })
            .finally(() => {
                if (reload) reload.reload();
                handleClose();
            });


    };

    const attachFiles = (venta) => {
        apiGet(`v1/constant/admin-proyectos`, auth)
            .then((response) => {
                const { alma } = response.data;
                const filePath = `ventas/${venta.id}/`;
                const aux = [];

                form.adjuntos.pago.files.forEach((file) => {
                    aux.push({
                        name: `${filePath}pagos/${Math.floor(Date.now() / 1000)}-${file.name}`,
                        file,
                        tipo: 'pago',
                    });
                });

                form.adjuntos.presupuesto.files.forEach((file) => {
                    aux.push({
                        name: `${filePath}presupuestos/${Math.floor(Date.now() / 1000)}-${file.name}`,
                        file,
                        tipo: 'presupuesto',
                    });
                });

                const auxPromises = aux.map((file) => {
                    return new Promise((resolve, reject) => {
                        new S3(alma)
                            .uploadFile(file.file.file, file.name)
                            .then((data) => {
                                const { location, status } = data;
                                if (status === 204) resolve({ name: file.name, url: location, tipo: file.tipo });
                                else reject(data);
                            })
                            .catch(reject);
                    });
                });

                return Promise.all(auxPromises);
            })
            .then((values) => attachFilesS3(values, venta))
            .catch((error) => {
                console.error(error);
                Swal.close();
                Swal.fire({
                    icon: 'error',
                    title: 'Error al adjuntar archivos',
                    text: 'Ocurrió un error al adjuntar los archivos',
                    showConfirmButton: false,
                    timer: 1500,
                });
                if (reload) reload.reload();
                handleClose();
            });
    };


    const attachFactura = (egreso, factura) => {

        let objeto = {
            dato: egreso.id,
            tipo: 'venta',
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
                proyecto: value.id,
                proyecto_nombre: value.nombre,
            })
        }
        if (value === null) {
            setForm({
                ...form,
                proyecto: null,
                proyecto_nombre: null,
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
        if (form.proyecto === '' || form.proyecto === null) {
            error.proyecto = "Seleccione un proyecto"
            validar = false
        }
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
        if (form.partida === '') {
            error.partida = "Seleccione el tipo de gasto"
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
        if (!validateForm()) {
            Swal.fire({
                title: 'Faltan campos',
                text: 'Favor de llenar todos los campos',
                icon: 'info',
                showConfirmButton: false,
                timer: 2000,
            });
            return;
        }

        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Se editará la venta',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, editar',
            cancelButtonText: 'No, cancelar',
            cancelButtonColor: '#d33',
            reverseButtons: true,
        }).then((result) => {
            if (!result.value) return;

            Swal.close();
            Swal.fire({
                title: 'Editando venta',
                text: 'Por favor, espere...',
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading(),
            });


            const payload = {
                empresa: Number(form.empresa),
                cliente: Number(form.proveedor),
                proyecto: Number(form.proyecto),
                area: parseInt(form.area) || null,
                subarea: parseInt(form.subarea) || null,
                partida: parseInt(form.partida) || null,
                cuenta: parseInt(form.cuenta) || null,
                tipoImpuesto: parseInt(form.tipoImpuesto) || null,
                estatusCompra: parseInt(form.estatusCompra) || null,
                tipoPago: parseInt(form.tipoPago) || null,
                total: Number(form.total),
                factura: form.factura ? 'Con factura' : 'Sin factura',
                fecha: form.fecha,
                descripcion: form.descripcion,
                contrato: form.contrato ? parseInt(form.contrato) : null,
                tickets: form.tickets ? parseInt(form.tickets) : null,
                rfc: form.rfc || '',
                total: Number(form.total),   
                comision: Number(form.comision) || 0,
            };


            // 🚀 Llamada limpia
            apiPutForm(`v2/proyectos/ventas/area/${data.id}`, payload, auth)
                .then((response) => {
                    const { venta } = response.data;
                    // console.log('Venta editada:', venta);

                    // 🔑 Guardamos venta por si se usa después
                    setForm({ ...form, venta });

                    // 🔍 Lógica de adjuntos / XML igual
                    const tieneXML = Object.keys(form.facturaObject).length > 0;
                    const tieneAdjuntos = form.adjuntos.pago.files.length > 0 || form.adjuntos.presupuesto.files.length > 0;

                    if (venta.factura) {
                        if (tieneXML) {
                            if (form.facturaItem) {
                                attachFactura(venta, venta.factura);
                            } else {
                                addFacturaS3(venta.id, venta);
                            }
                        } else if (tieneAdjuntos) {
                            attachFiles(venta);
                        } else {
                            cerrarConExito();
                        }
                    } else {
                        if (tieneAdjuntos) {
                            attachFiles(venta);
                        } else {
                            cerrarConExito();
                        }
                    }
                })
                .catch((error) => {
                    console.error(error);
                    Swal.fire({
                        title: 'Error',
                        text: 'No se pudo editar la venta',
                        icon: 'error',
                        confirmButtonText: 'Cerrar',
                    });
                });
        });

        function cerrarConExito() {
            Swal.close();
            Swal.fire({
                icon: 'success',
                title: 'Venta editada con éxito',
                text: 'Se editó la venta correctamente',
                showConfirmButton: false,
                timer: 1500,
            });
            setTimeout(() => {
                if (typeof reload === 'function') reload();
                handleClose();
            }, 1600);
        }

    };
    // console.log("form.proyecto:", form.proyecto);
    // console.log("opciones.proyectos:", opciones.proyectos);
    // console.log(
    //     "Proyecto seleccionado:",
    //     opciones.proyectos.find(p => p.id === form.proyecto)
    // );

    if (!form) return <Typography sx={{ p: 2 }}>Cargando información...</Typography>;
    // console.log(form)

    return (
        <Box>
            <Container maxWidth="lg">
                <DialogTitle>Editar Venta</DialogTitle>
                <DialogContent>
                    <Grid container spacing={3} alignItems="center">



                        {/* Cliente */}
                        <Grid item xs={12} md={4}>
                            <Paper sx={{ p: 2 }} elevation={0}>
                                <Autocomplete
                                    name="cliente"
                                    options={opciones.clientes}
                                    getOptionLabel={(option) => option?.name || ''}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    value={opciones.clientes.find(c => c.id === form.proveedor) || null}
                                    onChange={(e, value) => handleChangeProveedor(e, value)}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Cliente" error={!!errores.clientes} fullWidth />
                                    )}
                                />



                            </Paper>
                        </Grid>

                        {/* Proyecto */}
                        <Grid item xs={12} md={4}>
                            <Paper sx={{ p: 2 }} elevation={0}>
                                <Autocomplete
                                    name="proyecto"
                                    options={proyectos}
                                    getOptionLabel={(option) => option?.nombre || ''}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    value={proyectos.find(p => p.id === form.proyecto) || null}
                                    onChange={(e, value) => handleChangeProyecto(e, value)}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Proyecto"
                                            error={!!errores.proyecto}
                                            fullWidth
                                        />
                                    )}
                                />
                            </Paper>
                        </Grid>
                        {/* ¿Lleva factura? */}
                        <Grid item xs={12} md={4}>
                            <Paper sx={{ p: 2 }} elevation={0}>
                                <InputLabel sx={{ mb: 1 }}>¿Lleva factura?</InputLabel>
                                <FormGroup row>
                                    <FormControlLabel
                                        disabled
                                        control={<Checkbox checked={!form.factura} onChange={handleChangeCheck} color="secondary" name="factura" />}
                                        label="No"
                                    />
                                    <FormControlLabel
                                        disabled
                                        control={<Checkbox checked={form.factura} onChange={handleChangeCheck} color="primary" name="factura" />}
                                        label="Sí"
                                    />

                                </FormGroup>
                            </Paper>
                        </Grid>

                        {/* RFC o espacio vacío */}
                        <Grid item xs={12} md={4}>
                            <Paper sx={{ p: 2 }} elevation={0}>
                                <Autocomplete
                                    options={opciones.rfc || []} // debe ser un array de strings o de objetos con `label`
                                    value={form.rfc || null}
                                    onChange={(e, value) => handleChange({ target: { name: 'rfc', value } })}
                                    freeSolo
                                    disabled={!form.factura} // deshabilita si no hay factura
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="RFC"
                                            variant="outlined"
                                            fullWidth
                                            InputLabelProps={{ shrink: true }}
                                            disabled={!form.factura} // también en el input
                                        />
                                    )}
                                />
                            </Paper>
                        </Grid>




                        {/* EMPRESA */}
                        <Grid item xs={12} md={4}>
                            <Paper sx={{ p: 2 }} elevation={0}>
                                <Autocomplete
                                    name="empresa"
                                    options={opciones.empresas}
                                    getOptionLabel={(option) => option?.name || ''}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    value={opciones.empresas.find(e => e.id === form.empresa) || null}
                                    onChange={(e, value) => handleChange({ target: { name: 'empresa', value: value?.id || '' } })}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Empresa"
                                            variant="outlined"
                                            fullWidth
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    )}
                                />
                            </Paper>
                        </Grid>



                        {/* Departamento */}
                        <Grid item xs={12} md={4}>
                            <Paper sx={{ p: 2 }} elevation={0}>
                                <Autocomplete
                                    options={departamentos}
                                    getOptionLabel={(option) => option?.nombreArea || ''}
                                    isOptionEqualToValue={(option, value) => option.id_area === value.id_area}
                                    value={departamentos.find((d) => d.id_area === form.area) || null}
                                    onChange={(e, value) => handleChangeAreas({ target: { name: 'area', value: value?.id_area || '' } })}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Departamento"
                                            variant="outlined"
                                            fullWidth
                                            error={!!errores.area}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    )}
                                />
                            </Paper>
                        </Grid>

                        {/* Tipo de Gasto */}
                        <Grid item xs={12} md={4}>

                            <Paper sx={{ p: 2 }} elevation={0}>
                                <Autocomplete
                                    name="partida"
                                    options={
                                        departamentos
                                            .find((item) => item.id_area === form.area)?.partidas || []
                                    } // Filtra partidas según el área seleccionada
                                    getOptionLabel={(option) => option.nombre || ''} // Muestra el nombre de la partida
                                    isOptionEqualToValue={(option, value) => option.id === value?.id} // Compara las partidas por ID
                                    value={
                                        departamentos
                                            .find((item) => item.id_area === form.area)
                                            ?.partidas.find((partida) => partida.id === form.partida) || null
                                    } // Establece el valor seleccionado
                                    onChange={(event, value) => {
                                        setForm((prevForm) => ({
                                            ...prevForm,
                                            partida: value ? value.id : '', // Actualiza el ID de la partida seleccionada
                                        }));
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="outlined"
                                            label=" Tipo de Gasto"
                                            error={!!errores.partida}
                                            helperText={errores.partida || ''}
                                        />
                                    )}
                                />

                            </Paper>

                        </Grid>
                        <Grid item xs={12} sm={8} md={4}>
                            <Paper sx={{ padding: 2, textAlign: 'center' }} elevation={0}>
                                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
                                    <KeyboardDatePicker
                                        disableToolbar
                                        variant="inline"
                                        inputVariant="outlined"         // 🔥 Igual que Autocomplete
                                        label="Fecha de compra"
                                        format="dd/MM/yyyy"
                                        name="fecha"
                                        value={form.fecha !== '' ? form.fecha : null}
                                        placeholder="dd/mm/yyyy"
                                        onChange={(e) => handleChangeFecha(e, 'fecha')}
                                        fullWidth
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                        }}
                                        error={!!errores.fecha}
                                        helperText={errores.fecha || ''}
                                    />
                                </MuiPickersUtilsProvider>
                            </Paper>
                        </Grid>

                        {/* Tipo de Subgasto */}
                        <Grid item xs={12} md={4}>
                            <Paper sx={{ p: 2 }} elevation={0}>
                                <Autocomplete
                                    name="subarea"
                                    options={
                                        departamentos
                                            .find((item) => item.id_area === form.area) // Filtra por área seleccionada
                                            ?.partidas.find((item) => item.id === form.partida) // Filtra por partida seleccionada
                                            ?.subpartidas || [] // Obtiene las subpartidas o un array vacío
                                    }
                                    getOptionLabel={(option) => option.nombre || ''} // Muestra el nombre de la subpartida
                                    isOptionEqualToValue={(option, value) => option.id === value?.id} // Compara las opciones por ID
                                    value={
                                        departamentos
                                            .find((item) => item.id_area === form.area) // Encuentra el área seleccionada
                                            ?.partidas.find((item) => item.id === form.partida) // Encuentra la partida seleccionada
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
                                            label="Tipo de Subgasto "
                                            error={!!errores.subarea}
                                            helperText={errores.subarea || ''}
                                        />
                                    )}
                                />

                            </Paper>
                        </Grid>


                        {/* Cuenta */}
                        <Grid item xs={12} md={4}>
                            <Paper sx={{ p: 2 }} elevation={0}>
                                <Autocomplete
                                    options={
                                        opciones.empresas.find((e) => e.id === form.empresa)?.cuentas || []
                                    }
                                    getOptionLabel={(option) => option?.nombre || ''}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    value={
                                        opciones.empresas
                                            .find((e) => e.id === form.empresa)
                                            ?.cuentas.find((c) => c.id === form.cuenta) || null
                                    }
                                    onChange={(e, value) => handleChange({ target: { name: 'cuenta', value: value?.id || '' } })}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Cuenta"
                                            variant="outlined"
                                            fullWidth
                                            error={!!errores.cuenta}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    )}
                                />
                            </Paper>
                        </Grid>

                        {/* Contrato */}
                        <Grid item xs={12} md={4}>
                            {opciones.clientes.length > 0 && (
                                <Paper sx={{ p: 2 }} elevation={0}>
                                    <Autocomplete
                                        options={
                                            (opciones.clientes?.find((cli) => cli.id === form.proveedor)?.contratos) || []
                                        }
                                        getOptionLabel={(option) => option?.nombre || ''}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        value={
                                            opciones.clientes
                                                ?.find((cli) => cli.id === form.proveedor)
                                                ?.contratos?.find((c) => c.id === form.contrato) || null
                                        }
                                        onChange={(e, value) => handleChange({ target: { name: 'contrato', value: value?.id || '' } })}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Contrato"
                                                variant="outlined"
                                                fullWidth
                                                error={!!errores.contrato}
                                                InputLabelProps={{ shrink: true }}
                                            />
                                        )}
                                    />

                                </Paper>
                            )}
                        </Grid>

                        {/* Tipo de Pago */}
                        <Grid item xs={12} md={4}>
                            {opciones.tiposPagos.length > 0 && (
                                <Paper sx={{ p: 2 }} elevation={0}>
                                    <Autocomplete
                                        options={opciones.tiposPagos}
                                        getOptionLabel={(option) => option?.name || ''}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        value={opciones.tiposPagos.find((p) => p.id === form.tipoPago) || null}
                                        onChange={(e, value) => handleChange({ target: { name: 'tipoPago', value: value?.id || '' } })}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Tipo de Pago"
                                                variant="outlined"
                                                fullWidth
                                                InputLabelProps={{ shrink: true }}
                                            />
                                        )}
                                    />
                                </Paper>
                            )}
                        </Grid>

                        {/* Tipo de Impuesto */}
                        <Grid item xs={12} md={4}>
                            {opciones.tiposImpuestos.length > 0 && (
                                <Paper sx={{ p: 2 }} elevation={0}>
                                    <Autocomplete
                                        options={opciones.tiposImpuestos}
                                        getOptionLabel={(option) => option?.name || ''}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        value={opciones.tiposImpuestos.find((i) => i.id === form.tipoImpuesto) || null}
                                        onChange={(e, value) => handleChange({ target: { name: 'tipoImpuesto', value: value?.id || '' } })}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Tipo de Impuesto"
                                                variant="outlined"
                                                fullWidth
                                                InputLabelProps={{ shrink: true }}
                                            />
                                        )}
                                    />
                                </Paper>
                            )}
                        </Grid>


                        <Grid item xs={12} md={4}>
                            <Paper sx={{ p: 2 }} elevation={0}>
                                <CurrencyTextField
                                    label="Total"
                                    variant="standard"
                                    value={form.total}
                                    currencySymbol="$"
                                    outputFormat="number"
                                    modifyValueOnWheel={false}
                                    onChange={(event, value) => handleMoney(value)}
                                    error={!!errores.total}
                                    fullWidth
                                />
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Paper sx={{ p: 2 }} elevation={0}>
                                <CurrencyTextField
                                    label="Comisión"
                                    variant="standard"
                                    value={form.comision}
                                    currencySymbol="$"
                                    outputFormat="number"
                                    modifyValueOnWheel={false}
                                    onChange={(event, value) => handleMoneyComision(value)}
                                    fullWidth
                                />
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Paper sx={{ p: 2 }} elevation={0}>
                                <TextField
                                    name="descripcion"
                                    label="Descripción"
                                    value={form.descripcion}
                                    onChange={handleChange}
                                    fullWidth
                                    variant="standard"
                                    multiline
                                    error={!!errores.descripcion}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Paper>
                        </Grid>


                    </Grid>
                </DialogContent>

                <DialogActions>
                    <Button style={{ backgroundColor: '#F96D49', color: '#fff', '&:hover': { backgroundColor: '#F96D49', }, }} variant="contained" onClick={() => handleClose()}>
                        Cancelar
                    </Button>

                    <Button style={{ backgroundColor: '#0A3E27', color: '#fff', '&:hover': { backgroundColor: '#0A3E27', }, }} variant="contained" onClick={e => handleSend(form)}>
                        editar
                    </Button>
                </DialogActions>
            </Container>
        </Box >
    );

}