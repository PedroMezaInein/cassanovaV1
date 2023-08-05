import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Divider from '@material-ui/core/Divider';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';

export default function FiltrosProyectos(){

    const proyectos = useSelector(state => state.opciones.proyectos)

    const [form, setForm] = useState({
        proyecto: '',
        // fase1: proyecto.fase1 === 1 ? true : false,
        // fase2: proyecto.fase2 === 1 ? true : false,
        // fase3: proyecto.fase3 === 1 ? true : false,
        direccion: '',
        empresa: '',
        descripcion: '',
    })

    const arrayFases = [
        { value: 'fase1', name: 'Fase 1', label: 'Fase 1' },
        { value: 'fase2', name: 'Fase 2', label: 'Fase 2' },
        { value: 'fase3', name: 'Fase 3', label: 'Fase 3' },
    ]

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

    const handleChangeFase = (e) => {
        form.fase1 = 0
        form.fase2 = 0
        form.fase3 = 0
        let nuevaFase = arrayFases.filter(fase => fase.value === e.target.name)
        setForm({
            ...form,
            [e.target.name]: e.target.checked ? 1 : 0,
            fases: nuevaFase
        })
    }


    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
        
    };

    return (
        <>
            <div>
                {
                    proyectos.length > 0 ?
                    <div> 
                        {/* <InputLabel error={errores.proyecto ? true : false}>proyecto</InputLabel> */}
                        <InputLabel>proyecto</InputLabel>
                        <Autocomplete
                            name="proyecto"
                            options={proyectos}
                            getOptionLabel={(option) => option.nombre}
                            style={{ width: 230, paddingRight: '1rem' }}
                            onChange={(event, value) => handleChangeProyecto(event, value)}
                            renderInput={(params) => <TextField {...params}  variant="outlined"  label={form.proyecto_nombre ? form.proyecto_nombre : 'proyecto'} />}
                        />
                    </div>    
                        : <></>
                }
            </div>  

            <Typography className='proyect-Subtitulo'>Fase </Typography>
                <div className='container-Fases'>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={form.fase1 && !form.fase2 && !form.fase3}
                                name="fase1"
                                color="primary"
                            />
                        }
                        label="Fase 1"
                        onChange={handleChangeFase}
                    />
                    <Divider orientation="vertical" flexItem />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={form.fase2 &&  !form.fase3}
                                name="fase2"
                                color="primary"
                            />
                        }
                        label="Fase 2"
                        onChange={handleChangeFase}
                    />
                    <Divider orientation="vertical" flexItem />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={form.fase3}
                                name="fase3"
                                color='primary'
                            />
                        }
                        label="Fase 3"
                        onChange={handleChangeFase}
                    />
                </div>  

                <div style={{display: 'flex', justifyContent: 'space-evenly', width: '100%',marginTop: '1.5rem', marginBottom: '1rem'}}>
                    <TextField
                        name='direccion'
                        label="direccion"
                        type="text"
                        defaultValue={form.direccion}
                        onChange={handleChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        multiline
                        style={{ width: '70vh', height: 100 }}
                    />
                </div>

                <div style={{display: 'flex', justifyContent: 'space-evenly', width: '100%',marginTop: '1.5rem', marginBottom: '1rem'}}>
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
        </>
    )
}