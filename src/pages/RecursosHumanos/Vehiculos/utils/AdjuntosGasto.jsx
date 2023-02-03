import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import Swal from 'sweetalert2'
import S3 from 'react-aws-s3';
import axios from 'axios'

import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import { apiGet } from '../../../../functions/api'
import { URL_DEV } from '../../../../constants'
import { setSingleHeader } from '../../../../functions/routers'

import CarruselAdjuntos from './CarruselAdjuntos'
import './../../../../styles/_adjuntosVehiculos.scss'

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
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
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
        height: 550,
        width: '100%',
    },
    tabs: {
        borderRight: `1px solid ${theme.palette.divider}`,

    },
}));

export default function Adjuntos(props) {

    /* const { proyecto } = props */
    const authUser = useSelector(state => state.authUser.access_token)
    const classes = useStyles();
    const [value, setValue] = useState(0);
    const [form, setForm] = useState({
        datos_de_cliente: [], //antes documentacion_cliente
        file: [],
    })
    const [activeTab, setActiveTab] = useState('datos_de_cliente')
    const [adjuntos, setAdjuntos] = useState(false)
    useEffect(() => {
        /* Swal.fire({
            title: 'Cargando...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading()
            }
        }) */
        /* getAdjuntos() */
    }, [])

    const handleChange = (event, newValue) => {
        setValue(newValue);
        setForm({
            ...form,
            file: []
        })
    };

    /* const getAdjuntos = () => {
        try {
            apiGet(`v2/proyectos/proyectos/proyecto/${proyecto.id}/adjuntos`, authUser)
                .then(res => {
                    let adjunAux = res.data.proyecto
                    Swal.close()
                    let aux = {
                        datos_de_cliente: [],
                    }
                    //obtener la key del objeto y recorrelo
                    Object.keys(adjunAux).forEach((element) => {
                        switch (element) {
                            case 'datos_de_cliente':
                                aux.datos_de_cliente = adjunAux[element]
                                break;
                            default:
                                break;
                        }
                    });
                    console.log('aux', aux)
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
    } */

    const handleTab = (e) => {
        setActiveTab(e)
    }

    const handleFile = (e) => {
        setForm({
            ...form,
            file: [...e.target.files]
        })
    }

    const validate = () => {
        if (activeTab && form.file.length > 0) {
            return true
        } else {
            return false
        }
    }


    /* const handleSubmit = (e) => {
        e.preventDefault()

        if (validate()) {
            Swal.fire({
                title: 'Subiendo archivo...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading()
                }
            })
            let filePath = `proyecto/${proyecto.id}/${activeTab}/${Math.floor(Date.now() / 1000)}-`
            console.log('filePath', filePath)
            let aux = []
            form.file.forEach((file) => {
                console.log(file)
                aux.push(file)
            })

            try {
                apiGet('v1/constant/admin-proyectos', authUser)
                    .then(res => {
                        let auxPromises = aux.map((file) => {
                            return new Promise((resolve, reject) => {
                                new S3(res.data.alma).uploadFile(file, `${filePath}${file.name}`)
                                    .then((data) => {
                                        const { location, status } = data
                                        if (status === 204)
                                            resolve({ name: file.name, url: location })
                                        else
                                            reject(data)
                                    }).catch(err => reject(err))
                            })
                        })
                        Promise.all(auxPromises).then(values => { addS3FilesAxios(values) }).catch(err => console.error(err))
                    })
                    .catch(err => {
                        Swal.close()
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Algo salio mal!',
                        })
                        console.log('error', err)
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
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Debe seleccionar un archivo',
                showConfirmButton: false,
                timer: 1500
            })
        }
    } */

    /* const addS3FilesAxios = (files) => {
        try {
            axios.post(`${URL_DEV}v2/proyectos/proyectos/adjuntos/${proyecto.id}/s3`, { archivos: files }, {
                params: { tipo: activeTab },
                headers: setSingleHeader(authUser)
            })
                .then(res => {
                    Swal.close()
                    Swal.fire({
                        icon: 'success',
                        title: 'Archivo subido correctamente',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    getAdjuntos()
                    setForm({
                        file: []
                    })
                })
                .catch(err => {
                    Swal.close()
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Algo salio mal!',
                    })
                    console.log('error', err)
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
    } */

    const uploadButtons = () => {
        return (
            <>
                <div className='upload_buttons'>
                    <div className="file">

                        <label htmlFor="file">Seleccionar archivo(s)</label>
                        <input type="file" id="file" name="file" onChange={handleFile} multiple />
                        <div>
                            {form.file.length > 0 ?
                                form.file.length < 3 ?
                                    <>
                                        {
                                            form.file.map((file, index) => {
                                                return <p key={index}>{file.name}</p>
                                            })
                                        }
                                    </>
                                    :
                                    <>
                                        <p>{`${form.file.length} archivos seleccionados`}</p>
                                    </>
                                : <p>No hay archivo seleccionado</p>}
                        </div>

                    </div>
                    <div >
                        <button className="btn-subir" >Subir</button>
                    </div>
                </div>
            </>
        )
    }

    /* const viewAdjuntos = (tab) => {
        return (
            <>
                {
                    adjuntos && adjuntos[tab] && adjuntos[tab].length > 0 ?
                        <CarruselAdjuntos data={adjuntos[tab]} id={proyecto.id} getAdjuntos={getAdjuntos} />
                        :
                        <div className="">
                            <p>No hay archivos adjuntos</p>
                        </div>
                }
            </>
        )
    } */

    return (
        <>
            <div className={classes.root}>
                <Tabs
                    orientation="vertical"
                    variant="scrollable"
                    value={value}
                    onChange={handleChange}
                    className={classes.tabs}
                >
                    <Tab label="DOCUMENTOS CLIENTES " {...a11yProps(0)} name="datos_de_cliente" onClick={() => handleTab('datos_de_cliente')} />


                </Tabs>

                <TabPanel value={value} index={0}>
                    <div>
                        {uploadButtons()}
                        {/* {viewAdjuntos('datos_de_cliente')} */}
                    </div>
                </TabPanel>
            </div>
        </>
    )
}