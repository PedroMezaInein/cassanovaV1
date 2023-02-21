import React from "react"
import { useSelector } from "react-redux";
import Tabla from '../../../components/NewTables/TablaGeneral/TablaGeneral'

export default function EstatusVehiculos() {
    const userAuth = useSelector((state) => state.authUser);

    const columnas = [
      { nombre: 'Solicitante', identificador: 'solicitante', sort: true, stringSearch: false},
      { nombre: 'destino', identificador: 'destino', sort: false, stringSearch: false},
      { nombre: 'Estatus', identificador: 'estatus', sort: false, stringSearch: false},
      { nombre: 'autorizacion', identificador: 'autorizacion', sort: false, stringSearch: false},
      { nombre: 'Comentarios', identificador: 'comentarios', sort: false, stringSearch: false},
    ]

    const proccessData = (data) => {
      let aux = []
      data.solicitudes.map((item)=>{
        aux.push({
          solicitante: item.user.name,
          destino: item.destino,
          estatus: item.estatus === '1' && item.autorizacion ? 'aceptado' : item.estatus === '1' && !item.autorizacion ? 'pendiente' : 'rechazado',
          comentarios: item.comentarios ? item.comentarios : 'sin asignar',
          autorizacion: item.autorizacion ? item.autorizacion.name : 'pendiente'
        })
      })
      aux=aux.reverse()
      return aux
    }

    return (
        <>
          <Tabla
            titulo="Estatus" 
            columnas={columnas}
            url={'vehiculos/solicitudes/user'}  
            numItemsPagina={10}
            ProccessData={proccessData}
            // reload={setReloadTable}
            >
          </Tabla>
        </>
    )     
}