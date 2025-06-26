import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
// import Tabs from '@material-ui/core/Tabs';
// import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button';
import { apiGet, apiPostForm } from './../../../functions/api';
import CarruselAdjuntosCompras from './CarruselAdjuntosCompras';
import style from './CarruselCompras.module.scss';
import { useDropzone } from 'react-dropzone';
import { Typography } from '@material-ui/core';
import { Dialog, DialogActions, DialogContent, DialogTitle, Grid, Paper,Box,InputLabel  } from '@mui/material';
import Container from '@material-ui/core/Container';
// import Tabs from '@mui/material/Tabs';
// import Tab from '@mui/material/Tab';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import FacturasCompras from './FacturasCompras'

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
          role="tabpanel"
          hidden={value !== index}
          id={`scrollable-force-tabpanel-${index}`}
          aria-labelledby={`scrollable-force-tab-${index}`}
          {...other}
        >
          {value === index && (
            <Box p={3}>
              <Typography>{children}</Typography>
            </Box>
          )}
        </div>
      );
    }

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
  };
// function a11yProps(index) {
//     return {
//         id: `vertical-tab-${index}`,
//         'aria-controls': `vertical-tabpanel-${index}`,
//     };
// }

function a11yProps(index) {
    return {
      id: `scrollable-force-tab-${index}`,
      'aria-controls': `scrollable-force-tabpanel-${index}`,
    };
  }

  const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      width: '100%',
      backgroundColor: theme.palette.background.paper,
    },
  }));

// const useStyles = makeStyles((theme) => ({
//     root: {
//         flexGrow: 1,
//         backgroundColor: theme.palette.background.paper,
//         display: 'flex',
//         height: 550,
//         width: '100%',
//     },
//     tabs: {
//         borderRight: `1px solid ${theme.palette.divider}`,
//     },
// }));

// Componente para manejar Dropzone y subir archivos
const DropzoneButton = ({ tipo, form, setForm, handleSubmit }) => {
    const [files, setFiles] = useState([]);

    const onDrop = useCallback((acceptedFiles) => {
            // console.log('Archivos arrastrados:', acceptedFiles);

            if (acceptedFiles.length > 0) {
                const newFiles = acceptedFiles.map((file) =>
                    Object.assign(file, { preview: URL.createObjectURL(file) })
                );
        
                setFiles((prev) => [...prev, ...newFiles]); // Agrega nuevos archivos a la lista existente
                setForm((prevForm) => ({
                    ...prevForm,
                    [tipo]: [...(prevForm[tipo] || []), ...newFiles], // Agrega archivos al formulario
                }));
            }
        }, [tipo, setForm]);

    // Configuración de Dropzone
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop, // Llama a la función onDrop al arrastrar archivos
        accept: "application/pdf, application/xml, text/xml, application/zip, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, image/png, image/jpeg",
        multiple: true, // Permitir múltiples archivos
    });

    const clearFile = (fileName) => {
        setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
        setForm((prevForm) => ({
            ...prevForm,
            [tipo]: prevForm[tipo].filter((file) => file.name !== fileName),
        }));
    };
    

    const clearFiles = () => {
        setFiles([]); // Limpia los archivos seleccionados localmente
        setForm((prevForm) => ({
            ...prevForm,
            [tipo]: [], // Limpia los archivos del formulario
        }));
    };

    return (
        <>

    {/* Contenedor principal con Grid */}
            <Grid container spacing={2} justifyContent="center">
                
                {/* Área de Dropzone */}
                <Grid item xs={12}>
                    <Paper
                        {...getRootProps()}
                        elevation={3} // Agrega sombra al Paper
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
                

                {/* Vista previa de archivos */}
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
                                  <Button color="secondary" onClick={() => clearFile(file.name)}> Eliminar</Button>

                            </Paper>
                        </Grid>
                    ))}
                </Grid>

                {/* Botón de subir */}
                <Grid item xs={12} style={{ textAlign: 'center', marginTop: '10px' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            handleSubmit();
                            clearFiles();
                        }}
                        disabled={files.length === 0} // Desactiva si no hay archivos
                    >
                        Subir
                    </Button>
                </Grid>
            </Grid>
        </>
    )
};


