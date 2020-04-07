import React, { Component } from 'react'
import Layout from '../../components/layout/layout'
import { connect } from 'react-redux'
import { Modal } from '../../components/singles'
import { Button } from '../../components/form-components'
import { faPlus, faTrash, faEdit, faMoneyBill, faFileAlt } from '@fortawesome/free-solid-svg-icons'
import { IngresosForm } from '../../components/forms'
import axios from 'axios'
import { URL_DEV, PROVEEDORES_COLUMNS, GOLD } from '../../constants'
import { DataTable } from '../../components/tables'
import { Small, B, Subtitle } from '../../components/texts'
import { FileInput } from '../../components/form-components'
import Moment from 'react-moment'
import NumberFormat from 'react-number-format';
import swal from 'sweetalert'
import { Form } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ProveedorForm from '../../components/forms/administracion/ProveedorForm'


class Proveedor extends Component{

    state = {
        modal: false,
        modalDelete: false,
        title: '',
        lead: '',
        proveedor: '',
        form:{
            nombre: '',
            razonSocial: '',
            correo: '',
            telefono: '',
            cuenta: '',
            numCuenta: '',
            tipo: 0,
            banco: 0,
            leadId: '',
            area: '',
            subarea: '',
        },
        proveedores: [],
        areas: [],
        subareas: [],
        bancos: [],
        tipos: []
    }

    constructor(props){
        super(props);
        const { state } = props.location
        if(state){
            this.state.modal = true
            this.state.title = 'Lead a convertir'
            this.state.form.leadId = state.lead
            this.getLeadAxios(state.lead)
        }
    }

    componentDidMount(){
        const { authUser: { user : { permisos : permisos } } } = this.props
        const { history : { location: { pathname: pathname } } } = this.props
        const { history } = this.props
        const proveedor = permisos.find(function(element, index) {
            const { modulo: { url: url } } = element
            return  pathname === '/' + url
        });
        if(!proveedor)
            history.push('/')
        this.getProveedoresAxios();
    }

    openModal = () => {
        const { form } = this.state
        this.setState({
            ... this.state,
            form: this.clearForm(),
            modal: true,
            lead: '',
            title: 'Agregar un nuevo proveedor'
        })
    }

    openModalEdit = (e) => proveedor => {
        const { form } = this.state
        let {subareas} = this.state

        form['nombre'] = proveedor.nombre
        form['razonSocial'] = proveedor.razon_social
        form['correo'] = proveedor.email
        form['telefono'] = proveedor.telefono

        form['cuenta'] = proveedor.cuenta
        form['numCuenta'] = proveedor.numCuenta

        form['banco'] = proveedor.banco ? proveedor.banco.id : 0
        form['tipo'] = proveedor.tipo_cuenta ? proveedor.tipo_cuenta.id : 0

        let aux = []
        if(proveedor.subarea)
            proveedor.subarea.area.subareas.map((subarea) => {
                aux.push( { value: subarea.id.toString(), name: subarea.nombre } )
            })
        subareas = aux
        form.area = proveedor.subarea ? proveedor.subarea.area.id.toString() : ''
        form.subarea = proveedor.subarea ? proveedor.subarea.id.toString() : ''

        this.setState({
            ... this.state,
            title: 'Editar proveedor',
            form,
            modal: true,
            subareas,
            proveedor: proveedor
        })
    }

