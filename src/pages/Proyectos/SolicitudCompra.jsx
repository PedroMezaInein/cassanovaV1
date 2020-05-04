import React, { Component } from 'react'

//
import { connect } from 'react-redux'
import axios from 'axios'
import swal from 'sweetalert'
import { URL_DEV, SOLICITUD_COMPRA_COLUMNS } from '../../constants'

// Functions
import { setOptions, setSelectOptions, setTextTable, setDateTable, setMoneyTable, setArrayTable, setFacturaTable, setAdjuntosList } from '../../functions/setters'

//
import Layout from '../../components/layout/layout'
import { Button } from '../../components/form-components'
import { Modal, ModalDelete } from '../../components/singles'
import { faPlus, faLink, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import { DataTable } from '../../components/tables'
import Subtitle from '../../components/texts/Subtitle'
import SolicitudCompraForm from '../../components/forms/proyectos/SolicitudCompraForm'

class SolicitudCompra extends Component{

    state = {
        modal: false,
        title: 'Nueva solicitud de compra',
        form:{
            proveedor: '',
            proyecto: '',
            area: '',
            subarea: '',
            empresa: '',
            descripcion: '',
            total: '',
            fecha: new Date(),
            tipoPago: 0,
            factura: 'Sin factura'
        },
        options:{
            proveedores: [],
            proyectos: [],
            empresas: [],
            areas: [],
            subareas: [],
            tiposPagos: []
        }
    }

    componentDidMount(){
        const { authUser: { user : { permisos : permisos } } } = this.props
        const { history : { location: { pathname: pathname } } } = this.props
        const { history } = this.props
        const solicitud = permisos.find(function(element, index) {
            const { modulo: { url: url } } = element
            return  pathname === '/' + url
        });
        if(!solicitud)
            history.push('/')
        this.getSolicitudesCompraAxios()
    }

    openModal = () => {
        this.setState({
            ... this.state,
            modal: true,
            title: 'Nueva solicitud de compra',
            form: this.clearForm()
        })
    }

    handleClose = () => {
        const { modal } = this.state
        this.setState({
            ... this.state,
            modal: !modal,
            form: this.clearForm()
        })
    }

    //Handle change
    onChange = e => {
        const {form} = this.state
        const {name, value} = e.target
        form[name] = value
        this.setState({
            ... this.state,
            form
        })
    }

    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map( (element) => {
            switch(element){
                case 'fecha':
                    form[element] = new Date()
                    break;
                case 'tipoPago':
                    form[element] = 0
                    break;
                case 'factura':
                    form[element] = 'Sin factura'
                    break;
                default:
                    form[element] = ''
                    break;
            }
        })
        return form
    }

    onSubmit = e => {
        e.preventDefault()
        const { title } = this.state
        swal({
            title: '¡Un momento!',
            text: 'La información está siendo procesada.',
            buttons: false
        })
        if(title === 'Editar solicitud de compra')
            this.addSolicitudCompraAxios()
        else
            this.addSolicitudCompraAxios()
    }

    //Setters
    setOptions = (name, array) => {
        const {options} = this.state
        options[name] = setOptions(array, 'nombre', 'id')
        this.setState({
            ... this.state,
            options
        })
    }

    //Async
    async getSolicitudesCompraAxios(){
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'solicitud-compra', { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { empresas, areas, tiposPagos, proveedores, proyectos } = response.data
                const { options } = this.state
                options['empresas'] = setOptions(empresas, 'name', 'id')
                options['proveedores'] = setOptions(proveedores, 'nombre', 'id')
                options['areas'] = setOptions(areas, 'nombre', 'id')
                options['proyectos'] = setOptions(proyectos, 'nombre', 'id')
                options['tiposPagos'] = setSelectOptions( tiposPagos, 'tipo' )
                this.setState({
                    ... this.state,
                    options
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
                text: 'Ocurrió un error desconocido catch, intenta de nuevo.' + error,
                icon: 'error'
            })
        })
    }

    async addSolicitudCompraAxios(){
        const { access_token } = this.props.authUser
        const { form } = this.state
        await axios.post(URL_DEV + 'solicitud-compra', form, { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                swal({
                    title: '¡FeliaddCcidades 🥳!',
                    text: response.data.message !== undefined ? response.data.message : 'La solicitud fue registrado con éxito.',
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
                text: 'Ocurrió un error desconocido catch, intenta de nuevo.' + error,
                icon: 'error'
            })
        })
    }

    render(){

        const { modal, title, form, options } = this.state

        return(
            <Layout active={'proyectos'}  { ...this.props}>
                <div className="text-right">
                    <Button className="small-button ml-auto mr-4" onClick={ (e) => { this.openModal() } } text='' icon = { faPlus } color="green" />
                </div>
                <DataTable columns = { SOLICITUD_COMPRA_COLUMNS } data= { [] }/>
                <Modal show = {modal} handleClose = { this.handleClose } >
                    <SolicitudCompraForm title = { title } form = { form } options = { options } 
                        setOptions = {this.setOptions}  onChange = { this.onChange }
                        onSubmit = { this.onSubmit } />
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

export default connect(mapStateToProps, mapDispatchToProps)(SolicitudCompra);