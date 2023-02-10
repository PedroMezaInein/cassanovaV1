import React, {useState, useEffect} from "react"
import { useSelector } from "react-redux";
import { apiPostForm, apiGet, apiPutForm } from '../../../functions/api';
import Swal from 'sweetalert2'
import { makeStyles } from '@material-ui/core/styles';
import Tabla from '../../../components/NewTables/TablaGeneral/TablaGeneral'
import Layout from '../../../components/layout/layout'

export default function SeguimientoViajes({ closeModal }) {
    const userAuth = useSelector((state) => state.authUser);

    const columnas = [
      { nombre: 'control de viaje', identificador: 'control_de_viaje', sort: false, stringSearch: false},
      { nombre: 'Solicitante', identificador: 'solicitante', sort: true, stringSearch: false},
      { nombre: 'Descripcion', identificador: 'comentarios', sort: true, stringSearch: false},
      { nombre: 'Fecha_inicio', identificador: 'fecha_inicio', sort: true, stringSearch: false},
      { nombre: 'Fecha_fin', identificador: 'fecha_fin', sort: true, stringSearch: false},
      { nombre: 'destino', identificador: 'destino', sort: true, stringSearch: false},
    ]

    const travelButton = () => {
        return (
            <>
                <div>
                    <button className="btn btn-light-success btn-sm font-weight-bold"  onClick={startAlert}>Iniciar viaje</button>
                </div>
                <div>
                    <button className="btn btn-light-danger btn-sm font-weight-bold"  onClick={endAlert}>Finalizar viaje</button>
                </div>
            </>
        )
    }

    const startAlert = () => {
        Swal.fire({
            title: '¿Quieres confirmar el inicio de tu viaje?',
            icon: 'question',
            showDenyButton: false,
            showCancelButton: true,
            confirmButtonText: 'Sí',
            // denyButtonText: `Don't save`,
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              Swal.fire('iniciado, ¡Buen viaje!', '', 'success')
            } else if (result.isDenied) {
              Swal.fire('Changes are not saved', '', 'info')
            }
        })
    }

    const endAlert = () => {
        Swal.fire({
            title: '¿Estás seguro de finalizar el viaje?',
            icon: 'question',
            showDenyButton: false,
            showCancelButton: true,
            confirmButtonText: 'Sí',
            // denyButtonText: `Don't save`,
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              Swal.fire('Viaje finalizado', '', 'success')
            } else if (result.isDenied) {
              Swal.fire('Changes are not saved', '', 'info')
            }
        })
    }

    const proccessData = (data) => {
      console.log(data)
      let aux = []
      // aux.push(
      //   {
      //     solicitante: 'Sulem Pastrana',
      //     descripcion: 'Solicito camioneta para revisión de obra en Puebla',
      //     fecha_inicio: '10-03-2023 10:00 a.m',
      //     fecha_fin: '11-03-2023 03:30 p.m',
      //     control_de_viaje: travelButton(),
      //     destino: 'Blvrd Nte 2210, Las Hadas Mundial 86, 72070 Puebla, Pue.'
      //   }
      // )
      data.solicitudes.map((item)=>{ //item es cada iteracion que hay en este caso, cada solicitud creada
        aux.push({
          solicitante: item.user.name,
          destino: item.destino,
          comentarios:item.comentarios,
          hora_inicio: item.hora_inicio,
          hora_fin: item.hora_fin,
          fecha_inicio:item.fecha_inicio
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
            // reload={setReloadTable}
            >
          </Tabla>
        </>
    )     
}