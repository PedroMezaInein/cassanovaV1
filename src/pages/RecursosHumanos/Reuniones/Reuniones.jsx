import React, { useState } from 'react';
import { useSelector } from "react-redux";

import SalaJuntas from "./SalaJuntas/SalaJuntas";
import Cursos from "./Cursos/Cursos";

import Layout from '../../../components/layout/layout'

import { Tabs, Tab } from 'react-bootstrap';

import '../../../styles/_reuniones.scss'

export default function Reuniones() { 
    const userAuth = useSelector((state) => state.authUser);

    let prop = {
        pathname: '/rh/reuniones',
    }

    return (
        <>
            <Layout authUser={userAuth.acces_token} location={prop} history={{ location: prop }} active='rh'>
                    {/* <Tabs defaultActiveKey="reuniones">
                        <Tab eventKey="cursos" title="Cursos">
                            <Cursos/>
                        </Tab>
                        <Tab eventKey="sala-juntas" title="Sala de Juntas">
                            <SalaJuntas />
                        </Tab>
                    </Tabs> */}
                <SalaJuntas />
            </Layout>
        </>
    )
}