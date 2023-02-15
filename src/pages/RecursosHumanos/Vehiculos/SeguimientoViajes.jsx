import React, {useState, useEffect} from "react"
import { useSelector } from "react-redux";
import Swal from 'sweetalert2'
import Tabla from '../../../components/NewTables/TablaGeneral/TablaGeneral'
import { apiPutForm } from './../../../functions/api'

export default function SeguimientoViajes(props) {
  const { reload } = props
  const userAuth = useSelector((state) => state.authUser);
  const [reloadTable, setReloadTable] = useState()

  const columnas = [
    { nombre: 'control de viaje', identificador: 'control_de_viaje', sort: false, stringSearch: false},
    { nombre: 'Solicitante', identificador: 'solicitante', sort: true, stringSearch: false},
    { nombre: 'Descripcion', identificador: 'comentarios', sort: true, stringSearch: false},
    { nombre: 'Fecha_inicio', identificador: 'fecha_inicio', sort: true, stringSearch: false},
    { nombre: 'Fecha_fin', identificador: 'fecha_fin', sort: true, stringSearch: false},
    { nombre: 'destino', identificador: 'destino', sort: true, stringSearch: false},
  ]

  const travel = (viaje) => {
    return (
      <>
      {
        viaje.inicio_viaje ? 
        <>
          <div>
            <button className="btn btn-light-success btn-sm font-weight-bold" onClick={e=>endTravel(e,viaje)}>Finalizar viaje</button>
          </div>
        </>
        :
        <>
          <div>
            {/* <button className="btn btn-light-success btn-sm font-weight-bold" onClick={ e=> startTravel(e, viaje)}>Iniciar viaje</button> */}
            <button className="btn btn-light-success btn-sm font-weight-bold" onClick={e=>startTravel(e,viaje)}>Iniciar viaje</button>
          </div>
        </>
      }
      </>
    )
  }

  
  const startTravel = (e,viaje) => {
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
        Swal.fire({
          title: 'Cargando...',
          allowOutsideClick: false,
          onBeforeOpen: () => {
              Swal.showLoading()
          }
       }) 
      
      let now = new Date()

      let newForm = {
        inicio_viaje: now.getHours() + ':' + now.getMinutes()
      }

      apiPutForm(`vehiculos/viaje/${viaje.id}`, newForm, userAuth.access_token)
      // apiPutForm(`vehiculos/solicitud/edit/${viaje.id}`, newForm, userAuth.access_token)
      .then((response)=>{
          Swal.close()
          Swal.fire('iniciado, ¡Buen viaje!', '', 'success')
          if(reloadTable){
            reloadTable.reload()
          }
      }) 
      .catch((error)=>{  
          Swal.close()
          Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Ha ocurrido un error',
          })
      }) 
    } 
  })
  }

  const endTravel = (e, viaje) => {

	Swal.fire({
		title: '¿Estás seguro de concluir el viaje?',
		icon: 'question',
		showDenyButton: false,
		showCancelButton: true,
		confirmButtonText: 'Sí',
	  }).then((result) => {
		if (result.isConfirmed) {
			Swal.fire({
				title: 'Finalizando viaje...',
				allowOutsideClick: false,
				onBeforeOpen: () => {
					Swal.showLoading()
				}
			}) 
			
			let now = new Date()
	  
			let newForm = {
			  fin_viaje: now.getHours() + ':' + now.getMinutes()
			}
	  
			apiPutForm(`vehiculos/viaje/${viaje.id}`, newForm, userAuth.access_token)
			// apiPutForm(`vehiculos/solicitud/edit/${viaje.id}`, newForm, userAuth.access_token)
			.then((response)=>{
				Swal.close()
			   	Swal.fire('¡listo! has concluido con el viaje ', '', 'success')
				if(reloadTable){
					reloadTable.reload()
				}
			}) 
			.catch((error)=>{  
				Swal.close()
				Swal.fire({
					icon: 'error',
					title: 'Oops...',
					text: 'Ha ocurrido un error',
				})
			})
		  
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
    </>
  )     
}