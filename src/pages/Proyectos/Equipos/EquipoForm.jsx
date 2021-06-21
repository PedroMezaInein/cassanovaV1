import axios from 'axios'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import Swal from 'sweetalert2'
import Layout from '../../../components/layout/layout'
import { URL_DEV } from '../../../constants'
import { errorAlert, printResponseErrorAlert, waitAlert } from '../../../functions/alert'
import { setSingleHeader } from '../../../functions/routers'
import { setOptions } from '../../../functions/setters'

class Bodega extends Component {

    state = {
        options: { proveedores: [], partidas:  [] }
    }

    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { match: { params: { action } } } = this.props
        const { history, location: { state } } = this.props
        const module = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url + '/' + action
        });
        if (!module)
            history.push('/')
        this.getOptions()
    }

    getOptions = async() => {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.options(`${URL_DEV}v1/proyectos/equipos`, { responseType: 'json', headers: setSingleHeader(access_token) }).then(
            (response) => {
                Swal.close()
                const { partidas, proveedores } = response.data
                const { options } = this.state
                options.proveedores = setOptions(proveedores, 'razon_social', 'id')
                options.partidas = setOptions(partidas, 'nombre', 'id')
                this.setState({ ...this.state, options })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    render(){
        const { access_token } = this.props.authUser
        return(
            <Layout active = 'proyectos'  {...this.props}>
                
            </Layout>
        )
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({ })

export default connect(mapStateToProps, mapDispatchToProps)(Bodega)