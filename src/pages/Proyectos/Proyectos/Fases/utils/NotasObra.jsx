import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import 'date-fns';
import Swal from 'sweetalert2'

import NuevaNota from './NuevaNota'
import VerNotaObra from './VerNotaObra'
import VerBitacora from './VerBitacora'

import { apiGet, apiPostForm, apiDelete } from '../../../../../functions/api';
import { Modal } from './../../../../../components/singles'
import Table from './../../../../../components/NewTables/TablaGeneral/TablaGeneral'

export default function Notas(props) { 
    const { proyecto, reload, opciones } = props
    const auth = useSelector(state => state.authUser);
    const [reloadTable, setReloadTable] = useState()
    console.log(proyecto)

    const [modal, setModal] = useState({

        crear: {
            show: false,
            data: false
        },

        eliminar: {
            show: false,
            data: false
        },
        ver: {
            show: false,
            data: false
        },

        verBitacora: {
            show: false,
            data: false
        },

    })

    const [notas, setNotas] = useState([])

    useEffect(() => {
        getNotas()
    }, [])

    const columnas = [
        { nombre: 'Acciones', identificador: 'acciones', sort: false, stringSearch: false},
        { nombre: 'fecha', identificador: 'fecha', sort: false, stringSearch: false},
        { nombre: 'tipo de nota', identificador: 'tipo_nota', sort: false, stringSearch: false},
        { nombre: 'Nota', identificador: 'nota', sort: false, stringSearch: false},
    ]

    // const generarBitacoraAxios = async () => {
    //     waitAlert()
    //     const { at } = this.props
    //     const { proyecto } = this.props
    //     await axios.get(`${URL_DEV}v1/proyectos/nota-bitacora/pdf?proyecto=${proyecto.id}`, { headers: setSingleHeader(at) }).then(
    //         (response) => {
    //             const { refresh } = this.props
    //             const { proyecto } = response.data
    //             doneAlert('PDF GENERADO CON ÉXITO')
    //             window.open(proyecto.bitacora, '_blank').focus();
    //             refresh(proyecto.id)
    //         }, (error) => { printResponseErrorAlert(error) }
    //     ).catch((error) => {
    //         errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
    //         console.error(error, 'error')
    //     })
    // }

    const handleOpen = [
        {
            nombre: 'Nueva nota',
            funcion: (item) => { 
                setModal({
                    ...modal,
                    crear: {
                        show: true,
                        data: item
                    }
                })
            }
        },
        {
            nombre: 'generar bitácora (pdf)',
            icono: 'fas fa-trash',
            color: 'redButton',
            funcion: (item) => {
                Swal.fire({
                    title: 'bitácora',
                    text: '¿Deseas generar bitácora?',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonText: 'Si',
                    cancelButtonText: 'No',
                }).then((result) => {
                    apiGet(`v1/proyectos/nota-bitacora/pdf?proyecto=${proyecto.id}`, auth.access_token)
                    if (reloadTable) {
                        reloadTable.reload()
                    }

                    handleClose()

                    Swal.fire(
                        'La bitácora se ha generado con éxito!',
                        'success'
                    )
                });
            }
        },
    ]

    if (proyecto.bitacora) {
        handleOpen.push({
            nombre: 'ver bitácora',
            funcion: (item) => {
            setModal({
                ...modal,
                verBitacora: {
                    show: true,
                    data: item
                }
            })
            }
        });
    }

    let handleClose = (tipo) => () => {
        setModal({
            ...modal,
            [tipo]: {
                show: false,
                data: false
            }
        })
    }

    let acciones = () => {
        let aux = [  
            {
                nombre: 'ver',
                icono: 'fas fa-paperclip',
                color: 'perryButton',
                funcion: (item) => {
                    setModal({
                        ...modal,
                        ver: {
                            show: true,
                            data: item
                        }
                    })
                }
            }, 

            {
                nombre: 'Eliminar',
                icono: 'fas fa-trash',
                color: 'redButton',
                funcion: (item) => {
                    Swal.fire({
                        title: '¿Estás seguro?',
                        text: "¡No podrás revertir esto!",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: '¡Sí, bórralo!'
                    }).then((result) => {
                        apiDelete(`v1/proyectos/nota-bitacora/${item.id}?proyecto=${proyecto.id}`, auth.access_token)
                        if (reloadTable) {
                            reloadTable.reload()
                        }
                            handleClose()
                                Swal.fire(
                                    '¡Eliminado!',
                                    'El registro ha sido eliminado.',
                                    'success'
                                )
                    })
                }
            }, 
        ]
        return aux
    }

    const proccessData = (datos) => {
        
        let aux = []
            datos.proyecto.notas.map((result) => {
                aux.push(
                    {
                        acciones: acciones(),
                        fecha: result.fecha,
                        nota: result.notas,
                        tipo_nota: result.tipo_nota,
                        proveedor: result.proveedor.razon_social,
                        id: result.id,
                        url: result.adjuntos.length > 0 ? result.adjuntos[0].url : ''
                    }
                )
            })
            aux=aux.reverse()
            return aux
    }
    
    const getNotas = () => {
        apiGet(`v1/proyectos/nota-bitacora?proyecto=${proyecto.id}`, auth.access_token)
        .then((response) => {
            setNotas([...response.data.proyecto.notas])
        })
    }

    const listaNotas = () => {
        return (
            <>
                <Table
                    titulo="Notas de obra" 
                    columnas={columnas}
                    url={`v1/proyectos/nota-bitacora?proyecto=${proyecto.id}`}  
                    numItemsPagina={12}
                    ProccessData={proccessData}
                    opciones={handleOpen}
                    acciones={acciones()}
                    reload={setReloadTable}
                    >
                </Table>
            </>
        )
    }

    return (
        <>
            {
                listaNotas(notas)
            }

            <Modal size="lg" title={"Nueva nota"} show={modal.crear.show} handleClose={handleClose('crear')}>
                <NuevaNota handleClose={handleClose('crear')} reload={reloadTable} opciones={opciones} proyecto={proyecto}/>
            </Modal>
            <Modal size="lg" title={"ver nota"} show={modal.ver.show} handleClose={handleClose('ver')}>
                <VerNotaObra data={modal.ver.data} verNotaObra={true}/>
            </Modal>
            {
                proyecto.bitacora ?
                    <Modal size="lg" title={"bitácora"} show={modal.verBitacora.show} href={proyecto.bitacora} handleClose={handleClose('verBitacora')}>
                        <VerBitacora handleClose={handleClose('verBitacora')} data={modal.ver.data} proyecto={proyecto}/>
                    </Modal>
                    // <Dropdown.Item className="text-hover-primary dropdown-primary" href={proyecto.bitacora} tag={Link} target='_blank' rel="noopener noreferrer">
                    //     {setNaviIcon('las la-search icon-lg', 'VER PDF BITÁCORA DE OBRA')}
                    // </Dropdown.Item>
                    : <></>
            }
        </>
        
    )
}