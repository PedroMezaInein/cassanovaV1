import React, { Component } from 'react'

//
import { connect } from 'react-redux'
import axios from 'axios'
import swal from 'sweetalert'
import { URL_DEV } from '../../constants'

//
import Layout from '../../components/layout/layout'
import { Button } from '../../components/form-components'
import { Modal } from '../../components/singles'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { ComprasForm } from '../../components/forms'

class Compras extends Component{

    state = {
        modal: false,
        title: 'Nueva compra'
    }

    componentDidMount(){
        const { authUser: { user : { permisos : permisos } } } = this.props
        const { history : { location: { pathname: pathname } } } = this.props
        const { history } = this.props
        const egresos = permisos.find(function(element, index) {
            const { modulo: { url: url } } = element
            return  pathname === '/' + url
        });
        if(!egresos)
            history.push('/')
    }

    openModal = () => {
        this.setState({
            ... this.state,
            modal: true,
            title: 'Nueva compra'
        })
    }

    handleClose = () => {
        const { modal } = this.state
        this.setState({
            ... this.state,
            modal: !modal
        })
    }

    render(){

        const { modal, title } = this.state

        return(
            <Layout active={'proyectos'}  { ...this.props}>
                <div className="text-right">
                    <Button className="small-button ml-auto mr-4" onClick={ (e) => { this.openModal() } } text='' icon = { faPlus } color="green" />
                </div>
                <Modal show = {modal} handleClose = { this.handleClose } >
                    <ComprasForm title = { title } />
                </Modal>
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

export default connect(mapStateToProps, mapDispatchToProps)(Compras);