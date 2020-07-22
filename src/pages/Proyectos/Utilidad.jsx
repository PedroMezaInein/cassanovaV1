import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import { connect } from 'react-redux'
import axios from 'axios' 
import { URL_DEV, UTILIDADES_COLUMNS} from '../../constants'
import { setTextTable, setMoneyTable, setPercentTable} from '../../functions/setters'
import { errorAlert, forbiddenAccessAlert } from '../../functions/alert'
import Layout from '../../components/layout/layout'
import NewTable from '../../components/tables/NewTable'

class Utilidad extends Component {

    state = {
        utilidades: [],
        data:{
            utilidades: []
        }
    }

    componentDidMount() {
        var element = document.getElementById("kt_datatable_utilidad");
        element.classList.remove("table-responsive");

        const { authUser: { user: { permisos: permisos } } } = this.props
        const { history: { location: { pathname: pathname } } } = this.props
        const { history } = this.props
        const proyectos = permisos.find(function (element, index) {
            const { modulo: { url: url } } = element
            return pathname === url
        })
        if (!proyectos)
            history.push('/')
        this.getUtilidadesAxios()
    }

    setUtilidades = utilidades => {
        let aux = []
        utilidades.map((utilidad) => {
            aux.push({
                proyecto: renderToString(setTextTable(utilidad.nombre)),
                ventas: renderToString(setMoneyTable(utilidad.ventas_count ? utilidad.ventas_count : 0)),
                compras: renderToString(setMoneyTable(utilidad.compras_count ? utilidad.compras_count : 0)),
                utilidad: renderToString(setMoneyTable(utilidad.ventas_count-utilidad.compras_count)),
                margen: utilidad.ventas_count > 0 ? 
                    renderToString(setPercentTable((utilidad.ventas_count-utilidad.compras_count)*100/utilidad.ventas_count))
                    : renderToString(setPercentTable(0)), 
                id: utilidad.id
            })
        })
        return aux
    }

    async getUtilidadesAxios(){
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'proyectos/utilidad', { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { utilidades } = response.data
                const { data } = this.state
                data.utilidades = utilidades
                this.setState({
                    utilidades: this.setUtilidades(utilidades),
                    data
                })
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    forbiddenAccessAlert()
                }else{
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    render() {
        const { utilidades, data } = this.state
        return (
            <Layout active={'proyectos'}  {...this.props}>
                <NewTable 
                    columns = { UTILIDADES_COLUMNS } 
                    data = { utilidades }
                    title = 'Utilidad' 
                    subtitle = 'Listado de utilidad por proyecto'
                    mostrar_boton = { false }
                    abrir_modal = { false }
                    mostrar_acciones = { false }
                    elements = { data.utilidades }
                    idTable = 'kt_datatable_utilidad'
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