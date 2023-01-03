import React, {useState} from 'react'
import { useSelector } from 'react-redux';
import Layout from '../../../components/layout/layout'
import Tabla from './../../../components/NewTables/TablaGeneral/TablaGeneral'
import { REQUISICIONES } from '../../../constants'
import { Modal } from '../../../components/singles'
import NuevaRequisicion from 
'../../../components/forms/administracion/NuevaRequisicion'
import useOptionsArea from '../../../hooks/useOptionsArea'

function Requisiciones () {

    const userAuth = useSelector((state) => state.authUser);
    const [modal, setModal] = useState({
        crear:false
    })

    useOptionsArea()

    let prop = {
        pathname: '/administracion/requisicion',
    }

    const proccessData = (datos) => {
        console.log('prueba')
        console.log(datos)

        let aux = []
        datos.Requisiciones.map((result) => {
            aux.push(
                {
                    solicitante: result.solicitante.name,
                    fecha: result.fecha,
                    departamento: result.departamento.nombre,
                    tipo_gasto: result.gasto ? result.gasto.nombre: 'no definido',
                    descripcion: result.descripcion
                }
            )
        })
        return aux
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
                    columnas={REQUISICIONES}
                    url={'requisicion'}  
                    numItemsPagina={10}
                    ProccessData={proccessData}
                    opciones={[{nombre:'Agregar', funcion:()=>{handleOpen('crear')}}]}
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