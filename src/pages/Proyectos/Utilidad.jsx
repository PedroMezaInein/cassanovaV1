import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import { connect } from 'react-redux'
import { URL_DEV, UTILIDADES_COLUMNS} from '../../constants'
import { setMoneyTable, setPercentTable, setTextTableCenter} from '../../functions/setters'
import Layout from '../../components/layout/layout'
import NewTableServerRender from '../../components/tables/NewTableServerRender'
import $ from "jquery";
class Utilidad extends Component {
    componentDidMount() { 
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const proyectos = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        })
        if (!proyectos)
            history.push('/')
    }

    setUtilidades = utilidades => {
        let aux = []
        utilidades.map((utilidad) => {
            aux.push({
                proyecto: renderToString(setTextTableCenter(utilidad.nombre)),
                ventas: renderToString(setMoneyTable(utilidad.ventas_count ? utilidad.ventas_count : 0)),
                compras: renderToString(setMoneyTable(utilidad.compras_count ? utilidad.compras_count : 0)),
                utilidad: renderToString(setMoneyTable(utilidad.ventas_count-utilidad.compras_count)),
                margen: utilidad.ventas_count > 0 ? 
                    renderToString(setPercentTable((utilidad.ventas_count-utilidad.compras_count)*100/utilidad.ventas_count))
                    : renderToString(setPercentTable(0)), 
                id: utilidad.id
            })
            return false
        })
        return aux
    }

    async getUtilidadesAxios(){
        $('#kt_datatable_utilidad').DataTable().ajax.reload();
    }

    render() {
        return (
            <Layout active={'administracion'}  {...this.props}>
                <NewTableServerRender
                    columns = { UTILIDADES_COLUMNS } 
                    title = 'Utilidad' 
                    subtitle = 'Listado de utilidad por proyecto'
                    mostrar_boton = { false }
                    abrir_modal = { false }
                    mostrar_acciones = { false }
                    idTable = 'kt_datatable_utilidad'
                    cardTable='cardTable'
                    cardTableHeader='cardTableHeader'
                    cardBody='cardBody'
                    accessToken = { this.props.authUser.access_token }
                    setter =  {this.setUtilidades }
                    urlRender = { URL_DEV + 'proyectos/utilidad'}
                />
            </Layout>
        )
    }
}

const mapStateToProps = state => {
    return {
        authUser: state.authUser
    }
}

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Utilidad);