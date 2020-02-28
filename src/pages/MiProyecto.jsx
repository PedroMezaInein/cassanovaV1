import React, { Component } from 'react'
import Layout from '../components/layout/layout'
import { connect } from 'react-redux'
class MiProyecto extends Component{
    
    constructor(props){
        super(props)
    }

    componentDidMount(){
        const { user : { permisos : permisos } } = this.props
        const { history : { location: { pathname: pathname } } } = this.props
        const { history } = this.props
        const proyecto = permisos.find(function(element, index) {
            return element.modulo.url === pathname
        });
        if(!proyecto)
            history.push('/')
    }

    render(){
        return(
            <Layout { ...this.props}>
                Mi proyecto
            </Layout>
        )
    }
}

const mapStateToProps = state => {
    return{
        user: state.authUser.user,
        token: state.authUser.access_token
    }
}

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(MiProyecto);