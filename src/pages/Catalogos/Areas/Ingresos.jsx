import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux'

import { AREAS_GASTOS_COLUMNS } from '../../../constants'
import { Modal } from '../../../components/singles'
import TablaGeneral from '../../../components/NewTables/TablaGeneral/TablaGeneral'
import ModalAgregar from '../../../pages/Catalogos/Areas/ModalAgregar'
import ModalEditarGastos from '../../../pages/Catalogos/Areas/ModalEditarGastos'
import ModalEditarSubGasto from '../../../pages/Catalogos/Areas/ModalEditarSubPartida'
import useOptionsArea from '../../../hooks/useOptionsArea'

export default function Ventas (key){

    const userAuth = useSelector((state) => state.authUser);
    const [reloadTable, setReloadTable] = useState()
    const [modal, setModal] = useState({
        crear: {
            show:false,
            data:false
        },
        editarGastos:{
            show: false,
            data:false
        },
        eliminar:{
            show: false,
            data: false
        },
        editarSubGasto:{
            show: false,
            data: false
        }
    })
    useOptionsArea()

    const actionsGastos = () => {    
        let aux = [
            {
                nombre: 'editarGastos',
                icono: 'fas fa-edit',
                color: 'blueButton ',
                funcion: (item) => {
                    setModal({
                        ...modal,
                        editarGastos: {
                        show: true,
                        data: item
                        }
                    })
                }
            }
        ]
        return aux 
    }

    const handleOpen = [
        {
            nombre: 'Nueva venta',
            funcion: (item) => { 
                setModal({
                ...modal,
                    crear:{
                        show:true
                    }
                })
            }
        }
    ]

    const handleCloseGastos = (tipo) => {
        setModal({
            ...modal,
            [tipo]:{
                ...modal[tipo],
                show: false,
            }
        })
    }

    const handleOpenPartida = (info) =>{
        setModal({
            ...modal,
            ModalEditarSubGasto:{
                show:true,
                data: info
            },
        })
    }

    const proccessData = (e) => {
        let aux = []
        
        for(let key in e.ingresos){
            // Imprime el id del ingresos
        
            for(let ingresos in e.ingresos[key]){
                // Imprime el ingresos
        
                let auxPartidas = []

                    for(let idpartida in e.ingresos[key][ingresos]){

                        for(let partida in e.ingresos[key][ingresos][idpartida]){
                            // Imprime el nombre de cada partida
                            let auxSubpartida = []

                            e.ingresos[key][ingresos][idpartida][partida].forEach(elemento =>{
                                auxSubpartida.push({
                                    id: elemento.id,
                                    nombre: elemento.nombre,
                                })    
                            })
                            
                            auxPartidas.push({
                                id:idpartida,
                                nombre:partida,
                                subpartidas:auxSubpartida
                            })
                        }
                    }
                let areas = {
                    nombreArea: ingresos,
                    id_area: key,
                    partidas:auxPartidas,
                }
                aux.push(areas)
            }
        }
        let dataTable = []

        aux.map(item =>{

            item.partidas.forEach((partidaitem, index)=>{
                let subpartidaaux =[] 

                partidaitem.subpartidas.map((subpartida, index)=>{
                    subpartidaaux.push(<div key={index} onClick={()=>{handleOpenPartida(subpartida)}}>{subpartida.nombre}</div>)// es cada subpartida
                })

                let estesi = subpartidaaux.map((subpartida)=>{
                    return(subpartida)
                })
                
                let newdataaux = {
                    data:item,
                    partida:item.partidas[index],
                    subpartida:item.partidas[index].subpartidas,
                    /* sub:item.partidas.subpartidas[index].nombre, */
                    nombreArea:item.nombreArea,
                    partidas:item.partidas[index].nombre,
                    subpartidas:<div >{estesi}</div>, //este es el contenedor de las subpartidas
                    id:item.id_area
                } 
                dataTable.push(newdataaux) 

            })

        })
        let auxdataTable = dataTable.reverse()
        return auxdataTable
    }

    return(
        <>
            <TablaGeneral
                titulo="Ingreso" 
                columnas={AREAS_GASTOS_COLUMNS}
                url={'areas'}  
                numItemsPagina={12}
                opciones={handleOpen}
                acciones={actionsGastos()}
                ProccessData={proccessData}
                reload={setReloadTable}
                >
            </TablaGeneral>

            <Modal size="lg" title={"Nuevo Ingreso"} show={modal.crear.show} handleClose={()=>handleCloseGastos ('crear')}>
                <ModalAgregar tipo= {key.eventKey} handleClose={()=>handleCloseGastos ('crear')} reload={reloadTable}/>
            </Modal>    

            <Modal size="lg" title={"Editar Ingreso"} show={modal.editarGastos.show} handleClose={()=>handleCloseGastos ('editarGastos')}>
                <ModalEditarGastos data={modal.editarGastos.data} handleClose={()=>handleCloseGastos ('editarGastos')} reload={reloadTable}/>
            </Modal>

            {/* <Modal size="lg" title={"Editar Sub partida"} show={modal.editarSubPartida.show} handleClose={()=>handleCloseGastos ('editarSubPartida')}>
                <ModalEditarSubPartida data={modal.editarSubPartida.data}/>
            </Modal> */}

        </>
    )
}