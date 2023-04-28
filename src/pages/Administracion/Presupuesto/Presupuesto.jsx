import React, { useState } from 'react'
import { useSelector } from 'react-redux';

import Swal from 'sweetalert2'
import Layout from '../../../components/layout/layout'

import TablaPresupuesto from './TablaPresupuesto'

export default function Presupuesto() {
    const userAuth = useSelector((state) => state.authUser);

    let prop = {
        pathname: '/administracion/requisicion',
    }

    return (
        <>

            <Layout authUser={userAuth.acces_token} location={prop} history={{ location: prop }} active='administracion'>
                <TablaPresupuesto /> 
            </Layout>

        </>
    );
}
