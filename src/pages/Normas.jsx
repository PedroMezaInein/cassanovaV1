import React, { Component } from 'react'
import Layout from '../components/layout/layout'

class Normas extends Component{
    constructor(props){
        super(props)
    }
    render(){
        return(
            <Layout { ...this.props}>
                Normas
            </Layout>
        )
    }
}

export default Normas;