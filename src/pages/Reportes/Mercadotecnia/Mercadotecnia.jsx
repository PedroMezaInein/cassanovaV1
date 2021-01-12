import React, { Component } from 'react'
import { Card } from 'react-bootstrap'
import { renderToString } from 'react-dom/server'
import { connect } from 'react-redux'
import Layout from '../../../components/layout/layout'
import NewTableServerRender from '../../../components/tables/NewTableServerRender'
import { REPORTE_MERCA_COLUMNS, URL_DEV } from '../../../constants'
import { errorAlert, forbiddenAccessAlert, waitAlert } from '../../../functions/alert'
import { setOptions, setTextTable } from '../../../functions/setters'
import axios from 'axios'
import Swal from 'sweetalert2'
import { Modal } from '../../../components/singles'

class Mercadotecnia extends Component{

    state = {
        options: { empresas: [] },
        modal: false,
        title: 'Adjuntar reporte',
        form: {
            empresa: '',
            mes: '',
            año: '',
            adjuntos: {
                adjuntos: {
                    value: '',
                    placeholder: 'Adjunto',
                    files: []
                }
            }
        }
    }

    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const egresos = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        if (!egresos)
            history.push('/')
        this.getOptionsAxios()
    }

    setReportes = reportes => {
        let aux = []
        reportes.map((reporte) => {
            aux.push(
                {
                    actions: this.setActions(reporte),
                    empresa: renderToString(setTextTable( reporte.empresa ? reporte.empresa.name : '' ) ),
                    fecha: renderToString( setTextTable( reporte.mes + ' - ' + reporte.año) ),
                    reporte: renderToString( setTextTable('') ),
                    id: reporte.id
                }
            )
            return false
        })
        return aux
    }

    setActions = () => {
        let aux = []
        aux.push(
            {
                text: 'Editar',
                btnclass: 'success',
                iconclass: 'flaticon2-pen',
                action: 'edit',
                tooltip: { id: 'edit', text: 'Editar' }
            },
            {
                text: 'Eliminar',
                btnclass: 'danger',
                iconclass: 'flaticon2-rubbish-bin',
                action: 'delete',
                tooltip: { id: 'delete', text: 'Eliminar', type: 'error' }
            }
        )
        return aux
    }

    openModal = () => {
        this.setState({
            ...this.state,
            modal: true,
            title: 'Adjuntar reporte'
        })
    }

    getOptionsAxios = async () => {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'reportes/reporte-mercadotecnia/options', { headers: { Accept: '*/*', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
                const { empresas } = response.data
                const { options } = this.state
                options.empresas = setOptions(empresas, 'name', 'id')
                this.setState({
                    ...this.state,
                    options
                })
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    forbiddenAccessAlert()
                } else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    render(){
        const { title, modal } = this.state
        return(
            <Layout active = 'reportes' { ...this.props } >
                <Card className = 'card-custom' >
                    <Card.Header>
                        <div className = 'card-title'>
                            <h3 className = 'card-label'>
                                Reporte de ventas
                            </h3>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <NewTableServerRender columns = { REPORTE_MERCA_COLUMNS }
                            title = 'Reporte de mercadotecnia' subtitle = 'Listado de reporte de mercadotecnia'
                            mostrar_boton = { true } abrir_modal = { true } mostrar_acciones = { true }
                            onClick = { this.openModal } idTable = 'table_reporte_merca'
                            actions = {
                                {
                                    'edit': { function: this.openModalEdit },
                                    'delete': { function: this.openModalDelete },
                                }
                            } accessToken = { this.props.authUser.access_token }
                            setter = { this.setReportes } urlRender = { URL_DEV + 'reportes/reporte-mercadotecnia' }
                            cardTable = 'card_table_reporte_merca' cardTableHeader = 'card_table_header_reporte_merca'
                            cardBody = 'card_table_body'/>
                    </Card.Body>
                </Card>
                <Modal size = 'xl' title = { title } show = { modal } >

                </Modal>
            </Layout>
        )
    }
}

const mapDispatchToProps = (dispatch) => ({})
const mapStateToProps = (state) => { return { authUser: state.authUser } }

export default connect(mapStateToProps, mapDispatchToProps)(Mercadotecnia)