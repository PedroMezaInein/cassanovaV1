import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Modal } from './../../../components/singles'

import Tabla from './../../../components/NewTables/TablaGeneral/TablaGeneral'

import Crear from './Modales/CrearEgreso'



export default function EgresosTable() { 

    const [modal, setModal] = useState({
        ver: {
            show: false,
            data: null
        },
        editar: {
            show: false,
            data: null
        },
        crear: {
            show: false,
            data: null
        },
    })

    const [filtrado, setFiltrado] = useState({
        
    })

    const columns = [
        { nombre: 'Acciones', identificador: 'acciones', sort: false, stringSearch: false },
        { nombre: 'Id', identificador: 'id', sort: false, stringSearch: false },
        { nombre: 'Fecha', identificador: 'fecha', sort: false, stringSearch: false },
        { nombre: 'Proveedor', identificador: 'proveedor', sort: false, stringSearch: false },
        { nombre: 'Factura', identificador: 'factura', sort: false, stringSearch: false },
        { nombre: 'Area', identificador: 'area', sort: false, stringSearch: false },
        { nombre: 'Partida', identificador: 'partida', sort: false, stringSearch: false },
        { nombre: 'Subpartida', identificador: 'subpartida', sort: false, stringSearch: false },
        { nombre: 'Monto', identificador: 'monto', sort: false, stringSearch: false },
        { nombre: 'Comisión', identificador: 'comision', sort: false, stringSearch: false },
        { nombre: 'Total', identificador: 'total', sort: false, stringSearch: false },
    ]

    const acciones = [
        {
            nombre: 'Editar',
            icono: 'fas fa-edit',
            color: 'blueButton',
            funcion: (item) => {

            }
        },
        {
            nombre: 'Eliminar',
            icono: 'fas fa-trash-alt',
            color: 'redButton',
            funcion: (item) => {

            }
        },
        {
            nombre: 'Ver egreso',
            icono: 'fas fa-eye',
            color: 'greenButton',
            funcion: (item) => {

            }
        },
        {
            nombre: 'Adjuntos',
            icono: 'fas fa-paperclip',
            color: 'reyButton',
            funcion: (item) => {
            
            }
        },
        {
            nombre: 'Factura extranjera',
            icono: 'fas fa-file-invoice-dollar',
            color: 'reyButton',
            funcion: (item) => {

            }
        },
    ]

    const opciones = [
        {
            nombre: <div><i className="fas fa-plus mr-5"></i><span>Nuevo</span></div>,
            funcion: (item) => {
                openModal('crear', item)
            }
        },
        {
            //filtrar
            nombre: <div><i className="fas fa-filter mr-5"></i><span>Filtrar</span></div>,
            funcion: (item) => {

            }
        },
        {
            //exportar
            nombre: <div><i className="fas fa-file-export mr-5"></i><span>Exportar</span></div>,
            funcion: (item) => {

            }
        },
    ]

    const openModal = (modal, data) => {
        setModal({
            ...Modal,
            [modal]: {
                show: true,
                data: data
            }
        })
    }

    const handleClose = (modal) => {
        setModal({
            ...Modal,
            [modal]: {
                show: false,
                data: null
            }
        })
    }

    const proccessData = (datos) => { 
        let aux = [
            {
                acciones: acciones,
                id: 1,
            }
        ]
        return aux
    }

    return (
        <>
            <Tabla
                titulo="Gastos"
                subtitulo="listado de gastos"
                columnas={columns}
                url={'requisicion'}
                numItemsPagina={20}
                ProccessData={proccessData}
                opciones={opciones}
                acciones={acciones}
            >
            </Tabla>
            <Modal size="lg" title={"Nuevo gasto"} show={modal.crear.show} handleClose={e => handleClose('crear')} >
                <Crear handleClose={e => handleClose('crear')} />   
            </Modal>
        </>
    )

}