import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import Swal from 'sweetalert2'

import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import { apiGet, apiPostForm, apiPutForm } from './../../../functions/api'
import CarruselAdjuntosCompras from './CarruselAdjuntosCompras'
import style from './CarruselCompras.module.scss'

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

export default function AdjuntosCompras (props) {
    const { data, Gastos } = props

    const authUser = useSelector(state => state.authUser.access_token)
    const classes = useStyles();
    const [value, setValue] = useState(0);
    const [form, setForm] = useState({
        facturas_pdf: '',
        pago: '',
        Presupuestos: '',
        tipo:''
    })
    const [activeTab, setActiveTab] = useState('facturas_pdf')
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
    };
    console.log('hola')

    const getAdjuntos = () => {
        try {
            apiGet(`v2/proyectos/compras/adjuntos/${data.id}`, authUser)
                .then(res => {
                    console.log('res')
                    console.log(res)

                    let adjunAux = res.data.compra.facturas_pdf
                    let adjunPagos = res.data.compra.pagos
                    let adjunPresupuesto = res.data.compra.presupuestos

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
            data.append(`files_name_${activeTab}[]`, form[activeTab][0].name)
            data.append(`files_${activeTab}[]`, form[activeTab][0])
            data.append('adjuntos[]', activeTab)
            data.append('tipo', activeTab)

            try {
                apiPostForm(`v2/proyectos/compras/${props.data.id}/archivos/s3`, data, authUser)
                    .then(res => {
                        Swal.close()
                        Swal.fire({
                            icon: 'success',
                            title: 'Adjunto guardado',
                            showConfirmButton: false,
                            timer: 1500
                        })
                        getAdjuntos()

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
                        <CarruselAdjuntosCompras data={adjuntos[tab]} id={data.id} getAdjuntos={getAdjuntos} />
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
                    <Tab label="Factura Extranjera" {...a11yProps(0)} name="facturas_pdf" onClick={() => handleTab('facturas_pdf')} />
                    {Gastos ? null : <Tab label="Presupuesto" {...a11yProps(1)} name="presupuestos" onClick={() => handleTab('Presupuestos')} />}
                    {Gastos ? null : <Tab label="pago" {...a11yProps(2)} name="pago" onClick={() => handleTab('pago')} />}
                    
                </Tabs>

                <TabPanel value={value} index={0}>
                    <div>
                        {getButtonOptions('facturas_pdf')}
                        {getAdjuntosCarrusel('facturas_pdf') }
                    </div>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <div>
                        {getButtonOptions('Presupuestos')}
                        {getAdjuntosCarrusel('Presupuestos')}
                    </div>
                </TabPanel>

                <TabPanel value={value} index={2}>
                    <div>
                        {getButtonOptions('pago')}
                        {getAdjuntosCarrusel('pago')}
                    </div>
                </TabPanel>

            </div>
        </>
    )
}