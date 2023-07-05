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
import Facturas from './Modales/Facturas'
import { setMoneyTable, setDateTable } from '../../../functions/setters'
import { printResponseErrorAlert, errorAlert, waitAlert, validateAlert, doneAlert } from '../../../functions/alert'
import StatusIndicatorGastos from './Modales/StatusIndicatorGastos'

import Swal from 'sweetalert2'

import { apiOptions, catchErrors, apiDelete, apiPostForm, apiGet,apiPostFormResponseBlob } from './../../../functions/api';

export default function EgresosTable() { 
    const auth = useSelector((state) => state.authUser.access_token);
    const [opcionesData, setOpcionesData] = useState()
    const [reloadTable, setReloadTable] = useState()
    console.log(proccessData)

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
        },
        facturas: {
            show: false,
            data: null
        }
    })

    useEffect(() => {
        getProveedores()
    }, [filtrado])

    // useEffect(() => {
    //     getProveedores()
    //     // if (reloadTable) {
    //     //     reloadTable.reload()
    //     // }
    //     // if (filtrado) {
    //     //     reloadTable.reload(filtrado)
    //     //     //  setFiltrado('')
    //     //     if(borrar == false){
    //     //         setFiltrado('')   

    //     //     }
    //     // }
    // }, [filtrado])
    
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

    const [filtrado, setFiltrado] = useState('') 

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
        { nombre: '', identificador: 'acciones', sort: false, stringSearch: false },
        { nombre: 'ID', identificador: 'id', stringSearch: false },
        { nombre: 'Fecha', identificador: 'fecha', stringSearch: false },
        { nombre: 'Proveedor', identificador: 'proveedor', stringSearch: false },
        { nombre: 'Factura', identificador: 'factura', stringSearch: false },
        { nombre: 'Área', identificador: 'area', stringSearch: false },
        { nombre: 'Sub-Área', identificador: 'subarea', stringSearch: false },
        { nombre: 'Monto', identificador: 'monto', stringSearch: false },
        // { nombre: 'Total', identificador: 'total', stringSearch: false },
        { nombre: 'Cuenta', identificador: 'cuenta', stringSearch: false },
        // { nombre: 'Pago', identificador: 'pago', stringSearch: false },
        // { nombre: 'Impuesto', identificador: 'impuesto', stringSearch: false },
        // { nombre: 'Estatus', identificador: 'estatusCompra', stringSearch: false },
        { nombre: 'Descripción', identificador: 'descripcion', stringSearch: false }, //quitar
        { nombre: 'estatus', identificador: 'semaforo', stringSearch: false } //quitar
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
            color: 'yellowButton',
            funcion: (item) => {
                openModal('facturaExtranjera', item)
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
                exportEgresosAxios(item.id)

            }
        },
    ]

    const  exportEgresosAxios = () => {
        Swal.fire({
            icon: 'success',
            title: 'Descargar gasto',
            text: 'Exportando gastos espere...',
            showConfirmButton: false,
            timer: 4000
        })
        
        apiPostFormResponseBlob(`v3/administracion/egresos/exportar`,{ columnas: filtrado },  auth).then(
            (response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'egresos.xlsx');
                document.body.appendChild(link);
                link.click();
                doneAlert(
                    response.data.message !== undefined ? 
                        response.data.message 
                    : 'Ingresos exportados con éxito.'
                )
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }

    const openModal = (tipo, data) => {
        if(data.factura == 'Sin factura' && tipo == 'facturas' ){
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


    const createStatusIndicator = (item) => {
        console.log('createStatusIndicator')
        console.log(item)
        return (
            <StatusIndicatorGastos data={item} />
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
                id: dato.id,
                fecha: setDateTable(dato.created_at),
                monto: formatNumber(dato.monto),
                // total: formatNumber(dato.total),
                area: dato.area.nombre,
                subarea: dato.subarea.nombre,
                proveedor: dato.proveedor?.razon_social,
                cuenta: dato.cuenta?.nombre,
                pago: dato.tipo_pago?.tipo,
                impuesto: dato.tipo_impuesto?.tipo,
                descripcion: dato.descripcion,
                factura: dato.factura ? 'Con factura' : 'Sin factura',
                semaforo: createStatusIndicator(dato),
            })
        }
        )
        return aux
    }

    function reformatDate(dateStr) {
        var dArr = dateStr.split("-");  // ex input: "2010-01-18"
        return dArr[2] + "/" + dArr[1] + "/" + dArr[0]/* .substring(2) */; //ex output: "18/01/10"
    }

    return (
        <>
            <TablaGeneralPaginado
                titulo="Gastos"
                subtitulo="listado de gastos"
                url={'v3/administracion/gastos'}
                columnas={columns}
                numItemsPagina={50}
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
                modal.facturas.data &&
                <Modal size="xl" title={"Facturas"} show={modal.facturas?.show} handleClose={e => handleClose('facturas')} >
                    <Facturas handleClose={e => handleClose('facturas')}  opcionesData={opcionesData} egreso={modal.facturas.data}/>
                </Modal> 
            }
        
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
                    <Filtrar handleClose={e => handleClose('filtrar')} opcionesData={opcionesData} filtrarTabla={setFiltrado} borrarTabla={borrar}  reload={reloadTable}/>
                </Modal>
            }

            {
                modal.facturaExtranjera.data &&
                <Modal size="lg" title={"Adjuntos"} show={modal.facturaExtranjera?.show} handleClose={e => handleClose('facturaExtranjera')} >
                    <FacturaExtranjera handleClose={e => handleClose('facturaExtranjera')} opcionesData={opcionesData} data={modal.facturaExtranjera.data}/>
                </Modal>
            }

        </>
    )

}