import React, { useState, useEffect,useCallback } from 'react';
import { useSelector } from "react-redux";
import Swal from 'sweetalert2'

import { apiPostForm } from '../../../functions/api'

import { MuiPickersUtilsProvider, KeyboardDatePicker, KeyboardTimePicker } from '@material-ui/pickers';
// import Grid from '@material-ui/core/Grid';
// import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import CurrencyTextField from '@unicef/material-ui-currency-textfield'

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
// import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { DATE_VALIDATION_PROP_NAMES } from '@mui/x-date-pickers/validation/extractValidationProps';
import { useDropzone } from "react-dropzone";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Typography from '@material-ui/core/Typography';


import Style from './NuevaRequisicion.module.css'
import './../../../styles/_nuevaRequisicion.scss'

export default function NuevaRequisicion(props) {
    const {handleClose, reload} = props
    const user = useSelector(form => form.authUser)
    const departamento = useSelector(form => form.authUser.departamento)
    const departamentos = useSelector(form => form.opciones.areas)
    const presupuestos = useSelector(form => form.opciones.presupuestos)


    const [form, setForm] = useState({
        solicitante: user.user.id,
        fecha:'',
        departamento: departamento.departamentos[0].id,
        tipo_gasto: '', //partida
        descripcion: '',
        solicitud: '',
        presupuesto: '',
        monto: '',
        partidas: [], 
        presupuestoActual: true,
        todosPresupuestos: false,  
    });
    const [file, setFile] = useState(form.solicitud || null);

    const { presupuestoActual, todosPresupuestos } = form;

    const [errores, setErrores] = useState({})

    // 🔥 AQUÍ debes ponerlo
    const departamentosDisponibles = user.user.tipo.id === 1 
    ? departamentos 
    : departamento.departamentos;

    const handleFile = (e) => {
        setForm({
            ...form,
            solicitud: e.target.files[0]
        })
    }

    const handleChange = (event) => {
        // name son los diferentes tipos de atributos (departamento, fecha...)
        let name = event.target.name;
        let value = event.target.value;
    
        setForm((prevState) => ({

            ...prevState,
            [name]: value,
            tipo_gasto: null, // Reset the selected category when the budget changes
        }));

         // Find the selected budget by its ID
         const selectedBudget = presupuestos.find((budget) => budget.id === value);

         if (selectedBudget) {

            // console.log(form.departamento)
            // console.log(departamentos)

            const matchingDepartments = departamentos.filter((department) => parseInt(department.id_area) === form.departamento);


            // console.log("matchingDepartments:", matchingDepartments);

            if (matchingDepartments.length > 0) {
                const updatedPartidas = matchingDepartments.flatMap((matchingDepartment) =>
                    matchingDepartment.partidas.map((partida) => {
                        const matchingCategories = selectedBudget.rel.filter((category) => {
                            return String(category.id_partida) === String(partida.id);
                        });
            
                        // console.log("partida.id:", partida.id);
                        
                        if (matchingCategories.length > 0) {
            
                            return {
                                id: partida.id,
                                nombre: partida.nombre,
                            };
                        }
                        return null;
                    })
                );
                // console.log(matchingDepartments)
            
                // Remove null values (occurs when there are no matching categories)
                const filteredPartidas = updatedPartidas.filter(partida => partida !== null);
            
                // console.log("Updated Partidas:", filteredPartidas);
            
                setForm((prevState) => ({
                    ...prevState,
                    partidas: filteredPartidas,
                }));
            }


        }
    };
    
    useEffect(() => {
        // console.log("Updated partidas:", form.partidas);
    }, [form.partidas]);

    useEffect(() => {
        if (departamentos.length > 0 && !form.departamento) {
            setForm((prevForm) => ({
                ...prevForm,
                departamento: departamentos[0]?.id_area || '', // 🔥 Si aún no se ha seleccionado, establece el primer departamento
            }));
        }
    }, [departamentos]);

    const handleChangeFecha = (date, tipo) => {
        setForm({
            ...form,
            [tipo]: new Date(date)
        })
    };

    const validateForm = () => {
        let validar = true
        let error = {}
        if(form.departamento === ''){
            error.departamento = "Seleccione un departamento"
            validar = false
        }
        // if(form.tipo_gasto === ''){
        //     error.tipo_gasto = "Seleccione el tipo de gasto"
        //     validar = false
        // }
        if(form.descripcion === ''){
            error.descripcion = "Escriba una descripcion"
            validar = false
        }
        if (form.presupuesto === '') {
            error.presupuesto = "Seleccione un presupuesto"
            validar = false
        }
        if (form.fecha === '' || form.fecha === null) {
            error.fecha = "Seleccione una fecha"
            validar = false
        }
        
        setErrores(error)
        return validar
    }

    function formatDate(date) {
        var year = date.getFullYear();
      
        var month = (1 + date.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;
      
        var day = date.getDate().toString();
        day = day.length > 1 ? day : '0' + day;
        
        return year + '/' + month + '/' + day;
      }

    const enviar = () =>{
        if(validateForm()){

            Swal.fire({
                title: 'Cargando...',
                allowOutsideClick: false,
                onBeforeOpen: () => {
                    Swal.showLoading()
                }
            }) 
            try {
                let dataForm = new FormData()
                // console.log(form)
                let newForm = {
                    id_solicitante: form.solicitante,
                    id_departamento: form.departamento,
                    id_gasto: form.tipo_gasto,
                    descripcion: form.descripcion,
                    fecha: formatDate(form.fecha),
                    solicitud: form.solicitud,
                    presupuesto: form.presupuesto,
                    monto: form.monto

                }

                let aux = Object.keys(newForm)

                aux.forEach((element) => {
                    switch (element) {
                        case 'adjuntos':
                            break;
                        default:
                            dataForm.append(element, newForm[element])
                            break
                    }
                })

                dataForm.append(`files_name_requisicion[]`, 'requisicion01')
                dataForm.append(`files_requisicion[]`, form.solicitud)
                dataForm.append('adjuntos[]', "requisicion")

                apiPostForm('requisicion', dataForm, user.access_token)
                    .then((data) => {
                        Swal.fire({
                            title: 'Requisicion enviada',
                            text: 'La requisicion se ha enviado correctamente',
                            icon: 'success',
                            showConfirmButton: true,
                            timer: 2000,
                        }).then(() => {
                            reload();
                            // if (reload) {
                            //     reload.reload()
                            // }
                            handleClose()
                        })

                        /* if (data.isConfirmed) {
                            let form = {
                                solicitante: user.user.id,
                                fecha: '',
                                departamento: '',
                                tipo_gasto: '',
                                descripcion: '',
                                solicitud: ''
                            }
                            console.log('form')
                            console.log(form)
                        } */

                        /* else if (data.isDenied) {
                            Swal.fire('Faltan campos', '', 'info')
                        } */
                    })
                    .catch((error) => {
                        Swal.close()
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Ha ocurrido un error 1',
                        })
                        console.log(error)
                    })
            } catch (error) { 
                Swal.close()
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Ha ocurrido un error 2',
                })
                console.log(error)
            }
        } else{
            Swal.fire({
                title: 'Faltan campos',
                text: 'Favor de llenar todos los campos',
                icon: 'info',
                showConfirmButton: false,
                timer: 2000,
            })
        }
    }

    useEffect(() => {
        if (form.presupuesto && form.departamento) {
            const selectedBudget = presupuestos.find((budget) => budget.id === form.presupuesto);
    
            if (selectedBudget) {
                const matchingDepartments = departamentos.filter((department) => parseInt(department.id_area) === parseInt(form.departamento));
    
                if (matchingDepartments.length > 0) {
                    const updatedPartidas = matchingDepartments.flatMap((matchingDepartment) =>
                        matchingDepartment.partidas.map((partida) => {
                            const matchingCategories = selectedBudget.rel.filter((category) => {
                                return String(category.id_partida) === String(partida.id);
                            });
    
                            if (matchingCategories.length > 0) {
                                return {
                                    id: partida.id,
                                    nombre: partida.nombre,
                                };
                            }
                            return null;
                        })
                    );
    
                    const filteredPartidas = updatedPartidas.filter(partida => partida !== null);
    
                    setForm((prevForm) => ({
                        ...prevForm,
                        partidas: filteredPartidas,
                    }));
                }
            }
        }
    }, [form.presupuesto, form.departamento, presupuestos, departamentos]);

    
   const handleChangeDepartamento = (event) => {
    let name = event.target.name;
    let value = parseInt(event.target.value, 10);

    const selectedDepartment = departamentos.find((department) => department.id_area === value);

    setForm((prevState) => ({
        ...prevState,
        [name]: value,
        presupuesto: '', // 🔥 Resetea presupuesto
        partidas: [],    // 🔥 Limpia partidas
        tipo_gasto: '',  // 🔥 Limpia tipo de gasto
    }));
};



    const handleMoney = (e) => {
        setForm({
            ...form,
            monto: e
        })
    }

    const handleChangeCheckbox = (event) => {
        const { name, checked } = event.target;

        if (name === 'presupuestoActual' && checked) {
            setForm((prevState) => ({
                ...prevState,
                presupuestoActual: true,
                todosPresupuestos: false,
            }));
        } else if (name === 'todosPresupuestos' && checked) {
            setForm((prevState) => ({
                ...prevState,
                presupuestoActual: false,
                todosPresupuestos: true,
            }));
        } else {
            // If none of the checkboxes is selected, uncheck both
            setForm((prevState) => ({
                ...prevState,
                presupuestoActual: false,
                todosPresupuestos: false,
            }));
        }
    };
    

    // const handleChangeDepartamento = (e) => {
    //     setForm({
    //         ...form,
    //         [e.target.name]: e.target.value,
    //         tipo_gasto: null,
    //     })
    // }

    // const handleChangeTipo = (e) => {
    //     console.log("Selected Tipo de Gasto:", e.target.value);
    //     // form.tipo_gasto = e.target.value
    //     setForm((prevState) => ({
    //         ...prevState,
    //         [e.target.name]: e.target.value,
    //         // tipo_gasto: e.target.value,
    //     }));
    // };

    const handleChangeTipo = (event) => {
        let name = event.target.name;
        setForm({
            ...form,
            [name]: event.target.value,
        });
    };


    
    const itemsPresupuesto = presupuestos.map((item, index) => ( item.id_area !== form.departamento ?
        <MenuItem key={index} value={item.id}>{item.nombre}</MenuItem>
        : ''
    ));

    const handleChangeProyecto = (e, value) => {
        if (value && value.nombre) {
            setForm({
                ...form,
                presupuesto: value.id,
            })
        }
        if (value === null) {
            setForm({
                ...form,
                presupuesto: null,
            })
        }
    }

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

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        maxFiles: 1,
        accept: "application/pdf, application/xml, text/xml, image/png, image/jpeg, image/jpg",
    });
