import React, { Component } from 'react'
import Layout from '../components/layout/layout'

class MiProyecto extends Component{
    constructor(props){
        super(props)
    }
    render(){
        return(
            <Layout { ...this.props}>
                Mi proyecto
            </Layout>
        )
    }
}

export default MiProyecto;