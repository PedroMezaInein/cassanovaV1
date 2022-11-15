import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Swal from 'sweetalert2'
import { Card, Tab, Nav } from 'react-bootstrap'

import Layout from '../../../components/layout/layout'
import { waitAlert } from '../../../functions/alert'
import { URL_DEV } from '../../../constants'
import { setFase, setLabelTable, ordenamiento, setOptions } from '../../../functions/setters'
import { EditProyectoForm, NotasObra, Avances, Adjuntos, ComentariosProyectos, PresupuestosProyecto } from '../../../components/forms'


export default function DetailProyect() {
    const userAuth = useSelector((state) => state.authUser);

    let actualUrl = window.location.href
    actualUrl = actualUrl.split('/')
    console.log(actualUrl[actualUrl.length - 1])

    let prop = {
        pathname: '/rh/reuniones',
    }
    
    return (
        <>
            <Layout authUser={userAuth.acces_token} location={prop} history={{ location: prop }} active='proyectos'>
                
            </Layout>
        </>
    )
}