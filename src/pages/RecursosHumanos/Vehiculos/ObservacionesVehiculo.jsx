import React, {useState, useEffect} from "react"
import { useSelector } from "react-redux";
import { apiPostForm, apiGet, apiPutForm } from '../../../functions/api';
import Tabla from '../../../components/NewTables/TablaGeneral/TablaGeneral'
import Modal from '../../../components/singles/Modal'
import Adjuntos from './Adjuntos'
import AgregarComentario from './AgregarComentario'

export default function SeguimientoViajes({ closeModal, rh, }) {
    const userAuth = useSelector((state) => state.authUser);

    const [modal, setModal] = useState({

        evidencias: {
            show: false,
            data: false
        },
        adjuntos: {
            show: false,
            data: false
        },
        comentario: {
            show: false,
            data: false
        },

    })

    const columnas = [
      { nombre: 'acciones', identificador: 'acciones', sort: false, stringSearch: false},
      { nombre: 'marca', identificador: 'marca', sort: false, stringSearch: false},
      { nombre: 'modelo', identificador: 'modelo', sort: false, stringSearch: false},
      { nombre: 'placa', identificador: 'placa', sort: false, stringSearch: false},
      { nombre: 'vehículo asignado', identificador: 'vehiculo_asignado', sort: false, stringSearch: false},
      { nombre: 'comentario', identificador: 'comentario', sort: false, stringSearch: false},
    ]

    let acciones = () => {
        let aux = [
            {
                nombre: 'evidencias',
                icono: 'fas fa-paperclip',
                color: 'blueButton',
                funcion: (item) => {
                    setModal({
                        ...modal,
                        adjuntos: {
                            show: true,
                            data: item
                        }
                    })
                }
            }, 
            {
                nombre: 'Adjuntos',
                icono: 'fas fa-paperclip',
                color: 'blueButton',
                funcion: (item) => {
                    setModal({
                        ...modal,
                        evidencias: {
                            show: true,
                            data: item
                        }
                    })
                }
            }, 
            {
                nombre: 'comentario',
                icono: 'fas fa-edit',
                color: 'blueButton',
                funcion: (item) => {
                    setModal({
                        ...modal,
                        comentario: {
                            show: true,
                            data: item.data
                        }
                    })
                
                }
            },  
        ]
        return aux
    }

    let handleClose = (tipo) => () => {
        setModal({
            ...modal,
            [tipo]: {
                show: false,
                data: false
            }
        })
    }

    // const estadoVehiculo = () => {
    //     return (
    //         <>
    //             <div>
    //                 <button onClick={startAlert}>Agregar fotos</button>
    //             </div>
    //             <div>
    //                  <TextField
    //                     id="standard-multiline-static"
    //                     label="Comentario"
    //                     multiline
    //                     rows={4}
    //                     // defaultValue="Default Value"
    //                 />
    //             </div>
    //         </>
    //     )
    // }

    // const startAlert = () => {
    //     Swal.fire({
    //         title: '¿Quieres confirmar el inicio de tu viaje?',
    //         icon: 'question',
    //         showDenyButton: false,
    //         showCancelButton: true,
    //         confirmButtonText: 'Sí',
    //         // denyButtonText: `Don't save`,
    //       }).then((result) => {
    //         /* Read more about isConfirmed, isDenied below */
    //         if (result.isConfirmed) {
    //           Swal.fire('iniciado, ¡Buen viaje!', '', 'success')
    //         } else if (result.isDenied) {
    //           Swal.fire('Changes are not saved', '', 'info')
    //         }
    //     })
    // }

    const proccessData = () => {
      let aux = []
      aux.push(
        {
            vehiculo_asignado: 'camioneta 1',
            marca: 'camioneta 1',
            modelo: '2022',
            placa: 'mxp-018',
            comentario: 'vnb uireshg7584h gdjfnxv',
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
            acciones={acciones()}
            numItemsPagina={10}
            ProccessData={proccessData}
            // reload={setReloadTable}
            >
          </Tabla>

            <Modal size="lg" title={"Adjuntos"} show={modal.adjuntos.show} handleClose={handleClose('adjuntos')}>
                <Adjuntos data={modal.adjuntos.data} />
            </Modal>

            <Modal size="sm" title={"comentario"} show={modal.comentario.show} handleClose={handleClose('comentario')}>
                <AgregarComentario data={modal.comentario.data} />
            </Modal>
        </>
    )     
}