import React, { Component } from 'react'

//
import { connect } from 'react-redux'
import axios from 'axios'
import swal from 'sweetalert'
import { URL_DEV, CONCEPTOS_COLUMNS } from '../../constants'

// Functions
import { setOptions, setSelectOptions, setTextTable, setDateTable, setMoneyTable, setArrayTable, setFacturaTable, setAdjuntosList } from '../../functions/setters'

//
import Layout from '../../components/layout/layout'
import { Button } from '../../components/form-components'
import { Modal, ModalDelete } from '../../components/singles'
import { faPlus, faLink, faEdit, faTrash, faSync } from '@fortawesome/free-solid-svg-icons'
import { DataTable } from '../../components/tables'
import { Subtitle } from '../../components/texts'
import { ConceptoForm } from '../../components/forms'

class Conceptos extends Component{

    state = {
        modal: false,
        title: 'Nuevo concepto',
        options: {
            categorias: [],
            unidades: []
        },
        form: {
            unidad: '',
            categoria: '',
            descripcion: '',
            manoObra: '',
            herramienta: '',
            materiales: '',
            clave: '',
            costo: ''
        },
        conceptos: []
    }

    componentDidMount(){
        const { authUser: { user : { permisos : permisos } } } = this.props
        const { history : { location: { pathname: pathname } } } = this.props
        const { history } = this.props
        const conceptos = permisos.find(function(element, index) {
            const { modulo: { url: url } } = element
            return  pathname === '/' + url
        });
        if(!conceptos)
            history.push('/')
        this.getConceptosAxios()
    }

    openModal = () => {
        this.setState({
            ... this.state,
            modal: true,
            title: 'Nuevo concepto',
            form: this.clearForm()
        })
    }

    handleClose = () => {
        const { modal } = this.state
        this.setState({
            ... this.state,
            modal: !modal,
            title: 'Nuevo concepto'
        })
    }

    setConceptos = conceptos => {
        let aux = []
        conceptos.map( (concepto) => {
            aux.push(
                {
                    actions: '',
                    categoria: setTextTable(concepto.categoria.nombre),
                    clave: setTextTable(concepto.clave),
                    descripcion: setTextTable(concepto.descripcion),
                    unidad: setTextTable(concepto.unidad.nombre),
                    costo: setMoneyTable(concepto.costo),
                    materiales: setTextTable(concepto.materiales),
                    manoObra: setTextTable(concepto.mano_obra),
                    herramienta: setTextTable(concepto.herramienta),
                    
                }
            )
        })
        return aux
    }

    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map( (element) => {
            form[element] = ''
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
        if(title === 'Editar concepto de compra')
            console.log('HOLA')
        else
            this.addConceptoAxios()
    }

    onChange = e => {
        const {form} = this.state
        const {name, value} = e.target
        form[name] = value
        this.setState({
            ... this.state,
            form
        })
    }

    async getConceptosAxios(){
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'conceptos', { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { unidades, categorias, conceptos } = response.data
                const { options } = this.state
                options['unidades'] = setOptions(unidades, 'nombre', 'id')
                options['categorias'] = setOptions(categorias, 'nombre', 'id')
                this.setState({
                    ... this.state,
                    options,
                    conceptos: this.setConceptos(conceptos)
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

    async addConceptoAxios(){
        const { access_token } = this.props.authUser
        const { form } = this.state
        await axios.post(URL_DEV + 'conceptos', form, { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { conceptos } = response.data
                swal({
                    title: '¡Felicidades 🥳!',
                    text: response.data.message !== undefined ? response.data.message : 'La concepto fue registrado con éxito.',
                    icon: 'success',
                    timer: 1500,
                    buttons: false
                })
                this.setState({
                    ... this.state,
                    conceptos: this.setConceptos(conceptos),
                    modal:false,
                    title: 'Nuevo concepto',
                    form: this.clearForm()
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

        const { modal, title, form, options, conceptos } = this.state

        return(
            <Layout active={'administracion'}  { ...this.props}>

                <div className="text-right">
                    <Button className="small-button ml-auto mr-4" onClick={ (e) => { this.openModal() } } text='' icon = { faPlus } color="green" />
                </div>

                <Modal show = {modal} handleClose = { this.handleClose } >
                    <ConceptoForm title = { title } form  = { form } options = { options } 
                        onChange = { this.onChange } onSubmit = { this.onSubmit } />
                </Modal>

                <DataTable columns = { CONCEPTOS_COLUMNS } data = { conceptos } />
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

export default connect(mapStateToProps, mapDispatchToProps)(Conceptos);