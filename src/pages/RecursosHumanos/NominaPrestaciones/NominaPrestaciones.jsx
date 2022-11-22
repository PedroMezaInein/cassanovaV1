import React, { useEffect } from 'react';
import { useState, useSelector } from 'react-redux';

import Swal from 'sweetalert2';

import Layout from '../../../components/layout/layout'
import Tabla from './../../../components/NewTables/TablaGeneral/TablaGeneral'

export default function NominaPrestaciones() {
    const userAuth = useSelector((state) => state.authUser);

    let prop = {
        pathname: '/rh/nomina-prestaciones',
    }

    const columnas = [
        { nombre: 'Acciones', identificador: 'acciones' },
        { nombre: 'Sala', identificador: 'sala', sort: true, stringSearch: true },
        { nombre: 'Tipo', identificador: 'typo', sort: true, stringSearch: true },
        { nombre: 'Fecha', identificador: 'fecha', sort: true, stringSearch: true },
        { nombre: 'Hora', identificador: 'hora', sort: true, stringSearch: false },
    ]

    const createAcciones = () => {
        let aux = [
            {
                nombre: 'Editar',
                icono: 'fas fa-edit',
                color: 'btn btn-info',
                funcion: (item) => {
                    Swal.fire({
                        title: 'Editar',
                        text: '¿Desea editar el registro?',
                        icon: 'question',
                        showCancelButton: true,
                        confirmButtonText: 'Si',
                        cancelButtonText: 'No',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            console.log(item);
                        }
                    });
                }
            },
            {
                nombre: 'Eliminar',
                icono: 'fas fa-trash',
                color: 'btn btn-danger',
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
                            console.log(item);
                        }
                    });  
                }
            }
        ]
        return aux
    }

    const ProccessData = (data) => { 
        let aux = []
        data.Sala.forEach((item) => {
            aux.push({
                id: item.id,
                sala: item.sala,
                typo: item.typo,
                fecha: item.fecha,
                hora: item.hora,
            })
        })
        return aux
    }

    return (
        <>
            <Layout authUser={userAuth.acces_token} location={prop} history={{ location: prop }} active='rh'>
                <Tabla
                    titulo="Nomina Prestaciones" columnas={columnas} url="salas" subtitulo="subtitulo" acciones={createAcciones()} numItemsPagina={5} ProccessData={ProccessData}
                />
            </Layout>
        </>
    )
}