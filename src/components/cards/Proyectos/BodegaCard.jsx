import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { Box, Card, CardContent, Grid, Tab, Tabs, Typography } from '@mui/material';
import { ItemSlider } from '../../singles';
import { apiPostForm } from '../../../functions/api';
import { printResponseErrorAlert } from '../../../functions/alert';

// ===== Helpers: leen el TTL que firma el back =====
const getPresignedExpiry = (url) => {
  try {
    const u = new URL(url);
    const amzDate = u.searchParams.get('X-Amz-Date');     // p.ej. 20250902T225934Z
    const amzExp  = parseInt(u.searchParams.get('X-Amz-Expires') || '0', 10); // seg
    if (!amzDate || !amzExp) return 0;
    const iso = `${amzDate.slice(0,4)}-${amzDate.slice(4,6)}-${amzDate.slice(6,8)}T${amzDate.slice(9,11)}:${amzDate.slice(11,13)}:${amzDate.slice(13,15)}Z`;
    return new Date(iso).getTime() + amzExp * 1000;
  } catch { return 0; }
};

const normalizeAdjunto = (a) => {
  const temp = a?.url_temporal ?? a?.adjunto_url_temporal ?? a?.adjunto_temporal ?? null;
  return {
    id: a.id,
    name: a.name || a.filename || a.original_name || `Adjunto ${a.id}`,
    url: temp || null,                              // SIEMPRE usar temporal para abrir
    expiresAt: temp ? getPresignedExpiry(temp) : 0, // milisegundos
    raw: a,
  };
};

