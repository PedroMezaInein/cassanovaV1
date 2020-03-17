import React, { Component } from 'react'
import Layout from '../../components/layout/layout'
import { connect } from 'react-redux'
import { faPlus, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons'
import { Button } from '../../components/form-components'
import { Modal } from '../../components/singles'
import axios from 'axios'
import swal from 'sweetalert'
import { URL_DEV, CUENTAS_COLUMNS } from '../../constants'
import { CuentaForm } from '../../components/forms'
import Moment from 'react-moment'
import { Small, Subtitle, B } from '../../components/texts'
import DataTable from '../../components/tables/Data'
import NumberFormat from 'react-number-format';

class EstadosCuenta extends Component{

    state = {
        modal: false
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
        this.getEstadosCuenta()
    }


    // Modal

    handleClose = () => {
        const { modal } = this.state
        this.setState({
            modal: !modal
        })
    }

    openModal = () => {
        this.setState({
            modal: true
        })
    }

    // Axios

    // Get

    async getEstadosCuenta(){
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'cuentas', { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { bancos, estatus, tipo, cuentas } = response.data
                
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
        const { modal, modalDelete, bancos, estatus, tipos, form, cuentas, cuenta } = this.state
        return(
            <Layout active={'leads'}  { ...this.props}>
                <div className="text-right">
                    <Button className="small-button ml-auto mr-4" onClick={ (e) => { this.openModal() } } text='' icon={faPlus} color="green" />
                </div>
                <Modal show = { modal } handleClose={ this.handleClose } >
                    
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

export default connect(mapStateToProps, mapDispatchToProps)(EstadosCuenta);