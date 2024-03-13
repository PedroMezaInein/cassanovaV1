import React, {useState, useEffect} from "react"
import { useSelector } from "react-redux";
import Swal from 'sweetalert2'

import { apiPostForm } from '../../../functions/api'

import { MuiPickersUtilsProvider, KeyboardDatePicker, KeyboardTimePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { es } from 'date-fns/locale'
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import CurrencyTextField from '@unicef/material-ui-currency-textfield'

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
    
    const { presupuestoActual, todosPresupuestos } = form;

    const [errores, setErrores] = useState({})

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
        if(form.tipo_gasto === ''){
            error.tipo_gasto = "Seleccione el tipo de gasto"
            validar = false
        }
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
                            if (reload) {
                                reload.reload()
                            }
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

    const handleChangeDepartamento = (event) => {
        let name = event.target.name;
        let value = parseInt(event.target.value, 10);
      
        const selectedDepartment = departamentos.find((department) => department.id_area === value);
      
        setForm((prevState) => ({
          ...prevState,
          [name]: value,
          tipo_gasto: null, // Reset the selected category when the department changes
          partidas: selectedDepartment ? selectedDepartment.partidas : [], // Update the partidas array
          presupuesto: selectedDepartment ? selectedDepartment.presupuesto_default : '', // Set presupuesto based on the selected department
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



    return (
        <>
            <div className={Style.container}>
                <div style={{marginLeft:'2.5rem'}}>

                    <div>
                        <TextField 
                            className={Style.select}
                            label="Solicitante"
                            type="text"
                            defaultValue={user.user.name}
                            InputLabelProps={{
                            shrink: true,
                            }}
                            disabled
                        />
                    </div>
                    
                    <div >
                        {departamentos.length > 0 ?
                            <>
                                <InputLabel>Departamento</InputLabel>
                                <Select
                                    className={Style.select}
                                    value={form.departamento}
                                    name="departamento"
                                    onChange={handleChangeDepartamento}
                                    disabled={user.user.tipo.id ==1 ? false : true}
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
                    {presupuestos.length > 0 && form.departamento !== '' ? (

                            <>
                                <InputLabel>Presupuesto</InputLabel>
                                <Select
                                    className={Style.select}
                                    value={form.presupuesto}
                                    name="presupuesto"
                                    onChange={handleChange}
                                    error={errores.presupuesto ? true : false}
                                >
                                {
                                    presupuestos
                                        .filter(presupuesto => presupuesto.rel.some(item => item.id_area === form.departamento))
                                        .map((presupuesto, index) => (
                                            // Usamos map solo para los objetos que pasaron el filtro anterior
                                            <MenuItem key={index} value={presupuesto.id}>
                                                {presupuesto.nombre}
                                            </MenuItem>
                                        ))
                                }
                                </Select>
                            </>
                        ) : null}
                    </div>

                   

                </div>

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

                <div className={Style.nuevaRequisicion_segundoBloque}>
                    <div className={Style.nuevaRequisicion}>
                    {form.presupuestoActual && form.partidas && form.partidas.length > 0 ? (
                            <>
                                <InputLabel>Tipo de Gasto</InputLabel>
                                <Select
                                    className={Style.select}
                                    value={form.tipo_gasto}
                                    name="tipo_gasto"
                                    onChange={handleChangeTipo}
                                    error={errores.tipo_gasto ? true : false}
                                >
                                    {form.partidas.map((category, index) => (
                                        <MenuItem key={index} value={category.id}>
                                            {category.nombre}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </>
                        ) : null}

                        
                         {form.todosPresupuestos && departamentos.length > 0 && form.departamento !== '' ? (

                                <>
                                    <InputLabel>Tipo de Gasto</InputLabel>
                                    <Select
                                        className={Style.select}
                                        value={form.tipo_gasto}
                                        name="tipo_gasto"
                                        onChange={handleChangeTipo}
                                        error={errores.tipo_gasto ? true : false}
                                    >
                                        {departamentos.find(item => item.id_area == form.departamento).partidas.map((item, index) => (
                                            <MenuItem key={index} value={item.id}>{item.nombre}</MenuItem>
                                        ))}
                                    </Select>
                                </>
                            ) : null}

                    </div>


                    {/* <div className={Style.nuevaRequisicion}>
                        {presupuestos.length > 0 && form.departamento !== '' ?
                            <>
                                <InputLabel>Presupuesto</InputLabel>
                                <Select
                                    className={Style.select}
                                    value={form.presupuesto}
                                    name="presupuesto"
                                    onChange={handleChange}
                                    error={errores.presupuesto ? true : false}
                                >
                                {
                                    presupuestos.map((item, index) => (
                                        item.filter(item.rel.some(item2 => item2.id_area == form.departamento ? 
                                            <MenuItem key={index} value={item.id}>{item.nombre}</MenuItem>
                                        ))
                                    ))
                                }
                                    
                                    {
                                    presupuestos.map((item, index) => ( 
                                        item.rel.map((item2, index2) => (
                                            item2.id_area == form.departamento ? 
                                            <MenuItem key={index} value={item.id}>{item.nombre}</MenuItem>
                                            : <></>
                                        ))
                                        
                                    ))
                                    }
                                 
                                </Select>
                            </>
                            : null
                        }
                    </div> */}
                       {/* {presupuestos.map((item, index) => ( item.id_area == form.departamento ? 
                                        <MenuItem key={index} value={item.id}>{item.nombre}</MenuItem>
                                        : <></>
                                    ))} */}
                                    {/* {itemsPresupuesto} */}
                    <div className={Style.nuevaRequisicion}>
                        <InputLabel error={errores.fecha ?true: false}>Fecha que lo requieres</InputLabel>
                        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
                            <Grid>
                                <KeyboardDatePicker
                                    className={Style.select}
                                    format="dd/MM/yyyy"
                                    name='fecha'
                                    value={form.fecha !=='' ? form.fecha : null}
                                    onChange={e=>handleChangeFecha(e,'fecha')}
                                    // defaultValue={form.fecha}
                                    placeholder="dd/mm/yyyy"
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                />
                            </Grid>
                        </MuiPickersUtilsProvider>
                    </div>

                    <div>
                        <TextField
                            className={Style.select}
                            label="Descripcion"
                            placeholder="Deja una descripción"
                            onChange={handleChangeTipo}
                            margin="normal"
                            name='descripcion'
                            defaultValue={form.descripcion}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            multiline
                            error={errores.descripcion ? true : false}
                        />
                    </div>
                  
                </div>

            </div>
            <div className={Style.container}>
                 <div>
                    <CurrencyTextField
                        label="monto solicitado"
                        variant="standard"
                        value={form.monto}
                        currencySymbol="$"
                        outputFormat="number"
                        onChange={(event, value) => handleMoney(value)}
                        error={errores.monto ? true : false}
                    />
                </div>
                </div>

            <div>
                <div className={Style.file}>
                    {/* <p id='adjuntos'>Agregar archivos
                        <input className='nuevaRequisicion_adjunto_input' type='file' onChange={handleFile}></input>
                    </p> */}
                    <label htmlFor="file">Seleccionar archivo(s)</label>
                    <input type="file" id='file' name="file" onChange={handleFile} />
                    <div>
                        {form.solicitud.name ? <div className='file-name'>{form.solicitud.name}</div> : null}
                    </div>
                    
                </div>

                <div className="row justify-content-end mt-n18" >
                    <div className="col-md-4">
                        <button className={Style.sendButton} onClick={enviar}>Agregar</button>
                    </div>
                </div>

            </div>
        </>
        
    );  
}