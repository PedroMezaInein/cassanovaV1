import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
  Box, Typography, List, ListItem, ListItemIcon, ListItemText, IconButton,
  CircularProgress, Button, MenuItem, TextField
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import Swal from 'sweetalert2';
import { useDropzone } from 'react-dropzone';
import { apiGet, apiPostForm } from '../../../functions/api';
import { Stack } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Grid from '@mui/material/Grid';
import { format } from 'date-fns'
import { es } from 'date-fns/locale'


const tiposAdjuntos = [
  { codigo: 'ACNA', descripcion: 'Acta de nacimiento', obligatorio: true },
  { codigo: 'CURP', descripcion: 'CURP', obligatorio: true },
  { codigo: 'RFC', descripcion: 'Constancia de situación fiscal', obligatorio: true },
  { codigo: 'NSS', descripcion: 'Credencial IMSS', obligatorio: true },
  { codigo: 'IDO', descripcion: 'INE', obligatorio: true },
  // Agrega más según tu tabla
];

const ComponenteAdjuntos = ({ colaborador }) => {
  const [adjuntos, setAdjuntos] = useState([]);
  const [loading, setLoading] = useState(false);

  const [tipo, setTipo] = useState('');
  // const [nombrePersonalizado, setNombrePersonalizado] = useState('');
  const [archivo, setArchivo] = useState(null);
  const userAuth = useSelector(state => state.authUser);
  const [pendientes, setPendientes] = useState([]); // archivos por enviar


  // const fetchAdjuntos = async () => {
  //   setLoading(true);
  //   try {
  //     const res = await apiGet(`v2/rh/empleados/${colaborador.id}/adjuntos`, userAuth.access_token);
  //     setAdjuntos(res.data.data);
  //   } catch (error) {
  //     Swal.fire('Error', 'No se pudieron obtener los adjuntos.', 'error');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setArchivo(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
  });

  // const handleUpload = async () => {
  //   if (!archivo || !tipo) {
  //     return Swal.fire('Error', 'Selecciona un archivo y un tipo de adjunto.', 'warning');
  //   }

  //   const formData = new FormData();
  //   formData.append('archivo', archivo);
  //   formData.append('tipo', tipo);
  //   // formData.append('nombre', nombrePersonalizado || archivo.name);

  //   try {
  //     await apiPostForm(`v2/rh/empleados/${colaborador.id}/adjuntos`, formData);
  //     Swal.fire('Éxito', 'Archivo subido correctamente.', 'success');
  //     setArchivo(null);
  //     setTipo('');
  //     // setNombrePersonalizado('');
  //     fetchAdjuntos();
  //   } catch (error) {
  //     Swal.fire('Error', 'No se pudo subir el archivo.', 'error');
  //   }
  // };

  useEffect(() => {
    if (colaborador?.adjuntos && Array.isArray(colaborador.adjuntos)) {
      setAdjuntos(colaborador.adjuntos);
    } else if (colaborador?.datos_generales && Array.isArray(colaborador.datos_generales)) {
      setAdjuntos(colaborador.datos_generales);
    } else {
      setAdjuntos([]);
    }
  }, [colaborador]);

  

  const [tiposAdjuntos, setTiposAdjuntos] = useState([]);

useEffect(() => {
  const fetchTipos = async () => {
    try {
      const res = await apiGet('v2/rh/empleados/tipos-adjuntos', userAuth.access_token); // Ajusta URL según tu API
      setTiposAdjuntos(res.data.data);
    } catch (error) {
      Swal.fire('Error', 'No se pudieron cargar los tipos de adjuntos.', 'error');
    }
  };

  fetchTipos();
}, []);

    const handleAgregar = () => {
      const tipoSeleccionado = tiposAdjuntos.find(t => t.id === parseInt(tipo));
      if (!archivo || !tipoSeleccionado) {
        return Swal.fire('Error', 'Selecciona archivo y tipo válido.', 'warning');
      }

      // Evitar duplicados por tipo
      const yaExiste = pendientes.find(p => p.tipoId === tipoSeleccionado.id);
      if (yaExiste) {
        return Swal.fire('Advertencia', 'Este tipo de documento ya está en la lista.', 'info');
      }

      const nuevo = {
        archivo,
        tipoId: tipoSeleccionado.id,
        tipoCodigo: tipoSeleccionado.codigo,
        descripcion: tipoSeleccionado.descripcion,
        nombre: archivo.name,
      };

      setPendientes(prev => [...prev, nuevo]);
      setArchivo(null);
      setTipo('');
    };

