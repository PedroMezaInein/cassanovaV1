import React, { useState, useEffect,useCallback } from 'react';
import { useSelector } from 'react-redux'

import { apiPutForm, apiPostForm } from '../../../../functions/api'


import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { makeStyles } from '@material-ui/core/styles';
// import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import CurrencyTextField from '@unicef/material-ui-currency-textfield'
import {  printResponseErrorAlert } from '../../../../functions/alert'
import Swal from 'sweetalert2'
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Modal } from './../../../../components/singles'
import CrearProveedor from './CrearProveedor' 

import { useDropzone } from "react-dropzone";

import Button from '@material-ui/core/Button';
import { es } from 'date-fns/locale'
import DateFnsUtils from '@date-io/date-fns';
import Select from '@mui/material/Select';
import { Dialog, DialogActions, DialogContent, DialogTitle, Grid, Paper,Box,InputLabel  } from '@mui/material';
import Container from '@material-ui/core/Container';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Autocomplete from '@material-ui/lab/Autocomplete';
// import Style from './AprobarSolicitud.module.css'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Typography from '@material-ui/core/Typography';

import './../../../../styles/_adjuntosRequisicion.scss'

const useStyles = makeStyles((theme) => ({
    textField: {
        width: '75%',
    },
}));

export default function Convertir(props) { 
    const { data, handleClose, reload, opciones, estatusCompras ,getOpciones} = props
    const departamentos = useSelector(state => state.opciones.areas)
    const proveedores = useSelector((state) => state.opciones.proveedores);
    const auth = useSelector(state => state.authUser)
    const [nuevoProveedor, setNuevoProveedor] = useState(false)
      const [files, setFiles] = useState({
            adjuntos: null,
          });
    
    
    // console.log(data.fecha)
    // console.log(form)
    // console.log(opciones)

      useEffect(() => {
            // console.log('Data:', data);
            // console.log('Departamentos:', departamentos);
        
            if (data && opciones) {
                // Encuentra la empresa seleccionada
                const empresaSeleccionada = opciones.empresas?.find((empresa) => empresa.nombre === data.empresa);
                const cuentas = empresaSeleccionada?.cuentas || []; // Obtén las cuentas de la empresa seleccionada
        
                // Encuentra la cuenta seleccionada
                const cuentaSeleccionada = cuentas?.find((cuenta) => cuenta.nombre === data.cuenta);
        
                // Procesa las demás relaciones
                const area = departamentos?.find((area) => area.nombreArea === data.data?.departamento.nombre)?.id_area || '';
                const id_partidas = departamentos
                    ?.find((area) => area.nombreArea === data.data?.departamento.nombre)
                    ?.partidas?.find((partida) => partida.nombre === data.data?.gasto.nombre)?.id || '';
                const subarea = departamentos
                    ?.find((area) => area.nombreArea === data.data?.departamento.nombre)
                    ?.partidas?.find((partida) => partida.nombre === data.data?.gasto.nombre)
                    ?.subpartidas?.find((subarea) => subarea.nombre === data.data?.subarea)?.id || '';
                const proveedor = proveedores?.find((proveedor) => proveedor.name === data.data?.proveedor)?.id || '';
                // const proyecto = proyectos?.find((proyecto) => proyecto.nombre === data.proyecto)?.id || '';
                const tipoImpuesto = opciones.tiposImpuestos?.find((impuesto) => impuesto.id === data?.data?.tipo_impuesto.id)?.id || '';
                // const tipoPago = opciones.tiposPagos?.find((pago) => pago.id === data?.tipo_pago.id)?.id || '';
                // console.log(data?.data?.requisicion?.presu?.id)
                // console.log(data)
        
                // console.log('Processed Values:', {
                //     area,
                //     cuenta: cuentaSeleccionada?.id || '',
                //     id_partidas,
                //     subarea,
                //     proveedor,
                //     tipoImpuesto,
                //     // tipoPago,
                //     cuentaSeleccionada,
                // });
        
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
                    subarea,
                    monto: parseFloat(data.monto.replace(/[^\d.-]/g, '')) || 0,
                    tipoImpuesto : cuentaSeleccionada?.id_impuesto || '',
                    // tipoPago,
                    orden_compra : data?.orden || '',
                }));
                // console.log(form)
            }
        }, [data, opciones]);

    const [errores, setErrores] = useState({})

    const [file, setFile] = useState(null)

    const classes = useStyles();
    const [form, setForm] = useState({
        fecha: '',
        departamento: '',
        tipoGasto: '',
        subarea: '',
        tipoPago: '',
        monto:'',
        monto_pagado: '',
        descripcion: '',
        id: '',
        id_cuenta: '',
        auto1:'',
        auto2:'',
        auto3: '',
        id_estatus: '',
        checked:'',
        proveedor: '',
        fecha_entrega: '',
        empresa: "",
        conta: '',
        factura: '',
        orden_compra: '',
        facturas: false,
        labelPorveedor: '',
        facturaObject: {},
        area:'',

    })



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
    };

    const handleChangeDepartamento = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
            tipoGasto: null,
            subarea: null
        })
    }

    const validateForm = () => {
        let valid = true;
        let aux = {}; // 🔥 Se inicializa como objeto (antes estaba como array `[]`)
    
        if (form.fecha_entrega === '' || form.fecha_entrega === null) {
            valid = false;
            aux.fecha_entrega = "La fecha de entrega es obligatoria";
        }
        if (form.area === '' || form.area === null) {
            valid = false;
            aux.area = "El departamento es obligatorio";
        }
        
        if (form.subarea === '' || form.subarea === null) {
            valid = false;
            aux.subarea = "El subárea es obligatoria";
        }
        if (form.tipoPago === '' || form.tipoPago === null) {
            valid = false;
            aux.tipoPago = "El tipo de pago es obligatorio";
        }
        if (form.monto === '' || form.monto === null || form.monto === 0) {
            valid = false;
            aux.monto = "El monto es obligatorio";
        }
        if (form.descripcion === '' || form.descripcion === null) {
            valid = false;
            aux.descripcion = "La descripción es obligatoria";
        }
        if (form.id_estatus === '' || form.id_estatus === null) {
            valid = false;
            aux.id_estatus = "El estatus de entrega es obligatorio";
        }
        if (form.proveedor === '' || form.proveedor === null) {
            valid = false;
            aux.proveedor = "El proveedor es obligatorio";
        }
    
        setErrores(aux); // 🔥 Se actualiza `errores` con el objeto `aux`
        // console.log("Errores detectados:", aux); // ✅ Log para ver qué datos están fallando
    
        return valid;
    };

    

    // console.log(form)
    const aprobar = () => {


        if (!validateForm()) { 
            Swal.fire({
                icon: 'error',
                title: 'Error en el formulario',
                html: Object.values(errores).map(err => `<p>${err}</p>`).join(''), // ✅ Muestra los errores
                confirmButtonText: 'Entendido',
            });
            return;
        }
  
        if (!form.auto1) {
            Swal.fire({
                title: 'Requisición no autorizada!',
                text: 'Debes aprobar la requisición para poder convertirla',
                icon: 'error',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Ok',
            });
            return;
        }                
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
                        Swal.fire({
                            title: 'Aprobando...',
                            allowOutsideClick: false,
                            onBeforeOpen: () => {
                                Swal.showLoading()
                            }
                        })

                        let newForm = {
                            id_departamento: form.area,
                            id_gasto: form.id_partidas,
                            descripcion: form.descripcion,
                            id_subarea: form.subarea,
                            id_pago: form.tipoPago,
                            id_solicitante: data.solicitante_id,
                            monto_pagado: form.monto_pagado,
                            cantidad: form.monto,
                            autorizacion_1: form.auto1 && form.auto1.id ? form.auto1.id : form.auto1,
                            autorizacion_2: form.monto === data.monto_solicitado ? form.auto2 ? form.auto2.id : null : null,
                            orden_compra: data.orden_compra,
                            fecha_pago: data.fecha_pago,
                            id_cuenta: form.id_cuenta,
                            id_estatus_compra: form.id_estatus,
                            id_proveedor: form.proveedor,
                            fecha_entrega: form.fecha_entrega,
                            autorizacion_compras: true,
                            id_estatus_factura: form.factura,
                            id_estatus_conta: form.id_estatus,
                            facturas: form.facturas,
                            fecha: form.fecha,
                            form : 'convertir',
                        }
                        //  console.log('esta')
                        apiPutForm(`requisicion/${data.id}`, newForm, auth.access_token).then(
                            (response) => {
                                // console.log(response)

                                // if (file) {
                                //     handleSubmit()
                                // }
                                Swal.close()
                                // handleClose('convertir')
                                // if (reload) {
                                //     reload.reload()
                                // }
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Aprobado!',
                                    text: 'Se ha aprobado correctamente',
                                    timer: 2000,
                                    timerProgressBar: true,
                                })
                                reload();
                                handleClose()
                                // handleClose('convertir')

                            }, (error) => { 
                                    // console.log(error.response.status)
                                    if(error.response.status == 400){
                                        Swal.fire(error.response.data.message, "", "info");
                                        handleClose('convertir')


                                    }else{
                                        Swal.fire({
                                            title: error.response.data.message ,
                                            showDenyButton: true,
                                            // showCancelButton: true,
                                            confirmButtonText: "Crear",
                                            denyButtonText: `No Crear`,
                                            text: "¿Deseas crear la partida en el presupuesto para aprobación?",
                                          }).then((result) => {
                                            /* Read more about isConfirmed, isDenied below */
                                            if (result.isConfirmed) {
                                                apiPutForm(`requisicion/${data.id}/presupuesto`, newForm, auth.access_token).then(
                                                    res => {
                                                    Swal.close()
                                                    // Swal.fire("Saved!", "Se creo la partida pero necesita aprovacion", "success");
        
                                                    Swal.fire({
                                                        icon: 'success',
                                                        title: 'Guardado',
                                                        text: 'Se creó la partida pero necesita aprobación',
                                                        timer: 2000,
                                                        timerProgressBar: true,
                                                        onOpen: () => {
                                                            handleClose('convertir')
                                                            // if (reload) {
                                                            //     reload.reload()
                                                            // }
                                                            reload();
                                                            Swal.showLoading()
                                                        }
                                                    })
                                                })
                                                .catch(err => {
                                                    Swal.close()
                                                    Swal.fire({
                                                        icon: 'error',
                                                        title: 'El registro fue actualizado pero no fue posible subir la factura',
                                                        text: 'Algo salio mal!',
                                                        onOpen: () => {
                                                            handleClose('convertir')
                                                            // if (reload) {
                                                            //     reload.reload()
                                                            // }
                                                            reload();
                                                            Swal.showLoading()
                                                        }
                                                    })
                                                })
        
        
                                            } else if (result.isDenied) {
        
                                              Swal.fire("Cambia el tipo de gasto para continuar", "", "info");
                                            }
                                          });
                                    }
                               

                                // Swal.fire({
                                //     // icon: 'error',
                                //     title: 'Oops...',
                                //     text: error.response.data.message,
                                //     icon: 'warning',
                                //     showCancelButton: false,
                                //     confirmButtonColor: '#3085d6',
                                //     // cancelButtonColor: '#d33',
                                //     // cancelButtonText: 'Cancelar',
                                //     confirmButtonText: 'Aceptar'
                                // }).then((result) => {
                                //     if (result.isConfirmed) {
                                //         Swal.fire({
                                //             title: 'Enviando',
                                //             text: 'Espere un momento...',
                                //             allowOutsideClick: false,
                                //             allowEscapeKey: false,
                                //             allowEnterKey: false,
                                //             showConfirmButton: false,
                                //             onOpen: () => {
                                //                 handleClose('convertir')
                                //                 if (reload) {
                                //                     reload.reload()
                                //                 }
                                //                 Swal.showLoading()
                                //             }
                                //         })
                                   
                                //     }
                                // })
                                   
                                    // console.log(error.response.data.message)
                                    // printResponseErrorAlert(error)
                                    // handleClose('convertir')
                            }
                        ).catch((error) => {
                            console.log(error)
                            console.log('errror')
                            Swal.close()
                            Swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: 'Ha ocurrido un error',
                            })
                        })
                    }
                })
           
       

    }

    const handleAprueba = (e) => {
        if (e.target.name === 'auto1') {
            setForm({
                ...form,
                auto1: auth.user.id,
                checked: !form.checked
            })
        }
    }

    const handleMoney = (e) => {
        setForm({
            ...form,
            monto: e
        })
    }

    // const handleChangeProveedor = (e, value) => {
    //     if (value && value.name) {
    //         setForm({
    //             ...form,
    //             proveedor: value.value,
    //             labelPorveedor: opciones.proveedores.find(proveedor => proveedor.value == value.value).name
    //         })
    //     }
    // }
    
    const handleChangeProveedor = (e, value) => {
    
        if (value && value.name) {
            // console.log("ID del proveedor:", value.data?.id); // ✅ Acceder a ID dentro de `data`
    
            setForm((prevForm) => ({
                ...prevForm,
                proveedor: value.data?.id || '', // Usa `?.` para evitar errores si `data` es `undefined`
                proveedor_nombre: value.name,
            }));
        } else {
            setForm((prevForm) => ({
                ...prevForm,
                proveedor: '',
                proveedor_nombre: '',
            }));
        }
    };


    const handleSubmit = () => {

        if (true) {
            Swal.fire({
                title: 'Subiendo archivo...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading()
                }
            })
            let data = new FormData();
            let aux = Object.keys(form)

            /* aux.forEach((element) => {
                switch (element) {
                    case 'adjuntos':
                        break;
                    default:
                        data.append(element, form[element])
                        break
                }
            }) */

            data.append(`files_name_requisicion[]`, files.name)
            data.append(`files_requisicion[]`, files)
            data.append('adjuntos[]', "requisicion")
            data.append('tipo', 'Cotizaciones')

            try {
                apiPostForm(`requisicion/${props.data.id}/archivos/s3`, data, auth.access_token)
                    .then(res => {
                        Swal.close()
                        Swal.fire({
                            icon: 'success',
                            title: 'Adjunto guardado',
                            showConfirmButton: false,
                            timer: 1500
                        })

                        if (res.status === 200) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Adjunto guardado',
                                showConfirmButton: false,
                                timer: 1500
                            })
                        }
                    })
                    .catch(err => {
                        Swal.close()
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
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
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Debe seleccionar un archivo',
                showConfirmButton: false,
                timer: 1500
            })
        }
    }

    const handleFile = (e) => {
        setFile(e.target.files[0])
    }

    const handleChangeCheck = () => {
        setForm({
            ...form,
            facturas: !form.facturas
        });
    };

    const handleCloseProveedor = () => {
        setNuevoProveedor(false)
        setForm({
            ...form,
            proveedor: nuevoProveedor.id, // Establecer el proveedor recién creado
            proveedor_nombre: nuevoProveedor.name,
        });
    }

    const agregarProveedor = () => {
        setNuevoProveedor(true)
    }

    const [proveedorSelect, setProveedorSelect] = useState({
        preSelect: false,
        id:null,
        name: null,
    })

     const { getRootProps, getInputProps } = useDropzone({
            onDrop,
            maxFiles: 1,
            accept: "application/pdf, application/xml, text/xml, image/png, image/jpeg, image/jpg",
        });

        const onDrop = useCallback((acceptedFiles) => {
            if (acceptedFiles.length > 0) {
                const uploadedFile = acceptedFiles[0];
    
                // Validar tipos de archivo permitidos
                const allowedTypes = ["application/pdf", "application/xml", "text/xml", "image/png", "image/jpeg", "image/jpg"];
                if (!allowedTypes.includes(uploadedFile.type)) {
                    Swal.fire({
                        icon: "error",
                        title: "Formato no permitido",
                        text: `El archivo ${uploadedFile.name} no es un PDF, XML o imagen.`,
                    });
                    return;
                }
    
                setFile(uploadedFile);
                setForm((prevForm) => ({
                    ...prevForm,
                    solicitud: uploadedFile, // 🔥 Se guarda en form.solicitud
                }));
            }
        }, [setForm]);

        const handleDeleteFile = () => {
            setFile(null);
            setForm((prevForm) => ({
                ...prevForm,
                solicitud: null,
            }));
        };
    
    return (
        <>
        <Box>   
          <Container maxWidth="lg">
          <DialogTitle  >Nueva Requisicion</DialogTitle>
          <DialogContent >
          
              <Grid container spacing={3}>       
                 <Grid item  xs={12} sm={6} md={3}>
                      <Paper sx={{ padding: 2, textAlign: 'center', }} elevation={0} >
                      <InputLabel>N. orden de Compra</InputLabel>
                      <TextField
                          name="orden_compra"
                          label="Orden de compra"
                          type="text"
                          value={form.orden_compra !== '' ? form.orden_compra : null}
                          onChange={handleChange}
                          InputLabelProps={{
                              shrink: true,
                          }}
                          multiline
                          disabled
                          className="w-100"
                          error={errores.orden_compra ? true : false}
                      />
                      </Paper>
                  </Grid> 

                  <Grid item  xs={12} sm={6} md={3} justifyContent="space-around">
                      <Paper sx={{ padding: 2, textAlign: 'center', }} elevation={0} >
                      {/* <InputLabel>Fecha de Compra</InputLabel> */}
                      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
                          <KeyboardDatePicker
                              disableToolbar
                              label="Fecha de solicitud"
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

                  <Grid item  xs={12} sm={6} md={3} justifyContent="space-around">
                      <Paper sx={{ padding: 2, textAlign: 'center', }} elevation={0} >
                      {/* <InputLabel>Fecha de Compra</InputLabel> */}
                      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
                          <KeyboardDatePicker
                              disableToolbar
                              label="Fecha de entrega"
                              format="dd/MM/yyyy"
                              margin="normal"
                              name="fecha_entrega"
                              value={form.fecha_entrega !== '' ? form.fecha_entrega : null}
                              placeholder="dd/mm/yyyy"
                              onChange={(e) => handleChangeFecha(e, 'fecha_entrega')}
                              className="w-100"
                              KeyboardButtonProps={{
                                  'aria-label': 'change date',
                              }}
                              error={errores.fecha_entrega ? true : false}
                          />
                      </MuiPickersUtilsProvider>
                      </Paper>
                  </Grid>     

                  <Grid item  xs={12} sm={6} md={3} justifyContent="space-around">
                      <Paper sx={{ padding: 2, textAlign: 'center', }} elevation={0} >
                      <InputLabel>Monto solicitado</InputLabel>
                          <CurrencyTextField
                              label="Monto solicitado"
                              variant="standard"
                              name="monto"
                              value={form.monto}
                              currencySymbol="$"
                              outputFormat="number"
                              modifyValueOnWheel={false}
                              onChange={(event, value) => handleMoney(value)}
                              className="form-control"
                              error={errores.monto ? true : false}
                          />                        
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
              </Grid> 
              <Grid container spacing={3}>

                <Grid item xs={12} sm={8} md={4}>
                    <Paper sx={{ padding: 2, textAlign: 'center' }} elevation={0}>
                        <InputLabel>Proveedor</InputLabel>
                        <Autocomplete
                            name="proveedor"
                            options={opciones.proveedores.sort((a, b) => a.name.localeCompare(b.name))} // Orden alfabético
                            getOptionLabel={(option) => option.name || ''} // Muestra el nombre del proveedor
                            isOptionEqualToValue={(option, value) => option.data?.id === value?.data?.id} // Comparar por ID dentro de `data`
                            value={opciones.proveedores.find((item) => item.data?.id === form.proveedor) || null} // Ajustar el valor actual
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


                 <Grid item  xs={12} sm={8} md={4} justifyContent="space-around">
                            <Paper sx={{ padding: 2, textAlign: 'center', }} elevation={0} >
                            <InputLabel>Tipo de Pago</InputLabel>
                                <Autocomplete
                                    id="tipo-pago-autocomplete"
                                    options={opciones.tiposPagos} // Opciones de tipo de pago
                                    getOptionLabel={(option) => option.name || ''} // Muestra el nombre del tipo de pago
                                    isOptionEqualToValue={(option, value) => option.id === value} // Compara por ID
                                    value={opciones.tiposPagos.find((item) => item.id === form.tipoPago) || null} // Selecciona el valor actual
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
                                            name="tipoPago"
                                            error={!!errores.tipoPago} // Muestra el error si existe
                                            helperText={errores.tipoPago || ''} // Muestra el texto de ayuda
                                        />
                                    )}
                                />
    
                            </Paper>
                        </Grid>   

                        <Grid item xs={12} sm={8} md={4} justifyContent="space-around">
                            <Paper sx={{ padding: 2, textAlign: 'center' }} elevation={0}>
                                {estatusCompras ? (
                                    <>
                                        <InputLabel id="estatus-entrega-label">Estatus de entrega</InputLabel>
                                        <Select
                                            labelId="estatus-entrega-label"
                                            name="id_estatus"
                                            value={form.id_estatus || ''}
                                            onChange={(event) => {
                                                setForm((prevForm) => ({
                                                    ...prevForm,
                                                    id_estatus: event.target.value, // 🔥 Actualiza el estado con el nuevo valor seleccionado
                                                }));
                                            }}
                                            error={!!errores.id_estatus}
                                            displayEmpty
                                            fullWidth
                                        >
                                            <MenuItem value="" disabled>
                                                Selecciona un estatus
                                            </MenuItem>
                                            {estatusCompras
                                                .filter((item) => item.nivel === 1) // Filtra los elementos con nivel === 1
                                                .map((item, index) => (
                                                    <MenuItem key={index} value={item.id}>
                                                        {item.estatus}
                                                    </MenuItem>
                                                ))}
                                        </Select>
                                    </>
                                ) : null}
                            </Paper>
                        </Grid>
                     
                
              </Grid>

              <Grid container spacing={3}>
                <Grid item  xs={12} sm={8} md={4}>
                      <Paper sx={{ padding: 2, textAlign: 'center', }} elevation={0} >
                      <InputLabel>Descripción</InputLabel>
                      <TextField
                          name="descripcion"
                          label="Descripción"
                          type="text"
                          value={form.descripcion !== '' ? form.descripcion : null}
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

                  {/* Dropzone para subir archivo */}
                  {/* <Grid item xs={12} sm={8} md={4}>
                  <Paper sx={{ padding: 2, textAlign: "center" }} elevation={0}>
                      <InputLabel sx={{ fontWeight: "bold", fontSize: "16px", mb: 2 }}>Subir cotizacion</InputLabel>

                      <Box
                          {...getRootProps()}
                          sx={{
                              border: "2px dashed #28A745",
                              padding: "20px",
                              textAlign: "center",
                              cursor: "pointer",
                              borderRadius: "8px",
                              transition: "all 0.3s",
                              "&:hover": {
                                  backgroundColor: "#E3F3E1",
                              },
                          }}
                      >
                          <input {...getInputProps()} />
                          <CloudUploadIcon sx={{ fontSize: 40, color: "#28A745", mb: 1 }} />
                          <Typography variant="body2" sx={{ color: "#555" }}>
                              Arrastra y suelta un archivo aquí o haz clic para seleccionar
                          </Typography>
                      </Box>
                  </Paper>
                  </Grid> */}

                  {/* Mostrar archivo subido */}
                  {/* {file && (
                  <Grid item xs={12} sm={8} md={4}>
                      <Paper sx={{ padding: 2, textAlign: "center" }} elevation={0}>
                          <Box
                              sx={{
                                  marginTop: "10px",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "10px",
                                  backgroundColor: "#fff",
                                  padding: "10px",
                                  borderRadius: "5px",
                                  borderLeft: "4px solid #007BFF",
                              }}
                          >
                              <Typography variant="body2" sx={{ flexGrow: 1, color: "#333" }} title={file.name}>
                                  📄 {file.name}
                              </Typography>
                              {file.type.includes("image") ? (
                                  <img src={URL.createObjectURL(file)} alt="Imagen subida" width="50" style={{ borderRadius: "4px" }} />
                              ) : (
                                  <IconButton color="primary" href={URL.createObjectURL(file)} target="_blank">
                                      <VisibilityIcon />
                                  </IconButton>
                              )}
                              <IconButton color="secondary" onClick={handleDeleteFile}>
                                  <DeleteIcon />
                              </IconButton>
                          </Box>
                      </Paper>
                  </Grid>       
                    )} */}

                <Grid item  xs={12} sm={8} md={4}>
                    <Paper sx={{ padding: 2, textAlign: 'center', }} elevation={0} >
                      <InputLabel>¿Lleva factura?</InputLabel>
                        <FormGroup row>
                          <FormControlLabel
                            control={<Checkbox checked={!form.facturas} onChange={handleChangeCheck} color='secondary' name='facturas' />}
                            label="No"

                          />
                           <FormControlLabel
                            control={<Checkbox checked={form.facturas} onChange={handleChangeCheck} color='primary' name='facturas' />}
                            label="Si"

                        />
                         </FormGroup>
                    </Paper>
                  </Grid> 
                  <Grid item  xs={12} sm={8} md={4}>
                    <Paper sx={{ padding: 2, textAlign: 'center', }} elevation={0} >
                        <InputLabel id="demo-simple-select-label">Aprobar Requsición</InputLabel>
                        <Checkbox
                            checked={form.checked}
                            onChange={handleAprueba}
                            name="auto1"
                            color="primary"
                            style={{marginLeft: '20%'}}
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
              <Button style={{ backgroundColor: '#0A3E27', color: '#fff', '&:hover': { backgroundColor: '#0A3E27', }, }} variant="contained" onClick={e => aprobar(form)}>
              Guardar
              </Button>
          </DialogActions>

          </Container>
          </Box>

      </>
        
    )
    
}

