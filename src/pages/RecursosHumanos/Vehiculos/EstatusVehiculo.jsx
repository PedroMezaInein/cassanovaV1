import React, {useState, useEffect} from "react"
import { useSelector } from "react-redux";
import { apiPostForm, apiGet, apiPutForm } from '../../../functions/api';
import Swal from 'sweetalert2'
import { makeStyles } from '@material-ui/core/styles';
import Tabla from '../../../components/NewTables/TablaGeneral/TablaGeneral'
import Layout from '../../../components/layout/layout'

export default function EstatusVehiculos({ closeModal, rh, }) {
    const userAuth = useSelector((state) => state.authUser);

    const columnas = [
      { nombre: 'Solicitante', identificador: 'solicitante', sort: true, stringSearch: false},
      { nombre: 'Descripcion', identificador: 'descripcion', sort: true, stringSearch: false},
      { nombre: 'Estatus', identificador: 'estatus', sort: true, stringSearch: false},
      { nombre: 'Comentarios', identificador: 'comentarios', sort: true, stringSearch: false},
    ]

    const proccessData = () => {
      let aux = []
      aux.push(
        {
          solicitante: 'Sulem Pastrana',
          descripcion: 'Solicito camioneta para revisión de obra en Puebla',
          estatus: 'Aprobada',
          comentarios: 'La camioneta se encuentra en buenas condiciones y limpia, favor de revisar e informar cualquier anomalia'
        },
       
      )
      aux=aux.reverse()
      return aux
    }

    return (
        <>
          <Tabla
            titulo="Estatus" 
            columnas={columnas}
            url={'requisicion'}  
            numItemsPagina={10}
            ProccessData={proccessData}
            // reload={setReloadTable}
            >
          </Tabla>
        </>
    )     
}