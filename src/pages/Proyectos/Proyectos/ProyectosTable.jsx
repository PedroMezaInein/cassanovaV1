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
    const [opciones, setOpciones] = useState(false)
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
        { nombre: 'Cliente', identificador: 'cliente', sort: true, stringSearch: true },
        { nombre: 'Dirección', identificador: 'direccion', sort: true, stringSearch: true },
        { nombre: 'Contacto', identificador: 'contacto', sort: true, stringSearch: true },
        { nombre: 'Empresa', identificador: 'empresa', sort: true, stringSearch: true },
        { nombre: 'F. Inicio', identificador: 'fechaInicio', sort: true, stringSearch: true },
        { nombre: 'F. Fin', identificador: 'fechaFin', sort: true, stringSearch: true },
        { nombre: 'Descripción', identificador: 'descripcion', sort: true, stringSearch: true },

    ]

    const createAcciones = () => {
        let aux = [
            {
                nombre: 'Ver Proyecto',
                icono: 'fas fa-eye',
                color: 'blueButton ',
                funcion: (item) => {
                    Swal.fire({
                        title: 'Ver Proyecto',
                        text: '¿Desea ver el proyecto?',
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

                options.empresas.forEach(empresa => {
                    options.tipos = setOptions(empresa.tipos, 'tipo', 'id')
                });
                /* if (proyecto.empresa) {
                    options.empresas.forEach(empresa => {
                        if (proyecto.empresa.name === empresa.name) {
                            options.tipos = setOptions(empresa.tipos, 'tipo', 'id')
                        }
                    });
                } */

                Swal.close()
                setOpciones(options)
            },
            (error) => {

            }
        ).catch((error) => {


        })
    }
    console.log(opciones);

    const ProccessData = (data) => {
        let aux = []
        console.log(data);
        data.data.forEach((item) => {
            if (item.proyectos.length > 0) {
                aux.push({
                    id: item.id,
                    nombre: item.proyectos[0].simpleName,
                    
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
                <Tabla
                    titulo="Proyectos" columnas={columnas} url="proyectos/project" opciones={opcionesbtn} acciones={createAcciones()} numItemsPagina={20} ProccessData={ProccessData}
                />
            </Layout>
        </>
    )
}