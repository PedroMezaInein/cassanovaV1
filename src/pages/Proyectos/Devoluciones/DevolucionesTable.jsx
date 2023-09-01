import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import TablaGeneralPaginado from '../../../components/NewTables/TablaGeneral/TablaGeneralPaginado';
import { setDateTable } from './../../../functions/setters'
import { apiOptions, apiDelete, catchErrors, apiPostForm,apiPostFormResponseBlob} from './../../../functions/api'
import { printResponseErrorAlert, doneAlert } from './../../../functions/alert';
import CrearDevoluciones from './CrearDevolucion';
import EditarDevoluciones from './EditarDevolucion';
import VerDevoluciones from './VerDevolucion';
import AdjuntosDevoluciones from './AdjuntosDevoluciones';
import FacturasDevoluciones from './FacturasDevoluciones';
import FiltrosDevoluciones from './FiltrosDevoluciones';
import axios from 'axios'

import { Modal } from './../../../components/singles'

import Swal from 'sweetalert2'

export default function DevolucionesTable (props){
    const { options } = props
    const auth = useSelector((state) => state.authUser.access_token);
    const authUser = useSelector((state) => state.authUser);

    const [opcionesData, setOpcionesData] = useState()
    const [filtrado, setFiltrado] = useState('') 
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

    useEffect(() => {
        getProveedores()
    }, [filtrado])

    const  exportEgresosAxios = async()  => {
        Swal.fire({
            icon: 'success',
            title: 'Descargar devolución',
            text: 'Exportando devoluciones espere...',
            showConfirmButton: false,
            timer: 4000
        })
        let headers = []

        
        await axios.post(`v2/exportar/proyectos/devoluciones`, { columnas: headers }, { responseType: 'blob', headers: { Authorization: `Bearer ${auth}` } }).then(
            (response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'devoluciones.xlsx');
                document.body.appendChild(link);
                link.click();
                doneAlert(
                    response.data.message !== undefined ? 
                        response.data.message 
                    : 'devoluciones exportadas con éxito.'
                )
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }

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
        // {
        //     nombre: <div><i className="fas fa-file-export mr-5"></i><span>Exportar</span></div>,
        //     funcion: (item) => {
        //         exportEgresosAxios(item.id)

        //     }
        // }
    ]

    const deleteCompraAxios = (id) => {
        apiDelete(`v1/proyectos/devoluciones/${id}`, auth).then((data) => {
            Swal.fire({
                title: 'devolución',
                text: 'se ha eliminado correctamente',
                icon: 'success',
                showConfirmButton: true,
                timer: 2000,
            }).then(() => {
                if (reloadTable) {
                    reloadTable.reload()
                }
                handleClose()
            })
        }).catch((error) => { catchErrors(error) })
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
            nombre: 'Ver devolución',
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
                console.log(item)
                // authUser.user.tipo.tipo === 'Administrador' ?
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
                // :   
                // Swal.fire({
                //     icon: 'error',
                //     title: 'No tienes permiso',
                //     text: 'Lo sentimos no tienes permiso para borrar...',
                //     showConfirmButton: false,
                //     timer: 4000
                // })
            }
        },
    ]

    const borrar = ( id) =>{
        if(id == false){
            reloadTable.reload(filtrado)
            setFiltrado('')   
        }
    }

    useEffect(() => {
        if (filtrado) {
            reloadTable.reload(filtrado)
            if(borrar == false){
                setFiltrado('')   
            }
        }
    }, [filtrado])

    const columna = [
        { nombre: '', identificador: 'acciones', sort: false, stringSearch: false },
        { nombre: 'ID', identificador: 'id', stringSearch: false },
        { nombre: 'Fecha', identificador: 'fecha', stringSearch: false },
        { nombre: 'Proveedor', identificador: 'proveedor', stringSearch: false },
        { nombre: 'Proyecto', identificador: 'proyecto', orderable: false },
        { nombre: 'Factura', identificador: 'factura', orderable: false },
        { nombre: 'Área', identificador: 'area', stringSearch: false },
        { nombre: 'partida', identificador: 'partida', stringSearch: false },
        { nombre: 'Sub-partida', identificador: 'subarea', stringSearch: false },
        { nombre: 'Monto', identificador: 'monto', stringSearch: false },
        { nombre: 'comisión', identificador: 'comision', stringSearch: false },
        { nombre: 'Total', identificador: 'total', stringSearch: false },
        { nombre: 'Cuenta', identificador: 'cuenta', stringSearch: false },
        { nombre: 'Impuesto', identificador: 'impuesto', stringSearch: false },
        { nombre: 'Pago', identificador: 'pago', stringSearch: false },
        { nombre: 'Estatus', identificador: 'estatusCompra', stringSearch: false },
        // { nombre: 'Descripción', identificador: 'descripcion', stringSearch: false } //quitar
    ]

    const formatNumber = (num) => {
        return `$${num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`
    }

    // const label = (dato) => {  
    //     return(
    
    //         <div title={`${ dato.factura == 1 ? 'Con factura': 'Sin factura'}`}  >
    //             {
    //                 dato.factura ?
    //                 dato.facturas.length > 0 ?
    //                     <span   style={{ color: 'green' }}><DoneAllIcon/></span>
    //                     :
    //                     <span   style={{ color: 'red' }}><DoneAllIcon/></span>

    //                 : 
    //                 <span><DescriptionOutlinedIcon/></span>
    //             }
    //         </div>
    //     )
    // }

    const proccessData = (datos) => { 
        let aux = []
        datos.data.data.map((dato) => {
            aux.push({
                data: dato,
                id: dato.id ? dato.id : 's/i',
                fecha: dato.created_at ? setDateTable(dato.created_at) : 's/i',
                proveedor: dato.proveedor ? dato.proveedor.razon_social : 's/i',
                proyecto: dato.proyecto ? dato.proyecto.nombre : '',
                factura: dato.factura === 1 ? 'Con factura' : dato.factura === 0 ? 'Sin factura' : 'Sin información',
                area: dato.area ?  dato.area.nombre : 's/i',
                partida: dato.partida ? dato.partida.nombre : 's/i',
                subarea: dato.subarea ? dato.subarea.nombre : 's/i',
                monto: dato.monto ? formatNumber(dato.monto) : 's/i',
                comision: dato.comision !== undefined && dato.comision !== null ? formatNumber(dato.comision) : 'Sin información',
                total: dato.total ? formatNumber(dato.total): 's/i',
                cuenta: dato.cuenta ? dato.cuenta.nombre : 's/i',
                pago: dato.tipo_pago ? dato.tipo_pago.tipo : 's/i',
                impuesto: dato.tipo_impuesto ? dato.tipo_impuesto.tipo : 's/i',
                descripcion: dato.descripcion ? dato.descripcion : 's/i',   
                estatusCompra: dato.estatus_compra ? dato.estatus_compra.estatus : 's/i',
                // factura:label(dato),
            })
        })
        return aux
    }

    return (
        <>
            <TablaGeneralPaginado
                titulo="devoluciones"
                subtitulo="listado de devoluciones"
                url={`v1/proyectos/devoluciones`}
                columnas={columna}
                numItemsPagina={50}
                ProccessData={proccessData}
                opciones={opciones}
                acciones={acciones}
                reload={setReloadTable} 
                filtros={filtrado}
            />

            <Modal size="lg" title={"Nueva devolución"} show={modal.crear?.show} handleClose={e => handleClose('crear')} >
                <CrearDevoluciones getProveedores={getProveedores} handleClose={e => handleClose('crear')} reload={reloadTable} options={options} opcionesData={opcionesData}/> 
            </Modal>

            {
                modal.filtrar.data &&
                <Modal size="lg" title={"Filtrar devoluciones"} show={modal.filtrar?.show} handleClose={e => handleClose('filtrar')} >
                    <FiltrosDevoluciones getProveedores={getProveedores} options={options} handleClose={e => handleClose('filtrar')} opcionesData={opcionesData} filtrarTabla={setFiltrado} borrarTabla={borrar} reload={reloadTable}/>
                </Modal>
            }

            {
                modal.editar?.data &&
                <Modal size="lg" title={"editar devolución"} show={modal.editar?.show} handleClose={e => handleClose('editar')} >
                    <EditarDevoluciones handleClose={e => handleClose('editar')} reload={reloadTable} options={options} opcionesData={opcionesData} data={modal.editar?.data?.data}/> 
                </Modal>
            }

            {
                modal.ver?.data &&
                <Modal size="lg" title={"ver devolución"} show={modal.ver?.show} handleClose={e => handleClose('ver')} >
                    <VerDevoluciones handleClose={e => handleClose('ver')} reload={reloadTable} options={options} opcionesData={opcionesData} data={modal.ver?.data?.data}/> 
                </Modal>
            }

            {
                modal.adjuntos?.data &&
                <Modal size="lg" title={"adjuntos devolución"} show={modal.adjuntos?.show} handleClose={e => handleClose('adjuntos')} >
                    <AdjuntosDevoluciones handleClose={e => handleClose('adjuntos')} reload={reloadTable} options={options} opcionesData={opcionesData} data={modal.adjuntos?.data?.data}/> 
                </Modal>
            }

            {
                modal.facturas?.data &&
                <Modal size="lg" title={"facturas devolución"} show={modal.facturas?.show} handleClose={e => handleClose('facturas')} >
                    <FacturasDevoluciones handleClose={e => handleClose('facturas')} reload={reloadTable} options={options} opcionesData={opcionesData} data={modal.facturas?.data?.data}/> 
                </Modal>
            }
        </>
    )
}