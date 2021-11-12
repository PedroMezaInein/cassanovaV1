import React, { Component } from 'react'
import Layout from '../../../components/layout/layout'
import { connect } from 'react-redux'

class CalendarioPagos extends Component{
    
    render(){
        return(
            <Layout active = 'adminsitracion' { ...this.props } >

            </Layout>
        )
    }

}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({ })

export default connect(mapStateToProps, mapDispatchToProps)(CalendarioPagos);