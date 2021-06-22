import axios from 'axios'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import Layout from '../../../components/layout/layout'
import NewTableServerRender from '../../../components/tables/NewTableServerRender'
import { EQUIPOS_COLUMNS, URL_DEV } from '../../../constants'
import { deleteAlert, doneAlert, errorAlert, printResponseErrorAlert, waitAlert } from '../../../functions/alert'
import { setSingleHeader } from '../../../functions/routers'
import { setTextTableReactDom } from '../../../functions/setters'
import $ from "jquery";
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
            aux.push({
                actions: this.setActions(),
                id: equipo.id,
                equipo: setTextTableReactDom(equipo.equipo, this.doubleClick, equipo, 'equipo', 'text-center'),
                marca: setTextTableReactDom(equipo.marca, this.doubleClick, equipo, 'marca', 'text-center'),
                modelo: setTextTableReactDom(equipo.modelo, this.doubleClick, equipo, 'modelo', 'text-center'),
                proveedor: setTextTableReactDom(equipo.proveedor ? equipo.proveedor.razon_social : '', this.doubleClick, equipo, 'proveedor', 'text-center'),
                partida: setTextTableReactDom(equipo.partida ? equipo.partida.nombre : '', this.doubleClick, equipo, 'partida', 'text-center'),
                observaciones: setTextTableReactDom(equipo.observaciones, this.doubleClick, equipo, 'observaciones', 'text-center'),
                ficha: this.setFileLink(equipo.ficha_tecnica),
            })
        })
        return aux
    }

    setFileLink = liga => {
        if(liga)
            return(
                <div className="text-center">
                    <a href = {liga} target = '_blank' rel="noreferrer" className="btn btn-icon btn-xs btn-light-info mr-2 my-1 text-center">
                        <i className="flaticon-doc " />
                    </a>
                </div>
            )
        return(<></>)
    }

    setActions = () => {
        let aux = []
        aux.push(
            {
                text: 'Editar',
                btnclass: 'success',
                iconclass: 'flaticon2-pen',
                action: 'edit',
                tooltip: { id: 'edit', text: 'Editar' },
            },
            {
                text: 'Eliminar',
                btnclass: 'danger',
                iconclass: 'flaticon2-rubbish-bin',
                action: 'delete',
                tooltip: { id: 'delete', text: 'Eliminar', type: 'error' },
            }
        )
        return aux
    }

    doubleClick = (data, tipo) => {
        console.log(data, 'data')
        console.log(tipo, 'tipo')
    }

    changePageEdit = equipo => {
        const { history } = this.props
        history.push({ pathname: '/proyectos/equipos/edit', state: { equipo: equipo } });
    }

    openModalDelete = equipo => {
        deleteAlert('¿SEGURO DESEAS ELIMINAR EL EQUIPO?','', () => this.deleteEquipoAxios(equipo.id))
    }

    deleteEquipoAxios = async(id) => {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.delete(`${URL_DEV}v1/proyectos/equipos/${id}`, { responseType: 'json', headers: setSingleHeader(access_token) }).then(
            (response) => {
                doneAlert('Equipo eliminado con éxito')
                this.getEquiposAxios()
            }, (error) =>  { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    getEquiposAxios = async() => { $('#kt_datatable_equipos').DataTable().ajax.reload(); }

    render(){
        const { access_token } = this.props.authUser
        return(
            <Layout active = 'proyectos'  {...this.props}>
                <NewTableServerRender columns = { EQUIPOS_COLUMNS } title = 'Equipos' subtitle = 'Listado de equipos'
                    mostrar_boton = { true } abrir_modal = { false } url = '/proyectos/equipos/add' mostrar_acciones = { true }
                    actions = { { 'edit': { function: this.changePageEdit }, 'delete': { function: this.openModalDelete } } }
                    accessToken = { access_token } setter = { this.setEquipos } cardTable = 'cardTable_equipos'
                    urlRender = { `${URL_DEV}v1/proyectos/equipos` } idTable = 'kt_datatable_equipos'
                    cardTableHeader = 'cardTableHeader_equipos' cardBody = 'cardBody_equipos' />
            </Layout>
        )
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({ })

export default connect(mapStateToProps, mapDispatchToProps)(Bodega)