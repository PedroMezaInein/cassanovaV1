import {React, useState} from 'react'
import { useSelector } from 'react-redux'

import { Tabs, Tab } from 'react-bootstrap'
import Swal from 'sweetalert2'
import axios from 'axios'
import $ from 'jquery'
import { dayDMY } from '../../functions/setters'
import { URL_DEV, SOLICITAR_VACACIONES_COLUMNS, SOLICITAR_PERMISOS_COLUMNS, AUTORIZAR_PERMISOS_COLUMNS } from '../../constants'
import Layout from '../../components/layout/layout'
import { NewTable } from '../../components/NewTables'

import '../../../src/styles/_vacacionesPermisos.scss'

function VacacionesPermisos () {

    const auth = useSelector(state => state.authUser.access_token)
    const [tabShow, setTabShow] = useState('vacaciones')
    let prop = {
        pathname: '/rh/vacaciones-permisos',
    }
    const moment = require('moment');


    const handleSelect = (key) => {
        setTabShow(key)
        // console.log(key)
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

    const reloadTableAutorizados = () => {
        $(`#autorizados_admin_table`).DataTable().ajax.reload()
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
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
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

    const adjuntos = (e, data)=>{
        e.preventDefault()

        const pdfUrl = data.adjuntos ? data.adjuntos[0].url : '';

        if (pdfUrl.toLowerCase().endsWith('.pdf')) {
            // Si el enlace es un archivo PDF, abrir el visor de PDF
            const pdfViewerUrl = 'https://mozilla.github.io/pdf.js/web/viewer.html?file=' + encodeURIComponent(pdfUrl);
            window.open(pdfViewerUrl, '_blank');
        } else {
            // Si no es un PDF, mostrar la imagen
            Swal.fire({
                imageUrl: pdfUrl,
                imageHeight: 600, // Ajusta la altura según tus necesidades
                imageAlt: "Image",
                width: 800, // Ajusta el ancho según tus necesidades
                showCloseButton: true, // Agrega un botón de cierre
                confirmButtonText: 'Cerrar', // Cambia el texto del botón de confirmación
                customClass: {
                    image: 'custom-image-class', // Agrega clases CSS personalizadas para la imagen
                    confirmButton: 'custom-confirm-button-class', // Agrega clases CSS personalizadas para el botón de confirmación
                },
            });
        }
      
    }

    const rechazarPermiso = (e, data)=>{
        e.preventDefault()
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
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
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
                <button className='btn-primary' onClick={e=>adjuntos(e, data)} >
                    Adjuntos
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
        let aux = [];
        datos ? 
        datos.map((item) => { 
            item.map((item2) => { 
                aux.push({
                    actions: setActionsPermisos(item2),
                    empleado: `
                        ${item2.empleado.nombre}
                        ${item2.empleado.apellido_paterno}
                        ${item2.empleado.apellido_materno}
                    `,
                    tipo_permiso: item2.tipo ? item2.tipo : '',
                    comentario: item2.comentarios,
                    fecha_inicio: item2.tipo === 'Todo dia' ||  item2.tipo === 'Llegar tarde' || item2.tipo === 'Salida anticipada'  ? 
                        moment(item2.fecha_inicio).format('YYYY-MM-DD') + ' / ' + item2.hora_entrada + ' - ' + item2.hora_salida :
                        moment(item2.fecha_fin).format('YYYY-MM-DD') + ' / ' + item2.hora_ir + ' - ' + item2.hora_regresar ,
                   
                    estado: item2.estatus
                });
            });
        })
        : <></>;
        return aux;
    }

    function setDatosPermisosautorizados(datos) {
        let aux = [];
        datos ? 
        datos.map((item) => { 
            item.map((item2) => { 
                aux.push({
                    actions: setActionsPermisos(item2),
                    empleado: `
                        ${item2.empleado.nombre}
                        ${item2.empleado.apellido_paterno}
                        ${item2.empleado.apellido_materno}
                    `,
                    tipo_permiso: item2.tipo ? item2.tipo : '',
                    comentario: item2.comentarios,
                    fecha_inicio: item2.tipo === 'Todo dia' ||  item2.tipo === 'Llegar tarde' || item2.tipo === 'Salida anticipada'  ? 
                        moment(item2.fecha_inicio).format('YYYY-MM-DD') + ' / ' + item2.hora_entrada + ' - ' + item2.hora_salida :
                        moment(item2.fecha_fin).format('YYYY-MM-DD') + ' / ' + item2.hora_ir + ' - ' + item2.hora_regresar ,
                   
                    estado: item2.estatus
                });
            });
        })
        : <></>;
        return aux;
        
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
                <Tab eventKey="autorizados" title="Permisos autorizados">
                    <NewTable 
                        columns={AUTORIZAR_PERMISOS_COLUMNS}
                        title='Permisos autorizados'
                        subtitle='Permisos autorizados'
                      
                        accessToken={auth}
                        isTab={false}
                        cardBody='cardBody_admin'
                        cardTable='cardTable_admin'
                        cardTableHeader='cardTableHeader_admin'
                        tableName='autorizados_admin_table'
                        urlRender={`${URL_DEV}permiso/solicitudes/autorizaciones`}
                        setter={setDatosPermisosautorizados}
                    />
                </Tab>
               

            </Tabs>
        </Layout>
    )
    
}

export {VacacionesPermisos} ; 