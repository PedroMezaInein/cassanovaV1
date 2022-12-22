import React, {useState} from 'react'
import { useSelector } from 'react-redux';
import Layout from '../../../components/layout/layout'
import Tabla from './../../../components/NewTables/TablaGeneral/TablaGeneral'
import { AREAS_EGRESOS_COLUMNS } from '../../../constants'
import { Modal } from '../../../components/singles'
import NuevaRequisicion from '../../../components/forms/administracion/NuevaRequisicion'


function Requisiciones () {

    const userAuth = useSelector((state) => state.authUser);
    const [modal, setModal] = useState({
        crear:false
    })

    let prop = {
        pathname: '/administracion/requisicion',
    }

    const columnas = [
        { nombre: 'Opciones', identificador: 'opciones', sort: true, stringSearch: true},
        { nombre: 'Solicitante', identificador: 'solicitante', sort: true, stringSearch: true},
        { nombre: 'Fecha', identificador: 'fecha', sort: true, stringSearch: true},
        { nombre: 'Departamento', identificador: 'departamento', sort: true, stringSearch: true},
        { nombre: 'Tipo de egreso', identificador: 'tipo_egreso', sort: true, stringSearch: true},
        { nombre: 'Descripcion', identificador: 'descripcion', sort: true, stringSearch: true},
    ]

    const proccessData = (e) => {
        // Imprime todo el objeto a ocupar 
        /* console.log('uno') */
        console.log(e)

        let aux = []
        for(let key in e.area){


            for(let area in e.area[key]){

                let auxPartidas = []

                for(let i in e.area[key][area]){

                    for(let idpartida in e.area[key][area][i]){

                        for(let partida in e.area[key][area][i][idpartida]){
                            // Imprime el nombre de cada partida
                            let auxSubpartida = []
                            
                            auxSubpartida.push({
                                id: e.area[key][area][i][idpartida][partida].id,
                                nombre: e.area[key][area][i][idpartida][partida].nombre,
                            })

                            auxPartidas.push({
                                id:idpartida,
                                nombre:partida,
                                subpartidas:auxSubpartida
                            })

                        }
                    }
                }

                let areas = {
                    nombreArea: area,
                    id_area: key,
                    partidas:auxPartidas,
                }
                
                aux.push(areas)
            }
        }
        console.log(aux)
        let dataTable = []

        aux.map(item =>{
            console.log(item)
            let subpartidaaux =[] 
            item.partidas[0].subpartidas.map(subpartida=>{
                subpartidaaux.push(<div>{subpartida.nombre}</div>)
            })
            let estesi = subpartidaaux.map((subpartida)=>{
                return(subpartida)
            })
            

            let newdataaux = {
                nombreArea:<div value={item.id} >{item.nombreArea}</div>,
                partidas:item.partidas[0].nombre,
                subpartidas:estesi,
                data: item
            }
            dataTable.push(newdataaux)

        })
        console.log(dataTable)
        return dataTable
    }

    let handleClose = (nombre_modal)=>{
        setModal({
            ...modal,
            crear: false
        })
    }

    let handleOpen = (nombre_modal)=>{
        setModal({
            ...modal,
            crear: true
        })
    }

    return (
        <>
            <Layout authUser={userAuth.acces_token} location={prop} history={{ location: prop }} active='administracion'>
                <Tabla
                    titulo="Requisicion" 
                    columnas={AREAS_EGRESOS_COLUMNS}
                    url={`areas`}
                    numItemsPagina={3}
                    ProccessData={proccessData}
                    opciones={[{nombre:'Agregar', funcion:()=>{handleOpen('crear')}}]}
                    // numItemsPagina={3} 
                    >
                    </Tabla>
            </Layout>
            <Modal size="lg" title={"Nueva requisicion"} show={modal.crear} handleClose={handleClose}>
                <NuevaRequisicion />
            </Modal>
        </>
        

    )
}

export { Requisiciones }
