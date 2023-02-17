import React, {useState, useEffect} from "react"
import { useSelector } from "react-redux";
import Swal from 'sweetalert2'
import Tabla from '../../../components/NewTables/TablaGeneral/TablaGeneral'
import { apiPutForm } from './../../../functions/api'
import ControlViaje from './../../RecursosHumanos/Vehiculos/ControlViaje'
import { Modal } from './../../../components/singles'

export default function SeguimientoViajes(props) {
    const { reload, startTravel, endTravel } = props
    const userAuth = useSelector((state) => state.authUser);
    const [reloadTable, setReloadTable] = useState()

    const [modal, setModal] = useState({
        control: {
            show: false,
            data: false
        }
    })

    const columnas = [
        { nombre: 'control de viaje', identificador: 'control_de_viaje', sort: false, stringSearch: false},
        { nombre: 'Solicitante', identificador: 'solicitante', sort: true, stringSearch: false},
        { nombre: 'Descripcion', identificador: 'comentarios', sort: true, stringSearch: false},
        { nombre: 'Fecha_inicio', identificador: 'fecha_inicio', sort: true, stringSearch: false},
        { nombre: 'Fecha_fin', identificador: 'fecha_fin', sort: true, stringSearch: false},
        { nombre: 'destino', identificador: 'destino', sort: true, stringSearch: false},
    ]

    const openModalControl = (e,viaje) => {
        setModal({
            control:{
                show: true,
                data: viaje
            }
        })
    }

    const travel = (viaje) => {
        // endTravel(viaje)
        // startTravel(viaje)
        return (
        <>
        {
            viaje.inicio_viaje ? 
            <>
            <div>
                <button className="btn btn-light-success btn-sm font-weight-bold" onClick={e=>openModalControl(e,viaje)}>Finalizar viaje</button>
            </div>
            </>
            :
            <>
            <div>
                {/* <button className="btn btn-light-success btn-sm font-weight-bold" onClick={ e=> startTravel(e, viaje)}>Iniciar viaje</button> */}
                <button className="btn btn-light-success btn-sm font-weight-bold" onClick={e=>openModalControl(e,viaje)}>Iniciar viaje</button>
            </div>
            </>
        }
        </>
        )
    }

    const handleClose = () => {
        setModal({
            control: {
                show: false,
                data: false
            }
        })
    }

  const proccessData = (data) => {
    console.log(data)
    let aux = []
  
    data.solicitudes.map((item)=>{ //item es cada iteracion que hay en este caso, cada solicitud creada
      aux.push({
        control_de_viaje: travel(item),
        solicitante: item.user.name,
        destino: item.destino ? item.destino : 'sin asignar',
        comentarios:item.comentarios ? item.comentarios : 'sin asignar',
        fecha_inicio:item.fecha_inicio ? item.fecha_inicio.slice(0,10) : 'asignar',
        fecha_fin:item.fecha_fin ? item.fecha_fin.slice(0,10) : 'asignar',
      })
    })
    
    aux=aux.reverse()
    return aux
  }

  return (
    <>
      <Tabla
        titulo="Viajes" 
        columnas={columnas}
        url={'vehiculos/usuario'} 
        numItemsPagina={10}
        ProccessData={proccessData}
        reload={setReloadTable}
        >
      </Tabla>

      
      <Modal size="sm" title={"Control de viaje"} show={modal.control.show} handleClose={e => handleClose(e)}>
        <ControlViaje data={modal.control.data} handleClose={e => handleClose(e)} reload={reloadTable}/>
      </Modal>
    </>
  )     
}