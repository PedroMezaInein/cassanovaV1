import React, { Component } from 'react'
import { connect } from 'react-redux'
import Layout from '../../../components/layout/layout'
import NewTableServerRender from '../../../components/tables/NewTableServerRender'
import { CONTRATOS_RRHH_COLUMNS, URL_DEV } from '../../../constants'
class ContratosRh extends Component {

    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const empleados = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        if (!empleados)
            history.push('/')
    }

    setContratos = contratos => {
        let aux = []
        contratos.forEach((contrato, key) => {
            aux.push({
                actions: this.setActions(contrato),
                empleado: contrato.empleado.nombre,
                periodo: contrato.indefinido === 1 ? 'Tiempo indefinido' : `${contrato.dias} días`,
                fecha_inicio: '-',
                fecha_fin: '-',
                estatus: contrato.terminado ? 'Terminado' : 'En curso',
                id: contrato.id
            })
        })
        return aux
    }

    setActions = () => {
        let aux = []
        return aux
    }
    
    render() {
        const { access_token } = this.props.authUser
        return (
            <Layout active = 'rh' { ...this.props } >
                <NewTableServerRender columns = { CONTRATOS_RRHH_COLUMNS } title = 'Contratos' subtitle = 'Listado de contratos' mostrar_boton = { true }
                    abrir_modal = { true } mostrar_acciones = { true } urlRender = { `${URL_DEV}v1/rh/contratos-rrhh` } accessToken = { access_token }
                    actions = { { 'delete': { function: this.openModalDelete }, 'see': { function: this.openModalSee } } } setter = { this.setContratos } 
                    idTable = 'kt_datatable_contratos_rrhh' cardTable = 'cardTable' cardTableHeader = 'cardTableHeader' cardBody = 'cardBody' />
            </Layout>
        )
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({ })

export default connect(mapStateToProps, mapDispatchToProps)(ContratosRh);