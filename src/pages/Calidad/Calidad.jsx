import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import Layout from '../../components/layout/layout'
import { connect } from 'react-redux'
import { Button } from '../../components/form-components'
import { Modal } from '../../components/singles'
import axios from 'axios'
import swal from 'sweetalert'
import { URL_DEV, CUENTAS_COLUMNS, EDOS_CUENTAS_COLUMNS } from '../../constants'
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


class Calidad extends Component {

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

    render() {
        
        return (
            <Layout active={'calidad'}  {...this.props}>

                
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