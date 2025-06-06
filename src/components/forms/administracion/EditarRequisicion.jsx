import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux'

import { apiPutForm, apiPostForm} from '../../../functions/api'

// import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
// import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
// import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import CurrencyTextField from '@unicef/material-ui-currency-textfield'

import Style from './NuevaRequisicion.module.css'

import Swal from 'sweetalert2'

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
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { DATE_VALIDATION_PROP_NAMES } from '@mui/x-date-pickers/validation/extractValidationProps';

function EditarRequisicion (props) {

    const { data, handleClose, reload } = props
    const departamentos = useSelector(state => state.opciones.areas)
    const user = useSelector(state => state.authUser)

    console.log(data)

      useEffect(() => {
            console.log('Data:', data);
            console.log('Departamentos:', departamentos);
        
            if (data) {
                // Procesa las demás relaciones
                console.log(departamentos)
                const area = departamentos?.find((area) => area.nombreArea === data.data.departamento?.nombre)?.id_area || '';
                const partida = departamentos
                    ?.find((area) => area.nombreArea === data.data.departamento?.nombre)
                    ?.partidas?.find((partida) => partida.nombre === data.data.gasto?.nombre)?.id || '';        
                console.log('Processed Values:', {
                    area,
                    partida,
                });
        
                // Actualiza el estado del formulario
                setForm((prevForm) => ({
                    ...prevForm,
                    area,
                    descripcion: data.data.descripcion  || '',
                    fecha: new Date(data.data?.fecha),
                    partida,
                    monto: data.data.cantidad || 0,
                    id: data.data.id,
                }));
            }
        }, [data]);

        


    const [form, setForm] = useState({
        fecha: '',
        area: '',
        partida: '',
        descripcion: '',
        tipoSubgasto: '',
        tipoPago: '',
        monto: '',
        // estatus: data.estatus ? data.estatus.estatus : 'no difinido',
        id: '',
    })
    const [errores, setErrores] = useState({})


    const handleChangeDepartamento = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
            tipo_gasto: null,
        })
    }

    const handleChange = (event) => {
        let name = event.target.name;
        setForm({
            ...form,
            [name]: event.target.value,
        });
    };

    
    const validateForm = () => {
        let validar = true
        let error = {}
       
        if(form.descripcion === ''){
            error.descripcion = "Escriba una descripcion"
            validar = false
        }
        setErrores(error)
        return validar
    }

    const handleSave = () => {
        if(validateForm()){

             Swal.fire({
                title: '¿Estás seguro?',
                text: 'Se editará la requisicion',
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
                        title: 'editando requisicion',
                        text: 'Por favor, espere...',
                        allowOutsideClick: false,
                        onBeforeOpen: () => {
                            Swal.showLoading()
                        },
                    })

    
            let newForm = {
                id_departamento: form.area,
                id_gasto: form.partida,
                descripcion:form.descripcion,
                fecha: form.fecha,
                // id_subarea: form.tipoSubgasto,
                // id_pago: form.tipoPago,
                id_solicitante: data.solicitante.id,
                cantidad: form.monto,
                form: "editar"
                // estatus: data.estatus.estatus,
            }
            console.log(newForm)

            apiPutForm(`requisicion/${data.id}`, newForm, user.access_token)
            .then((response)=>{
                Swal.close()
                Swal.fire({
                    icon: 'success',
                    tittle: 'Editar requisición',
                    text: 'Se ha editado correctamente',
                    timer: 2000,
                    timerProgressBar: true,
                })
                handleClose()
                if(reload){
                    reload.reload()
                }
            })  .catch((error)=>{  
                Swal.close()
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Ha ocurrido un error',
                })
            })
        
            }else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Todos los campos son obligatorios',
                })
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

    const handleMoney = (e) => {
        setForm({
            ...form,
            monto: e
        })
    }

    const handleChangeFecha = (date, tipo) => {
        setForm({
            ...form,
            [tipo]: new Date(date)
        })
    };
    console.log(form)
    return (
        <>
            
            <Box>   
            <Container maxWidth="lg">
            <DialogTitle  >Editar requisicion</DialogTitle>
            <DialogContent >
            
                <Grid container spacing={3}>                 
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
                                        label="Partida"
                                        error={!!errores.partida}
                                        helperText={errores.partida || ''}
                                        />
                                    )}
                                    />

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
                    <Grid item  xs={12} sm={8} md={4}>
                        <Paper sx={{ padding: 2, textAlign: 'center', }} elevation={0} >
                        <InputLabel>Solicitante</InputLabel>
                        <TextField
                            name="solicitante"
                            label="Solicitante"
                            type="text"
                            defaultValue={user.user.name}
                            onChange={handleChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            disabled
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

            </DialogContent>

            <DialogActions>
                <Button style={{ backgroundColor: '#F96D49', color: '#fff', '&:hover': { backgroundColor: '#F96D49', }, }} variant="contained"  onClick={() => handleClose()}>
                    Cancelar
                    </Button>
                {/* <Button color="primary" variant="contained" onClick={e => handleSend(form)}>
                    Enviar
                </Button> */}
                <Button style={{ backgroundColor: '#0A3E27', color: '#fff', '&:hover': { backgroundColor: '#0A3E27', }, }} variant="contained" onClick={e => handleSave(form)}>
                editar
                </Button>
            </DialogActions>

            </Container>
            </Box>

        </>
    )
}

export { EditarRequisicion }