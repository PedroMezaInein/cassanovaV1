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

import { apiGet, apiPutForm, apiPostForm } from '../../../../functions/api'
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

    const { vehiculo } = props
    console.log('data', vehiculo)
    const authUser = useSelector(state => state.authUser.access_token)
    const classes = useStyles();
    const [value, setValue] = useState(0);
    const [form, setForm] = useState({
        Tenencia: [], 
        Foto_placas: [],
        Seguro: [],
        Tarjeta_circulacion: [],
        Verificacion: [],
        Factura: [],
        file: [],
    })
    const [activeTab, setActiveTab] = useState('Tenencia')
    const [adjuntos, setAdjuntos] = useState(false)
    useEffect(() => {
        Swal.fire({
            title: 'Cargando...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading()
            }
        }) 
        getAdjuntos()
    }, [])

    const handleChange = (event, newValue) => {
        setValue(newValue);
        setForm({
            ...form,
            file: []
        })
    };

    const getAdjuntos = () => {
        try {
            apiGet(`vehiculos/adjuntos/${vehiculo.id}`, authUser)
                .then(res => {
                    Swal.close()
                    /* let aux = {
                        Tenencia: [],
                        Foto_placas: [],
                        Seguro: [],
                        Tarjeta_circulacion: [],
                        Verificacion: [],
                        Factura: [],

                    }
                    Object.keys(adjunAux).forEach((element) => {
                        switch (element) {
                            case 'Tenencia':
                                aux.Tenencia = res.data.Tenencia
                                break;
                        }
                    });
                    console.log('aux', aux)
                    setAdjuntos(aux) */
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
    }

    const handleFile = (e) => {
        console.log(e.target.files)
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


    const handleSubmit = (e) => {
        e.preventDefault()

        if (validate()) {
            Swal.fire({
                title: 'Subiendo archivo...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading()
                }
            })
            let data = new FormData()

            data.append('files_name_vehiculos[]', form.file[0].name)
            data.append(`files_vehiculos[]`, form.file[0])
            data.append('asjuntos[]', "vehiculos")
            data.append('tipo', activeTab)


            try {
                apiPostForm(`vehiculos/${vehiculo.id}/archivos/s3`, data,  authUser)
                    .then(res => {
                        Swal.close()
                    })
                    .catch(err => {
                        Swal.close()
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Algo salio mal!',
                        })
                    })
            } catch (error) {
                Swal.close()
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Algo salio mal!',
                })
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Debe seleccionar un archivo',
                showConfirmButton: false,
                timer: 1500
            })
        }
    }

   

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
                        <button className="btn-subir" onClick={handleSubmit} >Subir</button>
                    </div>
                </div>
            </>
        )
    }

    const viewAdjuntos = (tab) => {
        return (
            <>
                {
                    adjuntos && adjuntos[tab] && adjuntos[tab].length > 0 ?
                        <CarruselAdjuntos data={adjuntos[tab]} id={vehiculo.id} getAdjuntos={getAdjuntos} />
                        :
                        <div className="">
                            <p>No hay archivos adjuntos</p>
                        </div>
                }
            </>
        )
    }

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
                    <Tab label="Tenencia " {...a11yProps(0)} name="tenencia" onClick={() => handleTab('Tenencia')} />
                    

                </Tabs>

                <TabPanel value={value} index={0}>
                    <div>
                        {uploadButtons('Tenencia')}
                        {viewAdjuntos('Tenencia')}
                    </div>
                </TabPanel>
            </div>
        </>
    )
}