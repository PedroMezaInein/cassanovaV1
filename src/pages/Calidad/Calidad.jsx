import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import Layout from '../../components/layout/layout'
import { connect } from 'react-redux'
import { Button } from '../../components/form-components'
import { Modal } from '../../components/singles'
import axios from 'axios'
import swal from 'sweetalert'
import { URL_DEV, PROYECTOS_TICKETS } from '../../constants'
import { CuentaForm } from '../../components/forms'
import Moment from 'react-moment'
import { Small } from '../../components/texts'
import NumberFormat from 'react-number-format';
import { Form, Tabs, Tab } from 'react-bootstrap'
import Calendar from '../../components/form-components/Calendar'
import TableForModals from '../../components/tables/TableForModals'
import { setTextTable, setDateTable, setListTable, setMoneyTable, setArrayTable } from '../../functions/setters'
import { errorAlert, forbiddenAccessAlert, waitAlert, doneAlert } from '../../functions/alert'
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
            state: { calidad: calidad},
            formeditado:1
        });
    }

    setCalidad = calidad => {
        let aux = []
        calidad.map((calidad) => {
            console.log(calidad)
            aux.push(
                {
                    actions: this.setActions(calidad),
                    proyectos: renderToString(setTextTable( calidad.proyecto ? calidad.proyecto.nombre : '' )),
                    cliente: renderToString(setTextTable( calidad.usuario ? calidad.usuario.name : '' )),
                    estatus: renderToString(this.setEstatus(calidad.estatus_ticket)),
                    tipo_trabajo: renderToString(setTextTable(calidad.tipo_trabajo ?  calidad.tipo_trabajo.tipo : '')),
                    fecha: renderToString(setDateTable(calidad.created_at)),
                    descripcion: renderToString(setTextTable(calidad.descripcion)),
                    id: calidad.id
                }
            )
        })
        return aux
    }

    setEstatus = (text) => {
        return (
            <>
                <span className="label label-lg bg- label-inline font-weight-bold py-2" style={{
                    color: `${text.letra}`,
                    backgroundColor: `${text.fondo}`,
                    fontSize:"10.4px"
                }} >{text.estatus}</span>
            </>
        )
    }


    setActions = () => {
        let aux = []
            aux.push(
                {
                    text: 'Ver',
                    btnclass: 'primary',
                    iconclass: 'flaticon2-expand',                  
                    action: 'see',
                    tooltip: {id:'see', text:'Mostrar', type:'success'},
                },
                {
                    text: 'Reporte',
                    btnclass: 'info',
                    iconclass: 'flaticon-edit-1',                  
                    action: 'reporte',
                    tooltip: {id:'see', text:'Reporte', type:'info'},
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
                        // 'edit': { function: this.changePageEdit },
                        // 'delete': { function: this.openModalDelete },
                        'see': {function: this.changePageSee},
                        'reporte': { function: this.changePageReporte}
                    }}
                    // url='/calidad/calidad/add'
                    idTable = 'kt_datatable_calidad'
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