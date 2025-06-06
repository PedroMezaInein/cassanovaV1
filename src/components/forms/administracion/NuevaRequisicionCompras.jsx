import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Swal from 'sweetalert2';

import { apiPostForm } from '../../../functions/api';

import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { es } from 'date-fns/locale';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import CurrencyTextField from '@unicef/material-ui-currency-textfield';

import Style from './NuevaRequisicion.module.css';
import './../../../styles/_nuevaRequisicion.scss';

export default function NuevaRequisicion(props) {
    const { handleClose, reload } = props;
    const user = useSelector(form => form.authUser);
    const departamento = useSelector(form => form.authUser.departamento);
    const departamentos = useSelector(form => form.opciones.compras);
    const presupuestos = useSelector(form => form.opciones.presupuestos);
    const proyectos = useSelector(form => form.opciones.proyectos);

    const [form, setForm] = useState({
        solicitante: user.user.id,
        fecha: '',
        departamento: departamento.departamentos[0].id,
        tipo_gasto: '',
        descripcion: '',
        solicitud: null,
        presupuesto: '',
        proyecto: '',
        monto: '',
        area: '',
        areas: [],
        partidas: [],
        presupuestoActual: true,
        todosPresupuestos: false,
        proyectos: [],
    });

    const { presupuestoActual, todosPresupuestos } = form;
    const [errores, setErrores] = useState({});


    const handleFile = (e) => {
        console.log(e);
        console.log('si entra');
        console.log(e.target.files);
    
        if (e.target.files.length > 0) { // Verificar que exista un archivo seleccionado
            setForm({
                ...form,
                solicitud: e.target.files[0] // Guardar el archivo en el estado
            });
        }
    };
    const handleChangePresupuesto = (event) => {
        let value = event.target.value;

        setForm((prevState) => ({
            ...prevState,
            presupuesto: value,
            proyecto: '', 
            area: '', 
            areas: [], 
            partidas: [], 
            proyectos: [], 
        }));

        const selectedBudget = presupuestos.find((budget) => budget.id === value);

        if (selectedBudget) {
            const proyectosMap = new Map();
            selectedBudget.rel.forEach((rel) => {
                const proyectoId = rel.id_proyecto;
                if (!proyectosMap.has(proyectoId)) {
                    const proyectoInfo = proyectos.find(p => p.id === proyectoId);
                    if (proyectoInfo) {
                        proyectosMap.set(proyectoId, {
                            id: proyectoId,
                            nombre: proyectoInfo.nombre, 
                        });
                    }
                }
            });

            setForm((prevState) => ({
                ...prevState,
                proyectos: Array.from(proyectosMap.values()),
            }));
        }
    };

    const handleChangeProyecto = (event) => {
        let value = event.target.value;

        setForm((prevState) => ({
            ...prevState,
            proyecto: value,
            area: '', 
            areas: [],
            partidas: [], 
        }));

        const selectedBudget = presupuestos.find((budget) => budget.id === form.presupuesto);

        if (selectedBudget) {
            const matchingProjectRel = selectedBudget.rel.filter((rel) => rel.id_proyecto === value);

            const updatedAreas = new Map();
            matchingProjectRel.forEach((rel) => {
                departamentos.forEach((area) => {
                    if (String(area.id_area) === String(rel.id_area)) {
                        updatedAreas.set(area.id_area, {
                            id: area.id_area,
                            nombre: area.nombreArea,
                        });
                    }
                });
            });

            setForm((prevState) => ({
                ...prevState,
                areas: Array.from(updatedAreas.values()),
            }));
        }
    };

    const handleChangeArea = (event) => {
        let value = event.target.value;
    
        setForm((prevState) => ({
            ...prevState,
            area: value,
            partidas: [], // Reset partidas when area changes
        }));
    
        const selectedArea = departamentos.find((area) => String(area.id_area) === String(value));
        
        console.log('Selected Area:', selectedArea); // Debugging line
    
        if (selectedArea) {
            if (presupuestoActual) {
                const selectedBudget = presupuestos.find((budget) => budget.id === form.presupuesto);
    
                console.log('Selected Budget:', selectedBudget); // Debugging line
    
                if (selectedBudget) {
                    // Extraer todos los id_partida de selectedBudget.rel
                    const validPartidasIds = selectedBudget.rel.map(rel => String(rel.id_partida)); // Convertir a string
    
                    console.log('Valid Partidas IDs:', validPartidasIds); // Debugging line
    
                    // Filtrar las partidas de selectedArea que están en validPartidasIds
                    const filteredPartidas = selectedArea.partidas.filter(partida => 
                        validPartidasIds.includes(String(partida.id)) // Convertir a string para comparación
                    );
    
                    console.log('Filtered Partidas:', filteredPartidas); // Debugging line
    
                    setForm((prevState) => ({
                        ...prevState,
                        partidas: filteredPartidas, // Actualizar con las partidas filtradas
                    }));
                } else {
                    console.log('No budget selected or budget not found in presupuestos'); // Debugging line
                }
            } else if (todosPresupuestos) {
                // Si "Todos" está seleccionado, mostrar todas las partidas del área seleccionada
                setForm((prevState) => ({
                    ...prevState,
                    partidas: selectedArea.partidas, // Mostrar todas las partidas del área
                }));
            }
        } else {
            console.log('No area selected or area not found in departamentos'); // Debugging line
        }
    };

    const handleChangeFecha = (date, tipo) => {
        setForm({
            ...form,
            [tipo]: new Date(date)
        });
    };

    const validateForm = () => {
        let validar = true;
        let error = {};
        if (form.departamento === '') {
            error.departamento = "Seleccione un departamento";
            validar = false;
        }
        if (form.tipo_gasto === '') {
            error.tipo_gasto = "Seleccione el tipo de gasto";
            validar = false;
        }
        if (form.descripcion === '') {
            error.descripcion = "Escriba una descripcion";
            validar = false;
        }
        if (form.presupuesto === '') {
            error.presupuesto = "Seleccione un presupuesto";
            validar = false;
        }
        if (form.fecha === '' || form.fecha === null) {
            error.fecha = "Seleccione una fecha";
            validar = false;
        }

        setErrores(error);
        return validar;
    };

    function formatDate(date) {
        var year = date.getFullYear();
        var month = (1 + date.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;
        var day = date.getDate().toString();
        day = day.length > 1 ? day : '0' + day;
        return year + '/' + month + '/' + day;
    }

    const enviar = () => {
        if (validateForm()) {
            Swal.fire({
                title: 'Cargando...',
                allowOutsideClick: false,
                onBeforeOpen: () => {
                    Swal.showLoading();
                }
            });
            try {
                console.log(form)

                let dataForm = new FormData();
                let newForm = {
                    id_solicitante: form.solicitante,
                    id_departamento: form.area,
                    id_gasto: form.tipo_gasto,
                    id_proyecto: form.proyecto,

                    descripcion: form.descripcion,
                    fecha: formatDate(form.fecha),
                    presupuesto: form.presupuesto,
                    monto: form.monto
                };

                let aux = Object.keys(newForm);

                aux.forEach((element) => {
                    dataForm.append(element, newForm[element]);
                });

                dataForm.append(`files_name_requisicion[]`, 'requisicion01');
                dataForm.append(`files_requisicion[]`, form.solicitud);
                dataForm.append('adjuntos[]', "requisicion");
                console.log(dataForm)
                apiPostForm('requisicion/compras', dataForm, user.access_token)
                    .then((data) => {
                        Swal.fire({
                            title: 'Requisicion enviada',
                            text: 'La requisicion se ha enviado correctamente',
                            icon: 'success',
                            showConfirmButton: true,
                            timer: 2000,
                        }).then(() => {
                            if (reload) {
                                reload.reload();
                            }
                            handleClose();
                        });
                    })
                    .catch((error) => {
                        Swal.close();
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Ha ocurrido un error 1',
                        });
                        console.log(error);
                    });
            } catch (error) {
                Swal.close();
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Ha ocurrido un error 2',
                });
                console.log(error);
            }
        } else {
            Swal.fire({
                title: 'Faltan campos',
                text: 'Favor de llenar todos los campos',
                icon: 'info',
                showConfirmButton: false,
                timer: 2000,
            });
        }
    };

    const handleChangeDepartamento = (event) => {
        let name = event.target.name;
        let value = parseInt(event.target.value, 10);

        const selectedDepartment = departamentos.find((department) => department.id_area === value);

        setForm((prevState) => ({
            ...prevState,
            [name]: value,
            tipo_gasto: null,
            partidas: selectedDepartment ? selectedDepartment.partidas : [], 
            presupuesto: selectedDepartment ? selectedDepartment.presupuesto_default : '', 
        }));
    };

    const handleMoney = (e) => {
        setForm({
            ...form,
            monto: e
        });
    };

    const handleChangeCheckbox = (event) => {
        const { name, checked } = event.target;

        if (name === 'presupuestoActual' && checked) {
            setForm((prevState) => ({
                ...prevState,
                presupuestoActual: true,
                todosPresupuestos: false,
                partidas: [], 
                areas: [], // Reset areas to reflect correct state
            }));
        } else if (name === 'todosPresupuestos' && checked) {
            const allAreas = departamentos.map(departamento => ({
                id: departamento.id_area,
                nombre: departamento.nombreArea,
            }));

            setForm((prevState) => ({
                ...prevState,
                presupuestoActual: false,
                todosPresupuestos: true,
                areas: allAreas, // Mostrar todas las áreas
                partidas: [], // Resetear partidas al cambiar
            }));
        } else {
            setForm((prevState) => ({
                ...prevState,
                presupuestoActual: false,
                todosPresupuestos: false,
                partidas: [], 
                areas: [], // Reset areas if neither checkbox is selected
            }));
        }
    };

    const handleChangeTipo = (event) => {
        let name = event.target.name;
        setForm({
            ...form,
            [name]: event.target.value,
        });
    };

    console.log(form)

    return (
        <>
            <div className={Style.container}>
                <div style={{ marginLeft: '2.5rem' }}>
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

                    <div>
                        <>
                            <InputLabel>Presupuesto</InputLabel>
                            <Select
                                className={Style.select}
                                value={form.presupuesto}
                                name="presupuesto"
                                onChange={handleChangePresupuesto}
                                error={errores.presupuesto ? true : false}
                            >
                                {presupuestos
                                    .filter(presupuesto => presupuesto.observaciones === "Presupuesto Obra")
                                    .map((presupuesto, index) => (
                                        <MenuItem key={index} value={presupuesto.id}>
                                            {presupuesto.nombre}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </>
                    </div>
                 
                    <div>
                        {form.proyectos && form.proyectos.length > 0 && (
                            <>
                                <InputLabel>Proyecto</InputLabel>
                                <Select
                                    className={Style.select}
                                    value={form.proyecto}
                                    name="proyecto"
                                    onChange={handleChangeProyecto}
                                    error={errores.proyecto ? true : false}
                                >
                                    {form.proyectos.map((proyecto, index) => (
                                        <MenuItem key={index} value={proyecto.id}>
                                            {proyecto.nombre} ({proyecto.id})
                                        </MenuItem>
                                    ))}
                                </Select>
                            </>
                        )}
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


                <div>
                        {form.areas && form.areas.length > 0 && (
                            <>
                                <InputLabel>Área</InputLabel>
                                <Select
                                    className={Style.select}
                                    value={form.area}
                                    name="area"
                                    onChange={handleChangeArea}
                                    error={errores.area ? true : false}
                                >
                                    {form.areas.map((area, index) => (
                                        <MenuItem key={index} value={area.id}>
                                            {area.nombre}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </>
                        )}
                    </div>
                    <div className={Style.nuevaRequisicion}>
                    <div>

                            {form.presupuestoActual && form.partidas && form.partidas.length > 0 ? (
                                <>
                                    <InputLabel>Partida</InputLabel>
                                    <Select
                                        className={Style.select}
                                        value={form.tipo_gasto}
                                        name="tipo_gasto"
                                        onChange={handleChangeTipo}
                                        error={errores.tipo_gasto ? true : false}
                                    >
                                        {form.partidas.map((partida, index) => (
                                            <MenuItem key={index} value={partida.id}>
                                                {partida.nombre}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </>
                            ) : null}
                        </div>

                        <div>

                        {form.todosPresupuestos && form.partidas.length > 0 ? (
                            <>
                                <InputLabel>Partida</InputLabel>
                                <Select
                                    className={Style.select}
                                    value={form.tipo_gasto}
                                    name="tipo_gasto"
                                    onChange={handleChangeTipo}
                                    error={errores.tipo_gasto ? true : false}
                                >
                                    {form.partidas.map((partida, index) => (
                                        <MenuItem key={index} value={partida.id}>
                                            {partida.nombre}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </>
                        ) : null}
                         </div>

                    </div>

                    <div className={Style.nuevaRequisicion}>
                        <InputLabel error={errores.fecha ? true : false}>Fecha que lo requieres</InputLabel>
                        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
                            <Grid>
                                <KeyboardDatePicker
                                    className={Style.select}
                                    format="dd/MM/yyyy"
                                    name='fecha'
                                    value={form.fecha !== '' ? form.fecha : null}
                                    onChange={e => handleChangeFecha(e, 'fecha')}
                                    placeholder="dd/mm/yyyy"
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                />
                            </Grid>
                        </MuiPickersUtilsProvider>
                    </div>

                   
                </div>

            </div>
            <div className={Style.container}>
                      <div>
                        <TextField
                            className={Style.select}
                            label="Descripcion"
                            placeholder="Deja una descripción"
                            onChange={handleChangeTipo}
                            margin="normal"
                            name='descripcion'
                            rows={2} // Número de filas visibles inicialmente
                            rowsMax={8} // Número máximo de filas
                            fullWidth 
                            defaultValue={form.descripcion}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            multiline
                            error={errores.descripcion ? true : false}
                        />
                    </div>
                <div>
                    <CurrencyTextField
                        label="monto solicitado"
                        variant="standard"
                        value={form.monto}
                        currencySymbol="$"
                        outputFormat="number"
                        modifyValueOnWheel={false}
                        onChange={(event, value) => handleMoney(value)}
                        error={errores.monto ? true : false}
                    />
                </div>
            </div>

            <div>
                <div className={Style.file}>
                    <div>
                        <label htmlFor="file">Seleccionar archivo(s)</label>
                        <input type="file" id='file' name="file" accept="image/png, image/jpeg, .pdf" onChange={handleFile}  />
                            {form.solicitud && form.solicitud.name ? ( // Verifica que form.solicitud sea un objeto válido
                                <div className='file-name'>{form.solicitud.name}</div>
                            ) : null}
                    </div>
                </div>

                <div className="row justify-content-end mt-n18">
                    <div className="col-md-4">
                        <button className={Style.sendButton} onClick={enviar}>Agregar</button>
                    </div>
                </div>
            </div>
        </>
    );
}
