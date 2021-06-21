import React, { Component } from 'react'
import { connect } from 'react-redux'
import Layout from '../../../components/layout/layout'
import NewTableServerRender from '../../../components/tables/NewTableServerRender'
import { BODEGA_COLUMNS, EQUIPOS_COLUMNS, URL_DEV } from '../../../constants'

class Bodega extends Component {

    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const module = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        if (!module)
            history.push('/')
    }

    setEquipos = (equipos) => {
        let aux = []
        equipos.forEach((equipo) => {
            
        })
        return []
    }

    render(){
        const { access_token } = this.props.authUser
        return(
            <Layout active = 'proyectos'  {...this.props}>
                <NewTableServerRender columns = { EQUIPOS_COLUMNS } title = 'Equipos' subtitle = 'Listado de equipos'
                    mostrar_boton = { true } abrir_modal = { false } url = '/proyectos/equipos/add' mostrar_acciones = { true }
                    actions = { { } } accessToken = { access_token } setter = { this.setEquipos } cardTable = 'cardTable_equipos'
                    urlRender = { `${URL_DEV}v1/proyectos/equipos` } idTable = 'kt_datatable_equipos'
                    cardTableHeader = 'cardTableHeader_equipos' cardBody = 'cardBody_equipos' />
            </Layout>
        )
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({ })

export default connect(mapStateToProps, mapDispatchToProps)(Bodega)