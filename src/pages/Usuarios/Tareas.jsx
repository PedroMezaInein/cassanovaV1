import React, { Component } from 'react'
import Layout from '../../components/layout/layout'

class Tareas extends Component{
    constructor(props){
        super(props)
    }
    render(){
        return(
            <Layout { ...this.props}>
                Tareas
            </Layout>
        )
    }
}

export default Tareas;