export default function AdjuntosCompras(props) {
    const { data, Gastos, opcionesData, reload } = props;

    const authUser = useSelector((state) => state.authUser.access_token);
    const classes = useStyles();
    const [value, setValue] = useState(0);
    const [form, setForm] = useState({
        facturas_pdf: '',
        pagos: '',
        presupuestos: '',
        tipo: '',
    });
    const [activeTab, setActiveTab] = useState('facturas_pdf');
    const [adjuntos, setAdjuntos] = useState(false);

    useEffect(() => {
        // Swal.fire({
        //     title: 'Cargando...',
        //     allowOutsideClick: false,
        //     didOpen: () => {
        //         Swal.showLoading();
        //     },
        // });
        getAdjuntos();
    }, []);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const getAdjuntos = () => {
        try {
            apiGet(`v2/proyectos/compras/adjuntos/${data}`, authUser).then((res) => {
                const { facturas_pdf, pagos, presupuestos } = res.data.compra;
                setAdjuntos({ facturas_pdf, pagos, presupuestos});
                Swal.close();
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Algo salió mal!',
            });
        }
    };

    const handleTab = (e) => {
        setActiveTab(e);
        setForm({ ...form, tipo: '' });
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
    
        Swal.fire({
            title: 'Subiendo archivos...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });
    
        try {
            for (const file of form[activeTab]) {
                const data = new FormData();
                data.append(`files_name_${activeTab}[]`, file.name);
                data.append(`files_${activeTab}[]`, file);
                data.append('adjuntos[]', activeTab);
                data.append('tipo', activeTab);
    
                await apiPostForm(`v2/proyectos/compras/${props.data}/archivos/adjuntos/s3`, data, authUser);
                
                Swal.fire({
                    icon: 'success',
                    title: `Archivo ${file.name} subido con éxito`,
                    showConfirmButton: false,
                    timer: 1000,
                });
            }
    
            getAdjuntos(); // 🔄 Recargar los adjuntos después de subir todos los archivos
    
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error al subir archivos',
                text: 'Uno o más archivos no pudieron subirse',
            });
        } finally {
            Swal.close(); // ❌ Cerrar la alerta de carga después de terminar
        }
    };

    return (
        <Box>   
            {/* <Container maxWidth="xl"> */}
            <div className={classes.root}>
                <AppBar position="static" color="default">
                    <Tabs
                        // orientation="vertical"
                        variant="scrollable"
                        scrollButtons="on"
                        value={value}
                        onChange={handleChange}
                        aria-label="scrollable force tabs example"
                        className={classes.tabs}
                    >
                        <Tab label="Facturas" {...a11yProps(0)} onClick={() => handleTab('facturas')} />
                        {!Gastos && <Tab label="Factura Extranjera" {...a11yProps(1)} onClick={() => handleTab('facturas_pdf')}/>}
                        {!Gastos && <Tab label="Presupuesto" {...a11yProps(2)} onClick={() => handleTab('Presupuestos')} />}
                        {!Gastos && <Tab label="Pago" {...a11yProps(3)} onClick={() => handleTab('pago')} />}
                    </Tabs>
                </AppBar>

                <TabPanel value={value} index={0}>
                    <FacturasCompras opcionesData={opcionesData} reload={reload} activeTab={activeTab} compra={data} />
                    
                    {/* <DropzoneButton tipo="facturas_pdf" form={form} setForm={setForm} handleSubmit={handleSubmit} />
                    {adjuntos?.facturas_pdf && <CarruselAdjuntosCompras data={adjuntos.facturas_pdf} id={data} getAdjuntos={getAdjuntos} />} */}
                </TabPanel>

                <TabPanel value={value} index={1}>
                    <DropzoneButton tipo="facturas_pdf" form={form} setForm={setForm} handleSubmit={handleSubmit} />
                    {adjuntos?.facturas_pdf && <CarruselAdjuntosCompras data={adjuntos.facturas_pdf} id={data} getAdjuntos={getAdjuntos} />}
                </TabPanel>
                <TabPanel value={value} index={2}>
                    <DropzoneButton tipo="Presupuestos" form={form} setForm={setForm} handleSubmit={handleSubmit} />
                    {adjuntos?.presupuestos && <CarruselAdjuntosCompras data={adjuntos.presupuestos} id={data} getAdjuntos={getAdjuntos}/>}
                </TabPanel>
                <TabPanel value={value} index={3}>
                    <DropzoneButton tipo="pago" form={form} setForm={setForm} handleSubmit={handleSubmit} />
                    {adjuntos?.pagos && <CarruselAdjuntosCompras data={adjuntos.pagos} id={data} getAdjuntos={getAdjuntos} />}
                </TabPanel>
            </div>

           {/* </Container > */}
        </Box> 

 
        );
}
