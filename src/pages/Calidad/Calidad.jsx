import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import Layout from '../../components/layout/layout'
import { connect } from 'react-redux'
import { URL_DEV, PROYECTOS_TICKETS } from '../../constants'
import { setTextTable, setDateTable, setLabelTable } from '../../functions/setters'
import NewTableServerRender from '../../components/tables/NewTableServerRender'
const $ = require('jquery');
class Calidad extends Component {
    state = {
        calidad: ''
    }
    componentDidMount() {
        const { authUser: { user: { permisos: permisos } } } = this.props
        const { history: { location: { pathname: pathname } } } = this.props
        const { history } = this.props
        const leads = permisos.find(function (element, index) {
            const { modulo: { url: url } } = element
            return pathname === url
        });
        if (!leads)
            history.push('/')
    }
    changePageSee = calidad => {
        const { history } = this.props
        history.push({
            pathname: '/calidad/calidad/see',
            state: { calidad: calidad },
            formeditado: 1
        });
    }
    setCalidad = calidad => {
        let aux = []
        calidad.map((calidad) => {
            aux.push(
                {
                    actions: this.setActions(calidad),
                    proyectos: renderToString(setTextTable(calidad.proyecto ? calidad.proyecto.nombre : '')),
                    cliente: renderToString(setTextTable(calidad.usuario ? calidad.usuario.name : '')),
                    estatus: renderToString(setLabelTable(calidad.estatus_ticket)),
                    tipo_trabajo: renderToString(setTextTable(calidad.tipo_trabajo ? calidad.tipo_trabajo.tipo : '')),
                    fecha: renderToString(setDateTable(calidad.created_at)),
                    descripcion: renderToString(setTextTable(calidad.descripcion)),
                    motivo: renderToString(setTextTable(calidad.motivo_cancelacion)),
                    id: calidad.id
                }
            )
        })
        return aux
    }
    setActions = () => {
        let aux = []
        aux.push(
            {
                text: 'Ver',
                btnclass: 'primary',
                iconclass: 'flaticon2-expand',
                action: 'see',
                tooltip: { id: 'see', text: 'Mostrar', type: 'success' },
            }
        )
        return aux
    }
    async getCalidadAxios() {
        var table = $('#kt_datatable_calidad').DataTable().ajax.reload();
    }
    render() {
        return (
            <Layout active={'calidad'}  {...this.props}>
                <NewTableServerRender
                    columns={PROYECTOS_TICKETS}
                    title='Calidad'
                    subtitle='Listado de tickets levantados'
                    mostrar_boton={false}
                    abrir_modal={false}
                    mostrar_acciones={true}
                    actions={{
                        'see': { function: this.changePageSee },
                    }}
                    idTable='kt_datatable_calidad'
                    cardTable='cardTable'
                    cardTableHeader='cardTableHeader'
                    cardBody='cardBody'
                    accessToken={this.props.authUser.access_token}
                    setter={this.setCalidad}
                    urlRender={URL_DEV + 'calidad'}
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

export default connect(mapStateToProps, mapDispatchToProps)(Calidad);