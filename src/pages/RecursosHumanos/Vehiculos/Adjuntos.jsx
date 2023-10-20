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

import { apiPostForm, apiGet } from '../../../functions/api';
import { URL_DEV } from '../../../constants'
import { setSingleHeader } from '../../../functions/routers'

import CarruselAdjuntos from './CarruselAdjuntos'
import './../../../styles/_adjuntosRequisicion.scss'

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

    const { proyecto } = props
    const authUser = useSelector(state => state.authUser.access_token)
    const classes = useStyles();
    const [value, setValue] = useState(0);
    const [form, setForm] = useState({
        // datos_de_cliente: [], //antes documentacion_cliente
        // contrato_cliente: [],
        // permisos_de_obra_ante_dependencias: [],
        // catalogo_inicial_obra: [],
        // programa_de_obra: [],
        // contrato_proveedores_y_contratistas: [],
        // firmas_de_aprobacion: [], //antes firma_de_acabados
        // reporte_fotografico_de_avance_de_obra: [], //antes planos_iniciales_de_obra
        // renders_aprobados: [],
        // fianzas_y_seguros: [],
        // catalogo_de_conceptos_asbuilt: [], //antes planos_asbuilt
        // consignas_de_matenimiento: [],
        // garantia_de_los_equipos: [],
        // garantia_de_vicios_ocultos: [],
        // memorias_de_calculo: [],
        // memorias_descriptivas: [],
        // fichas_tecnicas: [],
        // pruebas_de_instalaciones: [],
        // fotografias_fin_de_obra: [],
        acta_de_entrega: [],
        file: [],
    })
    const [activeTab, setActiveTab] = useState('datos_de_cliente')
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
            apiGet(`v2/proyectos/proyectos/proyecto/${proyecto.id}/adjuntos`, authUser)
                .then(res => {
                    let adjunAux = res.data.proyecto
                    Swal.close()
                    let aux = {
                        // datos_de_cliente: [],
                        // contrato_cliente: [],
                        // permisos_de_obra_ante_dependencias: [],
                        // catalogo_inicial_obra: [],
                        // programa_de_obra: [],
                        // contrato_proveedores_y_contratistas: [],
                        // firmas_de_aprobacion: [],
                        // reporte_fotografico_de_avance_de_obra: [],
                        // renders_aprobados: [],
                        // fianzas_y_seguros: [],
                        // catalogo_de_conceptos_asbuilt: [],
                        // consignas_de_matenimiento: [],
                        // garantia_de_los_equipos: [],
                        // garantia_de_vicios_ocultos: [],
                        // memorias_de_calculo: [],
                        // memorias_descriptivas: [],
                        // fichas_tecnicas: [],
                        // pruebas_de_instalaciones: [],
                        // fotografias_fin_de_obra: [],
                        acta_de_entrega: [],
                    }
                    //obtener la key del objeto y recorrelo
                    Object.keys(adjunAux).forEach((element) => {
                        switch (element) {
                            // case 'datos_de_cliente':
                            //     aux.datos_de_cliente = adjunAux[element]
                            //     break;
                            // case 'contrato_cliente':
                            //     aux.contrato_cliente = adjunAux[element]
                            //     break;
                            // case 'permisos_de_obra_ante_dependencias':
                            //     aux.permisos_de_obra_ante_dependencias = adjunAux[element]
                            //     break;
                            // case 'catalogo_inicial_obra':
                            //     aux.catalogo_inicial_obra = adjunAux[element]
                            //     break;
                            // case 'programa_de_obra':
                            //     aux.programa_de_obra = adjunAux[element]
                            //     break;
                            // case 'contrato_proveedores_y_contratistas':
                            //     aux.contrato_proveedores_y_contratistas = adjunAux[element]
                            //     break;
                            // case 'firmas_de_aprobacion':
                            //     aux.firmas_de_aprobacion = adjunAux[element]
                            //     break;
                            // case 'reporte_fotografico_de_avance_de_obra':
                            //     aux.reporte_fotografico_de_avance_de_obra = adjunAux[element]
                            //     break;
                            // case 'renders_aprobados':
                            //     aux.renders_aprobados = adjunAux[element]
                            //     break;
                            // case 'fianzas_y_seguros':
                            //     aux.fianzas_y_seguros = adjunAux[element]
                            //     break;
                            // case 'catalogo_de_conceptos_asbuilt':
                            //     aux.catalogo_de_conceptos_asbuilt = adjunAux[element]
                            //     break;
                            // case 'consignas_de_matenimiento':
                            //     aux.consignas_de_matenimiento = adjunAux[element]
                            //     break;
                            // case 'garantia_de_los_equipos':
                            //     aux.garantia_de_los_equipos = adjunAux[element]
                            //     break;
                            // case 'garantia_de_vicios_ocultos':
                            //     aux.garantia_de_vicios_ocultos = adjunAux[element]
                            //     break;
                            // case 'memorias_de_calculo':
                            //     aux.memorias_de_calculo = adjunAux[element]
                            //     break;
                            // case 'memorias_descriptivas':
                            //     aux.memorias_descriptivas = adjunAux[element]
                            //     break;
                            // case 'fichas_tecnicas':
                            //     aux.fichas_tecnicas = adjunAux[element]
                            //     break;
                            // case 'pruebas_de_instalaciones':
                            //     aux.pruebas_de_instalaciones = adjunAux[element]
                            //     break;
                            // case 'fotografias_fin_de_obra':
                            //     aux.fotografias_fin_de_obra = adjunAux[element]
                            //     break;
                            case 'acta_de_entrega':
                                aux.acta_de_entrega = adjunAux[element]
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
            let filePath = `proyecto/${proyecto.id}/${activeTab}/${Math.floor(Date.now() / 1000)}-`
            let aux = []
            form.file.forEach((file) => {
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
    }

    const addS3FilesAxios = (files) => {
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
    }

    const uploadButtons = () => {
        return (
            <>
                <div className='upload_buttons'>
                    <div className="file">

                        <label htmlFor="file">Seleccionar archivo(s)</label>
                        <input type="file" id="file" name="file" onChange={handleFile} multiple/>
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
                                        <p>{`${form.file.length} archivos seleccionados` }</p>
                                    </>
                                : <p>No hay archivo seleccionado</p>}
                        </div>

                    </div>
                    <div >
                        <button className="btn-subir" onClick={handleSubmit}>Subir</button>
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
                        <CarruselAdjuntos data={adjuntos[tab]} id={proyecto.id} getAdjuntos={getAdjuntos} />
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
                    {/* <Tab label="DOCUMENTOS CLIENTES " {...a11yProps(0)} name="datos_de_cliente" onClick={() => handleTab('datos_de_cliente')} />
                    <Tab label="CONTRATO CLIENTE" {...a11yProps(1)} name="contrato_cliente" onClick={() => handleTab('contrato_cliente')} />
                    <Tab label="PERMISOS DE OBRA" {...a11yProps(2)} name="permisos_de_obra_ante_dependencias" onClick={() => handleTab('permisos_de_obra_ante_dependencias')} />
                    <Tab label="CATALOGO INICIAL OBRA" {...a11yProps(3)} name="catalogo_inicial_obra" onClick={() => handleTab('catalogo_inicial_obra')} />
                    <Tab label="PROGRAMA DE OBRA " {...a11yProps(4)} name="programa_de_obra" onClick={() => handleTab('programa_de_obra')} />

                    <Tab label="CONTRATO PROVEEDORES Y CONTRATISTAS" {...a11yProps(5)} name="contrato_proveedores_y_contratistas" onClick={() => handleTab('contrato_proveedores_y_contratistas')} />

                    <Tab label="FIRMA DE ACABADOS " {...a11yProps(6)} name="firmas_de_aprobacion" onClick={() => handleTab('firmas_de_aprobacion')} />

                    <Tab label="PLANOS INICIALES DE OBRA " {...a11yProps(7)} name="reporte_fotografico_de_avance_de_obra" onClick={() => handleTab('reporte_fotografico_de_avance_de_obra')} />

                    <Tab label="RENDERS APROBADOS" {...a11yProps(8)} name="renders_aprobados" onClick={() => handleTab('renders_aprobados')} />

                    <Tab label="FIANZAS Y SEGUROS" {...a11yProps(9)} name="fianzas_y_seguros" onClick={() => handleTab('fianzas_y_seguros')} />

                    <Tab label="PLANOS ASBUILT" {...a11yProps(10)} name="catalogo_de_conceptos_asbuilt" onClick={() => handleTab('catalogo_de_conceptos_asbuilt')} />

                    <Tab label="CONSIGNAS DE MATENIMIENTO" {...a11yProps(11)} name="consignas_de_matenimiento" onClick={() => handleTab('consignas_de_matenimiento')} />

                    <Tab label="GARANTÍA DE LOS EQUIPOS" {...a11yProps(12)} name="garantia_de_los_equipos" onClick={() => handleTab('garantia_de_los_equipos')} />

                    <Tab label="GARANTÍA DE VICIOS OCULTOS" {...a11yProps(13)} name="garantia_de_vicios_ocultos" onClick={() => handleTab('garantia_de_vicios_ocultos')} />

                    <Tab label="MEMORIAS DE CÁLCULO" {...a11yProps(14)} name="memorias_de_calculo" onClick={() => handleTab('memorias_de_calculo')} />

                    <Tab label="MEMORIAS DESCRIPTIVAS " {...a11yProps(15)} name="memorias_descriptivas" onClick={() => handleTab('memorias_descriptivas')} />

                    <Tab label="FICHAS TÉCNICAS " {...a11yProps(16)} name="fichas_tecnicas" onClick={() => handleTab('fichas_tecnicas')} />

                    <Tab label="PRUEBAS DE INSTALACIONES " {...a11yProps(17)} name="pruebas_de_instalaciones" onClick={() => handleTab('pruebas_de_instalaciones')} />

                    <Tab label="FOTOGRAFÍAS FIN DE OBRA" {...a11yProps(18)} name="fotografias_fin_de_obra" onClick={() => handleTab('fotografias_fin_de_obra')} /> */}

                    <Tab label="Reportes" {...a11yProps(19)} name="acta_de_entrega" onClick={() => handleTab('acta_de_entrega')} />

                </Tabs>

                <TabPanel value={value} index={0}>
                    <div>
                        {uploadButtons()}
                        {viewAdjuntos('datos_de_cliente')}
                    </div>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <div>
                        {uploadButtons()}
                        {viewAdjuntos('contrato_cliente')}
                    </div>
                </TabPanel>
                <TabPanel value={value} index={2}>
                    <div>
                        {uploadButtons()}
                        {viewAdjuntos('permisos_de_obra_ante_dependencias')}
                    </div>
                </TabPanel>
                <TabPanel value={value} index={3}>
                    <div>
                        {uploadButtons()}
                        {viewAdjuntos('catalogo_inicial_obra')}
                    </div>
                </TabPanel>
                <TabPanel value={value} index={4}>
                    <div>
                        {uploadButtons()}
                        {viewAdjuntos('programa_de_obra')}
                    </div>
                </TabPanel>
                <TabPanel value={value} index={5}>
                    <div>
                        {uploadButtons()}
                        {viewAdjuntos('contrato_proveedores_y_contratistas')}
                    </div>
                </TabPanel>
                <TabPanel value={value} index={6}>
                    <div>
                        {uploadButtons()}
                        {viewAdjuntos('firmas_de_aprobacion')}
                    </div>
                </TabPanel>
                <TabPanel value={value} index={7}>
                    <div>
                        {uploadButtons()}
                        {viewAdjuntos('reporte_fotografico_de_avance_de_obra')}
                    </div>
                </TabPanel>
                <TabPanel value={value} index={8}>
                    <div>
                        {uploadButtons()}
                        {viewAdjuntos('renders_aprobados')}
                    </div>
                </TabPanel>
                <TabPanel value={value} index={9}>
                    <div>
                        {uploadButtons()}
                        {viewAdjuntos('fianzas_y_seguros')}
                    </div>
                </TabPanel>
                <TabPanel value={value} index={10}>
                    <div>
                        {uploadButtons()}
                        {viewAdjuntos('catalogo_de_conceptos_asbuilt')}
                    </div>
                </TabPanel>
                <TabPanel value={value} index={11}>
                    <div>
                        {uploadButtons()}
                        {viewAdjuntos('consignas_de_matenimiento')}
                    </div>
                </TabPanel>
                <TabPanel value={value} index={12}>
                    <div>
                        {uploadButtons()}
                        {viewAdjuntos('garantia_de_los_equipos')}
                    </div>
                </TabPanel>
                <TabPanel value={value} index={13}>
                    <div>
                        {uploadButtons()}
                        {viewAdjuntos('garantia_de_vicios_ocultos')}
                    </div>
                </TabPanel>
                <TabPanel value={value} index={14}>
                    <div>
                        {uploadButtons()}
                        {viewAdjuntos('memorias_de_calculo')}
                    </div>
                </TabPanel>
                <TabPanel value={value} index={15}>
                    <div>
                        {uploadButtons()}
                        {viewAdjuntos('memorias_descriptivas')}
                    </div>
                </TabPanel>
                <TabPanel value={value} index={16}>
                    <div>
                        {uploadButtons()}
                        {viewAdjuntos('fichas_tecnicas')}
                    </div>
                </TabPanel>
                <TabPanel value={value} index={17}>
                    <div>
                        {uploadButtons()}
                        {viewAdjuntos('pruebas_de_instalaciones')}
                    </div>
                </TabPanel>
                <TabPanel value={value} index={18}>
                    <div>
                        {uploadButtons()}
                        {viewAdjuntos('fotografias_fin_de_obra')}
                    </div>
                </TabPanel>
                <TabPanel value={value} index={19}>
                    <div>
                        {uploadButtons()}
                        {viewAdjuntos('acta_de_entrega')}
                    </div>
                </TabPanel>

            </div>
        </>
    )
}