import React, { useState, useEffect } from 'react';
import {
    Box, Button, Grid, TextField, Autocomplete, InputLabel, Typography, Paper, IconButton
} from '@mui/material';
import { apiGet, apiPostForm } from '../../../functions/api';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import CategoryIcon from '@mui/icons-material/Category';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import NumbersIcon from '@mui/icons-material/Numbers';


export default function FormMaterialBodega({ tipo: tipoProp, onSuccess, onCancel, open }) {
    const auth = useSelector((state) => state.authUser.access_token);

    // Ahora sí, tipoProp existe y lo blindamos
    const tipo = (tipoProp || 'material').trim().toLowerCase() === 'herramienta'
        ? 'herramienta'
        : 'material';

    const tipoRuta = tipo;
    const esHerramientaRuta = tipo === 'herramienta';

    const [form, setForm] = useState(() => ({
        nombre: '',
        cantidad: tipoRuta === 'herramienta' ? '' : 1,
        descripcion: '',
        partida: null,
        unidad: null,
        ubicacion: '',
        fecha_compra: null,
        fecha_entrada: null,
        proveedor: '',
        marca: '',
        modelo: '',
        serie: '',
        archivos: [],
        tipo: tipoRuta,   // inicia correcto
        estatus: '',
    }));

    // 2) Luego derivados seguros

    const esHerramienta = tipoRuta === 'herramienta';


    // 3) Sincroniza al abrir/cambiar URL
    useEffect(() => {
        if (!open) return;
        setForm(prev => ({
            ...prev,
            tipo: tipoRuta, // fuerza lo que viene en la ruta
            cantidad: tipoRuta === 'herramienta' ? '' : (prev.cantidad || 1),
        }));
    }, [tipoRuta, open, esHerramientaRuta]);



    const [options, setOptions] = useState({ partidas: [], unidades: [] });

    const tipoVista = form.tipo || (tipo === 'herramientas' ? 'herramienta' : 'material');



    const scrollRef = React.useRef(null);
    // const tipoFinal = form.tipo || (tipo === 'herramientas' ? 'herramienta' : 'material');

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const res = await apiGet('v1/proyectos/bodegas?solo_opciones=true', auth);
                setOptions({
                    partidas: res.data.partidas || [],
                    unidades: res.data.unidades || [],
                });
            } catch (err) {
                console.error('Error al cargar opciones:', err);
            }
        };
        fetchOptions();
    }, []);





    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files)
            .filter(file => file instanceof File && file.name && file.size > 0);

        if (newFiles.length === 0) {
            Swal.fire('Archivo inválido o vacío', '', 'warning');
            return;
        }

        handleChange('archivos', [...form.archivos, ...newFiles]);
    };


    const handleSubmit = async () => {
        console.log('Formulario a enviar:', form);

        const tipoFinal = tipoRuta;

        if (!form.nombre || !form.partida || !form.unidad) {
            Swal.fire('Completa todos los campos requeridos', '', 'warning');
            return;
        }

        if (tipoFinal === 'material') {
            const qty = Number(form.cantidad);
            if (!qty || qty < 1) {
                Swal.fire('La cantidad debe ser al menos 1', '', 'warning');
                return;
            }
        }

        const payload = new FormData();
        payload.append('nombre', form.nombre);
        payload.append('descripcion', form.descripcion);
        payload.append('partida_id', form.partida?.id ?? '');
        payload.append('unidad_id', form.unidad?.id ?? '');
        payload.append('ubicacion', form.ubicacion);
        payload.append('tipo', tipoFinal);

        payload.append('cantidad', String(esHerramienta ? 1 : (Number(form.cantidad) || 1)));

        payload.append('fecha_compra', form.fecha_compra || '');
        payload.append('fecha_entrada', form.fecha_entrada || '');
        payload.append('proveedor', form.proveedor);
        payload.append('marca', form.marca);
        payload.append('modelo', form.modelo);
        payload.append('serie', form.serie);
        payload.append('estatus', form.estatus || '');

        (form.archivos || []).forEach((file) => {
            if (file instanceof File && file.name && file.size > 0) {
                payload.append('files[]', file);
            }
        });

        try {
            await apiPostForm('v1/proyectos/bodegas', payload, auth);
            Swal.fire('Guardado con éxito', '', 'success');
            onSuccess();
        } catch (error) {
            console.error(error);
            Swal.fire('Error al guardar', '', 'error');
        }
    };



    const handleScroll = (direction) => {
        if (scrollRef.current) {
            const offset = 200;
            scrollRef.current.scrollBy({ left: direction === 'left' ? -offset : offset, behavior: 'smooth' });
        }
    };

    const [activeSlide, setActiveSlide] = useState(0);

    const handleDeleteFile = () => {
        const nuevosArchivos = [...form.archivos];
        nuevosArchivos.splice(activeSlide, 1);
        setForm(prev => ({ ...prev, archivos: nuevosArchivos }));
        setActiveSlide((prev) => Math.max(0, prev - 1));
    };

    const handleViewFile = () => {
        const file = form.archivos[activeSlide];
        const url = URL.createObjectURL(file);
        window.open(url, '_blank');
    };
    return (
        <Box component="form" noValidate autoComplete="off" sx={{ p: 3 }}>
            <Grid container spacing={2}>

                <Grid item xs={12} md={4}>
                    <TextField fullWidth label="Nombre" value={form.nombre} onChange={(e) => handleChange('nombre', e.target.value)} />
                </Grid>

                {!esHerramienta && (
                    <Grid item xs={12} md={4}>
                        <TextField
                            label="Cantidad"
                            type="number"
                            value={form.cantidad || ''}
                            onChange={(e) => setForm(p => ({ ...p, cantidad: e.target.value }))}
                            fullWidth
                            InputProps={{ startAdornment: (<InputAdornment position="start"><NumbersIcon fontSize="small" /></InputAdornment>) }}
                        />
                    </Grid>
                )}



                <Grid item xs={12} md={4}>
                    <Autocomplete
                        options={options.unidades}
                        getOptionLabel={(option) => option.nombre || ''}
                        isOptionEqualToValue={(option, value) => option.id === value?.id}
                        onChange={(_, value) => handleChange('unidad', value)}
                        value={form.unidad}
                        renderOption={(props, option) => (
                            <li {...props} key={option.id}>
                                {option.nombre}
                            </li>
                        )}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Unidad"
                                InputProps={{
                                    ...params.InputProps,
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Inventory2Icon fontSize="small" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        )}
                    />

                </Grid>

                <Grid item xs={12} md={4}>
                    <Autocomplete
                        options={options.partidas}
                        getOptionLabel={(option) => option.nombre || ''}
                        isOptionEqualToValue={(option, value) => option.id === value?.id} // ✅ NECESARIO
                        onChange={(_, value) => handleChange('partida', value)}
                        value={form.partida}

                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Partida"
                                InputProps={{
                                    ...params.InputProps,
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <CategoryIcon fontSize="small" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <TextField
                        fullWidth
                        label="Fecha de Compra"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={form.fecha_compra || ''}
                        onChange={(e) => handleChange('fecha_compra', e.target.value)}
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <TextField
                        fullWidth
                        label="Fecha de Entrada"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={form.fecha_entrada || ''}
                        onChange={(e) => handleChange('fecha_entrada', e.target.value)}
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <TextField fullWidth label="Proveedor" value={form.proveedor} onChange={(e) => handleChange('proveedor', e.target.value)} />
                </Grid>

                <Grid item xs={12} md={4}>
                    <TextField fullWidth label="Marca" value={form.marca} onChange={(e) => handleChange('marca', e.target.value)} />
                </Grid>

                <Grid item xs={12} md={4}>
                    <TextField fullWidth label="Modelo" value={form.modelo} onChange={(e) => handleChange('modelo', e.target.value)} />
                </Grid>

                <Grid item xs={12} md={4}>
                    <TextField fullWidth label="No. de Serie" value={form.serie} onChange={(e) => handleChange('serie', e.target.value)} />
                </Grid>

                <Grid item xs={12} md={4}>
                    <TextField
                        select
                        fullWidth
                        label="Tipo Detalle"
                        value={form.tipo}        // 👈 usa el estado sincronizado
                        disabled                 // 👈 bloqueado por la ruta
                        
                        onChange={(e) => {
                            // (no hará nada por estar disabled, pero si lo habilitas algún día)
                            const v = e.target.value; // 'material' | 'herramienta'
                            setForm(prev => ({
                                ...prev,
                                tipo: v,
                                cantidad: v === 'herramienta' ? '' : (prev.cantidad || 1),
                            }));
                        }}
                    >
                        <MenuItem value="material">Material</MenuItem>
                        <MenuItem value="herramienta">Herramienta</MenuItem>
                    </TextField>
                </Grid>



                <Grid item xs={12} md={4}>
                    <TextField fullWidth label="Ubicación" value={form.ubicacion} onChange={(e) => handleChange('ubicacion', e.target.value)} />
                </Grid>
                <Grid item xs={12} md={4}>
                    <TextField
                        select
                        fullWidth
                        label="Estatus"
                        value={form.estatus}
                        onChange={(e) => handleChange('estatus', e.target.value)}
                    >
                        <MenuItem value="disponible">Disponible</MenuItem>
                        <MenuItem value="precaución">Precaución</MenuItem>
                        <MenuItem value="dañado">Dañado</MenuItem>
                        <MenuItem value="no disponible">No disponible</MenuItem>
                        <MenuItem value="vendido">Vendido</MenuItem>
                    </TextField>
                </Grid>


                {/* FILA 3: Descripción */}
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Descripción"
                        multiline
                        minRows={3}
                        value={form.descripcion}
                        onChange={(e) => handleChange('descripcion', e.target.value)}
                    />
                </Grid>

                {/* CARRUSEL DE ARCHIVOS */}
                <Grid item xs={12}>
                    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" mt={2}>
                        <Box display="flex" alignItems="center" justifyContent="center" gap={3}>
                            <IconButton onClick={() => setActiveSlide((prev) => (prev - 1 + form.archivos.length + 1) % (form.archivos.length + 1))}>
                                <ArrowBackIosIcon />
                            </IconButton>

                            {activeSlide === form.archivos.length ? (
                                <label htmlFor="archivo-bodega">
                                    <Box
                                        sx={{
                                            height: 200,
                                            width: 200,
                                            border: '2px solid #007bff',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: 2,
                                            cursor: 'pointer',
                                            backgroundColor: '#fff',
                                            '&:hover': { backgroundColor: '#e6f0ff' },
                                            transition: '0.3s',
                                        }}
                                    >
                                        <CloudUploadIcon sx={{ color: '#007bff', fontSize: 48 }} />
                                        <Typography variant="caption">Agregar archivo</Typography>
                                        <input type="file" id="archivo-bodega" hidden multiple onChange={handleFileChange} />
                                    </Box>
                                </label>
                            ) : (
                                <Box display="flex" flexDirection="column" alignItems="center">
                                    <Box
                                        component="img"
                                        src={URL.createObjectURL(form.archivos[activeSlide])}
                                        alt={form.archivos[activeSlide].name}
                                        sx={{
                                            height: 200,
                                            width: 200,
                                            objectFit: 'contain',
                                            borderRadius: 2,
                                        }}
                                    />
                                    <Typography variant="caption" sx={{ mt: 1, maxWidth: 200, textAlign: 'center', wordBreak: 'break-word' }}>
                                        {form.archivos[activeSlide].name}
                                    </Typography>

                                    <Box mt={1} display="flex" justifyContent="center" gap={1}>
                                        <IconButton onClick={handleViewFile}>
                                            <VisibilityIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton onClick={handleDeleteFile}>
                                            <DeleteIcon fontSize="small" color="error" />
                                        </IconButton>
                                    </Box>
                                </Box>
                            )}

                            <IconButton onClick={() => setActiveSlide((prev) => (prev + 1) % (form.archivos.length + 1))}>
                                <ArrowForwardIosIcon />
                            </IconButton>
                        </Box>
                    </Box>
                </Grid>

                {/* BOTONES */}
                <Grid item xs={12} display="flex" justifyContent="flex-end" gap={2} mt={2}>
                    <Button variant="contained" color="secondary" onClick={onCancel}>Cancelar</Button>
                    <Button variant="contained" onClick={handleSubmit}>Guardar</Button>
                </Grid>
            </Grid>
        </Box>

    );
}
