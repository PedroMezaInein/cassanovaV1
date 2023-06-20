import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Modal } from './../../../components/singles'

import Tabla from './../../../components/NewTables/TablaGeneral/TablaGeneral'
import TablaGeneralPaginado from './../../../components/NewTables/TablaGeneral/TablaGeneralPaginado'

import Crear from './Modales/CrearEgreso'
import Editar from './Modales/EditarGasto'
import Ver from './Modales/VerEgreso'
import Filtrar from './Modales/Filtrar'
import FacturaExtranjera from './Modales/FacturaExtranjera'

import Swal from 'sweetalert2'


import { apiOptions, catchErrors, apiDelete, apiPostForm, apiGet } from './../../../functions/api';



export default function EgresosTable() { 
    const auth = useSelector((state) => state.authUser.access_token);
    const [opcionesData, setOpcionesData] = useState()
    const [reloadTable, setReloadTable] = useState()

    const [modal, setModal] = useState({
        ver: {
            show: false,
            data: null
        },
        editar: {
            show: false,
            data: null
        },
        crear: {
            show: false,
            data: null
        },
        filtrar: {
            show: false,
            data: null
        },
        facturaExtranjera: {
            show: false,
            data: null
        }
    })

    useEffect(() => {
        getProveedores()
    }, [])

    useEffect(() => {
        if (reloadTable) {
            reloadTable.reload()
        }
    }, [filtrado])

    const getProveedores = () => {
        Swal.fire({
            title: 'Cargando...',
            allowOutsideClick: false,
            onBeforeOpen: () => {
                Swal.showLoading()
            },
        })
        apiOptions(`v2/administracion/egresos`, auth)
            .then(res => {
                let data = res.data
                console.log(data)
                let aux = {
                    cuentas: [],
                    empresas: [],
                    estatusCompras: [],
                    proveedores: [],
                    tiposImpuestos: [],
                    tiposPagos: [],
                }

                data.proveedores.map((proveedor) => {
                    if (proveedor.nombre !== null) {
                        aux.proveedores.push({
                            id: proveedor.id,
                            name: proveedor.nombre,
                            rfc: proveedor.rfc,
                        })   
                    }  
                })

                data.empresas.map((empresa) => {
                    if (empresa.nombre !== null) {
                        aux.empresas.push({
                            id: empresa.id,
                            name: empresa.name,
                            rfc: empresa.rfc,
                            cuentas: empresa.cuentas,
                        })
                    }
                })

                data.estatusCompras.map((estatusCompra) => {
                    if (estatusCompra.estatus !== null) {
                        aux.estatusCompras.push({
                            id: estatusCompra.id,
                            name: estatusCompra.estatus,
                        })
                    }
                })

                data.tiposImpuestos.map((tipoImpuesto) => {
                    if (tipoImpuesto.tipo !== null) {
                        aux.tiposImpuestos.push({
                            id: tipoImpuesto.id,
                            name: tipoImpuesto.tipo,
                        })
                    }
                })

                data.tiposPagos.map((tipoPago) => {
                    if (tipoPago.tipo !== null) {
                        aux.tiposPagos.push({
                            id: tipoPago.id,
                            name: tipoPago.tipo,
                        })
                    }
                })

                Swal.close()
                setOpcionesData(aux)
                    
            }
        )
        
    }

    const [filtrado, setFiltrado] = useState('')

    const deleteEgresoAxios = (id) => {
        apiDelete(`egresos/${id}`, auth).then(
            (response) => {
                Swal.fire(
                    '¡Eliminado!',
                    'El egreso ha sido eliminado.',
                    'success'
                )
                if (reloadTable) {
                    reloadTable.reload()
                }
            }, (error) => { }
        ).catch((error) => { catchErrors(error) })
    }  

    const columns = [
        { nombre: 'Acciones', identificador: 'acciones', sort: false, stringSearch: false },
        { nombre: 'ID', identificador: 'id', stringSearch: false },
        { nombre: 'Fecha', identificador: 'fecha', stringSearch: false },
        { nombre: 'Proveedor', identificador: 'proveedor', stringSearch: false },
        { nombre: 'Factura', identificador: 'factura', stringSearch: false },
        { nombre: 'Área', identificador: 'area', stringSearch: false },
        { nombre: 'Sub-Área', identificador: 'subarea', stringSearch: false },
        { nombre: 'Monto', identificador: 'monto', stringSearch: false },
        { nombre: 'Comisión', identificador: 'comision', stringSearch: false },
        { nombre: 'Total', identificador: 'total', stringSearch: false },
        { nombre: 'Cuenta', identificador: 'cuenta', stringSearch: false },
        { nombre: 'Pago', identificador: 'pago', stringSearch: false },
        { nombre: 'Impuesto', identificador: 'impuesto', stringSearch: false },
        // { nombre: 'Estatus', identificador: 'estatusCompra', stringSearch: false },
        { nombre: 'Descripción', identificador: 'descripcion', stringSearch: false } //quitar
    ]

    const acciones = [
        {
            nombre: 'Editar',
            icono: 'fas fa-edit',
            color: 'blueButton',
            funcion: (item) => {
                openModal('editar', item)

            }
        },
        {
            nombre: 'Eliminar',
            icono: 'fas fa-trash-alt',
            color: 'redButton',
            funcion: (item) => {
                Swal.fire({
                    title: '¿Estás seguro?',
                    text: "¡No podrás revertir esto!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',

                    confirmButtonText: 'Sí, bórralo',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        deleteEgresoAxios(item.id)
                        
                    }
                })
            }
        },
        {
            nombre: 'Ver gasto',
            icono: 'fas fa-eye',
            color: 'greenButton',
            funcion: (item) => {
                openModal('ver', item)
            }
        },
        {
            nombre: 'Adjuntos',
            icono: 'fas fa-paperclip',
            color: 'reyButton',
            funcion: (item) => {
            
            }
        },
        {
            nombre: 'Factura extranjera',
            icono: 'fas fa-file-invoice-dollar',
            color: 'reyButton',
            funcion: (item) => {
                openModal('facturaExtranjera', item)
            }
        },
        {
            nombre: 'Facturas',
            icono: 'fas fa-file-invoice',
            color: 'reyButton',
            funcion: (item) => {

            }
        },
    ]

    const opciones = [
        {
            nombre: <div><i className="fas fa-plus mr-5"></i><span>Nuevo</span></div>,
            funcion: (item) => {
                openModal('crear', item)
            }
        },
        {
            //filtrar
            nombre: <div><i className="fas fa-filter mr-5"></i><span>Filtrar</span></div>,
            funcion: (item) => {
                openModal('filtrar', item)
            }
        },
        {
            //exportar
            nombre: <div><i className="fas fa-file-export mr-5"></i><span>Exportar</span></div>,
            funcion: (item) => {

            }
        },
    ]

    const openModal = (tipo, data) => {
        setModal({
            ...modal,
            [tipo]: {
                show: true,
                data: data
            }
        })
    }

    const handleClose = (tipo) => {
        setModal({
            ...modal,
            [tipo]: {
                show: false,
                data: null
            }
        })
    }

    const proccessData = (datos) => { 
        let aux = []
        datos.data.data.map((dato) => {
            aux.push({
                data: dato,
                id: dato.id,
                monto: dato.monto,
                total: dato.total,
                comision: dato.comision,
                area: dato.area.nombre,
                subarea: dato.subarea.nombre,
                proveedor: dato.proveedor?.razon_social,
                cuenta: dato.cuenta?.nombre,
                pago: dato.tipo_pago?.tipo,
                impuesto: dato.tipo_impuesto?.tipo,
                descripcion: dato.descripcion,
                factura: dato.factura ? 'Con factura' : 'Sin factura',
            })
        }
        )
        return aux
    }

    return (
        <>
            <TablaGeneralPaginado
                titulo="Gastos"
                subtitulo="listado de gastos"
                url={'v3/administracion/gastos'}
                columnas={columns}
                numItemsPagina={20}
                ProccessData={proccessData}
                opciones={opciones}
                acciones={acciones}
                reload={setReloadTable} 
                filtros={filtrado}
            />

            <Modal size="lg" title={"Nuevo gasto"} show={modal.crear?.show} handleClose={e => handleClose('crear')} >
                <Crear handleClose={e => handleClose('crear')} opcionesData={opcionesData} reload={reloadTable}/> 
            </Modal>

            {
                modal.editar?.data &&
                <Modal size="lg" title={"Editar gasto"} show={modal.editar?.show} handleClose={e => handleClose('editar')} >
                    <Editar handleClose={e => handleClose('editar')} opcionesData={opcionesData} data={modal.editar?.data?.data}/>
                </Modal>
            }

            {
                modal.ver.data &&
                <Modal size="lg" title={"Ver gasto"} show={modal.ver?.show} handleClose={e => handleClose('ver')} >
                    <Ver handleClose={e => handleClose('ver')} opcionesData={opcionesData} data={modal.ver?.data?.data}/>
                </Modal>
            }
            
            {
                modal.filtrar.data &&
                <Modal size="lg" title={"Filtrar gastos"} show={modal.filtrar?.show} handleClose={e => handleClose('filtrar')} >
                    <Filtrar handleClose={e => handleClose('filtrar')} opcionesData={opcionesData} filtrarTabla={setFiltrado}/>
                </Modal>
            }

            {
                modal.facturaExtranjera.data &&
                <Modal size="lg" title={"Factura extranjera"} show={modal.facturaExtranjera?.show} handleClose={e => handleClose('facturaExtranjera')} >
                    <FacturaExtranjera handleClose={e => handleClose('facturaExtranjera')} opcionesData={opcionesData} data={modal.facturaExtranjera.data}/>
                </Modal>
            }

        </>
    )

}