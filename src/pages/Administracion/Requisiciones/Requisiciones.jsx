import {React} from 'react'
import { useState, useSelector } from 'react-redux';
import Layout from '../../../components/layout/layout'
import Tabla from './../../../components/NewTables/TablaGeneral/TablaGeneral'

function Requisiciones () {

    const userAuth = useSelector((state) => state.authUser);

    let prop = {
        pathname: '/administracion/requisicion',
    }

    const columnas = [
        { nombre: 'Opciones', identificador: 'opciones', sort: true, stringSearch: true},
        { nombre: 'Articulo', identificador: 'articulo', sort: true, stringSearch: true},
        { nombre: 'Total', identificador: 'total', sort: true, stringSearch: true},
    ]

    return (
        <Layout authUser={userAuth.acces_token} location={prop} history={{ location: prop }} active='administracion'>
            <Tabla
                titulo="Requisicion" 
                columnas={columnas}
                url=
                numItemsPagina={3}
                // numItemsPagina={3} 
                // ProccessData={this.proccessData}
                >
                </Tabla>
        </Layout>
    )
}

export { Requisiciones }
