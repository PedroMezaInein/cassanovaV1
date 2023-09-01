import React,{useState} from 'react';
import { useSelector } from 'react-redux'
import {Tabs, Tab, DropdownButton, Dropdown  } from 'react-bootstrap'
import Layout from '../../components/layout/layout'

import NewTableServerRender from '../../components/tables/NewTableServerRender'

import { URL_DEV } from '../../constants'

import {setNaviIcon} from '../../functions/setters'

export default function Permisos() {
    const auth = useSelector(state => state.authUser.access_token)
    const [tabShow, setTabShow] = useState('vacaciones')
    let prop = {
        pathname: '/rh/permisos-vacaciones',
    }

    const VACACIONES_COLUMNS = [
        { Header: 'OPCIONES', accessor: 'actions', customRender: true },
        { Header: 'Nombre', accessor: 'empleado', customRender: true },
        { Header: 'Aprovaciones', accessor: 'aprovaciones', customRender: true },
        { Header: 'Fecha inicio', accessor: 'fecha_inicio', customRender: true },
        { Header: 'Fecha Fin', accessor: 'Fecha_fin', customRender: true },
        { Header: 'Estado', accessor: 'estado', customRender: true },
    ]

    const PERMISOS_COLUMNS = [
        { Header: 'OPCIONES', accessor: 'actions', customRender: true  },
        { Header: 'Nombre', accessor: 'empleado', customRender: true },
        { Header: 'Aprovaciones', accessor: 'aprovaciones', customRender: true },
        { Header: 'Fecha inicio', accessor: 'fecha_inicio', customRender: true },
        { Header: 'Fecha Fin', accessor: 'Fecha_fin', customRender: true },
        { Header: 'Estado', accessor: 'estado', customRender: true },
    ]


    const handleSelect = (key) => {
        setTabShow(key)
    }
    
   

    function test3() {
        console.log('test3')
    }

    const setActionsVacaciones = () => { 
        return (
            <div className="w-100 d-flex justify-content-center">
                <DropdownButton menualign="right" title = { <i className="fas fa-chevron-circle-down icon-md p-0"/> } id = 'dropdown-button-newtable' >
                    <Dropdown.Item className="text-hover-success dropdown-success" 
                        >
                        { setNaviIcon('flaticon2-pen', 'editar') }
                    </Dropdown.Item>
                    <Dropdown.Item className="text-hover-danger dropdown-danger" 
                        >
                        { setNaviIcon('flaticon2-rubbish-bin', 'eliminar') }
                    </Dropdown.Item>               
                    <Dropdown.Item className="text-hover-info dropdown-info">
                        { setNaviIcon('flaticon-attachment', 'Adjuntos') }
                    </Dropdown.Item>
                    
                </DropdownButton>
            </div>
        )
    }

    const setActionsPermisos = () => { 
        return (
            <div className="w-100 d-flex justify-content-center">
                <DropdownButton menualign="right" title = { <i className="fas fa-chevron-circle-down icon-md p-0"/> } id = 'dropdown-button-newtable' >
                    <Dropdown.Item className="text-hover-success dropdown-success" 
                        >
                        { setNaviIcon('flaticon2-pen', 'editar') }
                    </Dropdown.Item>
                    <Dropdown.Item className="text-hover-danger dropdown-danger" 
                        >
                        { setNaviIcon('flaticon2-rubbish-bin', 'eliminar') }
                    </Dropdown.Item>               
                    <Dropdown.Item className="text-hover-info dropdown-info">
                        { setNaviIcon('flaticon-attachment', 'Adjuntos') }
                    </Dropdown.Item>
                    
                </DropdownButton>
            </div>
        )
    }

    function test2(datos) {
        console.log(datos)
        let aux = []
        datos.map((item) => { 
            console.log(item)
            aux.push({
                actions: setActionsVacaciones,
                empleado: `${item.empleado.nombre} ${item.empleado.apellido_paterno ? item.empleado.apellido_paterno : ''} ${item.empleado.apellido_materno ? item.empleado.apellido_materno : ''}`,
                fecha_inicio: item.id
            })
        })
        return aux
    }
    
    return (
        <Layout authUser={auth} location={prop} history={{ location: prop }} active='rh'>
            <Tabs defaultActiveKey={tabShow} onSelect={key=>handleSelect(key)}>
                <Tab eventKey="vacaciones" title="Vacaciones">
                    <NewTableServerRender
                        columns={VACACIONES_COLUMNS}
                        title='Vacaciones'
                        subtitle='Solicitudes de vacaciones'
                        abrir_modal={true}
                        mostrar_acciones={true}
                        accessToken={auth}
                        isTab={true}
                        cardBody='cardBody_admin'
                        cardTable='cardTable_admin'
                        cardTableHeader='cardTableHeader_admin'
                        idTable='vacaciones_admin_table'
                        urlRender={`${URL_DEV}directorio`}
                        setter={test2}
                        actions={{
                            'edit': { function: test3 }
                        }}
                    />
                </Tab>
                <Tab eventKey="permisos" title="Permisos">
                    <NewTableServerRender
                        columns={PERMISOS_COLUMNS}
                        title='Permisos'
                        subtitle='Solicitudes de permiso'
                        abrir_modal={false}
                        mostrar_acciones={true}
                        accessToken={auth}
                        isTab={false}
                        cardBody='cardBody_admin'
                        cardTable='cardTable_admin'
                        cardTableHeader='cardTableHeader_admin'
                        idTable='permisos_admin_table'
                        urlRender={`${URL_DEV}directorio`}
                        setter={test2}
                    />
                </Tab>
            </Tabs>
        </Layout>
    )
}






















// const aceptarPermiso = (e, data)=>{
//     e.preventDefault()
//     console.log(data)

//     Swal.fire({
//         title: '¿Estás seguro de aceptar el permiso?',
//         icon: 'question',
//         input: 'textarea',
//         showDenyButton: false,
//         showCancelButton: true,
//         confirmButtonText: 'Aceptar',
       
//         preConfirm: (value) => {
//             if (!value) {
//               Swal.showValidationMessage(
//                 'Por favor deja un comentario'
//               )
//             }
//         }
        
//       }).then((result) => {
//         console.log(result)
      
//         if (result.isConfirmed) {
//             console.log(e)
//             let form = {
//                 estatus: 'pre_autorizado',
//                 empleado_id: data.empleado_id,
//                 id_permiso: data.id,
//                 comentario: result.value
//             }
//             postPermisos(form,data.id)
//             Swal.fire('Se aceptó el permiso', '', 'success') 
//         }
//         else if (result.isDenied) {
//           Swal.fire('Changes are not saved', '', 'info')
//         }
//     })
// }

