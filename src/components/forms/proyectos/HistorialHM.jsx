import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button'; // 👈 agregado
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import moment from 'moment';
import { deleteAlert } from '../../../functions/alert';
import { setMinFechaTexto } from '../../../functions/functions';
import { useSelector } from 'react-redux';


const HistorialHM = ({
    data = {},
    onDevolucion,
    deletePrestamo,
    onReasignar,
    mostrarConsumido = true,
    historial = [],          // 👈 viene del padre
    historialMeta = null,    // 👈 opcional, por si paginarás
}) => {
    const [datos, setDatos] = useState([]);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const usuarios = useSelector(
        (s) => s.usuarios?.lista || s.auth?.users || []  // ajusta al slice real
    );
    // Helpers (arriba del componente o fuera de useEffect)
    const arr = (v) => Array.isArray(v) ? v : [];
    const pickFirstArray = (obj, keys = []) => {
        for (const k of keys) if (Array.isArray(obj?.[k]) && obj[k].length >= 0) return obj[k];
        return [];
    };

    // ⬇️ Reemplaza tu useEffect completo por este
    useEffect(() => {
        const aux = [];

        // 1) PRESTAMOS (alias para materiales/herramientas)
        const prestamos = pickFirstArray(data, [
            'prestamos', 'prestamos_material', 'prestamosHerramienta', 'prestamos_bodega'
        ]);

        arr(prestamos).forEach((prestamo) => {
            aux.push({ tipo: 'prestamo', fecha: prestamo.fecha, dato: prestamo });

            // Devoluciones reales (alias comunes)
            const devols = pickFirstArray(prestamo, ['devoluciones', 'devols', 'devoluciones_prestamo']);
            arr(devols).forEach((devolucion) => {
                aux.push({
                    tipo: 'devolucion',
                    fecha: devolucion.fecha,
                    dato: devolucion,
                    prestamoId: prestamo.id,
                });
            });

            // Consumos (si existen en alguno de los dos módulos)
            const consumosP = pickFirstArray(prestamo, ['consumos', 'consumos_obra', 'consumosPrestamo']);
            arr(consumosP).forEach((consumo) => {
                aux.push({
                    tipo: 'consumo',
                    fecha: consumo.fecha,
                    dato: consumo,
                    prestamoId: prestamo.id,
                });
            });

            // Inyecta "cierre sin devolución" si está terminado y falta por devolver
            const prestado = Number(prestamo.cantidad || 0);
            const devueltoP = arr(devols).reduce((acc, d) => acc + Number(d?.cantidad || 0), 0);
            if (Number(prestamo.terminado) === 1 && devueltoP < prestado) {
                aux.push({
                    tipo: 'devolucion',
                    fecha: prestamo.updated_at || prestamo.fecha,
                    prestamoId: prestamo.id,
                    dato: {
                        id: `cierre-${prestamo.id}`,
                        prestamo_bodega_id: prestamo.id,
                        cantidad: 0,
                        responsable: prestamo.responsable,
                        comentarios: 'Cierre sin devolución (consumo total)',
                        ubicacion: prestamo.ubicacion,
                        esCierre: true,
                    },
                });
            }
        });

        // 2) ENTRADAS (alias)
        const entradas = pickFirstArray(data, ['entradas', 'entradas_material', 'entradasHerramienta']);
        arr(entradas).forEach((entrada) => {
            aux.push({ tipo: 'entrada', fecha: entrada.fecha, dato: entrada });
        });

        // 3) CONSUMOS “globales” (alias)
        const consumosGlobal = pickFirstArray(data, ['consumos', 'consumos_obra', 'consumosMaterial', 'consumosHerramienta']);
        arr(consumosGlobal).forEach((c) => {
            aux.push({ tipo: 'consumo', fecha: c.fecha, dato: c, prestamoId: c.prestamo_bodega_id });
        });

        // 4) KARDEX plano (si existiera en alguno)
        const kardex = pickFirstArray(data, ['kardex', 'movimientos', 'movimientos_material']);
        arr(kardex).forEach((mov) => {
            const tipo = mov.tipo || mov.movimiento || 'movimiento';
            aux.push({ tipo, fecha: mov.fecha, dato: mov, prestamoId: mov.prestamo_bodega_id });
        });

        // 5) ESTATUS HISTORIAL (varios alias + prop historial del padre)
        const estatusHist = [
            ...pickFirstArray(data, ['estatus_historial', 'historial_estatus', 'bodega_estatus_historial']),
            ...arr(historial) // ← lo que ya te llega del padre en Materiales
        ];


        setDatos(aux);
    }, [JSON.stringify(data), JSON.stringify(historial)]);

    const userNameById = React.useMemo(() => {
        const map = {};
        usuarios.forEach(u => {
            const name = u?.name || u?.full_name || u?.username || u?.email || `ID ${u?.id}`;
            if (u?.id != null) map[u.id] = name;
        });
        return map;
    }, [usuarios]);
    // 🟦 Detectar préstamo activo
    const prestamosActivos = datos
        .filter(d => d.tipo === 'prestamo' && d.dato.terminado !== 1)
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    // 🟩 Detectar préstamo terminado más reciente (último antes de la reasignación)
    const ultimoPrestamoTerminado = datos
        .filter(d => d.tipo === 'prestamo' && d.dato.terminado === 1)
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))[0];

    // 🟫 Resto del historial (sin el activo ni el último terminado)
    const setActivos = new Set(prestamosActivos);
    const historialFiltrado = datos
        .filter(d => !setActivos.has(d) && d !== ultimoPrestamoTerminado)
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    // 🔁 Inserta el último préstamo terminado al inicio del historial
    if (ultimoPrestamoTerminado) {
        historialFiltrado.unshift(ultimoPrestamoTerminado);
    }
    const getColor = (tipo) => {
        if (tipo === 'prestamo') return 'primary';
        if (tipo === 'devolucion') return 'success';
        return 'info';
    };

    const historialEmparejado = [];
    const copia = [...historialFiltrado];

    // Agrupar devoluciones y consumos por préstamo
    const devolucionesAgrupadas = {};
    const consumosAgrupados = {};

    copia.forEach(d => {
        if (d.tipo === 'devolucion' && d.dato?.prestamo_bodega_id) {
            const id = d.dato.prestamo_bodega_id;
            if (!devolucionesAgrupadas[id]) devolucionesAgrupadas[id] = [];
            devolucionesAgrupadas[id].push(d);
        }
        if ((d.tipo === 'consumo' || d.tipo === 'consumo_obra') && d.dato?.prestamo_bodega_id) {
            const id = d.dato.prestamo_bodega_id;
            if (!consumosAgrupados[id]) consumosAgrupados[id] = [];
            consumosAgrupados[id].push(d);
        }
    });

    copia
        .filter(d => d.tipo === 'prestamo')
        .forEach(prestamo => {
            const devoluciones = devolucionesAgrupadas[prestamo.dato.id] || [];
            const consumos = consumosAgrupados[prestamo.dato.id] || [];
            historialEmparejado.push({ prestamo, devoluciones, consumos });
        });

    // movimientos huérfanos (devoluciones/consumos sin préstamo en el rango)
    const idsEmparejadas = new Set([
        ...Object.keys(devolucionesAgrupadas).map(Number),
        ...Object.keys(consumosAgrupados).map(Number),
    ]);

    copia
        .filter(d =>
            (d.tipo === 'devolucion' || d.tipo === 'consumo' || d.tipo === 'consumo_obra') &&
            !idsEmparejadas.has(d.dato?.prestamo_bodega_id)
        )
        .forEach(mov => {
            historialEmparejado.push({ prestamo: null, devoluciones: mov.tipo === 'devolucion' ? [mov] : [], consumos: mov.tipo !== 'devolucion' ? [mov] : [] });
        });


    // 🔀 Timeline unificado (prestamo + devoluciones + consumos + estatus)
    const timeline = [...copia].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    const InfoRow = ({ label, value }) => (
        <Typography variant="body2" sx={{ mb: 0.5 }}>
            {label} <strong>{value || '—'}</strong>
        </Typography>
    );

    const colorTipo = (t, dato = {}) => {
        const tt = (t || '').toLowerCase();
        if (tt === 'estatus') {
            return dato?.estatus_nuevo === 'Vendido' ? 'warning' : 'secondary';
        }
        switch (tt) {
            case 'prestamo': return 'primary';
            case 'devolucion': return 'success';
            case 'consumo':
            case 'consumo_obra': return 'warning';
            case 'entrada': return 'info';
            case 'merma': return 'error';
            case 'ajuste': return 'secondary';
            default: return 'default';
        }
    };


    // totales por préstamo (prestado, devuelto, consumido, pendiente)
    const totalesPrestamo = (p) => {
        const prestado = Number(p?.cantidad ?? 0);
        const devuelto = Array.isArray(p?.devoluciones)
            ? p.devoluciones.reduce((acc, d) => acc + Number(d?.cantidad ?? 0), 0)
            : Number(p?.devuelto ?? 0);

        // Cuando el préstamo está TERMINADO, todo lo no devuelto se considera consumido
        const consumido = p?.terminado === 1 ? Math.max(0, prestado - devuelto) : 0;

        // Si está terminado, pendiente debe ser 0; si no, es lo que falta por devolver/consumir
        const pendiente = p?.terminado === 1
            ? 0
            : Math.max(0, prestado - (devuelto + consumido));

        return { prestado, devuelto, consumido, pendiente };
    };

    const hasHistorial = historialEmparejado.some(
        it => (it.devoluciones?.length || 0) > 0 || (it.consumos?.length || 0) > 0
    );

    console.log('Emparejados:', historialEmparejado);
    console.log('🧩 data:', data);
    console.log('🧩 estatus_historial:', data?.estatus_historial);
    console.log('🧩 datos (aplanado):', datos.length, datos);
    console.log('🧩 historialEmparejado:', historialEmparejado.length, historialEmparejado);

    const renderUsuario = (u) => {
        if (!u) return '—';
        if (typeof u === 'string' || typeof u === 'number') return String(u);
        return u.name || u.full_name || u.email || u.username || u.id || '—';
    };
    const pickUsuario = (raw) => {
        if (!raw) return null;
        if (typeof raw === 'string') return { name: raw };
        if (typeof raw === 'number') return { id: raw };
        if (raw.name || raw.full_name) return { name: raw.name || raw.full_name };
        if (raw.username) return { name: raw.username };
        if (raw.email) return { name: raw.email };
        if (raw.user) return pickUsuario(raw.user); // por si viene anidado
        return raw; // deja pasar otros campos (id, etc.)
    };

    // 👇 usa el mapa id→nombre para resolver ids o objetos con id
    const formatUsuario = (u) => {
        if (!u) return '—';

        // ya viene el nombre en string
        if (typeof u === 'string') return u;

        // solo id (número)
        if (typeof u === 'number') return userNameById[u] || `ID ${u}`;

        // objeto con name directo
        if (u.name || u.full_name || u.username || u.email) {
            return u.name || u.full_name || u.username || u.email;
        }

        // objeto con id (ej: { id: 7 })
        if (u.id != null) return userNameById[u.id] || `ID ${u.id}`;

        // anidado (ej: { user: { id: 7 } })
        if (u.user) return formatUsuario(u.user);

        return '—';
    };


    // Arma las filas (prestamo + devoluciones) justo ANTES del return
    const filas = (historialEmparejado || []).map((g) => ({
        prestamo: g.prestamo || null,
        devoluciones: g.devoluciones || [],
        consumos: g.consumos || [],
    }));

    return (
        <Grid container spacing={2}>
            {/* Columna de préstamos activos */}
            {prestamosActivos.length > 0 && (
                <Grid
                    item
                    xs={12}
                    md={hasHistorial ? 5 : 12}
                    order={{ xs: 1, md: 2 }}
                    sx={{
                        display: 'flex',
                        justifyContent: hasHistorial ? 'flex-start' : 'center',
                    }}
                >
                    <Box
                        textAlign="left"
                        pl={{ md: hasHistorial ? 3 : 0 }}
                        mt={4}
                        sx={{ width: '100%', maxWidth: 560 }}
                    >
                        {prestamosActivos.map((pa) => {
                            const t = totalesPrestamo(pa.dato);
                            return (
                                <Box key={pa.dato?.id} mb={3}>
                                    <Chip label="PRÉSTAMO ACTIVO" color="primary" size="small" />
                                    <Typography variant="subtitle2" fontWeight="bold" mt={1}>
                                        {setMinFechaTexto(pa.fecha)}
                                    </Typography>
                                    <Typography variant="body2">
                                        RESPONSABLE: <strong>{pa.dato?.responsable || '—'}</strong>
                                    </Typography>
                                    <Typography variant="body2">
                                        UBICACIÓN PRÉSTAMO: {pa.dato?.ubicacion || '—'}
                                    </Typography>
                                    <Typography variant="body2">
                                        FECHA: <u>{moment(pa.fecha).format('DD MMM YYYY — HH:mm')}</u>
                                    </Typography>
                                    <Typography variant="body2">
                                        COMENTARIOS: {pa.dato?.comentarios || '—'}
                                    </Typography>

                                    {t && (
                                        <Box mt={1} display="flex" flexWrap="wrap" gap={1}>
                                            <Chip label={`Prestado: ${t.prestado}`} size="small" />
                                            <Chip label={`Devuelto: ${t.devuelto}`} size="small" color="success" />
                                            {mostrarConsumido && (
                                                <Chip label={`Consumido: ${t.consumido}`} size="small" color="warning" />
                                            )}
                                            <Chip
                                                label={`Pendiente: ${t.pendiente}`}
                                                size="small"
                                                color={t.pendiente > 0 ? 'warning' : 'default'}
                                            />
                                        </Box>
                                    )}

                                    <Stack
                                        direction={{ xs: 'column', sm: 'row' }}
                                        spacing={1}
                                        mt={1}
                                        alignItems={{ xs: 'stretch', sm: 'center' }}
                                        flexWrap="wrap"
                                    >
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            color="success"
                                            onClick={() => onDevolucion?.(pa.dato)}
                                            fullWidth={isMobile}
                                        >
                                            Registrar devolución
                                        </Button>

                                        <Button
                                            variant="outlined"
                                            size="small"
                                            color="secondary"
                                            onClick={() => onReasignar?.(pa.dato)}
                                            fullWidth={isMobile}
                                        >
                                            Reasignar
                                        </Button>
                                    </Stack>
                                </Box>
                            );
                        })}
                    </Box>
                </Grid>
            )}

            {/* Columna del historial emparejado */}
            <Grid
                item
                xs={12}
                md={prestamosActivos.length > 0 ? 7 : 12}
                order={{ xs: 2, md: 1 }}
            >
                {/* ===== Línea vertical central (aplica a desktop y mobile) ===== */}
                <Stack position="relative" sx={{ mt: 4 }}>
                    <Box
                        sx={{
                            position: 'absolute',
                            left: '50%',
                            top: 0,
                            bottom: 0,
                            width: '2px',
                            bgcolor: '#ccc',
                            transform: 'translateX(-50%)',
                        }}
                    />

                    {/* ===== Vista MOBILE: una fila por pareja (prestamo — punto — devolucion) ===== */}
                    {isMobile && filas.map((row, idx) => (
                        <Grid
                            container
                            key={`fila-m-${idx}`}
                            sx={{ mb: 2 }}
                            alignItems="center"
                        >
                            {/* Izquierda: Préstamo */}
                            <Grid
                                item
                                xs={6}
                                sx={{ display: 'flex', justifyContent: 'flex-end', pr: 1 }}
                            >
                                {row.prestamo && (
                                    <Card variant="outlined" sx={{ width: '100%', maxWidth: 280, zIndex: 1 }}>
                                        <Accordion disableGutters elevation={0} sx={{ '&:before': { display: 'none' } }}>
                                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                <Stack direction="column" spacing={0.5} alignItems="flex-start">
                                                    <Chip label="PRÉSTAMO" color="primary" size="small" />
                                                    <Typography variant="subtitle2" fontWeight="bold" sx={{ fontSize: 12 }}>
                                                        {setMinFechaTexto(row.prestamo.fecha)}
                                                    </Typography>
                                                </Stack>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Typography variant="body2">
                                                    RESPONSABLE: <strong>{row.prestamo.dato?.responsable || '—'}</strong>
                                                </Typography>
                                                <Typography variant="body2">
                                                    FECHA: <u>{moment(row.prestamo.fecha).format('DD MMM YYYY — HH:mm')}</u>
                                                </Typography>
                                                <Typography variant="body2">
                                                    COMENTARIOS: {row.prestamo.dato?.comentarios || '—'}
                                                </Typography>
                                            </AccordionDetails>
                                        </Accordion>
                                    </Card>
                                )}
                            </Grid>

                            {/* Centro: punto (color verde si hay devolución, azul si solo préstamo) */}
                            <Grid item xs={0} sx={{ display: 'none' }} /> {/* placeholder xs=0 mobile */}

                            {/* Derecha: Devolución (primera) */}
                            <Grid
                                item
                                xs={6}
                                sx={{ display: 'flex', justifyContent: 'flex-start', pl: 1 }}
                            >
                                {row.devoluciones?.length > 0 && (
                                    <Card variant="outlined" sx={{ width: '100%', maxWidth: 280, zIndex: 1 }}>
                                        <Accordion disableGutters elevation={0} sx={{ '&:before': { display: 'none' } }}>
                                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                <Stack direction="column" spacing={0.5} alignItems="flex-start">
                                                    <Chip label="DEVOLUCIÓN" color="success" size="small" />
                                                    <Typography variant="subtitle2" fontWeight="bold" sx={{ fontSize: 12 }}>
                                                        {setMinFechaTexto(row.devoluciones[0].fecha)}
                                                    </Typography>
                                                </Stack>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Typography variant="body2">
                                                    RESPONSABLE:{' '}
                                                    <strong>{row.devoluciones[0].dato?.responsable || '—'}</strong>
                                                </Typography>
                                                <Typography variant="body2">
                                                    FECHA:{' '}
                                                    <u>{moment(row.devoluciones[0].fecha).format('DD MMM YYYY — HH:mm')}</u>
                                                </Typography>
                                                <Typography variant="body2">
                                                    COMENTARIOS: {row.devoluciones[0].dato?.comentarios || '—'}
                                                </Typography>
                                            </AccordionDetails>
                                        </Accordion>
                                    </Card>
                                )}
                            </Grid>
                        </Grid>
                    ))}

                    {/* ===== Vista DESKTOP: una fila por pareja (prestamo — punto — devolucion) ===== */}
                    {!isMobile && filas.map((row, idx) => (
                        <Grid
                            container
                            spacing={2}
                            key={`fila-d-${idx}`}
                            sx={{ mb: 3 }}
                            alignItems="center"
                            justifyContent="center"
                        >
                            {/* Izquierda: Préstamo */}
                            <Grid item xs={5}>
                                {row.prestamo && (
                                    <Box textAlign="right" pr={3}>
                                        <Chip label="PRÉSTAMO" color="primary" size="small" />
                                        <Typography variant="subtitle2" fontWeight="bold" mt={1}>
                                            {setMinFechaTexto(row.prestamo.fecha)}
                                        </Typography>
                                        <Typography variant="body2">
                                            RESPONSABLE: <strong>{row.prestamo.dato?.responsable || '—'}</strong>
                                        </Typography>
                                        <Typography variant="body2">
                                            FECHA: <u>{moment(row.prestamo.fecha).format('DD MMM YYYY — HH:mm')}</u>
                                        </Typography>
                                        <Typography variant="body2">
                                            COMENTARIOS: {row.prestamo.dato?.comentarios || '—'}
                                        </Typography>
                                    </Box>
                                )}
                            </Grid>

                            {/* Punto central */}
                            <Grid item xs={2} display="flex" justifyContent="center" alignItems="center">
                                <Box
                                    sx={{
                                        width: 20,
                                        height: 20,
                                        borderRadius: '50%',
                                        bgcolor: row.devoluciones?.length ? 'success.main' : 'primary.main',
                                        border: '3px solid white',
                                        boxShadow: 2,
                                    }}
                                />
                            </Grid>

                            {/* Derecha: Devolución (primera) */}
                            <Grid item xs={5}>
                                {row.devoluciones?.length > 0 && (
                                    <Box textAlign="left" pl={3}>
                                        <Chip label="DEVOLUCIÓN" color="success" size="small" />
                                        <Typography variant="subtitle2" fontWeight="bold" mt={1}>
                                            {setMinFechaTexto(row.devoluciones[0].fecha)}
                                        </Typography>
                                        <Typography variant="body2">
                                            RESPONSABLE:{' '}
                                            <strong>{row.devoluciones[0].dato?.responsable || '—'}</strong>
                                        </Typography>
                                        <Typography variant="body2">
                                            FECHA:{' '}
                                            <u>{moment(row.devoluciones[0].fecha).format('DD MMM YYYY — HH:mm')}</u>
                                        </Typography>
                                        <Typography variant="body2">
                                            COMENTARIOS: {row.devoluciones[0].dato?.comentarios || '—'}
                                        </Typography>
                                    </Box>
                                )}
                            </Grid>
                        </Grid>
                    ))}
                </Stack>
            </Grid>
        </Grid>
    );




};

export default HistorialHM;
