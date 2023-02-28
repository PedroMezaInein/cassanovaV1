import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2'

import { Modal } from '../../../components/singles'
import TablaGeneral from '../../../components/NewTables/TablaGeneral/TablaGeneral'
import { apiDelete } from '../../../functions/api'
import { setOptions } from '../../../functions/setters'
import useOptionsArea from '../../../hooks/useOptionsArea'
import Layout from '../../../components/layout/layout'

export default function TicketsUserTable() {
    const userAuth = useSelector((state) => state.authUser);
    const [reloadTable, setReloadTable] = useState(false)

    let prop = {
        pathname: '/rh/vehiculos',
    }

    const columnas = [
        { nombre: 'Acciones', identificador: 'acciones' },
        { nombre: 'Fecha', identificador: 'fecha' },
        { nombre: 'Tipo', identificador: 'tipo' },
        { nombre: 'Estatus', identificador: 'estatus' },
        { nombre: 'F. de entrega', identificador: 'fecha_entrega' },
    ];

    const ProccessData = (data) => {
        let aux = [
            { fecha: '2021-01-01', tipo: 'Mantenimiento', estatus: 'Pendiente', fecha_entrega: '2021-01-01' },
            { fecha: '2021-01-01', tipo: 'Mantenimiento', estatus: 'Pendiente', fecha_entrega: '2021-01-01' },
            { fecha: '2021-01-01', tipo: 'Mantenimiento', estatus: 'Pendiente', fecha_entrega: '2021-01-01' },
            { fecha: '2021-01-01', tipo: 'Mantenimiento', estatus: 'Pendiente', fecha_entrega: '2021-01-01' },
        ]
        return aux
    }

    const createAcciones = () => {
        return [
            {
                nombre: 'Editar',
                icono: 'fas fa-edit',
                color: 'blueButton',
                funcion: (item) => {
                    
                }
            },
        ]
    }


    return (
        <>
            <Layout authUser={userAuth.acces_token} location={prop} history={{ location: prop }} active='rh'>
                <>
                    <TablaGeneral titulo='Tickets' columnas={columnas} url='vehiculos' ProccessData={ProccessData} numItemsPagina={12} acciones={createAcciones()}  reload={setReloadTable} />
                </>
            </Layout>  
        </>
    );
}