const BodegaCard = ({ bodega }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const { access_token } = useSelector(s => s.authUser || {});
  const [adjuntosUI, setAdjuntosUI] = useState([]);
  const [devolucionesUI, setDevolucionesUI] = useState([]);
  const refreshTimer = useRef(null);

  const handleChange = (_, v) => setTabIndex(v);

  // Pide SOLO esta bodega para regenerar url_temporal
  const refreshFila = async () => {
    if (!bodega?.id) return;
    try {
      const body = {
        pageIndex: 0,
        pageSize: 1,
        columnFilters: [{ id: 'id', value: String(bodega.id) }],
        tipo: (bodega?.tipo || 'herramienta').toLowerCase(),
      };
      const res = await apiPostForm('v1/proyectos/bodegas/filtrar', body, access_token);
      const fila = res?.data?.data?.[0];

      // Adjuntos de la bodega
      const nuevos = Array.isArray(fila?.adjuntos) ? fila.adjuntos.map(normalizeAdjunto) : [];
      setAdjuntosUI(nuevos);

      // Adjuntos en devoluciones
      const devs = (fila?.prestamos ?? []).flatMap(p =>
        (p.devoluciones ?? []).map(d => {
          const url = d?.adjunto_url_temporal ?? d?.adjunto_temporal ?? null;
          return url ? { fecha: d.fecha, url, expiresAt: getPresignedExpiry(url) } : null;
        }).filter(Boolean)
      );
      setDevolucionesUI(devs);

      // Reprograma un refresh justo antes del vencimiento más cercano
      programRefresh([ ...nuevos, ...devs ]);
    } catch (e) {
      printResponseErrorAlert(e);
    }
  };

  const clearRefreshTimer = () => {
    if (refreshTimer.current) {
      clearTimeout(refreshTimer.current);
      refreshTimer.current = null;
    }
  };

  const programRefresh = (items) => {
    clearRefreshTimer();
    if (!items?.length) return;

    const now = Date.now();
    const soonest = items
      .map(i => i?.expiresAt || 0)
      .filter(t => t > now)
      .sort((a,b) => a - b)[0];

    if (!soonest) return;

    // refresca 8s antes de expirar (respeta exactamente el TTL del back)
    const bufferMs = 8000;
    const delay = Math.max(0, soonest - now - bufferMs);

    refreshTimer.current = setTimeout(() => {
      refreshFila();
    }, delay);
  };

  // Inicia con lo que viene en props (por si abre muy rápido)
  useEffect(() => {
    setAdjuntosUI(Array.isArray(bodega?.adjuntos) ? bodega.adjuntos.map(normalizeAdjunto) : []);
    // no programamos timer hasta que realmente se abra la pestaña
    return clearRefreshTimer;
  }, [bodega?.id]);

  // Al entrar a "Adjuntos" o "Adjuntos Devoluciones", trae URLs frescas y agenda el próximo refresh
  useEffect(() => {
    if (tabIndex === 1 || tabIndex === 2) {
      refreshFila();
      return clearRefreshTimer;
    }
    // si cambia a otra pestaña, cancela timers
    clearRefreshTimer();
  }, [tabIndex, bodega?.id]);

  // Por si el usuario dejó abierto y volvió (pestaña del navegador):
  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === 'visible' && (tabIndex === 1 || tabIndex === 2)) {
        refreshFila();
      }
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [tabIndex, bodega?.id]);

  const datosGenerales = [
    { label: `NOMBRE ${bodega.tipo === 'material' ? 'DEL MATERIAL' : 'DE LA HERRAMIENTA'}`, value: bodega.nombre },
    { label: 'PARTIDA', value: bodega.partida?.nombre },
    { label: 'UNIDAD', value: bodega.unidad?.nombre },
    { label: 'CANTIDAD', value: bodega.cantidad },
    { label: 'UBICACIÓN DEL MATERIAL', value: bodega.ubicacion },
    { label: 'DESCRIPCIÓN', value: bodega.descripcion },
  ];

  return (
    <Box mt={4} width="100%">
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <Tabs orientation="vertical" value={tabIndex} onChange={handleChange} aria-label="tabs bodega" sx={{ borderRight: 1, borderColor: 'divider' }}>
            <Tab label="Datos generales" />
            <Tab label="Adjuntos" />
            <Tab label="Adjuntos Devoluciones" />
          </Tabs>
        </Grid>

        <Grid item xs={12} md={9}>
          {tabIndex === 0 && (
            <Card variant="outlined">
              <CardContent>
                {datosGenerales.map((item, i) => (
                  <Grid container spacing={1} key={i} sx={{ mb: 1 }}>
                    <Grid item xs={5}><Typography fontWeight="bold" color="primary">{item.label}:</Typography></Grid>
                    <Grid item xs={7}><Typography>{item.value ?? '-'}</Typography></Grid>
                  </Grid>
                ))}
              </CardContent>
            </Card>
          )}

          {tabIndex === 1 && (
            <Card variant="outlined">
              <CardContent>
                {adjuntosUI.length > 0 ? (
                  <ItemSlider
                    items={adjuntosUI.map(a => ({
                      ...a,
                      url: a.url, // ya temporal y vigente
                    }))}
                    item=""
                  />
                ) : (<Typography>-</Typography>)}
              </CardContent>
            </Card>
          )}

          {tabIndex === 2 && (
            <Card variant="outlined">
              <CardContent>
                {devolucionesUI.length > 0 ? (
                  <Grid container spacing={2}>
                    {devolucionesUI.map((item, idx) => (
                      <Grid item xs={12} sm={6} md={3} key={idx}>
                        <Typography fontWeight="bold" mb={1}>Devolución del {moment(item.fecha).format('DD MMM YYYY')}</Typography>
                        <img
                          src={item.url}
                          alt={`adjunto-${idx}`}
                          style={{ width:'100%', height:150, objectFit:'cover', borderRadius:8, border:'1px solid #ccc', cursor:'pointer' }}
                          onClick={async () => {
                            // si está vencida, refresca y abre la nueva
                            if (item.expiresAt && Date.now() > item.expiresAt - 1000) {
                              await refreshFila();
                              const fresh = devolucionesUI[idx];
                              const u = fresh?.url || item.url;
                              window.open(u, '_blank', 'noopener,noreferrer');
                            } else {
                              window.open(item.url, '_blank', 'noopener,noreferrer');
                            }
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                ) : (<Typography>No hay devoluciones con adjuntos</Typography>)}
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default BodegaCard;