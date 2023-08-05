import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { Modal } from './../../../components/singles'
import { setDateTable } from '../../../functions/setters'

import CrearCompras from './CrearCompras'
import EditarCompra from './EditarCompra'
import VerCompra from './VerCompra'
import AdjuntosCompras from './AdjuntosCompras'
import FacturasCompras from './FacturasCompras'
import FiltrarCompras from './FiltrarCompras'
import { renderToString } from 'react-dom/server'

import AccessTimeIcon from '@material-ui/icons/AccessTime';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';

import TablaGeneralPaginado from './../../../components/NewTables/TablaGeneral/TablaGeneralPaginado'
import Swal from 'sweetalert2'

import { apiOptions, catchErrors, apiDelete } from './../../../functions/api';

export default function ComprasTable() { 
    const auth = useSelector((state) => state.authUser.access_token);
    const authUser = useSelector((state) => state.authUser);
    const [opcionesData, setOpcionesData] = useState()
    const [filtrado, setFiltrado] = useState('') 
    const [reloadTable, setReloadTable] = useState()
    const areaCompras = useSelector(state => state.opciones.compras)

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
        eliminar: {
            show: false,
            data: false
        },
        filtrar: {
            show: false,
            data: null
        }, 
        adjuntos: {
            show: false,
            data: null
        },
        facturas: {
            show: false,
            data: null
        }
    })

    useEffect(() => {
        // getProveedores()
        // setFiltrado()
        if (filtrado) {
            reloadTable.reload(filtrado)
            //  setFiltrado('')
            if(borrar == false){
                setFiltrado('')   

            }
        }
    }, [filtrado])

    const borrar = ( id) =>{
        if(id == false){
            reloadTable.reload(filtrado)
            setFiltrado('')   
        }
    }

    const columns = [
        { nombre: '', identificador: 'acciones', sort: false, stringSearch: false },
        { nombre: 'ID', identificador: 'id', stringSearch: false },
        { nombre: 'Fecha', identificador: 'fecha', stringSearch: false },
        { nombre: 'Proveedor', identificador: 'proveedor', stringSearch: false },
        { nombre: 'Factura', identificador: 'factura', orderable: false },
        { nombre: 'Área', identificador: 'area', stringSearch: false },
        { nombre: 'partida', identificador: 'partida', stringSearch: false },
        { nombre: 'Sub-partida', identificador: 'subarea', stringSearch: false },
        { nombre: 'Monto', identificador: 'monto', stringSearch: false },
        // { nombre: 'Total', identificador: 'total', stringSearch: false },
        { nombre: 'Cuenta', identificador: 'cuenta', stringSearch: false },
        { nombre: 'Pago', identificador: 'pago', stringSearch: false },
        { nombre: 'Impuesto', identificador: 'impuesto', stringSearch: false },
        // { nombre: 'Estatus', identificador: 'estatusCompra', stringSearch: false },
        { nombre: 'Descripción', identificador: 'descripcion', stringSearch: false } //quitar
    ]

    const deleteCompraAxios = (id) => {
        apiDelete(`compras/${id}`, auth).then(
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
            nombre: 'Ver compra',
            icono: 'fas fa-eye',
            color: 'greenButton',
            funcion: (item) => {
                openModal('ver', item)
            }
        },
    
        {
            nombre: 'Adjuntos',
            icono: 'fas fa-paperclip',
            color: 'yellowButton',
            funcion: (item) => {
                openModal('adjuntos', item)
            }
        },

        {
            nombre: 'Facturas',
            icono: 'fas fa-file-invoice',
            color: 'perryButton',
            funcion: (item) => {
                openModal('facturas', item)
            }
        },
        {
            nombre: 'Eliminar',
            icono: 'fas fa-trash-alt',
            color: 'redButton',
            funcion: (item) => {
                authUser.user.tipo.tipo === 'Administrador' ?
                Swal.fire({
                    title: '¿Estás seguro?',
                    text: "¡No podrás revertir esto!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',

                    cancelButtonText: 'Cancelar',
                    confirmButtonText: 'Sí, bórralo',
                }).then((result) => {
                    if (result.isConfirmed) {
                        deleteCompraAxios(item.id)
                    }
                })
                :   
                Swal.fire({
                    icon: 'error',
                    title: 'No tienes permiso',
                    text: 'Lo sentimos no tienes permiso para borrar...',
                    showConfirmButton: false,
                    timer: 4000
                })
                
            }
        },
    ]

    // if (proyecto.bitacora) {
    //     handleOpen.push({
    //         nombre: 'ver bitácora',
    //         funcion: (item) => {
    //             window.open(proyecto.bitacora, '_blank');
    //         }
    //     });
    // } 

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
    ]

    const openModal = (tipo, data) => {
        if(data.factura == 'Sin factura' && tipo == 'facturas'){
            Swal.fire({
                icon: 'error',
                title: 'No tiene facura',
                text: 'El registro es sin factura',
                showConfirmButton: false,
                timer: 1500
            })
            
        }else{
            setModal({
                ...modal,
                [tipo]: {
                    show: true,
                    data: data
                }
            })
        }
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

    useEffect(() => {
        getProveedores()
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

                let aux = {
                    cuentas: [],
                    empresas: [],
                    estatusCompras: [],
                    proveedores: [],
                    tiposImpuestos: [],
                    tiposPagos: [],
                }

                data.proveedores.map((proveedor) => {
                    if (proveedor.razon_social !== null) {
                        aux.proveedores.push({
                            id: proveedor.id,
                            name: proveedor.razon_social,
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
                // setProveedoresData(aux);
  
            }
        )
    }

    const formatNumber = (num) => {
        return `$${num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`
    }

    const proccessData = (datos) => { 

        let aux = []
        datos.data.data.map((dato) => {
            aux.push({
                data: dato,
                id: dato.id ? dato.id : 's/i',
                fecha: dato.created_at ? setDateTable(dato.created_at) : 's/i',
                monto: dato.monto ? formatNumber(dato.monto) : 's/i',
                area: dato.area ?  dato.area.nombre : 's/i',
                partida: dato.partida ? dato.partida.nombre : 's/i',
                subarea: dato.subarea ? dato.subarea.nombre : 's/i',
                proveedor: dato.proveedor.razon_social ? dato.proveedor.razon_social : 's/i',
                cuenta: dato.cuenta.nombre ? dato.cuenta.nombre : 's/i',
                pago: dato.tipo_pago.tipo ? dato.tipo_pago.tipo : 's/i',
                impuesto: dato.tipo_impuesto.tipo ? dato.tipo_impuesto.tipo : 's/i',
                descripcion: dato.descripcion ? dato.descripcion : 's/i',
                // factura: dato.factura ? 'Con factura' : 'Sin factura',
                factura:label(dato),
                
            })
        }
        )
        return aux
    }

    const label = (dato) => {  
       
            return(
              
                <div   title={`${ dato.factura == 1 ? 'Con factura': 'Sin factura'}`}  >
                {
                      dato.factura ?
                      dato.facturas.length > 0 ?
                        <span   style={{ color: 'green' }}><DoneAllIcon/></span>
                        :
                        <span   style={{ color: 'red' }}><DoneAllIcon/></span>

                    : 
                    <span><DescriptionOutlinedIcon/></span>
                }
              </div>
            )
        
    }

    return (
        <>
            <TablaGeneralPaginado
                titulo="Compras"
                subtitulo="listado de compras"
                url={`v3/proyectos/compras`}
                //url={'v3/proyectos/compra'}
                columnas={columns}
                numItemsPagina={50}
                ProccessData={proccessData}
                opciones={opciones}
                acciones={acciones}
                reload={setReloadTable} 
                filtros={filtrado}
            />

            <Modal size="lg" title={"Nueva compra"} show={modal.crear?.show} handleClose={e => handleClose('crear')} >
                <CrearCompras handleClose={e => handleClose('crear')} reload={reloadTable} opcionesData={opcionesData}/> 
            </Modal>

            {
                modal.filtrar.data &&
                <Modal size="lg" title={"Filtrar gastos"} show={modal.filtrar?.show} handleClose={e => handleClose('filtrar')} >
                    <FiltrarCompras handleClose={e => handleClose('filtrar')} opcionesData={opcionesData} filtrarTabla={setFiltrado} borrarTabla={borrar}  reload={reloadTable}/>
                </Modal>
            }

            {
                modal.editar?.data &&
                <Modal size="lg" title={"Editar compra"} show={modal.editar?.show} handleClose={e => handleClose('editar')} >
                    <EditarCompra handleClose={e => handleClose('editar')} opcionesData={opcionesData} reload={reloadTable} data={modal.editar?.data?.data}/>
                </Modal>
            }

            {
                modal.ver?.data &&
                <Modal size="md" title={"ver compra"} show={modal.ver?.show} handleClose={e => handleClose('ver')} >
                    <VerCompra handleClose={e => handleClose('ver')} opcionesData={opcionesData} reload={reloadTable} data={modal.ver?.data?.data}/>
                </Modal>
            }

            {
                modal.adjuntos?.data &&
                <Modal size="lg" title={"adjuntos"} show={modal.adjuntos?.show} handleClose={e => handleClose('adjuntos')} >
                    <AdjuntosCompras handleClose={e => handleClose('adjuntos')} opcionesData={opcionesData} reload={reloadTable} data={modal.adjuntos?.data?.data}/>
                </Modal>
            }

            {
                modal.facturas?.data &&
                <Modal size="xl" title={"facturas"} show={modal.facturas?.show} handleClose={e => handleClose('facturas')} >
                    <FacturasCompras handleClose={e => handleClose('facturas')} opcionesData={opcionesData} reload={reloadTable} compra={modal.facturas?.data?.data}/>
                </Modal>
            }
        </>
    )

}