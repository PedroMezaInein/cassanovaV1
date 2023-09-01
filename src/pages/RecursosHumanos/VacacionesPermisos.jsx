import {React, useState} from 'react'
import { useSelector } from 'react-redux'

import { Tabs, Tab } from 'react-bootstrap'
import { useEffect } from 'react'
import Swal from 'sweetalert2'
import axios from 'axios'
import $ from 'jquery'
import { dayDMY } from '../../functions/setters'

import { URL_DEV, SOLICITAR_VACACIONES_COLUMNS, SOLICITAR_PERMISOS_COLUMNS } from '../../constants'

import Layout from '../../components/layout/layout'
import { NewTable } from '../../components/NewTables'
import {setNaviIcon} from '../../functions/setters'

import '../../../src/styles/_vacacionesPermisos.scss'

function VacacionesPermisos () {

    const auth = useSelector(state => state.authUser.access_token)
    const [tabShow, setTabShow] = useState('vacaciones')
    let prop = {
        pathname: '/rh/vacaciones-permisos',
    }

    const handleSelect = (key) => {
        setTabShow(key)
        console.log(key)
    }

    // function acciones() {
    //     console.log('prueba')
    // }

    const reloadTablePermisos = () => {
        $(`#permisos_admin_table`).DataTable().ajax.reload()
    }
    
    const reloadTableVacaciones = () => {
        $(`#vacaciones_admin_table`).DataTable().ajax.reload()
    }

    const postPermisos = (body,id) => {
        axios.put(`${URL_DEV}permiso/solicitudes/autorizar/${id}`, body, { headers: { Authorization: `Bearer ${auth}` } })
        .then(response=>{
            reloadTablePermisos()
        })
    }

    const postVacaciones = (body,id) => {
        axios.put(`${URL_DEV}permiso/solicitudes/autorizar/vacaciones/${id}`, body, { headers: { Authorization: `Bearer ${auth}` } })
        .then(response=>{
            reloadTableVacaciones()
        })
    }

    const aceptarPermiso = (e, data)=>{
        e.preventDefault()
        console.log(data)

        Swal.fire({
            title: '¿Estás seguro de aceptar el permiso?',
            icon: 'question',
            input: 'textarea',
            showDenyButton: false,
            showCancelButton: true,
            confirmButtonText: 'Aceptar',
            // denyButtonText: `Don't save`,
            preConfirm: (value) => {
                if (!value) {
                  Swal.showValidationMessage(
                    'Por favor deja un comentario'
                  )
                }
            }
            
          }).then((result) => {
            console.log(result)
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                console.log(e)
                let form = {
                    estatus: 'pre_autorizado',
                    empleado_id: data.empleado_id,
                    id_permiso: data.id,
                    comentario: result.value
                }
                postPermisos(form,data.id)
                Swal.fire('Se aceptó el permiso', '', 'success') 
            }
            else if (result.isDenied) {
              Swal.fire('Changes are not saved', '', 'info')
            }
        })
    }

    const rechazarPermiso = (e, data)=>{
        e.preventDefault()
        console.log(data)
            Swal.fire({
            title: '¿Estás seguro de rechazar el permiso?',
            icon: 'warning',
            input: 'textarea',
            showDenyButton: false,
            showCancelButton: true,
            confirmButtonText: 'Aceptar',
            preConfirm: (value) => {
                if (!value) {
                  Swal.showValidationMessage(
                    'Por favor deja un comentario del porque rechazaste la solicitud'
                  )
                }
            }
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                let form = {
                    estatus: 'rechazado',
                    empleado_id: data.empleado_id,
                    id_permiso: data.id,
                    comentario: result.value
                }

                postPermisos(form,data.id)
                Swal.fire('Se rechazó el permiso', '', 'success')
            } 
            else if (result.isDenied) {
              Swal.fire('Changes are not saved', '', 'info')
            }
          })
    }

    const aceptarVacaciones = (e, data)=>{
        e.preventDefault()
        console.log(data)

        Swal.fire({
            title: '¿Estás seguro de aceptar las vacaciones?',
            icon: 'question',
            input: 'textarea',
            showDenyButton: false,
            showCancelButton: true,
            confirmButtonText: 'Aceptar',
            // denyButtonText: `Don't save`,
            preConfirm: (value) => {
                if (!value) {
                  Swal.showValidationMessage(
                    'Por favor deja un comentario'
                  )
                }
            }
            
          }).then((result) => {
            console.log(result)
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                console.log(e)
                let form = {
                    estatus: 'pre_autorizado',
                    empleado_id: data.empleado_id,
                    id_permiso: data.id,
                    comentario: result.value
                }
                postVacaciones(form,data.id)
                Swal.fire('Las vacaciones fueron aceptadas', '', 'success') 
            }
            else if (result.isDenied) {
              Swal.fire('Changes are not saved', '', 'info')
            }
        })
    }

    const rechazarVacaciones = (e, data)=>{
        e.preventDefault()
        console.log(data)
            Swal.fire({
            title: '¿Estás seguro de rechazar las vacaciones?',
            icon: 'warning',
            input: 'textarea',
            showDenyButton: false,
            showCancelButton: true,
            confirmButtonText: 'Aceptar',
            preConfirm: (value) => {
                if (!value) {
                  Swal.showValidationMessage(
                    'Por favor deja un comentario del porque rechazaste la solicitud'
                  )
                }
            }
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                let form = {
                    estatus: 'rechazado',
                    empleado_id: data.empleado_id,
                    id_permiso: data.id,
                    comentario: result.value
                }

                postVacaciones(form,data.id)
                Swal.fire('Se rechazó el permiso', '', 'success')
            } 
            else if (result.isDenied) {
              Swal.fire('Changes are not saved', '', 'info')
            }
          })
    }

    const setActionsPermisos = (data) => { 
        return (
            <div className="w-100 d-flex justify-content-center">
                <button className='btn-aceptar' onClick={e=>aceptarPermiso(e, data)} >
                    Aceptar
                </button>

                <button className='btn-rechazar' onClick={e=>rechazarPermiso(e, data)} >
                    Rechazar
                </button>
                {/* <DropdownButton
                    menualign="right" 
                    title = { <i className="fas fa-chevron-circle-down icon-md p-0"/> } 
                    id = 'dropdown-button-newtable' 
                >
                    <Dropdown.Item 
                        onClick={e=>aceptarPermiso(e, data)} 
                        className="text-hover-success dropdown-success" 
                    >
                        { setNaviIcon('flaticon2-pen', 'aceptar') }
                    </Dropdown.Item>

                    <Dropdown.Item 
                        onClick={e=>rechazarPermiso(e, data)} 
                        className="text-hover-danger dropdown-danger" 
                    >
                        { setNaviIcon('flaticon2-rubbish-bin', 'rechazar') }
                    </Dropdown.Item>               
                    
                </DropdownButton> */}
            </div>
        )
    }

    const setActionsVacaciones = (data) => { 
        return (
            <div className="w-100 d-flex justify-content-center">
                <button className='btn-aceptar' onClick={e=>aceptarVacaciones(e, data)} >
                    Aceptar
                </button>

                <button className='btn-rechazar' onClick={e=>rechazarVacaciones(e, data)} >
                    Rechazar
                </button>
                {/* <DropdownButton
                    menualign="right" 
                    title = { <i className="fas fa-chevron-circle-down icon-md p-0"/> } 
                    id = 'dropdown-button-newtable' 
                >
                    <Dropdown.Item 
                        onClick={e=>aceptarVacaciones(e, data)} 
                        className="text-hover-success dropdown-success" 
                    >
                        { setNaviIcon('flaticon2-pen', 'aceptar') }
                    </Dropdown.Item>

                    <Dropdown.Item 
                        onClick={e=>rechazarVacaciones(e, data)} 
                        className="text-hover-danger dropdown-danger" 
                    >
                        { setNaviIcon('flaticon2-rubbish-bin', 'rechazar') }
                    </Dropdown.Item>               
                    
                </DropdownButton> */}
            </div>
        )
    }

    function setDatosVacaciones(datos) {
        let aux = []
        datos ?
        datos.map((item) => { 
            // console.log(item)
         item.map((item2) => { 
            console.log(item2)
            aux.push({
                actions: setActionsVacaciones(item2),
                empleado: `
                    ${item2.empleado.nombre}
                    ${item2.empleado.apellido_paterno}
                    ${item2.empleado.apellido_materno}
                `,
                fecha_create: dayDMY(item2.created_at),
                fecha_inicio: dayDMY(item2.fecha_inicio)  ,
                fecha_fin: dayDMY(item2.fecha_fin) ,
                estado: item2.estatus,
            })
          })
        }) : <></>
        return aux
    }

    function setDatosPermisos(datos) {
        let aux = []
        datos ? 
        datos.map((item) => { 
            // console.log(item)
         item.map((item2) => { 
            console.log(item2)
            aux.push({
                actions: setActionsPermisos(item2),
                empleado: `
                    ${item2.empleado.nombre}
                    ${item2.empleado.apellido_paterno}
                    ${item2.empleado.apellido_materno}
                `,
                comentario: item2.comentarios,
                fecha_inicio: item2.fecha_inicio,
                fecha_fin: item2.fecha_fin,
                estado: item2.estatus
            })
          })
        })
        : <></>
        return aux
        
    }

    return (
        <Layout authUser={auth} location={prop} history={{ location: prop }} active='rh'>
        <Tabs defaultActiveKey={tabShow} mountOnEnter={true} unmountOnExit={true}  /*onSelect={key=>handleSelect(key)}*/>
                <Tab eventKey="vacaciones" title="Vacaciones">
                    <NewTable
                        columns={SOLICITAR_VACACIONES_COLUMNS}
                        title='Vacaciones'
                        subtitle='Solicitudes de vacaciones'
                        abrir_modal={false}
                        mostrar_acciones={true}
                        accessToken={auth}
                        isTab={false}
                        opciones={true}
                        cardBody='cardBody_admin'
                        cardTable='cardTable_admin'
                        cardTableHeader='cardTableHeader_admin'
                        tableName='vacaciones_admin_table'
                        urlRender={`${URL_DEV}permiso/solicitudes/aprovacaciones`}
                        setter={setDatosVacaciones}
                        // actions={{
                        //     'edit': { function: setDatosVacaciones}
                        // }}
                    />
                </Tab>
                <Tab eventKey="permisos" title="Permisos">
                    <NewTable 
                        columns={SOLICITAR_PERMISOS_COLUMNS}
                        title='Permisos'
                        subtitle='Solicitudes de permiso'
                        abrir_modal={false}
                        mostrar_acciones={true}
                        accessToken={auth}
                        isTab={false}
                        opciones={true}
                        cardBody='cardBody_admin'
                        cardTable='cardTable_admin'
                        cardTableHeader='cardTableHeader_admin'
                        tableName='permisos_admin_table'
                        urlRender={`${URL_DEV}permiso/solicitudes/aprobacion`}
                        setter={setDatosPermisos}
                    />
                </Tab>
            </Tabs>
        </Layout>
    )
}

export {VacacionesPermisos} ; 