// console.log(form)
// console.log(departamentos)
// console.log(presupuestos)

    return (
        <>
          <Box>   
            <Container maxWidth="lg">
            <DialogTitle  >Nueva Requisicion</DialogTitle>
            <DialogContent >
            
                <Grid container spacing={3}>  
                <Grid item  xs={12} sm={8} md={4}>
                    <Paper sx={{ padding: 2, textAlign: 'center', }} elevation={0} >
                    <InputLabel>Solicitante</InputLabel>
                    <TextField
                        name="solicitante"
                        label="Solicitante"
                        type="text"
                        defaultValue={user.user.name}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        disabled
                        multiline
                        className="w-100"
                    />
                    </Paper>
                </Grid>                

                <Grid item xs={12} sm={8} md={4} justifyContent="space-around">
                    <Paper sx={{ padding: 2, textAlign: "center" }} elevation={0}>
                        {departamentosDisponibles.length > 0 && (
                            <>
                                <InputLabel>Departamento</InputLabel>
                                
                                {user.user.tipo.id === 1 ? ( // 🔥 Si el usuario es Administrador, usa Autocomplete
                                    <Autocomplete
                                        name="departamento"
                                        options={departamentos.sort((a, b) => a.nombreArea.localeCompare(b.nombreArea))} // Ordena alfabéticamente
                                        groupBy={(option) => option.nombreArea.charAt(0).toUpperCase()} // Agrupa por la primera letra
                                        getOptionLabel={(option) => option.nombreArea || ""} // Muestra el nombre del área
                                        isOptionEqualToValue={(option, value) => option.id_area === value?.id_area} // Compara ID del área
                                        value={departamentos.find((item) => Number(item.id_area) === Number(form.departamento)) || null} // 🔥 Mantiene el departamento por defecto
                                        onChange={(event, value) => {
                                            setForm((prevForm) => ({
                                                ...prevForm,
                                                departamento: value ? value.id_area : '',
                                                presupuesto: '', // 🔥 Resetea presupuesto
                                                partidas: [],    // 🔥 Limpia partidas
                                                tipo_gasto: '',  // 🔥 Limpia tipo de gasto
                                            }));
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                variant="outlined"
                                                label="Departamento"
                                                error={!!errores.departamento}
                                                helperText={errores.departamento || ""}
                                            />
                                        )}
                                        sx={{ width: "100%" }} // Ajusta el ancho del componente
                                    />
                                ) : ( // 🔥 Si el usuario NO es Administrador, usa Select deshabilitado pero con su departamento asignado
                                    <Select
                                        value={form.departamento}
                                        name="departamento"
                                        onChange={handleChangeDepartamento}
                                        // disabled // 🔥 Deshabilitado para usuarios que no sean Administradores
                                        fullWidth
                                    >
                                        {departamentosDisponibles.map((item, index) => (
                                            <MenuItem key={index} value={item.id}>{item.nombre}</MenuItem>
                                        ))}
                                    </Select>
                                )}
                            </>
                        )}
                    </Paper>
                </Grid>

                <Grid item xs={12} sm={8} md={4} justifyContent="space-around">
                    <Paper sx={{ padding: 2, textAlign: 'center' }} elevation={0}>
                        {presupuestos.length > 0 && (
                            <>
                                <InputLabel>Presupuesto</InputLabel>             

                                {/* Autocomplete de presupuestos */}
                                <Autocomplete
                                    name="presupuesto"
                                    options={presupuestos.filter((presupuesto) => 
                                        todosPresupuestos ? true : presupuesto.rel.some((item) => Number(item.id_area) === Number(form.departamento))
                                    )} // 🔥 Si "Todos" está seleccionado, muestra todos los presupuestos; si no, filtra por departamento
                                    getOptionLabel={(option) => option.nombre || ''} // Muestra el nombre del presupuesto
                                    isOptionEqualToValue={(option, value) => option.id === value?.id} // Compara IDs correctamente
                                    value={presupuestos.find((item) => Number(item.id) === Number(form.presupuesto)) || null} // Mantiene el presupuesto seleccionado
                                    onChange={(event, value) => {
                                        setForm((prevForm) => ({
                                            ...prevForm,
                                            presupuesto: value ? value.id : '', 
                                            tipo_gasto: '', // 🔥 Limpia tipo de gasto porque cambia el presupuesto                                            
                                        }));
                                        handleChange({ target: { name: 'presupuesto', value: value ? value.id : '' } }); // 🔥 Ejecuta `handleChange`
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="outlined"
                                            label="Presupuesto"
                                            error={!!errores.presupuesto}
                                            helperText={errores.presupuesto || ''}
                                        />
                                    )}
                                />
                            </>
                        )}
                    </Paper>
                </Grid>                   
                    
                </Grid> 
                <Grid container spacing={3}>

                <Grid item xs={12} sm={8} md={4} justifyContent="space-around">
                    <Paper sx={{ padding: 2, textAlign: "center" }} elevation={0}>

                        {/* Checkboxes de selección */}
                        <div className={Style.checkboxContainer}>
                            <div className={Style.checkboxItem}>
                                <label>
                                    <input
                                        type="checkbox"
                                        name="presupuestoActual"
                                        checked={presupuestoActual}
                                        onChange={handleChangeCheckbox}
                                    />
                                    Presupuesto Actual
                                </label>
                            </div>
                            <div className={Style.checkboxItem}>
                                <label>
                                    <input
                                        type="checkbox"
                                        name="todosPresupuestos"
                                        checked={todosPresupuestos}
                                        onChange={handleChangeCheckbox}
                                    />
                                    Todos
                                </label>
                            </div>
                        </div>
                    </Paper>
                </Grid>


                <Grid item xs={12} sm={8} md={4} justifyContent="space-around">
                    <Paper sx={{ padding: 2, textAlign: "center" }} elevation={0}>
                        {form.departamento !== "" && (
                            <>
                                <InputLabel>Tipo de Gasto</InputLabel>

                                {/* 🔥 Si "Presupuesto Actual" está seleccionado, se usa Autocomplete con partidas filtradas */}
                                {form.presupuestoActual && form.partidas.length > 0 ? (
                                    <Autocomplete
                                        name="tipo_gasto"
                                        options={form.partidas} // Filtra partidas según el departamento seleccionado
                                        getOptionLabel={(option) => option.nombre || ""}
                                        isOptionEqualToValue={(option, value) => option.id === value?.id}
                                        value={form.partidas.find((partida) => partida.id === form.tipo_gasto) || null}
                                        onChange={(event, value) => {
                                            setForm((prevForm) => ({
                                                ...prevForm,
                                                tipo_gasto: value ? value.id : "",
                                            }));
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                variant="outlined"
                                                label="Partida"
                                                error={!!errores.tipo_gasto}
                                                helperText={errores.tipo_gasto || ""}
                                            />
                                        )}
                                        sx={{ width: "100%" }}
                                    />
                                ) : null}

                                {/* 🔥 Si "Todos los Presupuestos" está seleccionado, se usa Autocomplete con todas las partidas */}
                                {form.todosPresupuestos && departamentos.length > 0 ? (
                                    <Autocomplete
                                        name="tipo_gasto"
                                        options={departamentos.find((item) => Number(item.id_area) === Number(form.departamento))?.partidas || []}
                                        getOptionLabel={(option) => option.nombre || ""}
                                        isOptionEqualToValue={(option, value) => option.id === value?.id}
                                        value={
                                            departamentos
                                                .find((item) => Number(item.id_area) === Number(form.departamento))
                                                ?.partidas.find((partida) => partida.id === form.tipo_gasto) || null
                                        }
                                        onChange={(event, value) => {
                                            setForm((prevForm) => ({
                                                ...prevForm,
                                                tipo_gasto: value ? value.id : "",
                                            }));
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                variant="outlined"
                                                label="Partida"
                                                error={!!errores.tipo_gasto}
                                                helperText={errores.tipo_gasto || ""}
                                            />
                                        )}
                                        sx={{ width: "100%" }}
                                    />
                                ) : null}
                            </>
                        )}
                    </Paper>
                </Grid>




                    <Grid item  xs={12} sm={8} md={4} justifyContent="space-around">
                        <Paper sx={{ padding: 2, textAlign: 'center', }} elevation={0} >
                        {/* <InputLabel>Fecha de Compra</InputLabel> */}
                        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
                            <KeyboardDatePicker
                                disableToolbar
                                label="Fecha que lo requieres"
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
                    <Grid item  xs={12} sm={8} md={4}>
                        <Paper sx={{ padding: 2, textAlign: 'center', }} elevation={0} >
                        <InputLabel>Descripción</InputLabel>
                        <TextField
                            name="descripcion"
                            label="Descripción"
                            type="text"
                            onChange={handleChangeTipo}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            multiline
                            className="w-100"
                            error={errores.descripcion ? true : false}
                        />
                        </Paper>
                    </Grid> 
                   
                    <Grid item  xs={12} sm={8} md={4} justifyContent="space-around">
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
                </Grid>

                <Grid container spacing={3}>

                    {/* Dropzone para subir archivo */}
                    <Grid item xs={12} sm={8} md={4}>
                    <Paper sx={{ padding: 2, textAlign: "center" }} elevation={0}>
                        <InputLabel sx={{ fontWeight: "bold", fontSize: "16px", mb: 2 }}>Subir Archivo</InputLabel>

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
                    </Grid>

                    {/* Mostrar archivo subido */}
                    {file && (
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
                      )}

                </Grid>





            </DialogContent>

            <DialogActions>
                <Button style={{ backgroundColor: '#F96D49', color: '#fff', '&:hover': { backgroundColor: '#F96D49', }, }} variant="contained"  onClick={() => handleClose()}>
                    Cancelar
                    </Button>
                {/* <Button color="primary" variant="contained" onClick={e => handleSend(form)}>
                    Enviar
                </Button> */}
                <Button style={{ backgroundColor: '#0A3E27', color: '#fff', '&:hover': { backgroundColor: '#0A3E27', }, }} variant="contained" onClick={e => enviar(form)}>
                Guardar
                </Button>
            </DialogActions>

            </Container>
            </Box>

        </>
        
    );  
}