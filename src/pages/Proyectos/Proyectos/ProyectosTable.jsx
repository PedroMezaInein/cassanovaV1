import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import Swal from 'sweetalert2';
import axios from 'axios';

import Layout from '../../../components/layout/layout'
import TablaGeneralPaginado from './../../../components/NewTables/TablaGeneral/TablaGeneralPaginado'
import { ordenamiento, setOptions } from '../../../functions/setters'
import { URL_DEV } from '../../../constants'
import { Modal } from '../../../components/singles'
import { setSingleHeader } from '../../../functions/routers';

import CrearProyecto from './CrearProyecto'
import FiltrosProyectos from './FiltrosProyectos'

import AddIcon from '@material-ui/icons/Add';
import GetAppIcon from '@material-ui/icons/GetApp';

/* import ProyectosForm from './../../../components/forms/proyectos/ProyectosForm' */

export default function ProyectosTable() { 
    const userAuth = useSelector((state) => state.authUser);
    const[opciones, setOpciones] = useState(false)
    const [filtrado, setFiltrado] = useState('') 
    const [reloadTable, setReloadTable] = useState()

    let prop = {
        pathname: '/proyectos/proyectos/',
    }

    const [modal, setModal] = useState({
        crear: {
            show: false,
            data: null
        },
        filtrar: {
            show: false,
            data: null
        }, 
    })
    
    useEffect(() => {
        getOptionsEmpresas()
    }, []);

    useEffect(() => {
        // getProveedores()
        // setFiltrado()
        if (filtrado) {
            reloadTable.reload(filtrado)
            //  setFiltrado('')
            if(borrar == false){
                setFiltrado('')   

            }
        }
    }, [filtrado])

    const borrar = ( id) =>{
        if(id == false){
            reloadTable.reload(filtrado)
            setFiltrado('')   
        }
    }

    const openModal = (tipo, data) => {
        setModal({
            ...modal,
            [tipo]: {
                show: true,
                data: data
            }
        })
    }

    const handleClose = (tipo) => {
        setModal({
            ...modal,
            [tipo]: {
                show: false,
                data: null
            }
        })
    }

    const columnas = [
        { nombre: 'Acciones', identificador: 'acciones' },
        /* { nombre: 'T. Proyecto', identificador: 'tipoProyecto', sort: true, stringSearch: true }, */
        /* { nombre: 'F. incio', identificador: 'FInicio', sort: true, stringSearch: false },
        { nombre: 'F. fin', identificador: 'FFin', sort: true, stringSearch: false }, */
        { nombre: 'Nombre', identificador: 'nombre', sort: false, stringSearch: false },
        { nombre : 'Fases', identificador: 'fases', sort: false, stringSearch: false},
        /* { nombre: 'Cliente', identificador: 'cliente', sort: false, stringSearch: false }, */
        { nombre: 'Dirección', identificador: 'direccion', sort: false, stringSearch: false },
        /* { nombre: 'Contacto', identificador: 'contacto', sort: false, stringSearch: false }, */
        { nombre: 'Empresa', identificador: 'empresa', sort: false, stringSearch: false },
        /* { nombre: 'F. Inicio', identificador: 'fechaInicio', sort: false, stringSearch: false },
        { nombre: 'F. Fin', identificador: 'fechaFin', sort: false, stringSearch: false }, */
        { nombre: 'Descripción', identificador: 'descripcion_view', sort: false, stringSearch: false },
    ]

    const createAcciones = () => {
        let aux = [
            {
                nombre: 'Ver Proyecto',
                icono: 'fas fa-eye',
                color: 'blueButton ',
                funcion: (item) => {
                    window.location.href = `/proyectos/proyectos/nuevo/${item.id}`
                }
            },
            {
                nombre: 'Eliminar',
                icono: 'fas fa-trash',
                color: 'redButton',
                funcion: (item) => {
                    Swal.fire({
                        title: 'Eliminar',
                        text: '¿Desea eliminar el registro?',
                        icon: 'question',
                        showCancelButton: true,
                        confirmButtonText: 'Si',
                        cancelButtonText: 'No',
                    }).then((result) => {
                        if (result.isConfirmed) {
                        }
                    });
                }
            }
        ]
        return aux
    }

    const getOptionsEmpresas = async () => {
        Swal.fire({
            title: 'Cargando...',
            allowOutsideClick: false,
            willOpen: () => {
                Swal.showLoading()
            }
        })

        axios.get(`${URL_DEV}proyectos/opciones`, { headers: { Authorization: `Bearer ${userAuth.access_token}` } }).then(
            (response) => {
                const { clientes, empresas, estatus, proveedores } = response.data
                let aux = [];
                let options = {
                    empresas: [],
                    clientes: [],
                    // colonias: [],
                    estatus: [],
                    /* tipos:[], */
                    cp_clientes: [],
                    proveedores: []
                }
                clientes.forEach((element) => {
                    aux.push({
                        name: element.empresa,
                        value: element.id.toString(),
                        label: element.empresa,
                        cp: element.cp,
                        estado: element.estado,
                        municipio: element.municipio,
                        colonia: element.colonia,
                        calle: element.calle
                    })
                    return false
                })
                options.clientes = aux.sort(ordenamiento)
                options['empresas'] = setOptions(empresas, 'name', 'id')
                options['estatus'] = setOptions(estatus, 'estatus', 'id')
                options['proveedores'] = setOptions(proveedores, 'razon_social', 'id')
                let aux2 = []
                empresas.map(empresa => {
                    if (empresa.tipos.length > 0) {
                       aux2 = aux2.concat(empresa.tipos)
                    }
                    
                });
                options.tipos = setOptions(aux2, 'tipo', 'id')
                setOpciones(options)
                Swal.close()
            },
            (error) => {

            }
        ).catch((error) => {


        })
    }

    const fases = (data) => {
        let aux = []
        if (data.proyectos.length > 0) {
            data.proyectos.map((proyecto) => {
                if (proyecto.fase1 === 1) {
                    aux.push({
                        fase: 'Fase 1',
                        name: proyecto.simpleName,
                        color: '#F26C4F'
                    })
                }
                if (proyecto.fase2 === 1) {
                    aux.push({
                        fase: 'Fase 2',
                        name: proyecto.simpleName,
                        color: '#1693A5'
                    })
                }
                if (proyecto.fase3 === 1) {
                    aux.push({
                        fase: 'Fase 3',
                        name: proyecto.simpleName,
                        color: '#FFD549'
                    })
                }
            })
        }
        return (
            <div style={{display: 'flex', flexDirection: 'column'}}>
                {aux.map((item, index) => {
                    return (
                        <div key={index} style={{ display: 'flex', flexDirection: 'column' }}>
                            <center>
                                <span style={{backgroundColor: item.color, color: 'white', fontWeight: 'bold', padding: '2px', borderRadius: '5px', width: 'fit-content', textAlign: 'center'}}>
                                {item.fase}
                                </span>
                            </center>
                            
                            
                            <div>
                                <span>{item.name}</span>    
                            </div>
                            
                        </div>
                    )
                })}
            </div>
        )
    }

    
    const ProccessData = (data) => {
        let aux = []
        data.data.forEach((item) => {
            if (item.proyectos.length > 0) {
                let tipoAux = opciones.tipos.find(tipo => parseInt(tipo.value) === item.proyectos[0].tipo_proyecto_id)
                
                aux.push({
                    id: item.id,
                    nombre: item.proyectos[0].simpleName,
                    tipoProyecto: tipoAux && tipoAux.name ? tipoAux.name : 'Sin tipo',
                    /* cliente: item.id, */
                    empresa: item.empresa,
                    direccion: item.proyectos[0].sucursal ? item.proyectos[0].sucursal : 'Sin dirección',
                    contacto: item.nombre ? item.nombre : 'Sin contacto',
                    descripcion: item.proyectos[0].descripcion ? item.proyectos[0].descripcion : 'Sin descripción',
                    descripcion_view: item.proyectos[0].descripcion ? item.proyectos[0].descripcion.length > 100 ?
                        <div title={item.proyectos[0].descripcion}>
                            `${item.proyectos[0].descripcion.slice(0, 100) + '...'}`
                            </div>
                        : item.proyectos[0].descripcion : 'Sin descripción',
                    fases: fases(item),
                })
            }
        })
        return aux
    }

    const opcionesbtn = [
        {
            nombre: <div><AddIcon />Agregar</div>,
            funcion: (item) => {
                /* Swal.fire({
                    title: 'Nuevo',
                    text: '¿Desea crear un nuevo registro?',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonText: 'Si',
                    cancelButtonText: 'No',
                }).then((result) => {
                    if (result.isConfirmed) {
                    }
                }); */
                // openModal('crear', item)
                window.location.replace('/proyectos/proyectos/add')
            }
        },
        {
            //filtrar
            nombre: <div><i className="fas fa-filter mr-5"></i><span>Filtrar</span></div>,
            funcion: (item) => {
                openModal('filtrar', item)
            }
        },
        {
            nombre: <div><GetAppIcon/> Exportar</div>,
            funcion: () => {
                Swal.fire({
                    title: 'Exportar',
                    text: '¿Desea exportar los registros?',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonText: 'Si',
                    cancelButtonText: 'No',
                }).then((result) => {
                    if (result.isConfirmed) {
                        Swal.fire({
                            title: 'Exportando',
                            text: 'Espere un momento...',
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                            allowEnterKey: false,
                            showConfirmButton: false,
                            onOpen: () => {
                                Swal.showLoading();
                            }
                        });

                        axios.post(`${URL_DEV}v3/proyectos/proyectos/exportar`, { 'search': '{}' },
                            { responseType: 'blob', headers: setSingleHeader(userAuth.access_token) }).then(response => { 
                                Swal.close()
                                const url = window.URL.createObjectURL(new Blob([response.data]));
                                const link = document.createElement('a');
                                link.href = url;
                                link.setAttribute('download', 'proyectos.xlsx'); //or any other extension
                                document.body.appendChild(link);
                                link.click();
                            })
                    }
                });
            }
        }
    ]

    return (
        <>
            <Layout authUser={userAuth.acces_token} location={prop} history={{ location: prop }} active='proyectos' >
                { opciones &&
                    <TablaGeneralPaginado
                        titulo="Proyectos" 
                        columnas={columnas} 
                        url="proyectos/project" 
                        opciones={opcionesbtn} 
                        acciones={createAcciones()} 
                        numItemsPagina={20} 
                        ProccessData={ProccessData}
                        filtros={filtrado}
                        reload={setReloadTable} 
                    />
                }
            </Layout>

            <Modal size="lg" title={"crear proyectos"} show={modal.crear.show} handleClose={e => handleClose('crear')} >
                    <CrearProyecto handleClose={e => handleClose('crear')} filtrarTabla={setFiltrado} borrarTabla={borrar}  reload={reloadTable}/>
            </Modal>

            <Modal size="lg" title={"Filtrar proyectos"} show={modal.filtrar?.show} handleClose={e => handleClose('filtrar')} >
                    <FiltrosProyectos handleClose={e => handleClose('filtrar')} filtrarTabla={setFiltrado} borrarTabla={borrar}  reload={reloadTable}/>
            </Modal>
            {/* <Modal size="xl" show={modal.nuevo} title='Información del proyecto' handleClose={() => setModal({ ...modal, nuevo: false })}>
                <ProyectosForm />
            </Modal> */}
        </>
    )
}