import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux'

import Swal from 'sweetalert2'

import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
// import Box from '@material-ui/core/Box';

import { Dialog, DialogActions, DialogContent, DialogTitle, Grid, Paper,Box,InputLabel  } from '@mui/material';
import Button from '@material-ui/core/Button';
import { useDropzone } from 'react-dropzone';

import { apiPutForm, apiGet, apiPostForm } from '../../../../functions/api'
import CarruselAdjuntos from './CarruselAdjuntos'
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import style from './../../../../styles/_adjuntosRequisicion.scss'
import { ControlPointSharp } from '@mui/icons-material';

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
        accept: 'image/*,application/pdf,.xml,.doc,.docx,.xls,.xlsx,.ppt,.pptx',
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

export default function Adjuntos(props) {
    const { data, nuevaRequisicion ,factura} = props
    const authUser = useSelector(state => state.authUser.access_token)
    const classes = useStyles();
    const [value, setValue] = useState(0);
    const [form, setForm] = useState({
        Ficha_tecnica: '',
        Solicitud: '',
        Cotizaciones: '',
        Orden_compra: '',
        Comprobante_pago: '',
        Factura: '',
        tipo: '',

    })
    const [activeTab, setActiveTab] = useState('Ficha_tecnica')
    const [adjuntos, setAdjuntos] = useState(false)


   useEffect(() => {
           Swal.fire({
               title: 'Cargando...',
               allowOutsideClick: false,
               didOpen: () => {
                   Swal.showLoading();
               },
           });
           getAdjuntos();
       }, []);
    const handleChange = (event, newValue) => {
        // console.log('newvalue', event) 
        setValue(newValue);
    };

    
    const getAdjuntos = () => {
        try {
            apiGet(`requisicion/adjuntos/${props.data}`, authUser)
                .then(res => {
                    // Swal.close()
                    // console.log("Respuesta de la API:", res.data); // <--- Agrega este log
                    let adjunAux = res.data.data.adjuntos;
                    Swal.close();
                    // console.log(adjunAux)
                    let aux = {
                        Ficha_tecnica: [],
                        Solicitud: [],
                        Cotizaciones: [],
                        Orden_compra: [],
                        Comprobante_pago: [],
                        Factura: [],
                    };
                    // console.log(aux.Cotizaciones)
                    adjunAux.forEach((element) => {
                        switch (element.pivot.nombre) {
                            case 'Ficha_tecnica':
                                aux.Ficha_tecnica.push(element);
                                break;
                            case 'Solicitud':
                                aux.Solicitud.push(element);
                                break;
                            case 'Cotizaciones':
                                aux.Cotizaciones.push(element);
                                break;
                            case 'Orden_compra':
                                aux.Orden_compra.push(element);
                                break;
                            case 'Comprobante_pago':
                                aux.Comprobante_pago.push(element);
                                break;
                            case 'Factura':
                                aux.Factura.push(element);
                                break;
                            default:
                                break;
                        }
                    });
    
                    setAdjuntos(aux);
                    // console.log("Adjuntos después de setAdjuntos:", aux); // <--- Agrega este log
                    Swal.close();
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
        setActiveTab(e);
        setForm({ ...form, tipo: '' });
    };

    // const handleFile = (e) => {
    //     form.tipo = e.target.files[0]
    //     setForm({
    //         ...form,
    //         [activeTab]: [e.target.files[0]]
    //     })
    // }

    // const validate = () => {
    //     if (activeTab && form[activeTab] !== '') {
    //         return true
    //     } else {
    //         return false
    //     }
    // }

  const handleSubmit = async () => {
    // console.log(form)
    // console.log(activeTab)
    // console.log(form[activeTab].length)

        if (!form[activeTab] || form[activeTab].length === 0) {
            // console.log(form)
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
                // data.append(`files_name_requisicion[]`, form[activeTab][0].name)
                // data.append(`files_requisicion[]`, files_requisicion[])
                // data.append('adjuntos[]', "requisicion")
                // data.append('tipo', activeTab)


                data.append(`files_name_${activeTab}[]`, file.name);
                data.append(`files_requisicion[]`, file);
                data.append('adjuntos[]', "requisicion");
                data.append('tipo', activeTab);
                // console.log(data)
                await apiPostForm(`requisicion/${props.data}/archivos/s3`, data, authUser);
                
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

    // const handleSubmit = (e) => {
    //     e.preventDefault()

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

    //         data.append(`files_name_requisicion[]`, form[activeTab][0].name)
    //         data.append(`files_requisicion[]`, form[activeTab][0])
    //         data.append('adjuntos[]', activeTab)
    //         data.append('tipo', activeTab)
            

    //         try {
    //             apiPostForm(`requisicion/${props.data.id}/archivos/s3`, data, authUser)
    //                 .then(res => {
    //                     Swal.close()
    //                     Swal.fire({
    //                         icon: 'success',
    //                         title: 'Adjunto guardado',
    //                         showConfirmButton: false,
    //                         timer: 1500
    //                     })
    //                     getAdjuntos()

    //                     // console.log('res', res)
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

    // const getButtonOptions = (tipo) => { 
    //     // console.log(form.tipo)
    //     // console.log(tipo)
    //     return (
    //         <>
    //             <div className={style.adjuntos_send}>
    //                 <div className="file" >

    //                     <label htmlFor="file">Selecciona el adjunto</label>
    //                     <input type="file" id="file" name="file" onChange={handleFile} arial-label="Seleccionar adjunto" />
    //                     <div>
    //                         {form.tipo ? <div className='file-name'> {form.tipo.name} </div>: <p>No hay archivo seleccionado</p>}
    //                     </div>
    //                 </div>
    //                 <div>
    //                     <button  style={{ marginLeft: '1rem' }} className='sendButton' onClick={handleSubmit}>Subir</button>
    //                 </div>
    //             </div>
    //         </>
    //     )
    // }

    // const getAdjuntosCarrusel = (tab) => { 
    //     return (
    //         <>
    //             {
    //                 adjuntos && adjuntos[tab] && adjuntos[tab].length > 0 ?
    //                     <CarruselAdjuntos data={adjuntos[tab]} id={data.id} getAdjuntos={getAdjuntos} />
    //                     :
    //                     <div className="no-adjuntos">
    //                         <p>No hay archivos adjuntos</p>
    //                     </div>
    //             }
    //         </>
    //     )
    // }


 
   
    return (
        <>
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
                    <Tab label="Adjunto" {...a11yProps(0)} name="ficha_tecnica" onClick={() => handleTab('Ficha_tecnica')} />
                    {nuevaRequisicion ? null : <Tab label="Solicitud" {...a11yProps(1)} onClick={() => handleTab('Solicitud')}/>}
                    {nuevaRequisicion ? null : <Tab label="Cotizaciones" {...a11yProps(2)} name="Cotizaciones" onClick={() => handleTab('Cotizaciones')} />}
                    {nuevaRequisicion ? null : <Tab label="Orden de compra" {...a11yProps(3)} name="orden_compra" onClick={() => handleTab('Orden_compra')} />}
                    {nuevaRequisicion ? null : <Tab label="Comprobante de pago" {...a11yProps(4)} name="comprobante_pago" onClick={() => handleTab('Comprobante_pago')} />}
                    {factura ? null : <Tab label="Factura" {...a11yProps(5)} name="Factura" onClick={() => handleTab('Factura')} />} 
                    
                  </Tabs>
                </AppBar>

                <TabPanel value={value} index={0}>
                    <DropzoneButton tipo="Ficha_tecnica" form={form} setForm={setForm} handleSubmit={handleSubmit} />
                    {adjuntos?.Ficha_tecnica && <CarruselAdjuntos data={adjuntos.Ficha_tecnica} id={data} getAdjuntos={getAdjuntos} />}
                </TabPanel>

                <TabPanel value={value} index={1}>
                    <DropzoneButton tipo="Solicitud" form={form} setForm={setForm} handleSubmit={handleSubmit} />
                    {adjuntos?.Solicitud && <CarruselAdjuntos data={adjuntos.Solicitud} id={data} getAdjuntos={getAdjuntos} />}
                </TabPanel>

                <TabPanel value={value} index={2}>
                    <DropzoneButton tipo="Cotizaciones" form={form} setForm={setForm} handleSubmit={handleSubmit} />
                    {adjuntos?.Cotizaciones && <CarruselAdjuntos data={adjuntos.Cotizaciones} id={data} getAdjuntos={getAdjuntos} />}
                </TabPanel> 
                
                <TabPanel value={value} index={3}>
                    <DropzoneButton tipo="Orden_compra" form={form} setForm={setForm} handleSubmit={handleSubmit} />
                    {adjuntos?.Orden_compra && <CarruselAdjuntos data={adjuntos.Orden_compra} id={data} getAdjuntos={getAdjuntos} />}
                </TabPanel> 
                
                <TabPanel value={value} index={4}>
                    <DropzoneButton tipo="Comprobante_pago" form={form} setForm={setForm} handleSubmit={handleSubmit} />
                    {adjuntos?.Comprobante_pago && <CarruselAdjuntos data={adjuntos.Comprobante_pago} id={data} getAdjuntos={getAdjuntos} />}
                </TabPanel> 
                
                <TabPanel value={value} index={5}>
                    <DropzoneButton tipo="Factura" form={form} setForm={setForm} handleSubmit={handleSubmit} />
                    {adjuntos?.Factura && <CarruselAdjuntos data={adjuntos.Factura} id={data} getAdjuntos={getAdjuntos} />}
                </TabPanel>
                 {/* <TabPanel value={value} index={1}>
                    <DropzoneButton tipo="facturas_pdf" form={form} setForm={setForm} handleSubmit={handleSubmit} />
                    {adjuntos?.facturas_pdf && <CarruselAdjuntosCompras data={adjuntos.facturas_pdf} id={data} getAdjuntos={getAdjuntos} />}
                </TabPanel> */}

                {/* <TabPanel value={value} index={0}>
                    <div>
                        {getButtonOptions('Ficha_tecnica')}
                        {getAdjuntosCarrusel('Ficha_tecnica') }
                    </div>
                </TabPanel> */}

                {/* <TabPanel value={value} index={1}>
                    <div>
                        {getButtonOptions('Solicitud')}
                        {getAdjuntosCarrusel('Solicitud')}
                    </div>
                </TabPanel>

                <TabPanel value={value} index={2}>
                    <div>
                        {getButtonOptions('Cotizaciones')}
                        {getAdjuntosCarrusel('Cotizaciones')}
                    </div>
                </TabPanel>

                <TabPanel value={value} index={3}>
                    <div>
                        {getButtonOptions('Orden_compra')}
                        {getAdjuntosCarrusel('Orden_compra')}
                    </div>
                </TabPanel>

                <TabPanel value={value} index={4}>
                    <div>
                        {getButtonOptions('Comprobante_pago')}
                        {getAdjuntosCarrusel('Comprobante_pago')}
                    </div>
                </TabPanel>

                <TabPanel value={value} index={5}>
                    <div>
                        {getButtonOptions('Factura')}
                        {getAdjuntosCarrusel('Factura')}
                    </div>
                </TabPanel> */}
              </div>            
            </Box> 
        </>
    )
}