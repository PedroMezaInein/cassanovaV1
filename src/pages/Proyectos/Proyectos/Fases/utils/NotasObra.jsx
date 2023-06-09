import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import 'date-fns';
import Swal from 'sweetalert2'

// MATERIAL UI
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider,KeyboardTimePicker,KeyboardDatePicker } from '@material-ui/pickers';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';

import AdjuntosObra from './AdjuntosObra'
import NuevaNota from './NuevaNota'
import VerNotaObra from './VerNotaObra'

import PresupuestoViejo from './../../../../../components/forms/presupuesto/PresupuestoForm'
import { apiGet, apiPostForm, apiDelete } from '../../../../../functions/api';
import { Modal } from './../../../../../components/singles'
import Table from './../../../../../components/NewTables/TablaGeneral/TablaGeneral'
import { setOptions } from './../../../../../functions/setters'
import { NotasObra } from './../../../../../components/forms'

export default function Notas(props) { 
    const { proyecto, reload, opciones } = props
    const auth = useSelector(state => state.authUser);
    const [reloadTable, setReloadTable] = useState()

    const [form, setForm] = useState({ 
        fecha:'',
        proveedor:'',
        tipo_nota: '',
        nota: '',
        adjunto: ''
    });

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

    })

    const [errores, setErrores] = useState({})
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
    ]

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

    const validateForm = () => {
        let validar = true
        let error = {}
        if(form.fecha === ''){
            error.fecha = "Seleccione una fecha"
            validar = false
        }
        if(form.tipo_nota === ''){
            error.tipo_nota = "Indique el tipo de nota"
            validar = false
        }
        if(form.proveedor === ''){
            error.proveedor = "Seleccione un proveedor"
            validar = false
        }
        if(form.nota === ''){
            error.nota = "Escriba una nota"
            validar = false
        }
        
        setErrores(error)
        return validar
    }

    const handleChangeFecha = (date, tipo) => {
        setForm({
            ...form,
            [tipo]: new Date(date)
        })
    };

    const handleChange = (e) => {
        setForm({ 
            ...form, 
            [e.target.name]: e.target.value })
    };

    const handleSend = () => {
        
        if (validateForm()) {
            Swal.fire({
                title: 'Cargando...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading()
                }
            })

            let newform = {
                proveedor: {value:form.proveedor},
                notas: form.nota,
                tipo_nota: form.tipo_nota,
                fecha: form.fecha,
                adjuntos: form.adjunto,
            }

            try {
                apiPostForm(`v2/proyectos/nota-bitacora/${proyecto.id}`, newform, auth.access_token).then(
                    (response) => {
                        Swal.close()

                        Swal.fire({
                            title: 'Solicitud de Compra',
                            text: 'Solicitud de Compra creada correctamente',
                            icon: 'success',
                            timer: 2000,
                            showConfirmButton: false
                        })
                    },
                    (error) => {
                        Swal.close()
                        Swal.fire({
                            title: 'Solicitud de Compra',
                            text: 'Error al crear la Solicitud de Compra',
                            icon: 'error',
                            timer: 2000,
                            showConfirmButton: false
                        })
                    }
                ).catch((error) => {
                    Swal.close()
                    Swal.fire({
                        title: 'Solicitud de Compra',
                        text: 'Error al crear la Solicitud de Compra',
                        icon: 'error',
                        timer: 2000,
                        showConfirmButton: false
                    })
                })    
            } catch (error) {
                Swal.close()
                Swal.fire({
                    title: 'Solicitud de Compra',
                    text: 'Error al crear la Solicitud de Compra',
                    icon: 'error',
                    timer: 2000,
                    showConfirmButton: false
                })
            }
            
        } else {
            Swal.fire({
                title: 'Faltan campos por llenar',
                text: 'Favor de llenar todos los campos',
                icon: 'warning',
                timer: 2000,
                showConfirmButton: false

            })
        } 
    }

    const getNotas = () => {
        apiGet(`v1/proyectos/nota-bitacora?proyecto=${proyecto.id}`, auth.access_token)
        .then((response) => {
            setNotas([...response.data.proyecto.notas])
        })
    }

    const listaNotas = (data) => {
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

            <Modal size="md" title={"Nueva nota"} show={modal.crear.show} handleClose={handleClose('crear')}>
                <NuevaNota handleClose={handleClose('crear')} reload={reloadTable} opciones={opciones} proyecto={proyecto}/>
            </Modal>
            <Modal size="lg" title={"ver nota"} show={modal.ver.show} handleClose={handleClose('ver')}>
                <VerNotaObra data={modal.ver.data} verNotaObra={true}/>
            </Modal>
        </>
        
    )
}