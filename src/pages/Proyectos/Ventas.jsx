import React, { Component } from 'react'
import Layout from '../../components/layout/layout'

class Ventas extends Component{
    render(){
        return(
            <Layout active={'proyectos'}  { ...this.props}>

            </Layout>
        )
    }
}

export default Ventas