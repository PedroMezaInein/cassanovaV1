import React, { useEffect, useState } from 'react';

import Swal from 'sweetalert2';

import TablaGeneral from '../../../../components/NewTables/TablaGeneral/TablaGeneral'
import BotonAcciones from './BotonAcciones';
import ProgressBar from './utils/ProgressBar';

import '../../../../styles/_fases.scss'
import BotonAdjuntos from './BotonAdjuntos';

import Modales from './utils/Modales';

export default function Fase1(props) {
    const {fase, reload, opciones} = props;
    const [modal, setModal] = useState({
        edit_phase: false,
        add_agreement: false,
        hire_phase: false,
        invoice: false,
        sale: false,
        purchase: false,
        end_proyect: false,
        needs_program: false,
        uprising_photographs: false,
        plan_measurements: false,
        contract: false,
        proof_payment: false,
    });

    const columnas = [
        { nombre: 'Acciones', identificador: 'acciones' },
        { nombre: 'Nombre', identificador: 'nombre', sort: true, stringSearch: true },
        { nombre: 'Fecha', identificador: 'fecha', sort: true, stringSearch: true },
        { nombre: 'Descripcion', identificador: 'descripcion', sort: true, stringSearch: true },
        { nombre: 'Monto', identificador: 'monto', sort: true, stringSearch: true },
    ]

    const createAcciones = () => {
        let aux = [
            {
                nombre: 'Ver Minuta',
                icono: 'fas fa-eye',
                color: 'blueButton ',
                funcion: (item) => {
                    console.log(item);
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
                            console.log(item)
                        }
                    });
                }
            }
        ]
        return aux
    }

    const ProccessData = (data) => {
        let aux = [
            {
                id: 1,
                nombre: 'Minuta 1',
                fecha: 'Fecha 1',
                descripcion: 'Descripcion 1',
                monto: '$1000',
            },
            {
                id: 2,
                nombre: 'Minuta 2',
                fecha: 'Fecha 2',
                descripcion: 'Descripcion 2',
                monto: '$2000',
            },
        ]
        return aux
    }

    const opcionesbtn = [
        {
            nombre: 'Agregar',
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
        },
        {
            nombre: 'Exportar',
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
                        console.log('Exportar');
                    }
                });
            }
        }
    ]

    return (
        <>
            <div className='container-fase'>
                <div>
                    <BotonAdjuntos modal={modal} setModal={setModal} />
                    <BotonAcciones modal={modal} setModal={setModal} />
                    <div>
                        <span>Avance de la fase {fase.simpleName}</span>
                        <ProgressBar avance={54} />
                    </div>
                    
                </div>
                <div>

                    <div>
                        Área
                        <p>{fase.m2} m2</p>
                    </div>

                    <div>
                        Descripcion
                        <p>{fase.descripcion}</p>
                    </div>
                    
                    
                    <div>
                        Presupuesto inicial
                    </div>
                    <div>
                        Presupuestos adicionales
                    </div>
                    <div className='container-tabla'>
                        <TablaGeneral
                            titulo="Historial de minutas" columnas={columnas} url="proyectos/project" opciones={opcionesbtn} acciones={createAcciones()} numItemsPagina={20} ProccessData={ProccessData}
                        />
                    </div>
                </div>
            </div>

            <Modales modal={modal} setModal={setModal} proyecto={fase} reload={reload} opciones={opciones} />

        </>
        
    )
}