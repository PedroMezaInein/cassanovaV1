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
import { apiGet, apiPostForm, apiDelete } from '../../../functions/api';
import { Stack } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Grid from '@mui/material/Grid';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import ListSubheader from '@mui/material/ListSubheader';

const ComponenteAdjuntos = ({ colaborador }) => {
  const [adjuntos, setAdjuntos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tempMeta, setTempMeta] = useState({})
  const [tipo, setTipo] = useState('');
  const [archivo, setArchivo] = useState(null);
  const userAuth = useSelector(state => state.authUser);
  const [pendientes, setPendientes] = useState([]);

  // 🔹 NUEVO: mapa de URLs temporales { [adjuntoId]: url_temporal }
  const [tempUrls, setTempUrls] = useState({});
  const [refreshing, setRefreshing] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) setArchivo(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
  });

useEffect(() => {
  fetchAdjuntos();
}, [fetchAdjuntos]);

  const [tiposAdjuntos, setTiposAdjuntos] = useState([]);

  useEffect(() => {
    const fetchTipos = async () => {
      try {
        const res = await apiGet('v2/rh/empleados/tipos-adjuntos', userAuth.access_token);
        setTiposAdjuntos(res.data.data);
      } catch (error) {
        Swal.fire('Error', 'No se pudieron cargar los tipos de adjuntos.', 'error');
      }
    };
    fetchTipos();
  }, []);
  // Lee el vencimiento real desde la URL presignada de S3
  const parseS3Expiry = (url) => {
    try {
      const u = new URL(url);
      const expSec = Number(u.searchParams.get('X-Amz-Expires'));
      const dateStr = u.searchParams.get('X-Amz-Date'); // p.ej. 20250902T233019Z
      if (!expSec || !dateStr) return null;

      // YYYYMMDDTHHMMSSZ
      const y = +dateStr.slice(0, 4);
      const m = +dateStr.slice(4, 6) - 1;
      const d = +dateStr.slice(6, 8);
      const H = +dateStr.slice(9, 11);
      const M = +dateStr.slice(11, 13);
      const S = +dateStr.slice(13, 15);
      const base = new Date(Date.UTC(y, m, d, H, M, S));
      return new Date(base.getTime() + expSec * 1000);
    } catch {
      return null;
    }
  };

  // 🔹 NUEVO: refrescar URLs temporales (por lote o una lista de ids)
  const refreshUrls = useCallback(
    async (idsParam = null) => {
      const ids = idsParam || adjuntos.map(a => a.id).filter(Boolean);
      if (!colaborador?.id || ids.length === 0) return null;

      try {
        setRefreshing(true);
        // ¡Deja que el back decida el TTL! (no mandamos expires_in)
        const res = await apiPostForm(
          `rh/empleado/${colaborador.id}/adjuntos/presign`,
          { ids },
          userAuth.access_token
        );

        const list = Array.isArray(res?.data) ? res.data : [];
        const urlMap = {};
        const metaMap = {};

        list.forEach(({ id, url_temporal }) => {
          urlMap[id] = url_temporal;
          const expiresAt = parseS3Expiry(url_temporal);
          if (expiresAt) metaMap[id] = { expiresAt };
        });

        setTempUrls(prev => ({ ...prev, ...urlMap }));
        setTempMeta(prev => ({ ...prev, ...metaMap }));
        return list;
      } catch (e) {
        console.error('Error refrescando URLs temporales:', e);
        return null;
      } finally {
        setRefreshing(false);
      }
    },
    [adjuntos, colaborador?.id, userAuth?.access_token]
  );


  useEffect(() => {
    if (adjuntos.length > 0) {
      refreshUrls();
    } else {
      setTempUrls({});
      setTempMeta({});
    }
  }, [adjuntos, refreshUrls]);


  // Programa el próximo refresh 10s antes del vencimiento más cercano
  useEffect(() => {
    const metas = Object.values(tempMeta);
    if (!metas.length) return;

    const now = Date.now();
    const earliest = Math.min(
      ...metas
        .map(m => m?.expiresAt?.getTime?.() ?? Infinity)
        .filter(v => Number.isFinite(v))
    );
    if (!Number.isFinite(earliest)) return;

    const bufferMs = 10_000; // 10s antes del vencimiento
    const delay = Math.max(1_000, earliest - bufferMs - now);
    const t = setTimeout(() => { refreshUrls(); }, delay);

    return () => clearTimeout(t);
  }, [tempMeta, refreshUrls]);


  // 🔹 NUEVO: abrir asegurando URL fresca para un adjunto específico
  const openWithFreshUrl = useCallback(
    async (adjuntoId) => {
      const resp = await refreshUrls([adjuntoId]);
      const fresh = resp?.find(x => x.id === adjuntoId)?.url_temporal;
      const fallback =
        tempUrls[adjuntoId] ||
        adjuntos.find(a => a.id === adjuntoId)?.url_temporal ||
        adjuntos.find(a => a.id === adjuntoId)?.url ||
        null;
      const url = fresh || fallback;
      if (!url) {
        Swal.fire('Error', 'No se pudo generar la URL temporal.', 'error');
        return;
      }
      window.open(url, '_blank', 'noopener,noreferrer');
    },
    [refreshUrls, tempUrls, adjuntos]
  );

  const handleAgregar = () => {
    const tipoSeleccionado = tiposAdjuntos.find(t => t.id.toString() === tipo);
    if (!archivo || !tipoSeleccionado) {
      return Swal.fire('Error', 'Selecciona archivo y tipo válido.', 'warning');
    }
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

  const handleEnviarAgrupado = async () => {
    if (pendientes.length === 0) {
      return Swal.fire('Info', 'No hay archivos para subir.', 'info');
    }

    const data = new FormData();
    const agrupados = {};
    pendientes.forEach(doc => {
      if (!agrupados[doc.tipoId]) agrupados[doc.tipoId] = [];
      agrupados[doc.tipoId].push(doc);
    });

    Object.entries(agrupados).forEach(([tipoId, docs]) => {
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
      if (res.data?.empleado?.datos_generales) {
        setAdjuntos(res.data.empleado.datos_generales);
      }
      // 🔹 refresca URLs temporales de los nuevos adjuntos:
      setTimeout(() => refreshUrls(), 10);
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
const fetchAdjuntos = useCallback(async () => {
  if (!colaborador?.id) return;
  setLoading(true);
  try {
    // LEE SIEMPRE DEL BACK al abrir el modal
    const res = await apiGet(`rh/empleado/${colaborador.id}/adjuntos`, userAuth.access_token);
    const lista = Array.isArray(res?.data?.data) ? res.data.data : [];
    setAdjuntos([...lista]); // rompe referencia por si el prop venía con la misma ref.
  } catch (e) {
    // fallback: si falla el GET, usa lo que venga en el colaborador (si existe)
    const lista =
      (Array.isArray(colaborador?.adjuntos) && colaborador.adjuntos) ||
      (Array.isArray(colaborador?.datos_generales) && colaborador.datos_generales) ||
      [];
    setAdjuntos([...lista]);
  } finally {
    setLoading(false);
  }
}, [colaborador?.id, userAuth?.access_token, colaborador]);

  const coloresPorSeccion = {
    DP: '#e3f2fd',
    DOCA: '#fce4ec',
    OTROS: '#f5f5f5',
  };

  const agruparTiposPorCodigo = (tipos) => {
    const agrupados = tipos.reduce((acc, tipo) => {
      const grupo = tipo.codigo?.toUpperCase() || 'OT';
      if (!acc[grupo]) acc[grupo] = [];
      acc[grupo].push(tipo);
      return acc;
    }, {});
    Object.keys(agrupados).forEach(grupo => {
      agrupados[grupo].sort((a, b) => a.descripcion.localeCompare(b.descripcion));
    });
    return agrupados;
  };

  const tiposYaSubidos = new Set(
    adjuntos.map(adj => adj.tipo_adjunto?.id).filter(Boolean)
  );

  const tiposDisponibles = tiposAdjuntos.filter(
    tipo => !tiposYaSubidos.has(tipo.id)
  );

  const agrupados = agruparTiposPorCodigo(tiposDisponibles);

  const gruposYaSubidos = new Set(
    adjuntos.map(adj => adj.tipo_adjunto?.codigo?.toUpperCase()).filter(Boolean)
  );

  const todosLosGrupos = Array.from(
    new Set([...Object.keys(agrupados), ...gruposYaSubidos])
  ).sort();

  const handleEliminarAdjunto = async (adjuntoId) => {
    setTempMeta(prev => {
      const { [adjuntoId]: _, ...rest } = prev;
      return rest;
    });
    const confirm = await Swal.fire({
      title: '¿Eliminar adjunto?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (!confirm.isConfirmed) return;

    try {
      await apiDelete(`rh/empleado/${colaborador.id}/adjuntos/${adjuntoId}`, userAuth.access_token);
      Swal.fire('Eliminado', 'El archivo ha sido eliminado.', 'success');
      setAdjuntos((prev) => prev.filter((a) => a.id !== adjuntoId));
      setTempUrls(prev => {
        const { [adjuntoId]: _, ...rest } = prev;
        return rest;
      });
    } catch (error) {
      Swal.fire('Error', 'No se pudo eliminar el archivo.', 'error');
      console.error(error);
    }
  };

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
            '&:hover': { backgroundColor: '#f1faff' },
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
            {Array.from(new Set([...todosLosGrupos])).flatMap((grupo) => {
              const tipos = agrupados[grupo] || [];
              const estaSubido = gruposYaSubidos.has(grupo);
              return [
                <ListSubheader
                  key={`header-${grupo}`}
                  sx={{ fontWeight: 'bold', color: estaSubido ? 'green' : 'inherit', lineHeight: '2rem' }}
                >
                  — Grupo {grupo} {estaSubido && '✓'}
                </ListSubheader>,
                ...tipos.map((item) => (
                  <MenuItem key={item.id} value={item.id.toString()}>
                    {item.descripcion} {item.obligatorio ? '(Obligatorio)' : ''}
                  </MenuItem>
                ))
              ];
            })}
          </TextField>
          <Typography variant="caption">Tipo seleccionado: {tipo}</Typography>
        </Grid>

        <Grid item xs={12} sm={6} md={4} />

        <Grid item xs={12} sm={6} md={6}>
          <Button
            variant="contained"
            color="success"
            onClick={handleEnviarAgrupado}
            disabled={pendientes.length === 0}
          >
            Subir todos
          </Button>
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleAgregar}
            disabled={!archivo || !tipo}
          >
            Agregar a la lista
          </Button>
        </Grid>

        {/* 🔹 NUEVO: botón para refrescar todas las URLs temporales
        <Grid item xs={12}>
          <Button
            onClick={() => refreshUrls()}
            disabled={refreshing || adjuntos.length === 0}
          >
            {refreshing ? 'Actualizando ligas…' : 'Refrescar ligas (expiran ~2 min)'}
          </Button>
        </Grid> */}
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

                  // 🔹 URL efectiva: temp > accessor > url original
                  const url = tempUrls[adj.id] || adj.url_temporal || adj.url || null;

                  return (
                    <ListItem key={idx} divider>
                      <ListItemIcon><InsertDriveFileIcon /></ListItemIcon>
                      <ListItemText
                        primary={adj?.tipo_adjunto?.descripcion || `Archivo ${idx + 1}`}
                        secondary={`Subido: ${fechaFormateada}`}
                      />
                      {/* Ver (abre con refresh individual) */}
                      <IconButton
                        onClick={() => openWithFreshUrl(adj.id)}
                        title="Ver (refresca antes de abrir)"
                      >
                        <VisibilityIcon />
                      </IconButton>
                      {/* Descargar (usa la URL efectiva; si quieres, también puedes forzar refresh aquí) */}
                      <IconButton
                        component="a"
                        href={url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        download={adj.name || true}
                        disabled={!url}
                        title={!url ? 'Generando liga…' : 'Descargar'}
                      >
                        <DownloadIcon />
                      </IconButton>
                      <IconButton onClick={() => handleEliminarAdjunto(adj.id)} title="Eliminar">
                        ❌
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
