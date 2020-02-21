import React, { Component } from 'react'
import Layout from '../../components/layout/layout'

class Usuarios extends Component{
    constructor(props){
        super(props)
    }
    render(){
        return(
            <Layout { ...this.props}>
                Usuarios
            </Layout>
        )
    }
}

export default Usuarios;