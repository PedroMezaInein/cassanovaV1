import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Grid, Paper, Typography } from '@mui/material';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button';
import { useDropzone } from 'react-dropzone';
import { apiGet, apiPostForm } from '../../../functions/api';
import CarruselAdjuntosVentas from './CarruselAdjuntosVentas';
import FacturasVentas from './FacturasVentas';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
}));

function TabPanel({ children, value, index, ...other }) {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`ventas-tabpanel-${index}`}
            aria-labelledby={`ventas-tab-${index}`}
            {...other}
        >
            {value === index && <Box p={3}>{children}</Box>}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `ventas-tab-${index}`,
        'aria-controls': `ventas-tabpanel-${index}`,
    };
}

const DropzoneButton = ({ tipo, form, setForm, handleSubmit }) => {
    const [files, setFiles] = useState([]);

    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            // console.log('✅ Archivos aceptados:', acceptedFiles);
            const newFiles = acceptedFiles.map((file) =>
                Object.assign(file, { preview: URL.createObjectURL(file) })
            );
            setFiles((prev) => [...prev, ...newFiles]);
            setForm((prevForm) => ({
                ...prevForm,
                [tipo]: [...(prevForm[tipo] || []), ...newFiles],
            }));
        }
    }, [tipo, setForm]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: "application/pdf, application/xml, text/xml, application/zip, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, image/png, image/jpeg",
        multiple: true,
    });

    const clearFile = (fileName) => {
        setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
        setForm((prevForm) => ({
            ...prevForm,
            [tipo]: prevForm[tipo].filter((file) => file.name !== fileName),
        }));
    };

    const clearFiles = () => {
        setFiles([]);
        setForm((prevForm) => ({
            ...prevForm,
            [tipo]: [],
        }));
    };

    return (
        <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12}>
                <Paper
                    {...getRootProps()}
                    elevation={3}
                    style={{
                        padding: '20px',
                        border: '2px dashed #cccccc',
                        textAlign: 'center',
                        cursor: 'pointer',
                        backgroundColor: isDragActive ? '#e6f7ff' : '#ffffff',
                    }}
                >
                    <input {...getInputProps()} />
                    <Typography variant="body1">
                        {isDragActive ? 'Suelta los archivos aquí...' : 'Arrastra o haz clic para seleccionar archivos'}
                    </Typography>
                </Paper>
            </Grid>

            <Grid container item xs={12} spacing={2}>
                {files.map((file, index) => (
                    <Grid item xs={6} sm={4} md={3} key={index}>
                        <Paper elevation={2} style={{ padding: '10px', textAlign: 'center', borderRadius: '8px' }}>
                            {file.type.startsWith('image/') ? (
                                <img
                                    src={file.preview}
                                    alt="Vista previa"
                                    style={{
                                        width: '100%',
                                        height: '100px',
                                        objectFit: 'cover',
                                        borderRadius: '5px',
                                    }}
                                />
                            ) : (
                                <Typography variant="body2" style={{ wordBreak: 'break-word' }}>
                                    {file.name}
                                </Typography>
                            )}
                            <Button color="secondary" onClick={() => clearFile(file.name)}>Eliminar</Button>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            <Grid item xs={12} style={{ textAlign: 'center', marginTop: '10px' }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                        handleSubmit();
                        clearFiles();
                    }}
                    disabled={files.length === 0}
                >
                    Subir
                </Button>
            </Grid>
        </Grid>
    );
};

