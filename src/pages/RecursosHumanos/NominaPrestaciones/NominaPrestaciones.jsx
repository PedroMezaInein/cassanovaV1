import React, { useEffect } from 'react';
import { useState, useSelector } from 'react-redux';

import Layout from '../../../components/layout/layout'

import Tabla from './../../../components/NewTables/TablaGeneral/TablaGeneral'

export default function NominaPrestaciones() {
    const userAuth = useSelector((state) => state.authUser);

    let prop = {
        pathname: '/rh/nomina-prestaciones',
    }

    const columnas = [
        { nombre: 'Acciones', identificador: 'acciones' },
        { nombre: 'Sala', identificador: 'sala', sort: true, filtroSort: true },
        { nombre: 'Tipo', identificador: 'typo', sort: true, filtroSort: true },
        { nombre: 'Fecha', identificador: 'fecha', sort: true },
        { nombre: 'Hora', identificador: 'hora', sort: true, filtroSort: true },
    ]

    const createAcciones = () => {
        let aux = [
            {
                nombre: 'Editar',
                icono: 'fas fa-edit',
                color: 'btn btn-warning',
                funcion: (item) => {
                    console.log('Editar', item.id)
                }
            },
            {
                nombre: 'Eliminar',
                icono: 'fas fa-trash',
                color: 'btn btn-danger',
                funcion: (item) => {
                    console.log('Eliminar', item.id)
                }
            }
        ]
        return aux
    }


    return (
        <>
            <Layout authUser={userAuth.acces_token} location={prop} history={{ location: prop }} active='rh'>
                <Tabla
                    titulo="ejemplo" columnas={columnas} url="salas" subtitulo="subtitulo" acciones={createAcciones()} numPaginado={4}
                />
            </Layout>
        </>
    )
}