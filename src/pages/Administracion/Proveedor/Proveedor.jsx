import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'

//
import { connect } from 'react-redux'
import axios from 'axios'
import swal from 'sweetalert'
import { URL_DEV, GOLD, PROVEEDORES_COLUMNS } from '../../../constants'

// Functions
import { setOptions, setSelectOptions, setTextTable, setDateTable, setMoneyTable, setArrayTable, setFacturaTable, setAdjuntosList } from '../../../functions/setters'
import { errorAlert, waitAlert, forbiddenAccessAlert } from '../../../functions/alert'

//
import Layout from '../../../components/layout/layout'
import { Modal, ModalDelete } from '../../../components/singles'
import { Button , FileInput } from '../../../components/form-components'
import { faPlus, faTrash, faEdit, faMoneyBill, faFileAlt, faFileArchive, faMoneyBillWave, faReceipt, faEnvelopeOpenText } from '@fortawesome/free-solid-svg-icons'
import { ProveedorForm, FacturaForm } from '../../../components/forms'
import { DataTable } from '../../../components/tables'
import NewTable from '../../../components/tables/NewTable'
import { Small, B, Subtitle } from '../../../components/texts'
import Moment from 'react-moment'
import NumberFormat from 'react-number-format';
import { Form, ProgressBar } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class Proveedor extends Component{

    state = {
        modalDelete: false,
        lead: '',
        proveedor: '',
        proveedores: [],
        data:{
            proveedores: []
        }
    }

    componentDidMount(){
        const { authUser: { user : { permisos : permisos } } } = this.props
        const { history : { location: { pathname: pathname } } } = this.props
        const { history } = this.props
        const proveedor = permisos.find(function(element, index) {
            const { modulo: { url: url } } = element
            return pathname === url
        });
        if(!proveedor)
            history.push('/')
        this.getProveedoresAxios();
    }

    setProveedores = proveedores => {
        let aux = []
        proveedores.map( (proveedor) => {
            aux.push(
                {
                    actions: this.setActions(proveedor),
                    nombre: renderToString(setTextTable(proveedor.nombre)),
                    razonSocial: renderToString(setTextTable(proveedor.razon_social)),
                    rfc: renderToString(setTextTable(proveedor.rfc)),
                    contacto: renderToString(setArrayTable(
                        [
                            {'url': `tel:+${proveedor.telefono}`, 'text': proveedor.telefono},
                            {'url': `mailto:${proveedor.email}`, 'text': proveedor.email}
                        ]
                    )),
                    cuenta: renderToString(setArrayTable(
                        [
                            {'name': 'No. Cuenta', 'text': proveedor.numero_cuenta ? proveedor.numero_cuenta : 'Sin definir'},
                            {'name': 'Banco', 'text': proveedor.banco ? proveedor.banco.nombre: 'Sin definir'},
                            {'name': 'Tipo Cuenta', 'text': proveedor.tipo_cuenta? proveedor.tipo_cuenta.tipo: 'Sin definir'},
                        ]
                        )),
                    area: renderToString(setTextTable(proveedor.subarea ? proveedor.subarea.area.nombre: 'Sin definir')),
                    subarea: renderToString(setTextTable(proveedor.subarea ? proveedor.subarea.nombre : 'Sin definir')),
                    total: renderToString(setMoneyTable(proveedor.total)),
                    fecha: renderToString(setDateTable(proveedor.created_at)),
                    id: proveedor.id
                }
            )
        })
        return aux
    }

    setActions = proveedor => {
        let aux = []
        aux.push(
            {
                text: 'Editar',
                btnclass: 'success',
                iconclass: 'flaticon2-pen',
                action: 'edit',
                tooltip: {id:'edit', text:'Editar'}
            },
            {
                text: 'Eliminar',
                btnclass: 'danger',
                iconclass: 'flaticon2-rubbish-bin', 
                action: 'delete',
                tooltip: {id:'delete', text:'Eliminar', type:'error'}
            }
        )
        return aux
    }

    changePageEdit = (proveedor) => {
        const { history } = this.props
        history.push({
            pathname: '/administracion/proveedores/edit',
            state: { proveedor: proveedor}
        });
    }

    openModalDelete = proveedor => {
        this.setState({
            ... this.state,
            modalDelete: true,
            proveedor: proveedor
        })
    }

    handleCloseDelete = () => {
        this.setState({
            modalDelete: false,
            proveedor: ''
        })
    }

    async getProveedoresAxios(){
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'proveedores', { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { proveedores } = response.data
                const { data } = this.state
                data.proveedores = proveedores
                this.setState({
                    ... this.state,
                    proveedores: this.setProveedores(proveedores)
                })
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    forbiddenAccessAlert()
                }else{
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    
    async deleteProveedor(){
        const { access_token } = this.props.authUser
        const { proveedor } = this.state
        await axios.delete(URL_DEV + 'proveedores/' + proveedor.id, { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { proveedores } = response.data
                const { data } = this.state
                data.proveedores = proveedores
                this.setState({
                    ... this.state,
                    proveedores: this.setProveedores(proveedores),
                    data,
                    modalDelete: false,
                    proveedor: ''
                })
                swal({
                    title: '¡Listo 👋!',
                    text: response.data.message !== undefined ? response.data.message : 'El provedor fue eliminado con éxito.',
                    icon: 'success',
                    timer: 1500,
                    buttons: false
                })
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    forbiddenAccessAlert()
                }else{
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    render(){
        
        const { modalDelete, proveedores, data } = this.state

        return(
            <Layout active={'administracion'}  { ...this.props}>
                
                <NewTable columns = { PROVEEDORES_COLUMNS } data = { proveedores } 
                            title = 'Proveedores' subtitle = 'Listado de proveedores'
                            mostrar_boton={true}
                            abrir_modal={false}
                            url = '/administracion/proveedores/add'  
                            mostrar_acciones={true} 
                            actions = {{
                                'edit': {function: this.changePageEdit},
                                'delete': {function: this.openModalDelete}
                            }}
                            elements = { data.proveedores }
                            />
                

                <ModalDelete show = { modalDelete } handleClose = { this.handleCloseDelete } onClick = { (e) => { e.preventDefault(); waitAlert(); this.deleteProveedor() }}>
                    <Subtitle className="my-3 text-center">
                        ¿Estás seguro que deseas eliminar el proveedor?
                    </Subtitle>
                </ModalDelete>
                
            </Layout>
        )
    }
}


const mapStateToProps = state => {
    return{
        authUser: state.authUser
    }
}

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Proveedor);