export default function AdjuntosVentas({ data, Gastos, opcionesData, reload, open, reloadKey }) {
    const classes = useStyles();
    const authUser = useSelector((state) => state.authUser.access_token);
    const ventaId = typeof data === 'object' && data !== null ? data.id : data;
    // console.log('🚩 AdjuntosVentas abierto con data:', data);
    const [value, setValue] = useState(1);
    const [form, setForm] = useState({
        facturas_pdf: [],
        pagos: [],
        presupuestos: [],
    });
    const [activeTab, setActiveTab] = useState('facturas_pdf');
    const [adjuntos, setAdjuntos] = useState(false);

    useEffect(() => {
        // cada vez que ABRES el modal, pide nuevas urls firmadas
        if (open && ventaId) {
            getAdjuntos();
        }
    }, [open, ventaId]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const getAdjuntos = () => {
        apiGet(`v2/proyectos/ventas/adjuntos/${ventaId}`, authUser)
            .then((res) => {
                console.log("📥 Respuesta adjuntos:", res.data.venta);

                const venta = res.data.venta || {};

                const mapAdjuntos = (arr) =>
                    Array.isArray(arr)
                        ? arr.map((a) => ({
                            id: a.id,
                            url: a.url_temporal,              // 👈 aquí forzamos la URL del archivo
                            name: a.name || "Archivo",        // 👈 nombre visible
                            tipo: a.pivot?.tipo || null,      // opcional, si lo usas en tu carrusel
                        }))
                        : [];

                setAdjuntos({
                    facturas_pdf: mapAdjuntos(venta.facturas_pdf),
                    pagos: mapAdjuntos(venta.pagos),
                    presupuestos: mapAdjuntos(venta.presupuestos),
                });

                Swal.close();
            })
            .catch(() => {
                Swal.fire({
                    icon: "error",
                    title: "Error al obtener adjuntos",
                });
            });
    };



    const handleTab = (tabKey) => {
        setActiveTab(tabKey);
    };

    const handleSubmit = async () => {
        if (!form[activeTab] || form[activeTab].length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'Debe seleccionar al menos un archivo',
                showConfirmButton: false,
                timer: 1500,
            });
            return;
        }

        // console.log('🚀 Subiendo archivos del tipo:', activeTab, 'Archivos:', form[activeTab]);
        Swal.fire({
            title: 'Subiendo archivos...',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading(),
        });

        try {
            for (const file of form[activeTab]) {
                // console.log('📤 Subiendo archivo:', file);
                const payload = new FormData();

                let inputName = '';
                switch (activeTab) {
                    case 'facturas_pdf':
                        inputName = 'files_facturas_pdf[]';
                        break;
                    case 'pagos':
                        inputName = 'files_pago[]';  // ✅ Así lo espera el backend
                        break;
                    case 'presupuestos':
                        inputName = 'files_Presupuestos[]';  // ✅ Así lo espera el backend (mayúscula P)
                        break;
                    default:
                        inputName = `files_${activeTab}[]`;  // fallback para otros casos
                }

                payload.append(`files_name_${activeTab}[]`, file.name);
                payload.append(inputName, file);
                payload.append('adjuntos[]', activeTab);
                payload.append('tipo', activeTab);

                const res = await apiPostForm(
                    `v2/proyectos/ventas/${data}/archivos/s3`,
                    payload,
                    authUser
                );
                // console.log('✅ Respuesta backend subida:', res);
            }

            Swal.fire({
                icon: 'success',
                title: 'Todos los archivos se subieron con éxito',
                showConfirmButton: false,
                timer: 1500,
            });

            getAdjuntos();
        } catch (error) {
            console.error('❌ Error al subir archivos:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error al subir archivos',
            });
        }
    };


    return (
        <Box>
            <div className={classes.root}>
                <AppBar position="static" color="default">
                    <Tabs
                        variant="scrollable"
                        scrollButtons="on"
                        value={value}
                        onChange={handleChange}
                        className={classes.tabs}
                    >
                        <Tab label="Facturas" {...a11yProps(0)} onClick={() => handleTab('facturas')} />
                        {!Gastos && <Tab label="Factura Extranjera" {...a11yProps(1)} onClick={() => handleTab('facturas_pdf')} />}
                        {!Gastos && <Tab label="Presupuesto" {...a11yProps(2)} onClick={() => handleTab('presupuestos')} />}
                        {!Gastos && <Tab label="Pago" {...a11yProps(3)} onClick={() => handleTab('pagos')} />}
                    </Tabs>
                </AppBar>

                <TabPanel value={value} index={0}>
                    <FacturasVentas opcionesData={opcionesData} reload={reload} activeTab={activeTab} venta={data} />
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <DropzoneButton tipo="facturas_pdf" form={form} setForm={setForm} handleSubmit={handleSubmit} />
                    <CarruselAdjuntosVentas
                        data={adjuntos?.facturas_pdf || []}
                        id={ventaId}
                        getAdjuntos={getAdjuntos}
                        reloadKey={reloadKey}
                    />
                </TabPanel>
                <TabPanel value={value} index={2}>
                    <DropzoneButton tipo="presupuestos" form={form} setForm={setForm} handleSubmit={handleSubmit} />
                    <CarruselAdjuntosVentas
                        data={adjuntos?.presupuestos || []}   // ✅ ahora sí presupuestos
                        id={ventaId}
                        getAdjuntos={getAdjuntos}
                        reloadKey={reloadKey}
                    />
                </TabPanel>
                <TabPanel value={value} index={3}>
                    <DropzoneButton tipo="pagos" form={form} setForm={setForm} handleSubmit={handleSubmit} />
                    <CarruselAdjuntosVentas
                        data={adjuntos?.pagos || []}   // ✅ ahora sí pagos
                        id={ventaId}
                        getAdjuntos={getAdjuntos}
                        reloadKey={reloadKey}
                    />
                </TabPanel>
            </div>
        </Box>
    );
}