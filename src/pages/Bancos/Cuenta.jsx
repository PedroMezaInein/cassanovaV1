import React, { Component } from 'react'
import Layout from '../../components/layout/layout'
import { connect } from 'react-redux'
import { faPlus, faTrash, faEdit, faFile, faBox, faFolderPlus, faPaperclip, faTimes, faCheck } from '@fortawesome/free-solid-svg-icons'
import { Button, Input } from '../../components/form-components'
import { Modal } from '../../components/singles'
import axios from 'axios'
import swal from 'sweetalert'
import { URL_DEV, CUENTAS_COLUMNS, EDOS_CUENTAS_COLUMNS, DARK_BLUE } from '../../constants'
import { CuentaForm } from '../../components/forms'
import Moment from 'react-moment'
import { Small, Subtitle, B } from '../../components/texts'
import DataTable from '../../components/tables/Data'
import NumberFormat from 'react-number-format';
import { Form, Badge } from 'react-bootstrap'
import Calendar from '../../components/form-components/Calendar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class Cuentas extends Component{

    state = {
        modal: false,
        modalDelete: false,
        modalEstado: false,
        bancos: [],
        tipos: [],
        estatus: [],
        estados: [],
        empresas: [],
        form:{
            nombre: '',
            numero: '',
            descripcion: '',
            balance: 0.0,
            banco: '',
            tipo: '',
            estatus: '',
            empresa: 0
        },
        cuentas: [],
        cuenta: null,
        adjunto: '',
        adjuntoFile: '',
        adjuntoName: '',
        fecha: new Date()
    }

    componentDidMount(){
        const { authUser: { user : { permisos : permisos } } } = this.props
        const { history : { location: { pathname: pathname } } } = this.props
        const { history } = this.props
        const leads = permisos.find(function(element, index) {
            const { modulo: { url: url } } = element
            return  pathname === '/' + url
        });
        if(!leads)
            history.push('/')
        this.getCuentas()
    }

    //
    onChange = e => {
        const { name, value } = e.target
        console.log('Name', name)
        console.log('Value', value)
        const { form } = this.state
        form[name] = value
        this.setState({
            ... this.state,
            form
        })
    }

    onSubmit = e => {
        e.preventDefault()
        this.addCuentaAxios()
    }

    onSubmitEstado = e => {
        e.preventDefault()
        const { adjunto, adjuntoFile, adjuntoName } = this.state
        if(adjunto){
            swal({
                title: '¡Un momento!',
                text: 'Se está enviando tu estado de cuenta.',
                buttons: false
            })
            this.addEstadoAxios()
        }

    }

    onEditSubmit = e => {
        e.preventDefault()
        this.editCuentaAxios()
    }

    safeDelete = e => () => {
        this.deleteCuentaAxios()
    }

    onChangeAdjunto = (e) => {
        this.setState({
            ... this.state,
            adjuntoFile: e.target.files[0],
            adjunto: e.target.value,
            adjuntoName: e.target.files[0].name
        })
    }

    onChangeCalendar = date =>{
        this.setState({
            ... this.state,
            fecha: date
        })
    }

    deleteAdjunto = () => {
        this.setState({
            ... this.state,
            adjuntoFile: '',
            adjunto: '',
            adjuntoName: ''
        })
    }

    // Setters

    setEmptyForm = () => {
        return {
            nombre: '',
            numero: '',
            descripcion: '',
            empresa: '',
            balance: 0.0,
            banco: '',
            tipo: '',
            estatus: '',
            empresa: 0
        }
    }

    setCuentas = cuentas => {

        let aux = []
        cuentas.map((cuenta, key) => {
            aux.push( {
                
                actions: this.setActions( cuenta ),

                nombre: this.setText( cuenta.nombre ),
                numero: this.setText( cuenta.numero ),
                
                balance: this.setMoney( cuenta.balance ),

                descripcion: this.setText( cuenta.descripcion ),

                banco: this.setText( cuenta.banco.nombre ),
                tipo: this.setText( cuenta.tipo.tipo ),
                estatus: this.setText( cuenta.estatus.estatus ),
                empresa: this.setText(  cuenta.empresa ? cuenta.empresa.name : '' ),

                fecha: this.setDateTable( cuenta.created_at )
            } )
        })
        this.setState({
            ... this.state,
            cuentas: aux
        })
    }

    setEstados = estados => {

        let aux = []
        estados.map((estado, key) => {
            aux.push( {
                actions: this.setAction(estado.id),
                estado: this.setLinks( estado ),
                fecha: this.setDateTable( estado.created_at )
            } )
        })
        this.setState({
            ... this.state,
            estados: aux
        })
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

    setAction = (id) => {
        return(
            <>
                <div className="d-flex align-items-center flex-column flex-md-row">
                    <Button className="mx-2 my-2 my-md-0 small-button" text='' icon={faTrash} color="red" 
                        onClick = { () => {
                            swal({
                                title: '¿Estás seguro?',
                                icon: 'warning',
                                buttons: {
                                    cancel: {
                                        text: "Cancelar",
                                        value: null,
                                        visible: true,
                                        className: "button__green btn-primary cancel",
                                        closeModal: true,
                                    },
                                    confirm: {
                                        text: "Aceptar",
                                        value: true,
                                        visible: true,
                                        className: "button__red btn-primary",
                                        closeModal: true
                                    }
                                }
                            }).then((result) => {
                                if(result){
                                    this.deleteEstadoAxios(id)
                                }
                            })
                        }} />
                </div>
            </>
        )
    }

    setText = text => {
        return(
            <Small className="">
                { text }
            </Small>
        )
    }

    setMoney = value => {
        return(
            <NumberFormat value = { value } displayType = { 'text' } thousandSeparator = { true } prefix = { '$' }
                    renderText = { value => <Small> { value } </Small> } />
        )
    }

    setLinks = value => {
        return(
            <a href={value.url} target="_blank">
                <Small>
                    {
                        value.name
                    }
                </Small>        
            </a>
        )
    }

    setActions = cuenta => {
        return(
            <>
                <div className="d-flex align-items-center flex-column flex-md-row">
                    <Button className="mx-2 my-2 my-md-0 small-button" onClick={(e) => this.openModalEdit(e)(cuenta)}  text='' icon={faEdit} 
                        color="transparent" />
                    <Button className="mx-2 my-2 my-md-0 small-button" onClick={(e) => this.openModalDelete(e)(cuenta) } text='' icon={faTrash} color="red" />
                </div>
                <div className="d-flex align-items-center flex-column flex-md-row">
                    <Button className="mx-2 my-2 my-md-0 small-button" onClick={(e) => this.openModalAddEstado(e)(cuenta)}  text='' icon={faFolderPlus} 
                        color="transparent" />
                </div>
            </>
        )
    }

    setOptions = (array, name) => {
        const { form } = this.state
        let aux = []
        array.map((element, key) => {
            if(key === 0)
            {
                switch(name){
                    case 'nombre':
                        form['banco'] = element.id
                        break;
                    default:
                        form[name] = element.id
                        break;
                }
                this.setState({
                    ... this.state,
                    form
                })
            }
            aux.push({
                value: element.id,
                text: element[name]
            })
        })
        return aux
    }

    // Modal

    handleClose = () => {
        const { modal } = this.state
        this.setState({
            modal: !modal,
            cuenta: null
        })
    }

    handleDeleteModal = () => {
        const { modalDelete } = this.state
        this.setState({
            modalDelete: !modalDelete,
            cuenta: null
        })
    }

    handleEstadoClose = () => {
        const { modalEstado } = this.state
        this.setState({
            modalEstado: !modalEstado,
            cuenta: null,
            estados: [],
            fecha: new Date(),
            adjunto: '',
            adjuntoFile: '',
            adjuntoName: ''
        })
    }

    openModal = () => {
        this.setState({
            modal: true,
            cuenta: null
        })
    }

    openModalEdit = e => cuenta => {
        let aux = {
            nombre: cuenta.nombre,
            numero: cuenta.numero,
            descripcion: cuenta.descripcion,
            balance: cuenta.balance,
            banco: cuenta.banco ? cuenta.banco.id : '',
            tipo: cuenta.tipo ? cuenta.tipo.id : '',
            estatus: cuenta.estatus ? cuenta.estatus.id : '',
            empresa: cuenta.empresa ? cuenta.empresa.id : '',
        }
        
        this.setState({
            modal: true,
            cuenta:cuenta,
            form: aux
        })
    }

    openModalAddEstado = e => cuenta => {
        let aux = []
        cuenta.estados.map((estado, key) => {
            aux.push( {
                actions: this.setAction(estado.id),
                estado: this.setLinks( estado ),
                fecha: this.setDateTable( estado.created_at )
            } )
        })
        this.setState({
            modalEstado: true,
            cuenta:cuenta,
            estados: aux
        })
    }

    openModalDelete = e => cuenta => {
        
        this.setState({
            modalDelete: true,
            cuenta:cuenta
        })
    }

    // Axios

    // Get

    async getCuentas(){
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'cuentas', { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { bancos, estatus, tipo, cuentas, empresas } = response.data
                this.setCuentas(cuentas)
                this.setState({
                    bancos: this.setOptions(bancos, 'nombre'),
                    estatus: this.setOptions(estatus, 'estatus'),
                    tipos: this.setOptions(tipo, 'tipo'),
                    empresas: this.setOptions(empresas, 'name'),
                })
                
                console.log('state', this.state)
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
                        text: 'Ocurrió un error desconocido, intenta de nuevo.',
                        icon: 'error',
                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups!',
                text: 'Ocurrió un error desconocido catch, intenta de nuevo.',
                icon: 'error'
            })
        })
    }

    // Post

    async addCuentaAxios(){
        const { access_token } = this.props.authUser
        const { form } = this.state
        await axios.post(URL_DEV + 'cuentas', form, { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { cuentas } = response.data
                this.setCuentas(cuentas)
                this.setState({
                    modal: false,
                    form: this.setEmptyForm
                })
                swal({
                    title: '¡Felicidades!',
                    text: 'Cuenta agregada con éxito',
                    icon: 'success',
                    timer: 1500
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
                        text: 'Ocurrió un error desconocido, intenta de nuevo.',
                        icon: 'error',
                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups!',
                text: 'Ocurrió un error desconocido catch, intenta de nuevo.',
                icon: 'error'
            })
        })
    }

    async addEstadoAxios(){
        const { access_token } = this.props.authUser
        const { fecha, adjunto, adjuntoName, adjuntoFile, cuenta } = this.state
        const data = new FormData();
        data.append('adjunto', adjuntoFile)
        data.append('adjuntoName', adjuntoName)
        data.append('id', cuenta.id)
        await axios.post(URL_DEV + 'cuentas/estado', data, { headers: {Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { cuentas, cuenta } = response.data
                this.setCuentas(cuentas)
                this.setState({
                    adjunto: '',
                    adjuntoFile: '',
                    adjuntoName: '',
                    fecha: new Date()
                })
                this.setEstados(cuenta.estados)
                swal.close()
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
                        text: 'Ocurrió un error desconocido, intenta de nuevo.',
                        icon: 'error',
                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups!',
                text: 'Ocurrió un error desconocido catch, intenta de nuevo.',
                icon: 'error'
            })
        })
    }

    // PUT

    async editCuentaAxios(){
        const { access_token } = this.props.authUser
        const { cuenta, form } = this.state
        await axios.put(URL_DEV + 'cuentas/' + cuenta.id, form, { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { cuentas } = response.data
                this.setCuentas(cuentas)
                this.setState({
                    modal: false,
                    form: this.setEmptyForm,
                    cuenta: null
                })
                swal({
                    title: '¡Felicidades!',
                    text: 'Cuenta editada con éxito',
                    icon: 'success',
                    timer: 1500
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
                        text: 'Ocurrió un error desconocido, intenta de nuevo.',
                        icon: 'error',
                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups!',
                text: 'Ocurrió un error desconocido catch, intenta de nuevo.',
                icon: 'error'
            })
        })
    }

    //delete
    async deleteCuentaAxios(){
        const { access_token } = this.props.authUser
        const { cuenta, form } = this.state
        await axios.delete(URL_DEV + 'cuentas/' + cuenta.id, { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { cuentas } = response.data
                this.setCuentas(cuentas)
                this.setState({
                    modalDelete: false,
                    cuenta: null
                })
                swal({
                    title: '¡Felicidades!',
                    text: 'Cuenta eliminada con éxito',
                    icon: 'success',
                    timer: 1500
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
                        text: 'Ocurrió un error desconocido, intenta de nuevo.',
                        icon: 'error',
                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups!',
                text: 'Ocurrió un error desconocido catch, intenta de nuevo.',
                icon: 'error'
            })
        })
        
    }

    async deleteEstadoAxios(id){
        const { access_token } = this.props.authUser
        const { cuenta } = this.state
        await axios.delete(URL_DEV + 'cuentas/' + cuenta.id + '/estado/' + id, { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { cuentas, cuenta } = response.data
                this.setCuentas(cuentas)
                this.setEstados(cuenta.estados)
                
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
                        text: 'Ocurrió un error desconocido, intenta de nuevo.',
                        icon: 'error',
                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups!',
                text: 'Ocurrió un error desconocido catch, intenta de nuevo.',
                icon: 'error'
            })
        })
        
    }

    render(){
        const { modal, modalDelete, modalEstado, bancos, estatus, tipos, form, cuentas, cuenta, empresas, estados, adjunto, adjuntoName, fecha } = this.state
        return(
            <Layout active={'leads'}  { ...this.props}>
                <div className="text-right">
                    <Button className="small-button ml-auto mr-4" onClick={ (e) => { this.openModal() } } text='' icon={faPlus} color="green" />
                </div>
                <DataTable columns = { CUENTAS_COLUMNS } data = { cuentas } />
                
                <Modal show = { modal } handleClose={ this.handleClose } >
                    <CuentaForm title = { cuenta === null ? "Nueva cuenta" : 'Editar cuenta'} bancos = { bancos } estatus = { estatus } tipos = { tipos } 
                        empresas = { empresas } form = { form } onChange = { this.onChange } onSubmit = { cuenta === null ? this.onSubmit : this.onEditSubmit } />
                </Modal>
                <Modal show = { modalDelete } handleClose = { this.handleDeleteModal } >
                    <Subtitle className="my-3 text-center">
                        ¿Estás seguro que deseas eliminar la cuenta <B color="red">{cuenta && cuenta.nombre}</B>?
                    </Subtitle>
                    <div className="d-flex justify-content-center mt-3">
                        <Button icon='' onClick = { this.handleDeleteModal } text="Cancelar" className="mr-3" color="green"/>
                        <Button icon='' onClick = { (e) => { this.safeDelete(e)() }} text="Continuar" color="red"/>
                    </div>
                </Modal>
                <Modal show = { modalEstado } handleClose = { this.handleEstadoClose } >
                    <Subtitle className="my-3 text-center">
                        Estados de cuenta para <B color="gold">{cuenta && cuenta.nombre}</B>
                    </Subtitle>
                    <Form onSubmit = { this.onSubmitEstado } >
                        <div className="d-flex px-md-4">
                            <div className="d-flex align-items-center">
                                <div className="image-upload d-flex align-items-center">
                                    <div className="no-label">
                                        <Input
                                            onChange = {this.onChangeAdjunto}
                                            value = {adjunto}
                                            name="adjunto" 
                                            type="file" 
                                            id="adjunto"
                                            accept="application/pdf"/>
                                    </div>
                                    <label htmlFor="adjunto">
                                        <FontAwesomeIcon className = "p-0 font-unset mr-2" icon={ faPaperclip } color={ DARK_BLUE } />
                                    </label>
                                    {
                                        adjuntoName &&
                                            <Badge variant="light" className="d-flex px-3 align-items-center" pill>
                                                <FontAwesomeIcon icon={faTimes} onClick={ (e) => { e.preventDefault(); this.deleteAdjunto() } } className=" small-button mr-2" />
                                                {
                                                    adjuntoName
                                                }
                                            </Badge>
                                    }
                                </div>
                            </div>
                            {
                                adjuntoName && 
                                <div className="d-flex align-items-center justify-content-center">
                                    <Button className="ml-4" type="submit" text="Enviar" />
                                </div>
                            }
                                
                        </div>
                    </Form>
                    {
                        estados.length > 0 && <DataTable columns = { EDOS_CUENTAS_COLUMNS } data = { estados } />
                    }
                    
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

export default connect(mapStateToProps, mapDispatchToProps)(Cuentas);