import React, { Component } from 'react'
import Layout from '../../components/layout/layout'
import { connect } from 'react-redux'
import { Button } from '../../components/form-components'
import { faPlus, faTrash, faEdit, faMoneyBill, faFileAlt, faFileArchive, faMoneyBillWave } from '@fortawesome/free-solid-svg-icons'
import { AreasForm } from '../../components/forms'
import { URL_DEV, GOLD, AREAS_COLUMNS } from '../../constants'
import { DataTable } from '../../components/tables'
import { Small, Subtitle } from '../../components/texts'
import { Modal } from '../../components/singles'
import axios from 'axios'
import swal from 'sweetalert'

class Proyectos extends Component{

    componentDidMount(){
        const { authUser: { user : { permisos : permisos } } } = this.props
        const { history : { location: { pathname: pathname } } } = this.props
        const { history } = this.props
        const proyectos = permisos.find(function(element, index) {
            const { modulo: { url: url } } = element
            return  pathname === '/' + url
        });
        if(!proyectos)
            history.push('/')
    }

    render(){
        return(
            <Layout active={'catalogos'}  { ...this.props}>
                <div className="text-right">
                    <Button className="small-button ml-auto mr-4" onClick={ (e) => { this.openModal() } } text='' icon = { faPlus } color="green" />
                </div>
            </Layout>
        )
    }
}


const mapStateToProps = state => {
    return{
        authUser: state.authUser
    }
}

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Proyectos);