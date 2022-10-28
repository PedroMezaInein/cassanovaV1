import React from 'react';
import { useSelector } from "react-redux";

import SalaJuntas from "./SalaJuntas/SalaJuntas";

import Layout from '../../../components/layout/layout'

import '../../../styles/_reuniones.scss'

export default function Reuniones() { 
    const userAuth = useSelector((state) => state.authUser);

    let prop = {
        pathname: '/rh/reuniones',
    }

    return (
        <>
            <Layout authUser={userAuth.acces_token} location={prop} history={{ location: prop }} active='rh'>
                <SalaJuntas />
            </Layout>
        </>
    )
}