import React, { Component } from 'react'
// import PropTypes from 'prop-types'

class Encuesta extends Component {



    componentDidMount() {
        // const { authUser: { user: { permisos } } } = this.props
        // const { history: { location: { pathname } } } = this.props
        // // let queryString = this.props.history.location.search
        // // const { history } = this.props
        // const escuchamos = permisos.find(function (venta, index) {
        //     const { modulo: { url } } = venta
        //     return pathname === url
        // });
        // console.log(escuchamos)
        // if (!escuchamos)
        console.log('permiso')
            // history.push('/')
        // this.getOptions()
        
        // if (queryString) {
        //     let params = new URLSearchParams(queryString)
        //     let id = parseInt(params.get("id"))
        //     if (id) {
        //         const { modal, filters } = this.state
        //         filters.identificador = id
        //         modal.see = true
        //         this.setState({ ...this.state, modal, filters })
        //         this.reloadTable(filters)
        //         // this.getVentaAxios(id)
        //     }
        // }
    }


    render() {
        return (
            <div>
                <h1>encuesta</h1>
            </div>
        )
    }
}

// Encuesta.propTypes = {

// }

export default Encuesta