const handleSubirTodos = async () => {
  if (pendientes.length === 0) {
    return Swal.fire('Info', 'No hay archivos para subir.', 'info');
  }

  try {
    for (const doc of pendientes) {
      const formData = new FormData();
      formData.append('archivo', doc.archivo);
      formData.append('tipo', doc.tipo);
      formData.append('nombre', doc.nombre);

      await apiPostForm(`v2/rh/empleados/${colaborador.id}/adjuntos`, formData);
    }

    Swal.fire('Éxito', 'Todos los archivos fueron subidos.', 'success');
    setPendientes([]);
    // fetchAdjuntos();
  } catch (error) {
    Swal.fire('Error', 'Ocurrió un error al subir los archivos.', 'error');
  }
};

const handleEnviarAgrupado = async () => {
  if (pendientes.length === 0) {
    return Swal.fire('Info', 'No hay archivos para subir.', 'info');
  }

  const data = new FormData();
  const agrupados = {};

  // Agrupar los archivos por tipo
  pendientes.forEach(doc => {
      if (!agrupados[doc.tipoId]) agrupados[doc.tipoId] = [];
      agrupados[doc.tipoId].push(doc);
    });


  // Estructura compatible con Laravel
    Object.entries(agrupados).forEach(([tipoId, docs]) => {
      // console.log(tipoId)
      docs.forEach(doc => {
        data.append(`files_name_${tipoId}[]`, doc.nombre);
        data.append(`files_${tipoId}[]`, doc.archivo);
      });
      data.append('adjuntos[]', tipoId);
    });

    data.append('id', colaborador.id);

  try {
   const res = await apiPostForm('rh/empleado/adjuntos', data, userAuth.access_token);
    Swal.fire('Éxito', 'Todos los archivos fueron enviados agrupados.', 'success');
    setPendientes([]);
    // fetchAdjuntos();
    // ✅ Actualiza los adjuntos con los nuevos datos del backend
      if (res.data?.empleado?.datos_generales) {
        setAdjuntos(res.data.empleado.datos_generales);
      }


    // setAdjuntos(...) si necesitas refrescar localmente
  } catch (error) {
    Swal.fire('Error', 'Error al enviar los adjuntos agrupados.', 'error');
    console.error(error);
  }
};

const agruparPorSeccion = (lista) => {
  return lista.reduce((acc, item) => {
    const seccion = item?.tipo_adjunto?.seccion || 'OTROS';
    if (!acc[seccion]) acc[seccion] = [];
    acc[seccion].push(item);
    return acc;
  }, {});
};

