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
import { faPlus, faLink, faEdit, faTrash, faSync } from '@fortawesome/free-solid-svg-icons'
import { DataTable } from '../../components/tables'
import { Subtitle } from '../../components/texts'
import { ConceptoForm } from '../../components/forms'

class Conceptos extends Component{

    state = {
        modal: false,
        title: 'Nuevo concepto'
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
            title: 'Nuevo concepto'
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

    async getConceptosAxios(){
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'conceptos', { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { unidades, categorias, conceptos } = response.data
                console.log('Unidades', unidades)
                console.log('Categorias', categorias)
                console.log('Conceptos', conceptos)
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

        const { modal, title } = this.state

        return(
            <Layout active={'administracion'}  { ...this.props}>

                <div className="text-right">
                    <Button className="small-button ml-auto mr-4" onClick={ (e) => { this.openModal() } } text='' icon = { faPlus } color="green" />
                </div>

                <Modal show = {modal} handleClose = { this.handleClose } >
                    <ConceptoForm title = { title } />
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

export default connect(mapStateToProps, mapDispatchToProps)(Conceptos);