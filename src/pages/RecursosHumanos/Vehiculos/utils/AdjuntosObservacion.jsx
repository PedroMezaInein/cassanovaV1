import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import Swal from 'sweetalert2'

import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import { apiGet } from '../../../../functions/api'

import CarruselAdjuntos from './CarruselAdjuntoObservacion'
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
    console.log(vehiculo)
    const authUser = useSelector(state => state.authUser.access_token)
    const classes = useStyles();
    const [value, setValue] = useState(0);
    const [form, setForm] = useState({
        Seguro: [],
        Tarjeta_circulacion: [],
    })
    const [activeTab, setActiveTab] = useState('Seguro')
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
                    let adjunAux = res.data.vehiculos.adjuntos
                    Swal.close()
                    let aux = {
                        Seguro: [],
                        Tarjeta_circulacion: [],
                    }
                    adjunAux.forEach((element) => {
                        switch (element.pivot.tipo) {
                            case 'Seguro':
                                aux.Seguro = [...aux.Seguro, element]
                                break;
                            case 'Tarjeta_circulacion':
                                aux.Tarjeta_circulacion = [...aux.Tarjeta_circulacion, element]
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
        }
    }

    const handleTab = (e) => {
        setActiveTab(e)
    }

    const validate = () => {
        if (activeTab && form.file.length > 0) {
            return true
        } else {
            return false
        }
    }

    const resetForm = () => {
        setForm({
            ...form,
            file: []
        })
    }

    const viewAdjuntos = (tab) => {
        return (
            <>
                {
                    adjuntos && adjuntos[tab] && adjuntos[tab].length > 0 ?
                        <CarruselAdjuntos data={adjuntos[tab]} id={vehiculo.id} getAdjuntos={getAdjuntos} />
                        :
                        <div className="not_adjuntos">
                            <span>No hay archivos adjuntos</span>
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
                    <Tab label="Seguro" {...a11yProps(0)} name="seguro" onClick={() => handleTab('Seguro')} />
                    <Tab label="Tarjeta de circulación" {...a11yProps(1)} name="tarjeta" onClick={() => handleTab('Tarjeta_circulacion')} />
                </Tabs>

               
                <TabPanel value={value} index={0}>
                    <div>
                        {viewAdjuntos('Seguro')}
                    </div>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <div>
                        {viewAdjuntos('Tarjeta_circulacion')}
                    </div>
                </TabPanel>
                
            </div>
        </>
    )
}