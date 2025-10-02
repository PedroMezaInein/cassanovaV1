import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux'

import Swal from 'sweetalert2'

import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { useDropzone } from 'react-dropzone';
import { Box, Grid, Paper, Typography } from '@mui/material';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';

import { apiGet, apiPostForm, apiPutForm } from './../../../functions/api'
import CarruselAdjuntosCompras from './CarruselIngresos'
import FacturasVentas from './FacturasIngresos';

import style from './CarruselCompras.module.scss'

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

// export default function AdjuntosCompras (props) {
export default function AdjuntosIngresos({ data, Ingresos, opcionesData, reload }) {

    // const { data, Ingresos } = props
    const authUser = useSelector(state => state.authUser.access_token)
    const classes = useStyles();
    const [value, setValue] = useState(0);
    const [form, setForm] = useState({
        facturas_pdf: '',
        pago: '',
        Presupuestos: '',
        tipo:''
    })

    // console.log(data)
    const [activeTab, setActiveTab] = useState('facturas_pdf')
    const [adjuntos, setAdjuntos] = useState(false)
    // useEffect(() => {
    //     Swal.fire({
    //         title: 'Cargando...',
    //         allowOutsideClick: false,
    //         didOpen: () => {
    //             Swal.showLoading()
    //         }
    //     })
    //     getAdjuntos()
    // }, [])

      useEffect(() => {
        // if (data?.id) {
            getAdjuntos();
        // }
    }, []);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const getAdjuntos = () => {
        try {
            apiGet(`v2/administracion/ingresos/adjuntos/${data}`, authUser)
                .then(res => {
                    let adjunAux = res.data.ingreso.facturas_pdf
                    let adjunPagos = res.data.ingreso.pagos
                    let adjunPresupuesto = res.data.ingreso.presupuestos

                    Swal.close()
                    let aux = {
                        facturas_pdf: [],
                        pago: [],
                        Presupuestos: [],

                    }
                    adjunAux.forEach((element) => {
                        switch (element.pivot.tipo) {
                            case 'facturas_pdf':
                                aux.facturas_pdf.push(element)
                                break;                        
                            default:
                                break;
                        }
                    });
                    adjunPagos.forEach((element) => {
                        switch (element.pivot.tipo) { 
                            case 'pago':
                                aux.pago.push(element)
                                break;                      
                            default:
                                break;
                        }
                    });
                    adjunPresupuesto.forEach((element) => {
                        switch (element.pivot.tipo) { 
                            case 'presupuesto':
                                aux.Presupuestos.push(element)
                                break;                       
                            default:
                                break;
                        }
                    });
                    setAdjuntos(aux)
                })
            
        } catch (error) {
            Swal.close()
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Algo salio mal!',
            })

            console.log('error', error)
        }
    }

    const handleTab = (e) => {
        setActiveTab(e)
        form.tipo = ''
        setForm({
            ...form,
        })
    }

    const handleFile = (e) => {
        form.tipo = e.target.files[0]
        setForm({
            ...form,
            [activeTab]: [e.target.files[0]]
        })
    }

    const validate = () => {
        if (activeTab && form[activeTab] !== '') {
            return true
        } else {
            return false
        }
    }

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
                        `v3/administracion/ingresos/${data}/archivos/s3`,
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
        
        
    //     if (validate()) {
    //         Swal.fire({
    //             title: 'Subiendo archivo...',
    //             allowOutsideClick: false,
    //             didOpen: () => {
    //                 Swal.showLoading()
    //             }
    //         })
    //         let data = new FormData();
    //         let aux = Object.keys(form)

    //         /* aux.forEach((element) => {
    //             switch (element) {
    //                 case 'adjuntos':
    //                     break;
    //                 default:
    //                     data.append(element, form[element])
    //                     break
    //             }
    //         }) */
    //         data.append(`files_name_${activeTab}[]`, form[activeTab][0].name)
    //         data.append(`files_${activeTab}[]`, form[activeTab][0])
    //         data.append('adjuntos[]', activeTab)
    //         data.append('tipo', activeTab)
    
    //         try {
    //             apiPostForm(`v3/administracion/ingresos/${data}/archivos/s3`, data, authUser)
    //                 .then(res => {
    //                     Swal.close()
    //                     Swal.fire({
    //                         icon: 'success',
    //                         title: 'Adjunto guardado',
    //                         showConfirmButton: false,
    //                         timer: 1500
    //                     })
    //                     getAdjuntos()

    //                     if (res.status === 200) {
    //                         Swal.fire({
    //                             icon: 'success',
    //                             title: 'Adjunto guardado',
    //                             showConfirmButton: false,
    //                             timer: 1500
    //                         })
    //                     }
    //                 })
    //                 .catch(err => {
    //                     Swal.close()
    //                     Swal.fire({
    //                         icon: 'error',
    //                         title: 'Oops...',
    //                         text: 'Algo salio mal!',
    //                     })
    //                     console.log('err', err)
    //                 })
    //         } catch (error) {
    //             Swal.close()
    //             Swal.fire({
    //                 icon: 'error',
    //                 title: 'Oops...',
    //                 text: 'Algo salio mal!',
    //             })
    //             console.log('error', error)
    //         }
    //     } else {
    //         Swal.fire({
    //             icon: 'error',
    //             title: 'Debe seleccionar un archivo',
    //             showConfirmButton: false,
    //             timer: 1500
    //         })
    //     } 
    // }

    const getButtonOptions = (tipo) => { 
        
        return (
            <>
                <div className={style.adjuntos_send}>
                    <div className={style.file}>

                        {/* <label htmlFor="file">Seleccionar archivo(s)</label>
                        <input type="file" id='file' name="file" onChange={handleFile} />
                            <div>
                                {state.solicitud.name ? <div className='file-name'>{state.solicitud.name}</div> : null}
                            </div> */}

                        <label htmlFor="file">Selecciona la factura</label>
                        <input type="file" id="file" name="file" onChange={handleFile} arial-label="Seleccionar Comunicado" />
                        <div>
                            {form.tipo ? <div className='file-name'> {form.tipo.name} </div>: <p>No hay archivo seleccionado</p>}
                        </div>

                    </div>
                    <div>
                        <button style={{ marginLeft: '1rem' }} className='sendButton' onClick={handleSubmit}>Subir</button>
                    </div>
                </div>
            </>
        )
    }

    const getAdjuntosCarrusel = (tab) => { 
       
        return (
            <>
                {
                    adjuntos && adjuntos[tab] && adjuntos[tab].length > 0 ?
                        <CarruselAdjuntosCompras data={adjuntos[tab]} id={data} getAdjuntos={getAdjuntos} />
                        :
                        <div className="no-adjuntos">
                            <p>No hay archivos adjuntos</p>
                        </div>
                }
            </>
        )
    }


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
                        {!Ingresos && <Tab label="Factura Extranjera" {...a11yProps(1)} onClick={() => handleTab('facturas_pdf')} />}
                        {!Ingresos && <Tab label="Presupuesto" {...a11yProps(2)} onClick={() => handleTab('presupuestos')} />}
                        {!Ingresos && <Tab label="Pago" {...a11yProps(3)} onClick={() => handleTab('pagos')} />}
                    </Tabs>
                </AppBar>

                <TabPanel value={value} index={0}>
                    <FacturasVentas opcionesData={opcionesData} reload={reload} activeTab={activeTab} compra={data} />
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <DropzoneButton tipo="facturas_pdf" form={form} setForm={setForm} handleSubmit={handleSubmit} />
                    {adjuntos?.facturas_pdf && (
                        <CarruselAdjuntosCompras data={adjuntos.facturas_pdf} id={data} getAdjuntos={getAdjuntos} />

                    )}
                </TabPanel>
                <TabPanel value={value} index={2}>
                    <DropzoneButton tipo="presupuestos" form={form} setForm={setForm} handleSubmit={handleSubmit} />
                    {adjuntos?.Presupuestos && (
                        <CarruselAdjuntosCompras data={adjuntos.Presupuestos} id={data} getAdjuntos={getAdjuntos} />
                    )}
                </TabPanel>
                <TabPanel value={value} index={3}>
                    <DropzoneButton tipo="pagos" form={form} setForm={setForm} handleSubmit={handleSubmit} />
                    {adjuntos?.pago && (
                        <CarruselAdjuntosCompras data={adjuntos.pago} id={data} getAdjuntos={getAdjuntos} />
                    )}
                </TabPanel>
            </div>
        </Box>
    );
}