const generarColorHex = (texto) => {
  let hash = 0;
  for (let i = 0; i < texto.length; i++) {
    hash = texto.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = (hash & 0x00ffffff).toString(16).toUpperCase();
  return '#' + '00000'.substring(0, 6 - color.length) + color;
};



const coloresPorSeccion = {
  DP: '#e3f2fd', // Datos Personales
  DOCA: '#fce4ec', // Documentos Académicos
  OTROS: '#f5f5f5', // por default
};

// useEffect(() => {
//     fetchAdjuntos();
//   }, [colaborador]);


  return (
    <Box>
      <Typography variant="h6" mb={2}>
        Adjuntos de {colaborador?.nombre} {colaborador?.apellido_paterno}
      </Typography>
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <Box {...getRootProps()} sx={{
          border: '2px dashed #90caf9',
          borderRadius: 2,
          p: 3,
          textAlign: 'center',
          backgroundColor: isDragActive ? '#e3f2fd' : '#f9f9f9',
          color: '#1976d2',
          transition: '0.2s',
          '&:hover': {
            backgroundColor: '#f1faff',
          },
        }}>
          <input {...getInputProps()} />
          <CloudUploadIcon sx={{ fontSize: 50 }} />
          <Typography variant="body1" mt={1}>
            {archivo ? archivo.name : 'Arrastra y suelta un archivo o haz clic aquí'}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
         <TextField
            select
            label="Tipo de documento"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            fullWidth
          >
           {tiposAdjuntos.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                [{item.codigo}] {item.descripcion} {item.obligatorio ? '(Obligatorio)' : ''}
              </MenuItem>
            ))}

          </TextField>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        {/* <TextField
            label="Nombre personalizado (opcional)"
            value={nombrePersonalizado}
            onChange={(e) => setNombrePersonalizado(e.target.value)}
            fullWidth
          /> */}
      </Grid>
      
      <Grid item xs={12} sm={6} md={6}>
          <Button  variant="contained" color="success"  onClick={handleEnviarAgrupado}  disabled={pendientes.length === 0}  >
              Subir todos
            </Button>
      </Grid>

      <Grid item xs={12} sm={6} md={6}>
          <Button variant="outlined"  color="primary" onClick={handleAgregar} disabled={!archivo || !tipo} >
              Agregar a la lista
          </Button>
      </Grid>

    


    </Grid>
       <Box mt={4}>
        <Typography variant="subtitle1" gutterBottom>
          Archivos por subir:
        </Typography>

        {pendientes.length === 0 ? (
          <Typography color="text.secondary">No hay archivos pendientes.</Typography>
        ) : (
          <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 2 }}>
          {pendientes.map((doc, i) => (
              <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                <Box>
                  <Typography fontWeight="bold">{doc.nombre}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    [{doc.tipoCodigo}] {doc.descripcion}
                  </Typography>
                </Box>
                <IconButton onClick={() => setPendientes(pendientes.filter((_, idx) => idx !== i))}>
                  ❌
                </IconButton>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* Lista de archivos */}
        {loading ? (
        <CircularProgress />
      ) : (
        <List dense>
          {Object.entries(agruparPorSeccion(adjuntos)).map(([seccion, documentos], index) => (
            <Box key={index} sx={{ mb: 3 }}>
              <Box
                sx={{
                  backgroundColor: generarColorHex(seccion),
                  px: 2,
                  py: 1,
                  borderRadius: 1,
                }}
              >
                <Typography variant="subtitle2" fontWeight="bold" color="#fff">
                  Sección: {seccion}
                </Typography>
              </Box>

              <List dense>
                {documentos.map((adj, idx) => {
                  const fechaFormateada = adj.created_at
                    ? format(new Date(adj.created_at), "dd 'de' MMMM yyyy, HH:mm", { locale: es })
                    : 'Fecha desconocida';

                  return (
                    <ListItem key={idx} divider>
                      <ListItemIcon><InsertDriveFileIcon /></ListItemIcon>
                      <ListItemText
                        primary={adj?.tipo_adjunto?.descripcion || `Archivo ${idx + 1}`}
                        secondary={`Subido: ${fechaFormateada}`}
                      />
                      <IconButton onClick={() => window.open(adj.url, '_blank')}>
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton component="a" href={adj.url} target="_blank" rel="noopener noreferrer">
                        <DownloadIcon />
                      </IconButton>
                    </ListItem>
                  );
                })}
              </List>
            </Box>
          ))}


        </List>
      )}
     

    </Box>
    
    
  );
};

export default ComponenteAdjuntos;
