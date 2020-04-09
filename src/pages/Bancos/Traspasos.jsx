import React, { Component } from 'react'
import Layout from '../../components/layout/layout'
import { connect } from 'react-redux'
import { faPlus, faTrash, faEdit, faPaperclip, faTimes } from '@fortawesome/free-solid-svg-icons'
import { Button, Select, SelectSearch } from '../../components/form-components'
import { Modal } from '../../components/singles'
import axios from 'axios'
import swal from 'sweetalert'
import { URL_DEV, CUENTAS_COLUMNS, EDOS_CUENTAS_COLUMNS_2, DARK_BLUE, TRASPASOS_COLUMNS } from '../../constants'
import { CuentaForm, TraspasoForm } from '../../components/forms'
import Moment from 'react-moment'
import { Small, Subtitle, B } from '../../components/texts'
import DataTable from '../../components/tables/Data'
import NumberFormat from 'react-number-format';
import { Form, Badge } from 'react-bootstrap'
import Input from '../../components/form-components/Input'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class Traspasos extends Component{

    state = {
        modal: false,
        modalDelete: false,
        cuentas: [],
        form:{
            cantidad: '',
            comentario: '',
            origen: '',
            destino: '',
            fecha: new Date(),
            adjunto: '',
            adjuntoFile: '',
            adjuntoName: ''
        },
        traspasos: [],
        traspaso: ''
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
        this.getTraspasos()
    }

    // Form

    onchange = e => {
        const { form } = this.state
        const { name, value } = e.target
        form[name] = value
        this.setState({
            ... this.state,
            form
        })
        console.log(name, value, 'Traspaso on change')
    }

    onChangeAdjunto = e => {
        const { value, files } = e.target
        const { form } = this.state
        form['adjunto'] = value
        form['adjuntoFile'] = files[0]
        form['adjuntoName'] = files[0].name
        this.setState({
            ... this.state,
            form
        })
    }

    deleteAdjunto = () => {
        const { form } = this.state
        form['adjunto'] = ''
        form['adjuntoFile'] = ''
        form['adjuntoName'] = ''
        this.setState({
            ... this.state,
            form
        })
    }

    onSubmit = e =>{
        e.preventDefault()
        const { origen, destino } = this.state.form
        if(origen === destino){
            swal({
                title: '¡Error!',
                text: 'La cuenta destino y origen son la misma',
                icon: 'error'
            })
        }else{
            swal({
                title: '¡Un momento!',
                text: 'Se está efectuando el traspaso.',
                buttons: false
            })
            this.addTraspasosAxios()
        }
            
    }

    onSubmitEdit = e =>{
        e.preventDefault()
        const { origen, destino } = this.state.form
        if(origen === destino){
            swal({
                title: '¡Error!',
                text: 'La cuenta destino y origen son la misma',
                icon: 'error'
            })
        }else{
            swal({
                title: '¡Un momento!',
                text: 'Se está efectuando el traspaso.',
                buttons: false
            })
            this.editTraspasosAxios()
        }
            
    }

    safeDelete = e => () =>{
        this.deleteTraspasoAxios()
    }


    cleanForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map( (element) => {
            switch(element){
                case 'fecha':
                    form[element] = new Date()
                default:
                    form[element] = ''
                    break;
            }
        })
        return form
    }

    // Modal

    handleClose = () => {
        const { modal } = this.state
        this.setState({
            ... this.state,
            modal: !modal,
            traspaso: '',
            form: this.cleanForm()

        })
    }

    handleCloseDelete = () => {
        const { modalDelete } = this.state
        this.setState({
            ... this.state,
            modalDelete: !modalDelete,
            traspaso: '',
            form: this.cleanForm()

        })
    }

    openModal = () => {
        this.setState({
            ... this.state,
            modal: true
        })
    }

    openEdit = e => traspaso => {
        e.preventDefault();
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map( (element) => {
            switch(element){
                case 'cantidad':
                case 'comentario':
                    form[element] = traspaso[element]
                    break;
                case 'origen':
                case 'destino':
                    console.log(traspaso[element], 'cuenta element')
                    form[element] = {value: traspaso[element].numero, name: traspaso[element].nombre}
                    form[element] = traspaso[element].nombre
                    console.log(form[element], 'form element')
                    break;
                case 'fecha':
                    console.log('?FEHCA', element)
                    form[element] = new Date(traspaso['created_at'])
                    break;
                case 'adjunto':
                    form['adjuntoName'] = traspaso['adjunto'] && traspaso['adjunto'].name
                    break;
                default:
                    form[element] = traspaso[element]
                    break;
            }
        })
        form['origen'] = traspaso['origen'].numero
        form['destino'] = traspaso['destino'].numero
        this.setState({
            ... this.state,
            modal: true,
            traspaso: traspaso,
            form
        })
    }

    openDelete = e => (traspaso) => {
        e.preventDefault();
        this.setState({
            ... this.state,
            modalDelete: true,
            traspaso: traspaso
        })
    }

    // Setters
    setTraspasos = traspasos => {
        let _aux = []
        traspasos.map( (traspaso) => {
            _aux.push({
                actions: this.setActions(traspaso),
                origen: this.setCuenta(traspaso.origen),
                destino: this.setCuenta(traspaso.destino),
                monto: this.setMoney(traspaso.cantidad),
                comentario: this.setText(traspaso.comentario),
                usuario: this.setText(traspaso.user.name),
                fecha: this.setDateTable(traspaso.created_at)
            })
        })
        this.setState({
            ... this.state,
            traspasos: _aux
        })
    }

    setActions = traspaso => {
        return(
            <>
                <div className="d-flex align-items-center flex-column flex-md-row">
                    <Button className="mx-2 my-2 my-md-0 small-button" onClick={(e) => this.openEdit(e)(traspaso)}  text='' icon={faEdit} 
                        color="transparent" />
                    <Button className="mx-2 my-2 my-md-0 small-button" onClick={(e) => this.openDelete(e)(traspaso) } text='' icon={faTrash} color="red" />
                </div>
                <div className="d-flex align-items-center flex-column flex-md-row">
                    {
                        traspaso.adjunto && 
                        <a href={traspaso.adjunto.url} target="_blank" className="">
                            <Button className="mx-2 my-2 my-md-0 small-button" onClick={(e) => console.log(traspaso)}  text='' icon={faPaperclip} 
                                color="transparent" />
                        </a>
                    }
                </div>
            </>
        )
    }

    setCuenta = cuenta => {
        return(
            <>
                <div>
                    <Small className="mr-2">
                        Nombre: 
                    </Small>
                    <Small color="gold">
                        <B>
                            {cuenta.nombre}
                        </B>
                    </Small>
                </div>
                <div>
                    <Small className="mr-2">
                        Número
                    </Small>
                    <Small color="gold">
                        <B>
                            {cuenta.numero}
                        </B>
                    </Small>
                </div>
            </>
        )
    }

    setText = text => {
        return(
            <Small>
                { text }
            </Small>
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

    setMoney = value => {
        return(
            <NumberFormat value = { value } displayType = { 'text' } thousandSeparator = { true } prefix = { '$' }
                    renderText = { value => <Small> { value } </Small> } />
        )
    }

    // AXIOS

    async getTraspasos(){
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'traspasos', { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { cuentas, traspasos } = response.data
                this.setTraspasos(traspasos)
                let aux =  []
                cuentas.map((cuenta, key) => {
                    aux.push({value: cuenta.numero, name: cuenta.nombre})
                })
                this.setState({
                    ... this.state,
                    cuentas: aux
                })
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    swal({
                        title: '¡Ups 😕!',
                        text: 'Parece que no has iniciado sesión',
                        icon: 'warning',
                        confirmButtonText: 'Inicia sesión'
                    });
                }else{
                    swal({
                        title: '¡Ups 😕!',
                        text: error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.' ,
                        icon: 'error',
                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups 😕!',
                text: 'Ocurrió un error desconocido catch, intenta de nuevo.',
                icon: 'error'
            })
        })
    }

    async addTraspasosAxios(){
        const { access_token } = this.props.authUser
        const { form } = this.state
        const data = new FormData();
        const aux = Object.keys(form)
        aux.map((element) => {
            if(element === 'fecha')
                data.append(element, (new Date(form[element])).toDateString())
            else{
                data.append(element, form[element])
            }
        })
        await axios.post(URL_DEV + 'traspasos', data, { headers: {Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization:`Bearer ${access_token}`, } }).then(
            (response) => {
                const { cuentas, traspasos } = response.data
                this.setTraspasos(traspasos)
                let aux =  []
                cuentas.map((cuenta) => {
                    aux.push({value: cuenta.numero, name: cuenta.nombre})
                })
                this.setState({
                    ... this.state,
                    modal: false,
                    cuentas: aux,
                    form: this.cleanForm,
                    traspaso: ''
                })
                swal.close()
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    swal({
                        title: '¡Ups 😕!',
                        text: 'Parece que no has iniciado sesión',
                        icon: 'warning',
                        confirmButtonText: 'Inicia sesión'
                    });
                }else{
                    swal({
                        title: '¡Ups 😕!',
                        text: error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.' ,
                        icon: 'error',
                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups 😕!',
                text: 'Ocurrió un error desconocido catch, intenta de nuevo.',
                icon: 'error'
            })
        })
    }

    async deleteTraspasoAxios(){
        const { access_token } = this.props.authUser
        const { traspaso } = this.state
        await axios.delete(URL_DEV + 'traspasos/' + traspaso.id, { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { cuentas, traspasos } = response.data
                this.setTraspasos(traspasos)
                let aux =  []
                cuentas.map((cuenta) => {
                    aux.push({value: cuenta.numero, name: cuenta.nombre})
                })
                this.setState({
                    ... this.state,
                    modalDelete: false,
                    cuentas: aux,
                    form: this.cleanForm,
                    traspaso: ''
                })
                swal({
                    title: '¡Listo 👋!',
                    text: response.data.message !== undefined ? response.data.message : 'Eliminaste el traspaso con éxito',
                    icon: 'success',
                    timer: 1500,
                    buttons: false
                })
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    swal({
                        title: '¡Ups 😕!',
                        text: 'Parece que no has iniciado sesión',
                        icon: 'warning',
                        confirmButtonText: 'Inicia sesión'
                    });
                }else{
                    swal({
                        title: '¡Ups 😕!',
                        text: error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.' ,
                        icon: 'error',
                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups 😕!',
                text: 'Ocurrió un error desconocido catch, intenta de nuevo.',
                icon: 'error'
            })
        })
    }

    async editTraspasosAxios(){
        const { access_token } = this.props.authUser
        const { form, traspaso } = this.state
        const data = new FormData();
        const aux = Object.keys(form)
        aux.map((element) => {
            if(element === 'fecha')
                data.append(element, (new Date(form[element])).toDateString())
            else{
                data.append(element, form[element])
            }
        })
        await axios.post(URL_DEV + 'traspasos/' + traspaso.id, data, { headers: {Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization:`Bearer ${access_token}`, } }).then(
            (response) => {
                const { cuentas, traspasos } = response.data
                this.setTraspasos(traspasos)
                let aux =  []
                cuentas.map((cuenta) => {
                    aux.push({value: cuenta.numero, name: cuenta.nombre})
                })
                this.setState({
                    ... this.state,
                    modal: false,
                    cuentas: aux,
                    form: this.cleanForm,
                    traspaso: ''
                })
                swal.close()
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    swal({
                        title: '¡Ups 😕!',
                        text: 'Parece que no has iniciado sesión',
                        icon: 'warning',
                        confirmButtonText: 'Inicia sesión'
                    });
                }else{
                    swal({
                        title: '¡Ups 😕!',
                        text: error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.' ,
                        icon: 'error',
                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups 😕!',
                text: 'Ocurrió un error desconocido catch, intenta de nuevo.',
                icon: 'error'
            })
        })
    }

    render(){

        const { modal, modalDelete, cuentas, form, traspasos, traspaso } = this.state

        return(
            <Layout active={'bancos'}  { ...this.props}>
                <div className="text-right">
                    <Button className="small-button ml-auto mr-4" onClick={ (e) => { this.openModal() } } text='' icon={faPlus} color="green" />
                </div>
                <DataTable columns = { TRASPASOS_COLUMNS } data = { traspasos } />
                <Modal show = { modal } handleClose={ this.handleClose } >
                    <TraspasoForm cuentas = { cuentas } form = { form } onChange = { this.onchange } onChangeAdjunto = { this.onChangeAdjunto } 
                        deleteAdjunto = { this.deleteAdjunto } title = { traspaso === '' ? "Nuevo traspaso" : 'Editar traspaso'} 
                        onSubmit = { traspaso === '' ? this.onSubmit : this.onSubmitEdit } />
                </Modal>
                <Modal show = { modalDelete } handleClose={ this.handleCloseDelete } >
                    <Subtitle className="my-3 text-center">
                        ¿Estás seguro que deseas eliminar el traspaso?
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

export default connect(mapStateToProps, mapDispatchToProps)(Traspasos);