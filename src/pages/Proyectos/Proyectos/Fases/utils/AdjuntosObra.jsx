import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import Swal from 'sweetalert2'

import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';


import { apiPutForm, apiGet, apiPostForm } from './../../../../../functions/api'
import CarruselAdjuntosObra from './CarruselAdjuntosObra'


import './../../../../../styles/_adjuntosRequisicion.scss'

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
        height: 350,
        width: '100%',
    },
    tabs: {
        borderRight: `1px solid ${theme.palette.divider}`,
        
    },
}));

export default function AdjuntosObra(props) {
    const { data } = props
    console.log('data', data)
    const authUser = useSelector(state => state.authUser.access_token)
    const classes = useStyles();
    const [value, setValue] = useState(0);
    const [form, setForm] = useState({
        adjuntos_obra: '',
    })
    const [activeTab, setActiveTab] = useState('adjuntos_obra')
    const [adjuntos, setAdjuntos] = useState(false)
    useEffect(() => {
        // getAdjuntos()
    }, [])

    const handleChange = (event, newValue) => {
        console.log('newvalue', event) 
        setValue(newValue);
    };

    const getAdjuntos = () => {
        console.log('funciono')
        // Swal.fire({
        //     title: 'Cargando...',
        //     allowOutsideClick: false,
        //     didOpen: () => {
        //         Swal.showLoading()
        //     }
        // })
        try {
            apiGet(`v1/proyectos/nota-bitacora?proyecto=${data.id}`, authUser)
                .then(res => {
                    console.log(res.data)
                    let adjunAux = res.data.data.adjuntos
                    Swal.close()
                    let aux = {
                        adjuntos_obra: [],
                    }
                    adjunAux.forEach((element) => {
                        switch (element.pivot.nombre) {
                            case 'adjuntos_obra':
                                aux.adjuntos_obra.push(element)
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
        console.log('tab', e)
        setActiveTab(e)
    }

    const handleFile = (e) => {
        let aux = e.target.files
        // debugger
        setAdjuntos({
            ...adjuntos,
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
            let data = new FormData();
            let aux = Object.keys(form)

            /* aux.forEach((element) => {
                switch (element) {
                    case 'adjuntos':
                        break;
                    default:
                        data.append(element, form[element])
                        break
                }
            }) */

            data.append(`files_name_requisicion[]`, form[activeTab][0].name)
            data.append(`files_requisicion[]`, form[activeTab][0])
            data.append('adjuntos[]', "requisicion")
            data.append('tipo', activeTab)
            

            try {
                apiPostForm(`requisicion/${props.data.id}/archivos/s3`, data, authUser)
                    .then(res => {
                        Swal.close()
                        Swal.fire({
                            icon: 'success',
                            title: 'Adjunto guardado',
                            showConfirmButton: false,
                            timer: 1500
                        })
                        getAdjuntos()

                        console.log('res', res)
                        if (res.status === 200) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Adjunto guardado',
                                showConfirmButton: false,
                                timer: 1500
                            })
                        }
                    })
                    .catch(err => {
                        Swal.close()
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Algo salio mal!',
                        })
                        console.log('err', err)
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
    }

    const getButtonOptions = (tipo) => { 
        return (
            <>
                <div className='adjuntos_send'>
                    <div className="file">

                        <label htmlFor="file">Selecciona el archivo</label>
                        <input type="file" id="file" name="file" onChange={handleFile} arial-label="Seleccionar archivo" />
                        <div>
                            {/* {form.tipo && form.tipo.length > 0 ? <p>{form.tipo[0].name}</p> : <p>No hay archivo seleccionado</p>} */}
                        </div>

                    </div>
                    <div>
                        <button className='sendButton' onClick={handleSubmit}>Subir</button>
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
                        <CarruselAdjuntosObra data={adjuntos[tab]} id={data.id} getAdjuntos={getAdjuntos} />
                        :
                        <div className="no-adjuntos">
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
                    variant="fullWidth"

                    value={value}
                    onChange={handleChange}
                    aria-label="Vertical tabs example"
                    className={classes.tabs}
                >
                    <Tab label="Comunicado" {...a11yProps(0)} name="adjuntos_obra" onClick={() => handleTab('adjuntos_obra')} />
                </Tabs>

                <TabPanel value={value} index={0}>
                    <div>
                        {getButtonOptions('adjuntos_obra')}
                        {getAdjuntosCarrusel('adjuntos_obra') }
                    </div>
                </TabPanel>
            </div>
        </>
    )
}