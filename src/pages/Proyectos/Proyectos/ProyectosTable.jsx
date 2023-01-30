import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import Swal from 'sweetalert2';
import axios from 'axios';

import Layout from '../../../components/layout/layout'
import Tabla from './../../../components/NewTables/TablaGeneral/TablaGeneral'
import { ordenamiento, setOptions } from '../../../functions/setters'
import { URL_DEV } from '../../../constants'

export default function ProyectosTable() { 
    const userAuth = useSelector((state) => state.authUser);
    const[opciones, setOpciones] = useState(false)
    let prop = {
        pathname: '/proyectos/proyectos/',
    }
    useEffect(() => {
        getOptionsEmpresas()
    }, []);

    const columnas = [
        { nombre: 'Acciones', identificador: 'acciones' },
        { nombre: 'Nombre', identificador: 'nombre', sort: true, stringSearch: true },
        { nombre: 'T. Proyecto', identificador: 'tipoProyecto', sort: true, stringSearch: true },
        /* { nombre: 'Cliente', identificador: 'cliente', sort: true, stringSearch: true }, */
        { nombre: 'Dirección', identificador: 'direccion', sort: true, stringSearch: true },
        { nombre: 'Contacto', identificador: 'contacto', sort: false, stringSearch: true },
        { nombre: 'Empresa', identificador: 'empresa', sort: true, stringSearch: true },
        /* { nombre: 'F. Inicio', identificador: 'fechaInicio', sort: true, stringSearch: true },
        { nombre: 'F. Fin', identificador: 'fechaFin', sort: true, stringSearch: true }, */
        { nombre: 'Descripción', identificador: 'descripcion', sort: true, stringSearch: true },
    ]

    const createAcciones = () => {
        let aux = [
            {
                nombre: 'Ver Proyecto',
                icono: 'fas fa-eye',
                color: 'blueButton ',
                funcion: (item) => {
                    window.location.href = `/proyectos/proyectos/nuevo/${item.id}`
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

    const getOptionsEmpresas = async () => {
        Swal.fire({
            title: 'Cargando...',
            allowOutsideClick: false,
            willOpen: () => {
                Swal.showLoading()
            }
        })

        axios.get(`${URL_DEV}proyectos/opciones`, { headers: { Authorization: `Bearer ${userAuth.access_token}` } }).then(
            (response) => {
                const { clientes, empresas, estatus, proveedores } = response.data
                console.log(response.data);
                let aux = [];
                let options = {
                    empresas: [],
                    clientes: [],
                    // colonias: [],
                    estatus: [],
                    /* tipos:[], */
                    cp_clientes: [],
                    proveedores: []
                }
                clientes.forEach((element) => {
                    aux.push({
                        name: element.empresa,
                        value: element.id.toString(),
                        label: element.empresa,
                        cp: element.cp,
                        estado: element.estado,
                        municipio: element.municipio,
                        colonia: element.colonia,
                        calle: element.calle
                    })
                    return false
                })
                options.clientes = aux.sort(ordenamiento)
                options['empresas'] = setOptions(empresas, 'name', 'id')
                options['estatus'] = setOptions(estatus, 'estatus', 'id')
                options['proveedores'] = setOptions(proveedores, 'razon_social', 'id')
                let aux2 = []
                empresas.map(empresa => {
                    if (empresa.tipos.length > 0) {
                       aux2 = aux2.concat(empresa.tipos)
                    }
                    
                });
                options.tipos = setOptions(aux2, 'tipo', 'id')
                setOpciones(options)
                Swal.close()
            },
            (error) => {

            }
        ).catch((error) => {


        })
    }
    
    const ProccessData = (data) => {
        let aux = []
        console.log(data);
        data.data.forEach((item) => {
            if (item.proyectos.length > 0) {
                let tipoAux = opciones.tipos.find(tipo => parseInt(tipo.value) === item.proyectos[0].tipo_proyecto_id)
                
                aux.push({
                    id: item.id,
                    nombre: item.proyectos[0].simpleName,
                    tipoProyecto: tipoAux && tipoAux.name ? tipoAux.name : 'Sin tipo',
                    /* cliente: item.id, */
                    empresa: item.empresa,
                    direccion: item.proyectos[0].sucursal ? item.proyectos[0].sucursal : 'Sin dirección',
                    contacto: item.nombre ? item.nombre : 'Sin contacto',
                    descripcion: item.proyectos[0].descripcion ? item.proyectos[0].descripcion : 'Sin descripción',
                })
            }
        })
        console.log(aux);
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
            <Layout authUser={userAuth.acces_token} location={prop} history={{ location: prop }} active='proyectos' >
                { opciones &&
                    <Tabla
                    titulo="Proyectos" columnas={columnas} url="proyectos/project" opciones={opcionesbtn} acciones={createAcciones()} numItemsPagina={20} ProccessData={ProccessData}
                    />
                }
            </Layout>
        </>
    )
}