    openModalDelete = (e) => proveedor => {
        const { form } = this.state
        
        this.setState({
            ... this.state,
            modalDelete: true,
            proveedor: proveedor
        })
    }

    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map( (element) => {
            switch(element){
                case 'tipo':
                case 'banco':
                    form[element] = 0
                    break;
                default:
                    form[element] = ''
                    break;
            }
        })
        return form
    }

    onChange = e => {
        const { form } = this.state
        const { value, name } = e.target
        form[name] = value
        this.setState({
            ... this.state,
            form
        })
    }

    onSubmit = e => {
        e.preventDefault()
        const { title } = this.state
        swal({
            title: '¡Un momento!',
            text: 'La información está siendo procesada.',
            buttons: false
        })
        if(title === 'Editar proveedor')
            this.updateProveedorAxios()
        else
            this.addProveedorAxios()
    }

    setProveedores = proveedores => {
        let aux = []
        proveedores.map( (proveedor) => {
            aux.push(
                {
                    actions: this.setActionsTable(proveedor),
                    nombre: this.setTextTable(proveedor.nombre),
                    razonSocial: this.setTextTable(proveedor.razon_social),
                    contacto: this.setLinksTable(
                        [
                            {'link': `tel:+${proveedor.telefono}`, 'value': proveedor.telefono},
                            {'link': `mailto:${proveedor.email}`, 'value': proveedor.email}
                        ]
                    ),
                    cuenta: this.setArrayTextTable(
                        [
                            {'text': 'Cuenta', 'value': proveedor.cuenta ? proveedor.cuenta: 'Sin definir'},
                            {'text': 'No. Cuenta', 'value': proveedor.numero_cuenta ? proveedor.numero_cuenta : 'Sin definir'},
                            {'text': 'Banco', 'value': proveedor.banco ? proveedor.banco.nombre: 'Sin definir'},
                            {'text': 'Tipo Cuenta', 'value': proveedor.tipo_cuenta? proveedor.tipo_cuenta.tipo: 'Sin definir'},
                        ]
                        ),
                    area: this.setTextTable(proveedor.subarea ? proveedor.subarea.area.nombre: 'Sin definir'),
                    subarea: this.setTextTable(proveedor.subarea ? proveedor.subarea.nombre : 'Sin definir'),
                    total: this.setMoneyTable(proveedor.total),
                    fecha: this.setDateTable(proveedor.created_at)
                }
            )
        })
        return aux
    }
    setActionsTable = proveedor => {
        return(
            <>
                <div className="d-flex align-items-center flex-column flex-md-row">
                    <Button className="mx-2 my-2 my-md-0 small-button" onClick={(e) => this.openModalEdit(e)(proveedor)}  text='' icon={faEdit} 
                        color="transparent" />
                    <Button className="mx-2 my-2 my-md-0 small-button" onClick={(e) => this.openModalDelete(e)(proveedor) } text='' icon={faTrash} color="red" />
                </div>
            </>
        )
    }
    setArrayTextTable = arreglo => {
        return(
            <div>
                {
                    arreglo.map((element) => {
                        return(
                            <>
                                <Small className = "mr-1" >
                                    <B color = "gold">
                                        {element.text}: 
                                    </B>
                                </Small>
                                <Small>
                                    {element.value}
                                </Small>
                                <br />
                            </>
                        )
                    })
                }
            </div>
        )
    }
    setLinksTable = arreglo => {
        return(
            <div>
                {
                    arreglo.map((element) => {
                        return(
                            <>
                                <a href={element.link} target = "_blank">
                                    <Small color="gold">
                                        {element.value}
                                    </Small>
                                </a>
                                <br />
                            </>
                        )
                    })
                }
            </div>
        )
    }
    setTextTable = text => {
        return(
            <Small>
                {text}
            </Small>
        )
    }
    setMoneyTable = value => {
        return(
            <NumberFormat value = { value } displayType = { 'text' } thousandSeparator = { true } prefix = { '$' }
                    renderText = { value => <Small> { value } </Small> } />
        )
    }
    setDateTable = date => {
        return(
            <Small>
                <Moment format="DD/MM/YYYY">
                    {date}
                </Moment>
            </Small>
        )
    }

    setLeadForm = lead => {
        const { form } = this.state
        form['nombre'] = lead.nombre
        form['correo'] = lead.email
        form['telefono'] = lead.telefono
        this.setState({
            ... this.state,
            form
        })
    }

    setSubareas = (subareas) => {
        let aux = []
        subareas.map( (element) => {
            aux.push({ name: element['nombre'], value: element['id'].toString() } )
        })
        this.setState({
            ... this.state,
            subareas: aux
        })
    }

    setSelectOptions = (arreglo, value, name) => {
        let aux = []
        arreglo.map( (element) => {
            if(element.hasOwnProperty('subareas')){
                aux.push({ name: element[name], value: element[value].toString(), subareas: element['subareas'] } )
            }else
                aux.push({ name: element[name], value: element[value].toString() } )
            
        })
        return aux
    }

    setOptions = (arreglo, name) => {
        let aux = []
        arreglo.map((element) => {
            aux.push({
                value: element.id,
                text: element[name]
            })
        })
        return aux
    }

    handleClose = () => {
        this.setState({
            form: this.clearForm(),
            modal: false,
            lead: '',
            title: '',
            proveedor: ''
        })
    }

    handleCloseDelete = () => {
        this.setState({
            modalDelete: false,
            proveedor: ''
        })
    }

    safeDelete = (e) => () => {
        e.preventDefault();
        this.deleteProveedor();
    }

    async getProveedoresAxios(){
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'proveedores', { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { areas, proveedores, bancos, tipos_cuentas } = response.data
                this.setState({
                    ... this.state,
                    areas: this.setSelectOptions(areas, 'id', 'nombre'),
                    bancos: this.setOptions(bancos, 'nombre'),
                    tipos: this.setOptions(tipos_cuentas, 'tipo'),
                    proveedores: this.setProveedores(proveedores)
                })
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    swal({
                        title: '¡Ups!',
                        text: 'Parece que no has iniciado sesión',
                        icon: 'warning',
                        confirmButtonText: 'Inicia sesión'
                    });
                }else{
                    swal({
                        title: '¡Ups!',
                        text: 'Ocurrió un error desconocido, intenta de nuevo.' + error.response.data.message,
                        icon: 'error',
                        
                    })
                }
            }
        ).catch((error) => {
            console.log('Catch error')
            console.log(error)
            swal({
                title: '¡Ups!',
                text: 'Ocurrió un error desconocido catch, intenta de nuevo.',
                icon: 'error',
                
            })
        })
    }

    async addProveedorAxios(){
        const { access_token } = this.props.authUser
        const { form } = this.state
        await axios.post(URL_DEV + 'proveedores', form, { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { proveedores } = response.data
                this.setState({
                    ... this.state,
                    proveedores: this.setProveedores(proveedores),
                    form: this.clearForm(),
                    modal: false,
                    title: '',
                    lead: ''
                })
                swal({
                    title: '¡Felicidades!',
                    text: 'El provedor fue registrado con éxito',
                    icon: 'success',
                    timer: 1500,
                    buttons: false
                })
            },
            (error) => {
                console.log(error.response.data.message, 'error')
                if(error.response.status === 401){
                    swal({
                        title: '¡Ups!',
                        text: 'Parece que no has iniciado sesión',
                        icon: 'warning',
                        confirmButtonText: 'Inicia sesión'
                    });
                }else{
                    swal({
                        title: '¡Ups!',
                        text: 'Ocurrió un error desconocido, intenta de nuevo.' + error.response.data.message,
                        icon: 'error',
                        
                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups!',
                text: 'Ocurrió un error desconocido catch, intenta de nuevo.',
                icon: 'error',
                
            })
        })
    }

    async updateProveedorAxios(){
        const { access_token } = this.props.authUser
        const { form, proveedor } = this.state
        await axios.put(URL_DEV + 'proveedores/' + proveedor.id, form, { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { proveedores } = response.data
                this.setState({
                    ... this.state,
                    proveedores: this.setProveedores(proveedores),
                    form: this.clearForm(),
                    modal: false,
                    title: '',
                    lead: ''
                })
                swal({
                    title: '¡Felicidades!',
                    text: 'El provedor fue registrado con éxito',
                    icon: 'success',
                    timer: 1500,
                    buttons: false
                })
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    swal({
                        title: '¡Ups!',
                        text: 'Parece que no has iniciado sesión',
                        icon: 'warning',
                        confirmButtonText: 'Inicia sesión'
                    });
                }else{
                    swal({
                        title: '¡Ups!',
                        text: 'Ocurrió un error desconocido, intenta de nuevo.' + error.response.data.message,
                        icon: 'error',
                        
                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups!',
                text: 'Ocurrió un error desconocido catch, intenta de nuevo.',
                icon: 'error',
                
            })
        })
    }

    async deleteProveedor(){
        const { access_token } = this.props.authUser
        const { proveedor } = this.state
        await axios.delete(URL_DEV + 'proveedores/' + proveedor.id, { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { proveedores } = response.data
                this.setState({
                    ... this.state,
                    proveedores: this.setProveedores(proveedores),
                    form: this.clearForm(),
                    modalDelete: false,
                    proveedor: ''
                })
                swal({
                    title: '¡Felicidades!',
                    text: 'El provedor fue eliminado con éxito',
                    icon: 'success',
                    timer: 1500,
                    buttons: false
                })
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    swal({
                        title: '¡Ups!',
                        text: 'Parece que no has iniciado sesión',
                        icon: 'warning',
                        confirmButtonText: 'Inicia sesión'
                    });
                }else{
                    swal({
                        title: '¡Ups!',
                        text: 'Ocurrió un error desconocido, intenta de nuevo.' + error.response.data.message,
                        icon: 'error',
                        
                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups!',
                text: 'Ocurrió un error desconocido catch, intenta de nuevo.',
                icon: 'error',
                
            })
        })
    }

    async getLeadAxios(lead){
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'lead/' + lead, { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { lead } = response.data
                this.setState({
                    ... this.state,
                    lead: this.setLeadForm(lead)
                })
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    swal({
                        title: '¡Ups!',
                        text: 'Parece que no has iniciado sesión',
                        icon: 'warning',
                        confirmButtonText: 'Inicia sesión'
                    });
                }else{
                    swal({
                        title: '¡Ups!',
                        text: 'Ocurrió un error desconocido, intenta de nuevo.' + error.response.data.message,
                        icon: 'error',
                        
                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups!',
                text: 'Ocurrió un error desconocido catch, intenta de nuevo.',
                icon: 'error',
                
            })
        })
    }


    render(){
        
        const { modal, modalDelete, form, title, tipos, areas, subareas, bancos, proveedores } = this.state

        return(
            <Layout active={'administracion'}  { ...this.props}>
                
                <div className="text-right">
                    <Button className="small-button ml-auto mr-4" onClick={ (e) => { this.openModal() } } text='' icon = { faPlus } color="green" />
                </div>
                
                <DataTable columns = { PROVEEDORES_COLUMNS } data = { proveedores } />

                <Modal show = { modal } handleClose={ this.handleClose } >
                    <ProveedorForm form = {form} onChangeForm = {this.onChange} title = {title} tipos={tipos} 
                        areas = {areas} subareas = {subareas} setSubareas = {this.setSubareas} bancos = {bancos}
                        onSubmit = {this.onSubmit}/>
                </Modal>
                <Modal show = { modalDelete } handleClose={ this.handleCloseDelete } >
                    <Subtitle className="my-3 text-center">
                        ¿Estás seguro que deseas eliminar el proveedor?
                    </Subtitle>
                    <div className="d-flex justify-content-center mt-3">
                        <Button icon='' onClick = { this.handleCloseDelete } text="Cancelar" className="mr-3" color="green"/>
                        <Button icon='' onClick = { (e) => { this.safeDelete(e)() }} text="Continuar" color="red"/>
                    </div>
                </Modal>
                
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