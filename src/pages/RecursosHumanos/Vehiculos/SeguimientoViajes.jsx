import React, {useState, useEffect} from "react"
import { useSelector } from "react-redux";
import { apiPostForm, apiGet, apiPutForm } from '../../../functions/api';
import Swal from 'sweetalert2'
import { makeStyles } from '@material-ui/core/styles';
import Tabla from '../../../components/NewTables/TablaGeneral/TablaGeneral'
import Layout from '../../../components/layout/layout'

export default function SeguimientoViajes({ closeModal, rh, }) {
    const userAuth = useSelector((state) => state.authUser);

    const columnas = [
      { nombre: 'control de viaje', identificador: 'control_de_viaje', sort: false, stringSearch: false},
      { nombre: 'Solicitante', identificador: 'solicitante', sort: true, stringSearch: false},
      { nombre: 'Descripcion', identificador: 'descripcion', sort: true, stringSearch: false},
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

    const proccessData = () => {
      let aux = []
      aux.push(
        {
          solicitante: 'Sulem Pastrana',
          descripcion: 'Solicito camioneta para revisión de obra en Puebla',
          fecha_inicio: '10-03-2023 10:00 a.m',
          fecha_fin: '11-03-2023 03:30 p.m',
          control_de_viaje: travelButton(),
          destino: 'Blvrd Nte 2210, Las Hadas Mundial 86, 72070 Puebla, Pue.'
        }
      )
      aux=aux.reverse()
      return aux
    }

    return (
        <>
          <Tabla
            titulo="Viajes" 
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