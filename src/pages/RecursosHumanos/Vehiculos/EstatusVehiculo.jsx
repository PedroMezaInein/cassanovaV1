import React, {useState, useEffect} from "react"
import { useSelector } from "react-redux";
import { apiPostForm, apiGet } from '../../../functions/api';
import Swal from 'sweetalert2'
import { makeStyles } from '@material-ui/core/styles';
import Tabla from '../../../components/NewTables/TablaGeneral/TablaGeneral'
import Layout from '../../../components/layout/layout'

export default function EstatusVehiculos({ closeModal, rh, }) {
    const userAuth = useSelector((state) => state.authUser);

    const columnas = [
      { nombre: 'Solicitante', identificador: 'solicitante', sort: true, stringSearch: false},
      { nombre: 'destino', identificador: 'destino', sort: true, stringSearch: false},
      { nombre: 'Estatus', identificador: 'estatus', sort: true, stringSearch: false},
      { nombre: 'Comentarios', identificador: 'comentarios', sort: true, stringSearch: false},
    ]

    const proccessData = (data) => {
      let aux = []
      data.solicitudes.map((item)=>{
        aux.push({
          solicitante: item.user.name,
          destino: item.destino,
          estatus: item.estatus === '1' ? 'aceptado' : 'rechazado',
          comentarios: item.comentarios ? item.comentarios : 'sin asignar'
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