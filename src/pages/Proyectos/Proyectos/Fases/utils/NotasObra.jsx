import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import 'date-fns';
import Swal from 'sweetalert2'

import NuevaNota from './NuevaNota'
import VerNotaObra from './VerNotaObra'

import { apiGet, apiDelete } from '../../../../../functions/api';
import { Modal } from './../../../../../components/singles'
import Table from './../../../../../components/NewTables/TablaGeneral/TablaGeneral'


export default function Notas(props) { 
    const { proyecto, opciones } = props
    const auth = useSelector(state => state.authUser);
    const [reloadTable, setReloadTable] = useState()

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
        { nombre: 'tema', identificador: 'tema', sort: false, stringSearch: false},
        { nombre: 'hora', identificador: 'hora', sort: false, stringSearch: false},
        { nombre: 'tipo de nota', identificador: 'tipo_nota', sort: false, stringSearch: false},
        { nombre: 'Nota', identificador: 'nota', sort: false, stringSearch: false},
    ]

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
        // {
        //     nombre: 'generar bitácora (pdf)',
        //     icono: 'fas fa-trash',
        //     color: 'redButton',
        //     funcion: (item) => {
        //         Swal.fire({
        //             title: 'bitácora',
        //             text: '¿Deseas generar bitácora?',
        //             icon: 'question',
        //             showCancelButton: true,
        //             cancelButtonText: 'No',
        //             confirmButtonText: 'Si',
        //         }).then((result) => {
        //             if (result.isConfirmed) {
        //                 apiGet(`v1/proyectos/nota-bitacora/pdf?proyecto=${proyecto.id}`, auth.access_token)
        //                 if (reloadTable) {
        //                     reloadTable.reload()
        //                 }

        //                 handleClose()

        //                 Swal.fire(
        //                     'La bitácora se ha generado con éxito!',
        //                     'success'
        //                 )
        //             }
        //         });
        //     }
        // },
    ]

    if (notas.length >= 1) {
        handleOpen.push({
        nombre: 'generar bitácora (pdf)',
            icono: 'fas fa-trash',
            color: 'redButton',
            funcion: (item) => {
                Swal.fire({
                    title: 'bitácora',
                    text: '¿Deseas generar bitácora?',
                    icon: 'question',
                    showCancelButton: true,
                    cancelButtonText: 'No',
                    confirmButtonText: 'Si',
                }).then((result) => {
                    if (result.isConfirmed) {
                        apiGet(`v1/proyectos/nota-bitacora/pdf?proyecto=${proyecto.id}`, auth.access_token)
                        if (reloadTable) {
                            reloadTable.reload()
                        }

                        handleClose()

                        Swal.fire(
                            'La bitácora se ha generado con éxito!',
                            'success'
                        )
                    }
                });
            }
        })
    }       

    if (proyecto.bitacora) {
        handleOpen.push({
            nombre: 'ver bitácora',
            funcion: (item) => {
                window.open(proyecto.bitacora, '_blank');
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
                        cancelButtonColor: '#d33',
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: '¡Sí, bórralo!'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            apiDelete(`v1/proyectos/nota-bitacora/${item.id}?proyecto=${proyecto.id}`, auth.access_token)
                            if (reloadTable) {
                                reloadTable.reload()
                            }
                            handleClose()
                            getNotas()
                            Swal.fire(
                                '¡Eliminado!',
                                'El registro ha sido eliminado.',
                                'success'
                            )
                        }
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
                        hora: result.hora ? result.hora : 's/a' ,
                        nota: result.notas ? result.notas : 's/a',
                        tipo_nota: result.tipo_nota ? result.tipo_nota : 's/a',
                        proveedor: result.proveedor.razon_social ? result.proveedor.razon_social : 's/a',
                        id: result.id,
                        url: result.adjuntos.length > 0 ? result.adjuntos[0].url : '',
                        tema: result.tema ? result.tema : 's/a',
                        num_personal: result.personas ? result.personas : 's/a',
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
                <NuevaNota handleClose={handleClose('crear')} reload={reloadTable} opciones={opciones} proyecto={proyecto} arrayNotas={notas}/>
            </Modal>
            <Modal size="lg" title={"ver nota"} show={modal.ver.show} handleClose={handleClose('ver')}>
                <VerNotaObra data={modal.ver.data} verNotaObra={true}/>
            </Modal>
        </>
        
    )
}