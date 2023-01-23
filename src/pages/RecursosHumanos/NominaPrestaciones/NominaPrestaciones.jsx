import React, { useEffect } from 'react';
import { useState, useSelector } from 'react-redux';

import Swal from 'sweetalert2';
import { Card, Nav, Tab, Dropdown, Col, Row, OverlayTrigger, Tooltip } from 'react-bootstrap'

import Layout from '../../../components/layout/layout'
import Tabla from './../../../components/NewTables/TablaGeneral/TablaGeneral'

export default function NominaPrestaciones() {
    const userAuth = useSelector((state) => state.authUser);

    let prop = {
        pathname: '/rh/nomina-prestaciones',
    }

    const columnas = [
        { nombre: 'Acciones', identificador: 'acciones' },
        { nombre: 'Empresa', identificador: 'empresa', sort: true, stringSearch: true },
    ]

    const createAcciones = () => {
        let aux = [
            {
                nombre: 'Editar',
                icono: 'fas fa-edit',
                color: 'blueButton ',
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
        console.log(data);
        data.data.forEach((item) => {
            if (item.proyectos.length > 0) { 
                aux.push({
                    id: item.id,
                    empresa: item.proyectos[0].simpleName,
                    proyecto: item.proyectos
                })
            }
        })
        console.log(aux);
        return aux
    }

    const opciones = [
        {
            nombre: 'Nuevo',
            funcion: () => {
                Swal.fire({
                    title: 'Nuevo',
                    text: '¿Desea crear un nuevo registro?',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonText: 'Si',
                    cancelButtonText: 'No',
                }).then((result) => {
                    if (result.isConfirmed) {
                        console.log('Nuevo');
                    }
                });
            }
        }
    ]


    return (
        <>
            <Layout authUser={userAuth.acces_token} location={prop} history={{ location: prop }} active='rh'>
                <div>
                    <Tabla
                        titulo="Proyectos" columnas={columnas} url="proyectos/project" opciones={opciones}  acciones={createAcciones()} numItemsPagina={20} ProccessData={ProccessData}
                    />    
                </div>
                
            </Layout>
        </>
    )
}